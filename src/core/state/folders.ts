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

export interface FolderState {
  folders: Folder[];
  currentFolderId: string | null;
  isLoading: boolean;
}

type StateListener = (state: FolderState) => void;

export class FolderStateManager {
  private state: FolderState;
  private listeners: Set<StateListener>;
  private operations: FolderOperations;
  private storage: StorageInterface;

  constructor(storage: StorageInterface) {
    this.state = {
      folders: [],
      currentFolderId: null,
      isLoading: true
    };
    this.listeners = new Set();
    this.operations = new FolderOperations(storage);
    this.storage = storage;

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
    const result = await this.operations.createFolder(data, this.state.folders);
    if (result.success && result.data) {
      this.setState({ folders: [...this.state.folders, result.data] });
    }
    return result;
  }

  async moveFolder(data: MoveFolderData): Promise<OperationResult<FolderConflictResult>> {
    // Always check for conflicts first
    const conflict = detectMoveConflict(data.sourceId, data.targetId, this.state.folders);
    if (conflict) {
      return {
        success: false,
        error: conflict.message,
        data: conflict
      };
    }

    // Proceed with move if no conflicts
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

  async replaceFolder(data: ReplaceFolderData): Promise<OperationResult> {
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

  async renameFolder(data: RenameFolderData): Promise<OperationResult> {
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

  async deleteFolder(id: string): Promise<OperationResult> {
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
}
