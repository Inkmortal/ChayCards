import { 
  Folder, 
  FolderItem 
} from '../../../core/storage/folders/models';
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
import { FolderConflict } from '../../../core/operations/folders/conflicts';
import { QueuedOperation } from '../../../core/state/operation-queue';

/**
 * UI State Types
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
  folderConflict: FolderConflict | null;
  isCreateModalOpen: boolean;
  newFolderName: string;
  createInFolderId: string | null;
  folderError?: string;
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
 * Operation Types
 */
export interface UIOperationResult extends OperationResult {
  conflict?: FolderConflict;
}

export type UICreateFolderResult = CreateFolderResult & { conflict?: FolderConflict };
export type UIMoveResult = MoveFolderResult & { conflict?: FolderConflict };
export type UIRenameResult = RenameFolderResult & { conflict?: FolderConflict };
export type UIDeleteResult = DeleteFolderResult & { conflict?: FolderConflict };
export type UIReplaceResult = ReplaceFolderResult & { conflict?: FolderConflict };

export type UIRenameOperation = (
  id: string, 
  newName: string, 
  moveAfter?: { targetId: string | null }
) => Promise<UIRenameResult>;

export type UIMoveOperation = (
  sourceId: string, 
  targetId: string | null
) => Promise<UIMoveResult>;

export type UIReplaceOperation = (
  sourceId: string, 
  targetId: string | null
) => Promise<UIReplaceResult>;

/**
 * Combined Hook Return Type
 */
export interface UseFolderStateReturn extends 
  UIFolderState, 
  UIStateUpdates, 
  UIOperationHandlers {
  // Core operations
  createFolder: (data: { name: string }) => Promise<UICreateFolderResult>;
  moveFolder: UIMoveOperation;
  renameFolder: UIRenameOperation;
  replaceFolder: UIReplaceOperation;
  deleteFolder: (id: string) => Promise<UIDeleteResult>;
  
  // Navigation
  setCurrentFolder: (id: string | null) => void;

  // Queue management
  resolveConflict: () => void;
  cancelOperation: () => void;
}
