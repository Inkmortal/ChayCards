import { Folder } from '../../../core/storage/folders/models';
import { OperationResult } from '../types';
import { StorageInterface } from '../../storage/types';
import { validateFolderName } from './validation';

export async function renameAndMoveFolder(
  id: string,
  newName: string,
  targetId: string | null,
  folders: Folder[],
  storage: StorageInterface
): Promise<OperationResult> {
  try {
    const folder = folders.find(f => f.id === id);
    if (!folder) {
      return {
        success: false,
        error: 'Folder not found'
      };
    }

    const isValid = await validateFolderName(newName, targetId, folders);
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid folder name or folder already exists'
      };
    }

    // Update folder name and location
    const updatedFolders = folders.map(f => 
      f.id === id
        ? { 
            ...f, 
            name: newName,
            parentId: targetId,
            modifiedAt: new Date().toISOString() 
          }
        : f
    );
    
    await storage.saveFolders(updatedFolders);

    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to rename and move folder'
    };
  }
}
