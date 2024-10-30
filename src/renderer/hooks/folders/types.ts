import { Folder, FolderItem } from '../../../core/storage/folders/models';
import { 
  OperationResult,
  OperationState,
  UIOperationHandlers,
  CreateFolderResult,
  MoveFolderResult,
  RenameFolderResult,
  DeleteFolderResult,
  ReplaceFolderResult
} from '../../../core/operations/types';
import { QueuedOperation } from '../../../core/state/operation-queue';
import { FolderConflict } from '../../../core/operations/folders/conflicts';

/**
 * UI State
 */
export interface UIFolderState {
  // Core Data
  folders: Folder[];
  currentFolder: Folder | null;
  currentFolders: Folder[];
  isLoading: boolean;
  currentOperation: QueuedOperation | null;

  // Operation State
  isProcessing: boolean;
  hasConflict: boolean;

  // Modal State
  itemToRename: FolderItem | null;
  pendingMove: { sourceId: string; targetId: string | null } | null;
  isCreateModalOpen: boolean;
  newFolderName: string;
  createInFolderId: string | null;
  folderError?: string;
  folderConflict: FolderConflict | null;
}

/**
 * UI State Updates
 */
export interface UIStateUpdates {
  setItemToRename: (item: FolderItem | null) => void;
  setPendingMove: (move: { sourceId: string; targetId: string | null } | null) => void;
  setFolderConflict: (conflict: FolderConflict | null) => void;
  openCreateModal: (parentId?: string | null) => void;
  closeCreateModal: () => void;
  setNewFolderName: (name: string) => void;
  clearModalStates: () => void;
}

/**
 * Navigation Utilities
 */
export interface NavigationUtils {
  navigateBack: () => void;
  navigateToFolder: (id: string | null) => void;
  getBreadcrumbPath: (folder: Folder) => Folder[];
}

/**
 * Conflict Resolution
 */
export interface ConflictHandlers {
  handleConflictResolve: {
    replace: () => Promise<void>;
    rename: () => void;
    cancel: () => void;
  };
}

/**
 * Combined Hook Return Type
 */
export interface UseFolderStateReturn extends 
  UIFolderState, 
  UIStateUpdates, 
  UIOperationHandlers,
  NavigationUtils,
  ConflictHandlers {
  // Core operations (using core types directly)
  createFolder: (data: { name: string }) => Promise<CreateFolderResult>;
  moveFolder: (sourceId: string, targetId: string | null) => Promise<MoveFolderResult & { conflict?: FolderConflict }>;
  renameFolder: (id: string, newName: string, moveAfter?: { targetId: string | null }) => Promise<RenameFolderResult>;
  replaceFolder: (sourceId: string, targetId: string | null) => Promise<ReplaceFolderResult>;
  deleteFolder: (id: string) => Promise<DeleteFolderResult>;
  
  // Navigation
  setCurrentFolder: (id: string | null) => void;

  // Queue management
  resolveConflict: () => void;
  cancelOperation: () => void;

  // Folder creation
  handleCreateFolder: () => Promise<void>;
}
