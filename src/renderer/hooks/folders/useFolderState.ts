import { useState, useEffect } from 'react';
import { FolderStateManager } from '../../../core/state/folders';
import { ElectronFolderStorage } from '../../../services/storage';
import { validateFolderName } from '../../../core/operations/folders/validation';
import { 
  UIFolderState, 
  UIStateUpdates,
  UIOperationResult,
  UIRenameOperation,
  UIMoveOperation,
  UIReplaceOperation
} from './types';
import { CreateFolderData, RenameFolderData } from '../../../core/operations/types';
import { Item } from '../../components/library/types';
import { FolderConflict, NameConflictResult } from '../../../core/operations/folders/conflicts';

// Singleton state manager
const storage = new ElectronFolderStorage();
const stateManager = new FolderStateManager(storage);

export function useFolderState() {
  // Core state subscription
  const [coreState, setCoreState] = useState(() => ({
    folders: stateManager.getState().folders,
    currentFolder: stateManager.getCurrentFolder(),
    currentFolders: stateManager.getCurrentFolders(),
    isLoading: stateManager.getState().isLoading
  }));

  // UI state
  const [uiState, setUIState] = useState<Omit<UIFolderState, keyof typeof coreState>>({
    itemToRename: null,
    pendingMove: null,
    folderConflict: null,
    isCreateModalOpen: false,
    newFolderName: '',
    createInFolderId: null
  });

  useEffect(() => {
    return stateManager.subscribe(state => {
      setCoreState({
        folders: state.folders,
        currentFolder: stateManager.getCurrentFolder(),
        currentFolders: stateManager.getCurrentFolders(),
        isLoading: state.isLoading
      });
    });
  }, []);

  // UI State Updates
  const updateUIState = (updates: Partial<typeof uiState>) => {
    setUIState(current => ({ ...current, ...updates }));
  };

  // Create Folder UI
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
    // Synchronous validation for immediate feedback
    const siblings = coreState.folders.filter(f => f.parentId === uiState.createInFolderId);
    const exists = siblings.some(f => f.name.toLowerCase() === name.toLowerCase());
    
    updateUIState({
      newFolderName: name,
      folderError: exists ? 'A folder with this name already exists' : undefined
    });
  };

  // Core Operations with UI Types
  const createFolder = async (data: CreateFolderData): Promise<UIOperationResult> => {
    const result = await stateManager.createFolder(data);
    return {
      success: result.success,
      error: result.error
    };
  };

  const moveFolder: UIMoveOperation = async (sourceId, targetId) => {
    const result = await stateManager.moveFolder({ sourceId, targetId });
    if (!result.success && result.data) {
      // Check if it's a name conflict
      if (result.data.type === 'name') {
        const nameConflict = result.data as NameConflictResult;
        // Convert to UI conflict
        const conflict: FolderConflict = {
          sourceId,
          targetId,
          originalName: nameConflict.originalName,
          suggestedName: nameConflict.suggestedName
        };
        return {
          success: false,
          error: result.error,
          conflict
        };
      }
    }
    return { success: true };
  };

  const renameFolder: UIRenameOperation = async (id, newName, moveAfter) => {
    const result = await stateManager.renameFolder({ id, newName });
    if (result.success && moveAfter) {
      await stateManager.moveFolder({ 
        sourceId: id, 
        targetId: moveAfter.targetId 
      });
    }
  };

  const replaceFolder: UIReplaceOperation = async (sourceId, targetId) => {
    const result = await stateManager.replaceFolder({ sourceId, targetId });
    return {
      success: result.success,
      error: result.error
    };
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
    setItemToRename: (item: Item | null) => updateUIState({ itemToRename: item }),
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

    // Core operations with UI types
    createFolder,
    moveFolder,
    renameFolder,
    replaceFolder,
    deleteFolder: stateManager.deleteFolder.bind(stateManager),

    // Navigation
    setCurrentFolder: stateManager.setCurrentFolder.bind(stateManager)
  };
}
