import { Folder } from '../../../renderer/hooks/folders/types';
import { MoveFolderData, OperationResult } from '../types';
import { StorageInterface } from '../../storage/types';
import { wouldCreateCircularReference } from './validation';

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

    // Check for circular reference
    if (wouldCreateCircularReference(data.sourceId, data.targetId, folders)) {
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
