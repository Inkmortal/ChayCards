import { Folder } from '../storage/folders/models';
import { StorageInterface } from '../storage/types';
import { FolderOperations } from '../operations/folders';
import { FolderConflictResult, detectMoveConflict } from '../operations/folders/conflicts';
import { 
  CreateFolderData,
  MoveFolderData,
  RenameFolderData,
  ReplaceFolderData,
  OperationResult 
} from '../operations/types';
import { OperationQueue, QueuedOperation } from './operation-queue';

export interface FolderState {
  folders: Folder[];
  currentFolderId: string | null;
  isLoading: boolean;
  currentOperation: QueuedOperation | null;
}

type StateListener = (state: FolderState) => void;

export class FolderStateManager {
  private state: FolderState;
  private listeners: Set<StateListener>;
  private operations: FolderOperations;
  private storage: StorageInterface;
  private operationQueue: OperationQueue;

  constructor(storage: StorageInterface) {
    this.state = {
      folders: [],
      currentFolderId: null,
      isLoading: true,
      currentOperation: null
    };
    this.listeners = new Set();
    this.operations = new FolderOperations(storage);
    this.storage = storage;
    this.operationQueue = new OperationQueue();

    // Subscribe to operation queue updates
    setInterval(() => {
      const currentOp = this.operationQueue.getCurrentOperation();
      if (currentOp !== this.state.currentOperation) {
        this.setState({ currentOperation: currentOp });
      }
    }, 100);

    this.loadFolders();
  }

  private setState(newState: Partial<FolderState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // State Access
  getState(): FolderState {
    return this.state;
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  // Data Loading
  private async loadFolders() {
    try {
      this.setState({ isLoading: true });
      const folders = await this.storage.loadFolders();
      this.setState({ folders });
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Helper Methods
  private getAllSubFolders(folderId: string): Folder[] {
    const result: Folder[] = [];
    const addChildren = (id: string) => {
      const children = this.state.folders.filter(f => f.parentId === id);
      children.forEach(child => {
        result.push(child);
        addChildren(child.id);
      });
    };
    addChildren(folderId);
    return result;
  }

  // Core Operations - Each with single responsibility
  async createFolder(data: CreateFolderData): Promise<OperationResult<Folder>> {
    return this.operationQueue.queueOperation({
      type: 'create',
      execute: async () => {
        const result = await this.operations.createFolder(data, this.state.folders);
        if (result.success && result.data) {
          this.setState({ folders: [...this.state.folders, result.data] });
        }
        return result;
      }
    });
  }

  async moveFolder(data: MoveFolderData): Promise<OperationResult<FolderConflictResult>> {
    // Check for conflicts before queueing
    const conflict = detectMoveConflict(data.sourceId, data.targetId, this.state.folders);
    if (conflict) {
      return {
        success: false,
        error: conflict.message,
        data: conflict
      };
    }

    // Queue the move operation
    return this.operationQueue.queueOperation({
      type: 'move',
      execute: async () => {
        const result = await this.operations.moveFolder(data, this.state.folders);
        if (result.success) {
          const updatedFolders = this.state.folders.map(folder => 
            folder.id === data.sourceId
              ? { ...folder, parentId: data.targetId, modifiedAt: new Date().toISOString() }
              : folder
          );
          this.setState({ folders: updatedFolders });
        }
        return result;
      }
    });
  }

  async replaceFolder(data: ReplaceFolderData): Promise<OperationResult> {
    return this.operationQueue.queueOperation({
      type: 'replace',
      execute: async () => {
        const result = await this.operations.replaceFolder(data, this.state.folders);
        
        if (result.success) {
          const sourceFolder = this.state.folders.find(f => f.id === data.sourceId);
          if (!sourceFolder) return { success: false, error: 'Source folder not found' };

          // Find folders to delete
          const foldersToDelete = new Set<string>();
          const conflictingFolders = this.state.folders.filter(folder => 
            folder.id !== data.sourceId &&
            folder.parentId === data.targetId &&
            folder.name.toLowerCase() === sourceFolder.name.toLowerCase()
          );

          // Get all subfolders of conflicting folders
          conflictingFolders.forEach(folder => {
            const subFolders = this.getAllSubFolders(folder.id);
            subFolders.forEach(f => foldersToDelete.add(f.id));
            foldersToDelete.add(folder.id);
          });

          // Update folders state
          const updatedFolders = this.state.folders
            .filter(folder => !foldersToDelete.has(folder.id))
            .map(folder => 
              folder.id === data.sourceId
                ? { ...folder, parentId: data.targetId, modifiedAt: new Date().toISOString() }
                : folder
            );

          // Update state and handle current folder if deleted
          this.setState({ 
            folders: updatedFolders,
            currentFolderId: foldersToDelete.has(this.state.currentFolderId || '') 
              ? data.targetId 
              : this.state.currentFolderId
          });
        }
        return result;
      }
    });
  }

  async renameFolder(data: RenameFolderData): Promise<OperationResult> {
    return this.operationQueue.queueOperation({
      type: 'rename',
      execute: async () => {
        const result = await this.operations.renameFolder(data, this.state.folders);
        if (result.success) {
          const updatedFolders = this.state.folders.map(folder => 
            folder.id === data.id
              ? { ...folder, name: data.newName, modifiedAt: new Date().toISOString() }
              : folder
          );
          this.setState({ folders: updatedFolders });
        }
        return result;
      }
    });
  }

  async deleteFolder(id: string): Promise<OperationResult> {
    return this.operationQueue.queueOperation({
      type: 'delete',
      execute: async () => {
        const result = await this.operations.deleteFolder(id, this.state.folders);
        if (result.success) {
          // Get all subfolders to delete
          const foldersToDelete = new Set([id]);
          const subFolders = this.getAllSubFolders(id);
          subFolders.forEach(f => foldersToDelete.add(f.id));

          // Update folders state
          const updatedFolders = this.state.folders.filter(f => !foldersToDelete.has(f.id));
          
          this.setState({ 
            folders: updatedFolders,
            currentFolderId: foldersToDelete.has(this.state.currentFolderId || '') 
              ? this.state.folders.find(f => f.id === id)?.parentId || null 
              : this.state.currentFolderId
          });
        }
        return result;
      }
    });
  }

  // Navigation
  setCurrentFolder(id: string | null) {
    this.setState({ currentFolderId: id });
  }

  getCurrentFolder(): Folder | null {
    return this.state.folders.find(f => f.id === this.state.currentFolderId) || null;
  }

  getCurrentFolders(): Folder[] {
    return this.state.folders.filter(f => f.parentId === this.state.currentFolderId);
  }

  // Operation Queue Management
  resumeOperationQueue() {
    this.operationQueue.resumeQueue();
  }

  clearOperationQueue() {
    this.operationQueue.clearQueue();
  }

  // Check if an operation is in progress
  isOperationInProgress(): boolean {
    return this.state.currentOperation?.status === 'processing';
  }

  // Get current operation details
  getCurrentOperation(): QueuedOperation | null {
    return this.state.currentOperation;
  }
}
