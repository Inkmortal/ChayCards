import { useState, useEffect } from 'react';
import { FolderStateManager } from '../../../core/state/folders';
import { StorageInterface } from '../../../core/storage/types';
import { 
  UIFolderState, 
  UIStateUpdates,
  UseFolderStateReturn
} from './types';
import { CreateFolderData } from '../../../core/operations/types';
import { Folder, FolderItem } from '../../../core/storage/folders/models';
import { FolderConflict, NameConflictResult } from '../../../core/operations/folders/conflicts';

declare global {
  interface Window {
    storage: StorageInterface;
  }
}

const stateManager = new FolderStateManager(window.storage);

export function useFolderState(): UseFolderStateReturn {
  const [coreState, setCoreState] = useState(() => ({
    folders: stateManager.getState().folders,
    currentFolder: stateManager.getCurrentFolder(),
    currentFolders: stateManager.getCurrentFolders(),
    isLoading: stateManager.getState().isLoading,
    currentOperation: stateManager.getState().currentOperation
  }));

  const [uiState, setUIState] = useState<Omit<UIFolderState, keyof typeof coreState>>({
    itemToRename: null,
    pendingMove: null,
    folderConflict: null,
    isCreateModalOpen: false,
    newFolderName: '',
    createInFolderId: null,
    isProcessing: false,
    hasConflict: false,
    folderError: undefined
  });

  useEffect(() => {
    return stateManager.subscribe(state => {
      setCoreState({
        folders: state.folders,
        currentFolder: stateManager.getCurrentFolder(),
        currentFolders: stateManager.getCurrentFolders(),
        isLoading: state.isLoading,
        currentOperation: state.currentOperation
      });
    });
  }, []);

  useEffect(() => {
    const operation = coreState.currentOperation;
    if (operation) {
      setUIState(current => ({
        ...current,
        isProcessing: operation.status === 'processing',
        hasConflict: operation.status === 'conflict'
      }));
    }
  }, [coreState.currentOperation]);

  const updateUIState = (updates: Partial<Omit<UIFolderState, keyof typeof coreState>>) => {
    setUIState(current => ({ ...current, ...updates }));
  };

  const handleOperationResult = <T extends { success: boolean, error?: string, conflict?: FolderConflict }>(result: T) => {
    if (!result.success) {
      if (result.conflict) {
        updateUIState({ folderConflict: result.conflict });
      }
    } else {
      updateUIState({ folderConflict: null });
    }
  };

  // Navigation Utilities
  const navigateBack = () => {
    if (coreState.currentFolder?.parentId !== undefined) {
      stateManager.setCurrentFolder(coreState.currentFolder.parentId);
    }
  };

  const navigateToFolder = (id: string | null) => {
    stateManager.setCurrentFolder(id);
  };

  const getBreadcrumbPath = (folder: Folder): Folder[] => {
    const path: Folder[] = [];
    let current: Folder | undefined = folder;
    
    while (current) {
      path.unshift(current);
      current = coreState.folders.find(f => f.id === current?.parentId);
    }

    return path;
  };

  // Conflict Resolution
  const handleConflictResolve = {
    replace: async () => {
      if (!uiState.folderConflict) return;
      const result = await replaceFolder(
        uiState.folderConflict.sourceId, 
        uiState.folderConflict.targetId
      );
      if (result.success) {
        updateUIState({ folderConflict: null });
      }
    },
    rename: () => {
      if (!uiState.folderConflict) return;
      updateUIState({
        pendingMove: {
          sourceId: uiState.folderConflict.sourceId,
          targetId: uiState.folderConflict.targetId
        }
      });
      const sourceItem = coreState.folders.find(f => f.id === uiState.folderConflict?.sourceId);
      if (sourceItem) {
        updateUIState({
          itemToRename: {
            ...sourceItem,
            name: uiState.folderConflict.suggestedName,
            type: 'folder'
          }
        });
      }
      updateUIState({ folderConflict: null });
    },
    cancel: () => {
      updateUIState({
        folderConflict: null,
        pendingMove: null,
        itemToRename: null
      });
    }
  };

  // UI Actions
  const openCreateModal: UIStateUpdates['openCreateModal'] = (parentId) => {
    updateUIState({
      isCreateModalOpen: true,
      newFolderName: '',
      folderError: undefined,
      createInFolderId: parentId ?? null
    });
  };

  const closeCreateModal: UIStateUpdates['closeCreateModal'] = () => {
    updateUIState({
      isCreateModalOpen: false,
      newFolderName: '',
      folderError: undefined,
      createInFolderId: null
    });
  };

  const setNewFolderName: UIStateUpdates['setNewFolderName'] = (name) => {
    const siblings = coreState.folders.filter(f => f.parentId === uiState.createInFolderId);
    const exists = siblings.some(f => f.name.toLowerCase() === name.toLowerCase());
    
    updateUIState({
      newFolderName: name,
      folderError: exists ? 'A folder with this name already exists' : undefined
    });
  };

  // Core Operations
  const handleCreateFolder = async () => {
    if (!uiState.folderError && uiState.newFolderName.trim()) {
      const result = await createFolder({
        name: uiState.newFolderName.trim()
      });
      if (result.success) {
        closeCreateModal();
      }
    }
  };

  const createFolder = async (data: { name: string }) => {
    const parentId = uiState.createInFolderId ?? coreState.currentFolder?.id ?? null;
    const result = await stateManager.createFolder({
      name: data.name,
      parentId
    });

    handleOperationResult(result);
    return result;
  };

  const moveFolder = async (sourceId: string, targetId: string | null) => {
    const result = await stateManager.moveFolder({ sourceId, targetId });
    
    if (!result.success && result.data?.type === 'name') {
      const nameConflict = result.data as NameConflictResult;
      const conflict: FolderConflict = {
        sourceId,
        targetId,
        originalName: nameConflict.originalName,
        suggestedName: nameConflict.suggestedName
      };
      handleOperationResult({ ...result, conflict });
      return { ...result, conflict };
    }

    handleOperationResult(result);
    return result;
  };

  const renameFolder = async (id: string, newName: string, moveAfter?: { targetId: string | null }) => {
    const result = await stateManager.renameFolder({ id, newName });
    handleOperationResult(result);
    if (result.success && moveAfter) {
      const moveResult = await stateManager.moveFolder({ 
        sourceId: id, 
        targetId: moveAfter.targetId 
      });
      handleOperationResult(moveResult);
    }
    return result;
  };

  const replaceFolder = async (sourceId: string, targetId: string | null) => {
    const result = await stateManager.replaceFolder({ sourceId, targetId });
    handleOperationResult(result);
    return result;
  };

  const deleteFolder = async (id: string) => {
    const result = await stateManager.deleteFolder(id);
    handleOperationResult(result);
    return result;
  };

  // Queue Management
  const resolveConflict = () => {
    stateManager.resumeOperationQueue();
    updateUIState({ folderConflict: null });
  };

  const cancelOperation = () => {
    stateManager.clearOperationQueue();
    updateUIState({ folderConflict: null });
  };

  return {
    // Core state
    ...coreState,

    // UI state
    ...uiState,

    // UI actions
    openCreateModal,
    closeCreateModal,
    setNewFolderName,
    setItemToRename: (item: FolderItem | null) => updateUIState({ itemToRename: item }),
    setPendingMove: (move: { sourceId: string; targetId: string | null } | null) => 
      updateUIState({ pendingMove: move }),
    setFolderConflict: (conflict: FolderConflict | null) => 
      updateUIState({ folderConflict: conflict }),
    clearModalStates: () => updateUIState({
      itemToRename: null,
      pendingMove: null,
      folderConflict: null,
      isCreateModalOpen: false,
      newFolderName: '',
      folderError: undefined,
      createInFolderId: null
    }),

    // Core operations
    createFolder,
    moveFolder,
    renameFolder,
    replaceFolder,
    deleteFolder,
    handleCreateFolder,

    // Navigation
    setCurrentFolder: stateManager.setCurrentFolder.bind(stateManager),
    navigateBack,
    navigateToFolder,
    getBreadcrumbPath,

    // Conflict resolution
    handleConflictResolve,

    // Queue management
    resolveConflict,
    cancelOperation
  };
}
