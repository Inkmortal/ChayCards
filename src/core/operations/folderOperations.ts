import { Folder } from '../../renderer/hooks/folders/types';
import { 
  OperationResult,
  CreateFolderData,
  MoveFolderData,
  RenameFolderData,
  FolderOperationsType
} from './types';
import { StorageInterface } from '../storage/types';
import { ElectronStorage } from '../../services/storage/electron';

export class FolderOperations implements FolderOperationsType {
  private storage: StorageInterface;

  constructor() {
    this.storage = new ElectronStorage();
  }

  private async validateFolderName(
    name: string,
    parentId: string | null,
    folders: Folder[]
  ): Promise<boolean> {
    if (!name.trim()) {
      return false;
    }

    const siblings = folders.filter(f => f.parentId === parentId);
    return !siblings.some(f => f.name.toLowerCase() === name.toLowerCase());
  }

  async createFolder(
    data: CreateFolderData,
    folders: Folder[]
  ): Promise<OperationResult<Folder>> {
    try {
      const isValid = await this.validateFolderName(data.name, data.parentId, folders);
      if (!isValid) {
        return {
          success: false,
          error: 'Invalid folder name or folder already exists'
        };
      }

      const newFolder: Folder = {
        id: Date.now().toString(),
        name: data.name,
        parentId: data.parentId,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      };

      // Add to folders and save
      const updatedFolders = [...folders, newFolder];
      await this.storage.saveFolders(updatedFolders);

      return {
        success: true,
        data: newFolder
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create folder'
      };
    }
  }

  async moveFolder(
    data: MoveFolderData,
    folders: Folder[]
  ): Promise<OperationResult> {
    try {
      const sourceFolder = folders.find(f => f.id === data.sourceId);
      if (!sourceFolder) {
        return {
          success: false,
          error: 'Source folder not found'
        };
      }

      // Check for circular reference
      if (this.wouldCreateCircularReference(data.sourceId, data.targetId, folders)) {
        return {
          success: false,
          error: 'Cannot move folder into its own subfolder'
        };
      }

      // Update folder's parent and save
      const updatedFolders = folders.map(folder => 
        folder.id === data.sourceId
          ? { ...folder, parentId: data.targetId, modifiedAt: new Date().toISOString() }
          : folder
      );
      
      await this.storage.saveFolders(updatedFolders);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to move folder'
      };
    }
  }

  async renameFolder(
    data: RenameFolderData,
    folders: Folder[]
  ): Promise<OperationResult> {
    try {
      const folder = folders.find(f => f.id === data.id);
      if (!folder) {
        return {
          success: false,
          error: 'Folder not found'
        };
      }

      const isValid = await this.validateFolderName(data.newName, folder.parentId, folders);
      if (!isValid) {
        return {
          success: false,
          error: 'Invalid folder name or folder already exists'
        };
      }

      // Update folder name and save
      const updatedFolders = folders.map(f => 
        f.id === data.id
          ? { ...f, name: data.newName, modifiedAt: new Date().toISOString() }
          : f
      );
      
      await this.storage.saveFolders(updatedFolders);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to rename folder'
      };
    }
  }

  async deleteFolder(id: string, folders: Folder[]): Promise<OperationResult> {
    try {
      const folder = folders.find(f => f.id === id);
      if (!folder) {
        return {
          success: false,
          error: 'Folder not found'
        };
      }

      // Remove folder and save
      const updatedFolders = folders.filter(f => f.id !== id);
      await this.storage.saveFolders(updatedFolders);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete folder'
      };
    }
  }

  private wouldCreateCircularReference(
    sourceId: string,
    targetId: string | null,
    folders: Folder[]
  ): boolean {
    if (!targetId) return false;

    let currentId: string | null = targetId;
    const visited = new Set<string>();

    while (currentId) {
      if (currentId === sourceId) return true;
      if (visited.has(currentId)) return true;

      visited.add(currentId);
      const folder = folders.find(f => f.id === currentId);
      currentId = folder?.parentId || null;
    }

    return false;
  }
}
