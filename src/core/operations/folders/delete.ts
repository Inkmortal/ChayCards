import { Folder } from '../../../core/storage/folders/models';
import { OperationResult } from '../types';
import { StorageInterface } from '../../storage/types';
import { getFoldersToDelete } from './conflicts';

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

    // Get all folders that need to be deleted (including descendants)
    const folderIdsToDelete = getFoldersToDelete(folders, id);
    console.log('Deleting folders:', Array.from(folderIdsToDelete));

    // Remove folder and all its descendants
    const updatedFolders = folders.filter(f => !folderIdsToDelete.has(f.id));
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
