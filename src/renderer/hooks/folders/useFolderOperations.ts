import { Folder } from '../../../core/storage/folders/models';
import { useFolderConflicts } from './useFolderConflicts';
import { getAllSubFolders } from './folderUtils';
import { FolderOperations } from '../../../core/operations/folders';
import { ElectronFolderStorage } from '../../../services/storage';
import { 
  FolderConflictResult, 
  NameConflictResult,
  FolderConflict
} from '../../../core/operations/folders/conflicts';

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
  const operations = new FolderOperations(new ElectronFolderStorage());
  const { folderConflict, setFolderConflict } = useFolderConflicts();

  const handleConflict = (conflict: FolderConflictResult, sourceId: string, targetId: string | null) => {
    if (conflict.type === 'name') {
      const nameConflict = conflict as NameConflictResult;
      setFolderConflict({
        sourceId,
        targetId,
        originalName: nameConflict.originalName,
        suggestedName: nameConflict.suggestedName
      });
      return true;
    }
    return false;
  };

  const moveFolder = async (folderId: string, targetFolderId: string | null, skipConflictCheck: boolean = false) => {
    const result = await operations.moveFolder(
      { sourceId: folderId, targetId: targetFolderId },
      folders
    );

    if (!result.success && result.data && !skipConflictCheck) {
      const conflict = result.data as FolderConflictResult;
      if (handleConflict(conflict, folderId, targetFolderId)) {
        return;
      }
    }

    if (result.success) {
      const updatedFolders = folders.map(folder => 
        folder.id === folderId
          ? { ...folder, parentId: targetFolderId, modifiedAt: new Date().toISOString() }
          : folder
      );
      setFolders(updatedFolders);
    }
  };

  const renameAndMoveFolder = async (id: string, newName: string, targetId: string | null): Promise<boolean> => {
    const result = await operations.renameAndMoveFolder(id, newName, targetId, folders);
    
    if (result.success) {
      const updatedFolders = folders.map(f => 
        f.id === id
          ? { 
              ...f, 
              name: newName,
              parentId: targetId,
              modifiedAt: new Date().toISOString() 
            }
          : f
      );
      setFolders(updatedFolders);
      return true;
    }

    return false;
  };

  const replaceFolder = async (sourceId: string, targetId: string | null): Promise<boolean> => {
    const result = await operations.replaceFolder(
      { sourceId, targetId },
      folders
    );

    if (result.success) {
      const sourceFolder = folders.find(f => f.id === sourceId);
      if (!sourceFolder) return false;

      // Find conflicting folders
      const conflictingFolders = folders.filter(folder => 
        folder.id !== sourceId &&
        folder.parentId === targetId &&
        folder.name.toLowerCase() === sourceFolder.name.toLowerCase()
      );

      // Get all folder IDs that need to be deleted
      const folderIdsToDelete = new Set<string>();
      conflictingFolders.forEach(folder => {
        const ids = getAllSubFolders(folders, folder.id).map(f => f.id);
        ids.forEach(id => folderIdsToDelete.add(id));
        folderIdsToDelete.add(folder.id);
      });

      // Update folders state
      const updatedFolders = folders
        .filter(folder => !folderIdsToDelete.has(folder.id))
        .map(folder => 
          folder.id === sourceId
            ? { ...folder, parentId: targetId, modifiedAt: new Date().toISOString() }
            : folder
        );

      setFolders(updatedFolders);

      // Update current folder if it was deleted
      if (folderIdsToDelete.has(currentFolderId || '')) {
        setCurrentFolderId(targetId);
      }

      return true;
    }

    return false;
  };

  const renameFolder = async (id: string, newName: string): Promise<boolean> => {
    const result = await operations.renameFolder(
      { id, newName },
      folders
    );

    if (result.success) {
      const updatedFolders = folders.map(f => 
        f.id === id
          ? { ...f, name: newName, modifiedAt: new Date().toISOString() }
          : f
      );
      setFolders(updatedFolders);
      return true;
    }

    return false;
  };

  const deleteFolder = async (id: string) => {
    const result = await operations.deleteFolder(id, folders);
    
    if (result.success) {
      const updatedFolders = folders.filter(f => f.id !== id);
      setFolders(updatedFolders);

      // Update current folder if deleted
      if (currentFolderId === id) {
        const currentFolder = folders.find(f => f.id === id);
        setCurrentFolderId(currentFolder?.parentId || null);
      }
    }
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
