import { useState, useEffect } from 'react';
import { Folder } from './types';
import { loadFoldersFromApi, restoreFoldersFromBackup, subscribeToFolderUpdates } from './api';
import { useCreateFolder } from './useCreateFolder';
import { useFolderOperations } from './useFolderOperations';
import { useNavigation } from './useNavigation';

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const loadFolders = async () => {
    try {
      setIsLoading(true);
      const loadedFolders = await loadFoldersFromApi();
      setFolders(loadedFolders);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Load folders on mount
  useEffect(() => {
    loadFolders();
  }, []);

  // Set up folder update subscription after initial load
  useEffect(() => {
    if (!isInitialLoad) {
      const unsubscribe = subscribeToFolderUpdates(() => loadFolders());
      return () => unsubscribe();
    }
  }, [isInitialLoad]);

  const restoreFromBackup = async () => {
    try {
      const restoredFolders = await restoreFoldersFromBackup();
      setFolders(restoredFolders);
    } catch (error) {
      console.error('Error restoring folders:', error);
    }
  };

  const {
    isCreateModalOpen,
    newFolderName,
    folderError,
    createInFolderId,
    openCreateModal,
    closeCreateModal,
    setNewFolderName,
    handleCreateFolder,
    handleInputKeyDown
  } = useCreateFolder({ folders, setFolders });

  const {
    folderConflict,
    setFolderConflict,
    moveFolder,
    renameFolder,
    renameAndMoveFolder,
    replaceFolder,
    deleteFolder,
    getAllSubFolders
  } = useFolderOperations({
    folders,
    setFolders,
    currentFolderId,
    setCurrentFolderId
  });

  const {
    currentFolder,
    currentFolders,
    breadcrumbPath,
    navigateFolder,
    navigateBack,
    navigateToFolder
  } = useNavigation({
    folders,
    currentFolderId,
    setCurrentFolderId
  });

  return {
    // State
    folders,
    currentFolder,
    currentFolders,
    breadcrumbPath,
    isCreateModalOpen,
    newFolderName,
    folderError,
    isLoading,
    folderConflict,

    // Create folder
    openCreateModal,
    closeCreateModal,
    handleCreateFolder,
    setNewFolderName,
    handleInputKeyDown,

    // Folder operations
    setFolderConflict,
    moveFolder,
    renameFolder,
    renameAndMoveFolder,
    replaceFolder,
    deleteFolder,
    getAllSubFolders,

    // Navigation
    navigateFolder,
    navigateBack,
    navigateToFolder,

    // Backup
    restoreFromBackup
  };
}
