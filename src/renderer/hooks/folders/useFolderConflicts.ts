import { useState } from 'react';
import { Folder, FolderConflict } from './types';
import { getAllSubFolders, getUniqueFolderName } from './folderUtils';

interface UseFolderConflictsReturn {
  folderConflict: FolderConflict | null;
  setFolderConflict: (conflict: FolderConflict | null) => void;
  checkFolderConflict: (sourceId: string, targetId: string | null, folders: Folder[]) => boolean;
}

export function useFolderConflicts(): UseFolderConflictsReturn {
  const [folderConflict, setFolderConflict] = useState<FolderConflict | null>(null);

  const checkFolderConflict = (sourceId: string, targetId: string | null, folders: Folder[]): boolean => {
    const sourceFolder = folders.find((folder: Folder) => folder.id === sourceId);
    if (!sourceFolder) return false;

    // Get all folders in target location
    const targetFolders = getAllSubFolders(folders, targetId);

    // Check for naming conflicts
    const hasDuplicate = targetFolders.some(
      folder => folder.id !== sourceId && 
                folder.name.toLowerCase() === sourceFolder.name.toLowerCase()
    );

    if (hasDuplicate) {
      // Generate a unique name for the conflicting folder
      const uniqueName = getUniqueFolderName(folders, sourceFolder.name, targetId);
      
      setFolderConflict({
        sourceId,
        targetId,
        originalName: sourceFolder.name,  // Keep track of the original name
        suggestedName: uniqueName  // Store the suggested unique name
      });
      return true;
    }

    return false;
  };

  return {
    folderConflict,
    setFolderConflict,
    checkFolderConflict
  };
}
