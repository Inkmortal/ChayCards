import { useState, useEffect } from 'react';
import { Folder } from '../../../core/storage/folders/models';
import { useCreateFolder } from './useCreateFolder';
import { useFolderOperations } from './useFolderOperations';
import { useNavigation } from './useNavigation';
import { ElectronFolderStorage } from '../../../services/storage';

const storage = new ElectronFolderStorage();

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const loadFolders = async () => {
    try {
      setIsLoading(true);
      const loadedFolders = await storage.loadFolders();
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
      const unsubscribe = storage.subscribeToUpdates(() => loadFolders());
      return () => unsubscribe();
    }
  }, [isInitialLoad]);

  const restoreFromBackup = async () => {
    try {
      const restoredFolders = await storage.restoreFolders();
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
