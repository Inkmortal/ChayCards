import { Folder, FolderConflict } from './types';
import { useFolderCore } from './useFolderCore';
import { useFolderConflicts } from './useFolderConflicts';
import { getAllSubFolders, getUniqueFolderName } from './folderUtils';

interface UseFolderOperationsProps {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
}

interface UseFolderOperationsReturn {
  folderConflict: FolderConflict | null;
  setFolderConflict: (conflict: FolderConflict | null) => void;
  moveFolder: (folderId: string, targetFolderId: string | null, skipConflictCheck?: boolean) => Promise<void>;
  renameAndMoveFolder: (id: string, newName: string, targetId: string | null) => Promise<boolean>;
  replaceFolder: (sourceId: string, targetId: string | null) => Promise<boolean>;
  renameFolder: (id: string, newName: string) => Promise<boolean>;
  deleteFolder: (id: string) => Promise<void>;
  getAllSubFolders: (parentId: string | null) => Folder[];
}

export function useFolderOperations({
  folders,
  setFolders,
  currentFolderId,
  setCurrentFolderId
}: UseFolderOperationsProps): UseFolderOperationsReturn {
  const {
    moveFolder: coreMoveFolder,
    renameAndMoveFolder: coreRenameAndMoveFolder,
    replaceFolder,
    renameFolder: coreRenameFolder,
    deleteFolder
  } = useFolderCore({
    folders,
    setFolders,
    currentFolderId,
    setCurrentFolderId
  });

  const {
    folderConflict,
    setFolderConflict,
    checkFolderConflict
  } = useFolderConflicts();

  const moveFolder = async (folderId: string, targetFolderId: string | null, skipConflictCheck: boolean = false) => {
    console.log('moveFolder called:', { folderId, targetFolderId, skipConflictCheck });
    if (!skipConflictCheck && checkFolderConflict(folderId, targetFolderId, folders)) {
      console.log('Conflict detected in moveFolder');
      return;
    }
    await coreMoveFolder(folderId, targetFolderId);
  };

  const renameFolder = async (id: string, newName: string): Promise<boolean> => {
    console.log('renameFolder called:', { id, newName });
    const folder = folders.find(f => f.id === id);
    if (!folder) {
      console.log('Folder not found:', id);
      return false;
    }

    // Check for name conflicts
    const hasDuplicate = folders.some(
      f => f.id !== id && 
          f.parentId === folder.parentId && 
          f.name.toLowerCase() === newName.toLowerCase()
    );

    if (hasDuplicate) {
      console.log('Name conflict detected in renameFolder');
      const suggestedName = getUniqueFolderName(folders, newName, folder.parentId);
      console.log('Suggested name:', suggestedName);
      setFolderConflict({
        sourceId: id,
        targetId: folder.parentId,
        sourceName: suggestedName
      });
      return false;
    }

    console.log('No conflict, proceeding with rename');
    return await coreRenameFolder(id, newName);
  };

  const renameAndMoveFolder = async (id: string, newName: string, targetId: string | null): Promise<boolean> => {
    console.log('renameAndMoveFolder called:', { id, newName, targetId });
    // Check for name conflicts in target location
    const hasDuplicate = folders.some(
      f => f.id !== id && 
          f.parentId === targetId && 
          f.name.toLowerCase() === newName.toLowerCase()
    );

    if (hasDuplicate) {
      console.log('Name conflict detected in renameAndMoveFolder');
      const suggestedName = getUniqueFolderName(folders, newName, targetId);
      console.log('Suggested name:', suggestedName);
      setFolderConflict({
        sourceId: id,
        targetId: targetId,
        sourceName: suggestedName
      });
      return false;
    }

    console.log('No conflict, proceeding with rename and move');
    return await coreRenameAndMoveFolder(id, newName, targetId);
  };

  return {
    folderConflict,
    setFolderConflict,
    moveFolder,
    renameAndMoveFolder,
    replaceFolder,
    renameFolder,
    deleteFolder,
    getAllSubFolders: (parentId: string | null) => getAllSubFolders(folders, parentId)
  };
}
