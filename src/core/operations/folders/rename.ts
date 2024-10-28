import { Folder } from '../../../renderer/hooks/folders/types';
import { RenameFolderData, OperationResult } from '../types';
import { StorageInterface } from '../../storage/types';
import { validateFolderName } from './validation';

export async function renameFolder(
  data: RenameFolderData,
  folders: Folder[],
  storage: StorageInterface
): Promise<OperationResult> {
  try {
    const folder = folders.find(f => f.id === data.id);
    if (!folder) {
      return {
        success: false,
        error: 'Folder not found'
      };
    }

    const isValid = await validateFolderName(data.newName, folder.parentId, folders);
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
    
    await storage.saveFolders(updatedFolders);

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
