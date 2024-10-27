import { useState } from 'react';
import { Folder } from './types';
import { saveFoldersToApi, isDescendant, getFolderIdsToDelete } from './folderUtils';

interface UseFolderCoreProps {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
}

interface UseFolderCoreReturn {
  isOperationInProgress: boolean;
  moveFolder: (folderId: string, targetFolderId: string | null) => Promise<void>;
  renameAndMoveFolder: (id: string, newName: string, targetId: string | null) => Promise<boolean>;
  replaceFolder: (sourceId: string, targetId: string | null) => Promise<boolean>;
  renameFolder: (id: string, newName: string) => Promise<boolean>;
  deleteFolder: (id: string) => Promise<void>;
}

export function useFolderCore({
  folders,
  setFolders,
  currentFolderId,
  setCurrentFolderId
}: UseFolderCoreProps): UseFolderCoreReturn {
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);

  const moveFolder = async (folderId: string, targetFolderId: string | null) => {
    if (isOperationInProgress) return;

    try {
      const sourceFolder = folders.find((folder: Folder) => folder.id === folderId);
      if (!sourceFolder) return;

      if (folderId === targetFolderId || isDescendant(folders, targetFolderId, folderId)) {
        return;
      }

      const updatedFolders = folders.map((folder: Folder) => 
        folder.id === folderId
          ? { ...folder, parentId: targetFolderId, modifiedAt: new Date().toISOString() }
          : folder
      );

      await saveFoldersToApi(updatedFolders, setFolders, setIsOperationInProgress);
    } catch (error) {
      console.error('Error in moveFolder:', error);
      throw error;
    }
  };

  const renameAndMoveFolder = async (id: string, newName: string, targetId: string | null): Promise<boolean> => {
    if (isOperationInProgress) return false;

    try {
      setIsOperationInProgress(true);
      const trimmedName = newName.trim();
      if (!trimmedName) return false;

      const targetFolder = folders.find((folder: Folder) => folder.id === id);
      if (!targetFolder) return false;

      const updatedFolders = folders.map((folder: Folder) => 
        folder.id === id
          ? { 
              ...folder, 
              name: trimmedName,
              parentId: targetId,
              modifiedAt: new Date().toISOString() 
            }
          : folder
      );

      await saveFoldersToApi(updatedFolders, setFolders, setIsOperationInProgress);
      return true;
    } catch (error) {
      console.error('Error in renameAndMoveFolder:', error);
      return false;
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const replaceFolder = async (sourceId: string, targetId: string | null): Promise<boolean> => {
    if (isOperationInProgress) return false;

    try {
      setIsOperationInProgress(true);
      const sourceFolder = folders.find((folder: Folder) => folder.id === sourceId);
      if (!sourceFolder) return false;

      const conflictingFolders = folders.filter(folder => 
        folder.id !== sourceId &&
        folder.parentId === targetId &&
        folder.name.toLowerCase() === sourceFolder.name.toLowerCase()
      );

      const folderIdsToDelete = new Set<string>();
      conflictingFolders.forEach(folder => {
        const ids = getFolderIdsToDelete(folders, folder.id);
        ids.forEach(id => folderIdsToDelete.add(id));
      });

      const updatedFolders = folders
        .filter((folder: Folder) => !folderIdsToDelete.has(folder.id))
        .map((folder: Folder) => 
          folder.id === sourceId
            ? { ...folder, parentId: targetId, modifiedAt: new Date().toISOString() }
            : folder
        );

      await saveFoldersToApi(updatedFolders, setFolders, setIsOperationInProgress);
      return true;
    } catch (error) {
      console.error('Error in replaceFolder:', error);
      return false;
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const renameFolder = async (id: string, newName: string): Promise<boolean> => {
    if (isOperationInProgress) return false;

    const trimmedName = newName.trim();
    if (!trimmedName) return false;

    const targetFolder = folders.find((folder: Folder) => folder.id === id);
    if (!targetFolder) return false;

    const isDuplicate = folders.some(
      (folder: Folder) => 
        folder.id !== id &&
        folder.parentId === targetFolder.parentId && 
        folder.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) return false;

    try {
      const updatedFolders = folders.map((folder: Folder) => 
        folder.id === id
          ? { 
              ...folder, 
              name: trimmedName,
              modifiedAt: new Date().toISOString() 
            }
          : folder
      );

      await saveFoldersToApi(updatedFolders, setFolders, setIsOperationInProgress);
      return true;
    } catch (error) {
      console.error('Error in renameFolder:', error);
      return false;
    }
  };

  const deleteFolder = async (id: string) => {
    if (isOperationInProgress) return;

    try {
      const folderIdsToDelete = getFolderIdsToDelete(folders, id);
      const updatedFolders = folders.filter((folder: Folder) => !folderIdsToDelete.has(folder.id));
      await saveFoldersToApi(updatedFolders, setFolders, setIsOperationInProgress);

      if (currentFolderId === id) {
        const currentFolder = folders.find((folder: Folder) => folder.id === id);
        setCurrentFolderId(currentFolder?.parentId || null);
      }
    } catch (error) {
      console.error('Error in deleteFolder:', error);
    }
  };

  return {
    isOperationInProgress,
    moveFolder,
    renameAndMoveFolder,
    replaceFolder,
    renameFolder,
    deleteFolder
  };
}
