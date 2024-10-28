import { Folder } from '../../../renderer/hooks/folders/types';
import { OperationResult } from '../types';
import { StorageInterface } from '../../storage/types';

export async function deleteFolder(
  id: string,
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

    // Remove folder and save
    const updatedFolders = folders.filter(f => f.id !== id);
    await storage.saveFolders(updatedFolders);

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
