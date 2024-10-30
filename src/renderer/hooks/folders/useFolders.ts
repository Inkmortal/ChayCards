import { useFolderState } from './useFolderState';
import { CreateFolderData } from '../../../core/operations/types';
import { Item } from '../../components/library/types';

export function useFolders() {
  const {
    // Core state
    folders,
    currentFolder,
    currentFolders,
    isLoading,

    // UI state
    itemToRename,
    pendingMove,
    folderConflict,
    isCreateModalOpen,
    newFolderName,
    folderError,
    createInFolderId,

    // UI actions
    openCreateModal,
    closeCreateModal,
    setNewFolderName,
    setItemToRename,
    setPendingMove,
    setFolderConflict,
    clearModalStates,

    // Core operations
    createFolder,
    moveFolder,
    replaceFolder,
    renameFolder,
    deleteFolder,

    // Navigation
    setCurrentFolder
  } = useFolderState();

  // Create folder
  const handleCreateFolder = async () => {
    const trimmedName = newFolderName.trim();
    
    if (folderError || !trimmedName) {
      return;
    }

    const data: CreateFolderData = {
      name: trimmedName,
      // Use createInFolderId if set (from tree view), otherwise use current folder
      parentId: createInFolderId ?? currentFolder?.id ?? null
    };

    const result = await createFolder(data);
    if (result.success) {
      closeCreateModal();
    }
  };

  // Move operations
  const handleMove = async (sourceId: string, targetId: string | null) => {
    const result = await moveFolder(sourceId, targetId);
    if (!result.success && result.conflict) {
      setFolderConflict(result.conflict);
    }
    return result;
  };

  // Conflict resolution
  const handleConflictResolve = {
    replace: async () => {
      if (!folderConflict) return;
      const result = await replaceFolder(
        folderConflict.sourceId,
        folderConflict.targetId
      );
      if (result.success) {
        setFolderConflict(null);
      }
    },
    rename: () => {
      if (!folderConflict) return;
      setPendingMove({
        sourceId: folderConflict.sourceId,
        targetId: folderConflict.targetId
      });
      // Create Item from folder for rename
      const sourceItem: Item = {
        id: folderConflict.sourceId,
        name: folderConflict.suggestedName,
        type: 'folder',
        modifiedAt: folders.find(f => f.id === folderConflict.sourceId)?.modifiedAt || new Date().toISOString(),
        createdAt: folders.find(f => f.id === folderConflict.sourceId)?.createdAt || new Date().toISOString()
      };
      setItemToRename(sourceItem);
      setFolderConflict(null);
    },
    cancel: () => {
      clearModalStates();
    }
  };

  // Navigation
  const navigateFolder = (id: string) => setCurrentFolder(id);
  const navigateBack = () => currentFolder?.parentId !== undefined && setCurrentFolder(currentFolder.parentId);
  const navigateToFolder = (id: string | null) => setCurrentFolder(id);

  return {
    // Core state
    folders,
    currentFolder,
    currentFolders,
    isLoading,

    // UI state
    isCreateModalOpen,
    newFolderName,
    folderError,
    itemToRename,
    pendingMove,
    folderConflict,

    // Create folder
    openCreateModal,
    closeCreateModal,
    setNewFolderName,
    handleCreateFolder,

    // Operations
    moveFolder: handleMove,
    replaceFolder,
    renameFolder,
    deleteFolder,
    onConflictResolve: handleConflictResolve,

    // Navigation
    navigateFolder,
    navigateBack,
    navigateToFolder
  };
}
