import { Folder } from './types';
import { saveFoldersToApi as apiSave } from './api';

/**
 * Saves folders to the API and updates local state
 */
export const saveFoldersToApi = async (
  folders: Folder[],
  setFolders: (folders: Folder[]) => void,
  setIsOperationInProgress: (inProgress: boolean) => void
): Promise<Folder[]> => {
  setIsOperationInProgress(true);
  try {
    const savedFolders = await apiSave(folders);
    setFolders(savedFolders);
    return savedFolders;
  } finally {
    setIsOperationInProgress(false);
  }
};

/**
 * Gets all sub-folders for a given parent folder
 */
export const getAllSubFolders = (folders: Folder[], parentId: string | null): Folder[] => {
  const directFolders = folders.filter((folder: Folder) => folder.parentId === parentId);
  return directFolders.reduce((acc, folder) => {
    return [...acc, folder, ...getAllSubFolders(folders, folder.id)];
  }, [] as Folder[]);
};

/**
 * Checks if a folder is a descendant of another folder
 */
export const isDescendant = (folders: Folder[], parentId: string | null, targetId: string): boolean => {
  if (parentId === targetId) return true;
  const parent = folders.find((folder: Folder) => folder.id === parentId);
  return parent ? isDescendant(folders, parent.parentId, targetId) : false;
};

/**
 * Gets all folder IDs to delete (including children)
 */
export const getFolderIdsToDelete = (folders: Folder[], rootId: string): Set<string> => {
  const folderIdsToDelete = new Set<string>();
  
  const addFolderAndChildren = (folderId: string) => {
    folderIdsToDelete.add(folderId);
    folders
      .filter((folder: Folder) => folder.parentId === folderId)
      .forEach(child => addFolderAndChildren(child.id));
  };
  
  addFolderAndChildren(rootId);
  return folderIdsToDelete;
};

/**
 * Checks if a folder name exists in the target parent folder
 */
export const doesFolderNameExist = (folders: Folder[], name: string, parentId: string | null): boolean => {
  return folders.some(
    folder => folder.parentId === parentId && 
             folder.name.toLowerCase() === name.toLowerCase()
  );
};

/**
 * Gets a unique name for a folder when there's a conflict
 */
export const getUniqueFolderName = (folders: Folder[], name: string, parentId: string | null): string => {
  // If the name doesn't exist, return it as is
  if (!doesFolderNameExist(folders, name, parentId)) {
    return name;
  }

  // Get all existing names in the target folder for pattern matching
  const existingNames = folders
    .filter(folder => folder.parentId === parentId)
    .map(folder => folder.name.toLowerCase());

  // Extract base name (remove any existing "(copy N)" suffix)
  const baseName = name.replace(/\s*\(copy(?:\s*\d+)?\)$/, '');
  
  // Try "name (copy)" first if it doesn't exist
  const copyName = `${baseName} (copy)`;
  if (!existingNames.includes(copyName.toLowerCase())) {
    return copyName;
  }

  // Find the highest existing number
  let maxNum = 1;
  existingNames.forEach(existingName => {
    const match = existingName.match(new RegExp(`^${baseName.toLowerCase()}\\s*\\(copy\\s*(\\d+)\\)$`));
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num >= maxNum) {
        maxNum = num + 1;
      }
    }
  });

  return `${baseName} (copy ${maxNum})`;
};
