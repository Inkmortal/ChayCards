import { useState, useCallback } from 'react';
import { Folder } from '../../../core/storage/folders/models';
import { FolderOperations } from '../../../core/operations/folders';
import { ElectronFolderStorage } from '../../../services/storage';
import { detectNameConflict } from '../../../core/operations/folders/conflicts';

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

  const operations = new FolderOperations(new ElectronFolderStorage());

  const validateName = useCallback((nameToCheck: string): string | undefined => {
    const conflict = detectNameConflict(nameToCheck, createInFolderId, folders);
    return conflict?.message;
  }, [folders, createInFolderId]);

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

  const setNewFolderNameWithValidation = (name: string) => {
    setNewFolderName(name);
    setFolderError(validateName(name));
  };

  const handleCreateFolder = async () => {
    const trimmedName = newFolderName.trim();
    const error = validateName(trimmedName);
    
    if (error) {
      setFolderError(error);
      return;
    }

    try {
      const result = await operations.createFolder(
        { name: trimmedName, parentId: createInFolderId },
        folders
      );

      if (!result.success || !result.data) {
        setFolderError(result.error || 'Failed to create folder');
        return;
      }

      setFolders([...folders, result.data]);
      closeCreateModal();
    } catch (error) {
      console.error('Error in handleCreateFolder:', error);
      setFolderError('Failed to create folder. Please try again.');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !folderError && newFolderName.trim()) {
      handleCreateFolder();
    } else if (e.key === 'Escape') {
      closeCreateModal();
    }
  };

  return {
    isCreateModalOpen,
    newFolderName,
    folderError,
    createInFolderId,
    openCreateModal,
    closeCreateModal,
    setNewFolderName: setNewFolderNameWithValidation,
    handleCreateFolder,
    handleInputKeyDown
  };
}
