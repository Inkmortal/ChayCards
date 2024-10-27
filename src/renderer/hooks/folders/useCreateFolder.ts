import { useState } from 'react';
import { Folder } from './types';
import { saveFoldersToApi } from './api';

interface UseCreateFolderProps {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
}

interface UseCreateFolderReturn {
  isCreateModalOpen: boolean;
  newFolderName: string;
  folderError: string | undefined;
  createInFolderId: string | null;
  openCreateModal: (parentId?: string | null) => void;
  closeCreateModal: () => void;
  setNewFolderName: (name: string) => void;
  handleCreateFolder: () => Promise<void>;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function useCreateFolder({ folders, setFolders }: UseCreateFolderProps): UseCreateFolderReturn {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderError, setFolderError] = useState<string | undefined>();
  const [createInFolderId, setCreateInFolderId] = useState<string | null>(null);

  const openCreateModal = (parentId?: string | null) => {
    setIsCreateModalOpen(true);
    setNewFolderName('');
    setFolderError(undefined);
    setCreateInFolderId(parentId ?? null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewFolderName('');
    setFolderError(undefined);
    setCreateInFolderId(null);
  };

  const handleCreateFolder = async () => {
    const trimmedName = newFolderName.trim();
    
    if (!trimmedName) {
      setFolderError('Folder name is required');
      return;
    }

    const isDuplicate = folders.some(
      (folder: Folder) => 
        folder.parentId === createInFolderId && 
        folder.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setFolderError('A folder with this name already exists');
      return;
    }

    try {
      const now = new Date().toISOString();
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: trimmedName,
        parentId: createInFolderId,
        createdAt: now,
        modifiedAt: now,
      };

      console.log('Creating new folder:', newFolder);
      const updatedFolders = [...folders, newFolder];
      const savedFolders = await saveFoldersToApi(updatedFolders);
      setFolders(savedFolders);
      closeCreateModal();
    } catch (error) {
      console.error('Error in handleCreateFolder:', error);
      setFolderError('Failed to create folder. Please try again.');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCreateFolder();
    else if (e.key === 'Escape') closeCreateModal();
  };

  return {
    isCreateModalOpen,
    newFolderName,
    folderError,
    createInFolderId,
    openCreateModal,
    closeCreateModal,
    setNewFolderName,
    handleCreateFolder,
    handleInputKeyDown
  };
}
