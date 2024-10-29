import { Folder } from '../../../core/storage/folders/models';
import { OperationResult, ReplaceFolderData } from '../types';
import { StorageInterface } from '../../storage/types';
import { detectNameConflict, getFoldersToDelete } from './conflicts';

export async function replaceFolder(
  data: ReplaceFolderData,
  folders: Folder[],
  storage: StorageInterface
): Promise<OperationResult> {
  const { sourceId, targetId } = data;
  
  // Find source folder
  const sourceFolder = folders.find(folder => folder.id === sourceId);
  if (!sourceFolder) {
    return {
      success: false,
      error: 'Source folder not found'
    };
  }

  try {
    console.log('Replace operation:', {
      sourceFolder,
      targetId,
      allFolders: folders.map(f => ({ id: f.id, name: f.name, parentId: f.parentId }))
    });

    // Find conflicting folders
    const conflictingFolders = folders.filter(folder => 
      folder.id !== sourceId &&
      folder.parentId === targetId &&
      folder.name.toLowerCase() === sourceFolder.name.toLowerCase()
    );

    console.log('Conflicting folders:', conflictingFolders);

    // Get all folder IDs that need to be deleted (including descendants)
    const folderIdsToDelete = new Set<string>();
    conflictingFolders.forEach(folder => {
      console.log('Getting descendants for folder:', folder);
      const ids = getFoldersToDelete(folders, folder.id);
      console.log('Descendants:', Array.from(ids));
      ids.forEach(id => folderIdsToDelete.add(id));
    });

    console.log('All folders to delete:', Array.from(folderIdsToDelete));

    // Get source folder descendants
    const sourceDescendants = getFoldersToDelete(folders, sourceId);
    console.log('Source folder descendants:', Array.from(sourceDescendants));

    // Make sure we don't delete any source folder descendants
    sourceDescendants.forEach(id => folderIdsToDelete.delete(id));

    console.log('Final folders to delete:', Array.from(folderIdsToDelete));

    // Create updated folders array
    const updatedFolders = folders
      .filter(folder => !folderIdsToDelete.has(folder.id))
      .map(folder => 
        folder.id === sourceId
          ? { ...folder, parentId: targetId, modifiedAt: new Date().toISOString() }
          : folder
      );

    // Save updated folders
    await storage.saveFolders(updatedFolders);

    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to replace folder'
    };
  }
}

// Re-export the type from core operations
export type { ReplaceFolderData };
