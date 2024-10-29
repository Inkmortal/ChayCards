import { Folder } from '../../../core/storage/folders/models';
import { MoveFolderData, OperationResult } from '../types';
import { StorageInterface } from '../../storage/types';
import { detectMoveConflict } from './conflicts';

export async function moveFolder(
  data: MoveFolderData,
  folders: Folder[],
  storage: StorageInterface
): Promise<OperationResult> {
  try {
    const sourceFolder = folders.find(f => f.id === data.sourceId);
    if (!sourceFolder) {
      return {
        success: false,
        error: 'Source folder not found'
      };
    }

    // Check for conflicts
    const conflict = detectMoveConflict(data.sourceId, data.targetId, folders);
    if (conflict) {
      return {
        success: false,
        error: conflict.message || 'Conflict detected',
        data: conflict
      };
    }

    // Update folder's parent and save
    const updatedFolders = folders.map(folder => 
      folder.id === data.sourceId
        ? { ...folder, parentId: data.targetId, modifiedAt: new Date().toISOString() }
        : folder
    );
    
    await storage.saveFolders(updatedFolders);

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
