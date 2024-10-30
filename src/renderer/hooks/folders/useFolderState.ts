import { useState, useEffect } from 'react';
import { FolderStateManager } from '../../../core/state/folders';
import { StorageInterface } from '../../../core/storage/types';
import { 
  UIFolderState, 
  UIStateUpdates,
  UICreateFolderResult,
  UIMoveResult,
  UIRenameResult,
  UIReplaceResult,
  UIDeleteResult,
  UIRenameOperation,
  UIMoveOperation,
  UIReplaceOperation,
  UseFolderStateReturn
} from './types';
import { CreateFolderData } from '../../../core/operations/types';
import { FolderItem, toFolderItem } from '../../../core/storage/folders/models';
import { FolderConflict, NameConflictResult } from '../../../core/operations/folders/conflicts';
import { QueuedOperation } from '../../../core/state/operation-queue';

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
  const createFolder = async (data: { name: string }): Promise<UICreateFolderResult> => {
    const parentId = uiState.createInFolderId ?? coreState.currentFolder?.id ?? null;
    const result = await stateManager.createFolder({
      name: data.name,
      parentId
    });

    handleOperationResult(result);
    return result;
  };

  const moveFolder: UIMoveOperation = async (sourceId, targetId) => {
    const result = await stateManager.moveFolder({ sourceId, targetId });
    
    if (!result.success) {
      if (result.data?.type === 'name') {
        const nameConflict = result.data as NameConflictResult;
        const conflict: FolderConflict = {
          sourceId,
          targetId,
          originalName: nameConflict.originalName,
          suggestedName: nameConflict.suggestedName
        };
        const uiResult: UIMoveResult = {
          ...result,
          conflict
        };
        handleOperationResult(uiResult);
        return uiResult;
      }
      return result;
    }

    updateUIState({ folderConflict: null });
    return result;
  };

  const renameFolder: UIRenameOperation = async (id, newName, moveAfter) => {
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

  const replaceFolder: UIReplaceOperation = async (sourceId, targetId) => {
    const result = await stateManager.replaceFolder({ sourceId, targetId });
    handleOperationResult(result);
    return result;
  };

  const deleteFolder = async (id: string): Promise<UIDeleteResult> => {
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

    // Navigation
    setCurrentFolder: stateManager.setCurrentFolder.bind(stateManager),

    // Queue management
    resolveConflict,
    cancelOperation
  };
}
