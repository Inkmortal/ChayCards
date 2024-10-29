import { Folder } from '../../../core/storage/folders/models';
import { ElectronFolderStorage } from '../../../services/storage';
import { getFoldersToDelete, detectNameConflict } from '../../../core/operations/folders/conflicts';

const storage = new ElectronFolderStorage();

/**
 * Saves folders using the storage layer
 */
export const saveFoldersToApi = async (
  folders: Folder[],
  setFolders: (folders: Folder[]) => void,
  setIsOperationInProgress: (inProgress: boolean) => void
): Promise<Folder[]> => {
  setIsOperationInProgress(true);
  try {
    const savedFolders = await storage.saveFolders(folders);
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
  const directFolders = folders.filter(folder => folder.parentId === parentId);
  return directFolders.reduce((acc, folder) => {
    return [...acc, folder, ...getAllSubFolders(folders, folder.id)];
  }, [] as Folder[]);
};

/**
 * Checks if a folder is a descendant of another folder
 */
export const isDescendant = (folders: Folder[], parentId: string | null, targetId: string): boolean => {
  if (parentId === targetId) return true;
  const parent = folders.find(folder => folder.id === parentId);
  return parent ? isDescendant(folders, parent.parentId, targetId) : false;
};

/**
 * Gets all folder IDs to delete (including children)
 * @deprecated Use getFoldersToDelete from core/operations/folders/conflicts instead
 */
export const getFolderIdsToDelete = (folders: Folder[], rootId: string): Set<string> => {
  return getFoldersToDelete(folders, rootId);
};

/**
 * Checks if a folder name exists in the target parent folder
 * @deprecated Use detectNameConflict from core/operations/folders/conflicts instead
 */
export const doesFolderNameExist = (folders: Folder[], name: string, parentId: string | null): boolean => {
  return detectNameConflict(name, parentId, folders) !== null;
};

/**
 * Gets a unique name for a folder when there's a conflict
 * @deprecated Use detectNameConflict from core/operations/folders/conflicts instead
 * and access suggestedName from the result
 */
export const getUniqueFolderName = (folders: Folder[], name: string, parentId: string | null): string => {
  const conflict = detectNameConflict(name, parentId, folders);
  return conflict ? conflict.suggestedName : name;
};
