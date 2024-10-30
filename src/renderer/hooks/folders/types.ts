import { Folder } from '../../../core/storage/folders/models';
import { FolderConflict } from '../../../core/operations/folders/conflicts';
import { Item } from '../../components/library/types';

/**
 * UI Operation Types
 * Bridge between core operations and UI components
 */
export interface UIOperationResult {
  success: boolean;
  error?: string;
  conflict?: FolderConflict;
}

export type UIRenameOperation = (id: string, newName: string, moveAfter?: { targetId: string | null }) => Promise<void>;
export type UIMoveOperation = (sourceId: string, targetId: string | null) => Promise<UIOperationResult>;
export type UIReplaceOperation = (sourceId: string, targetId: string | null) => Promise<UIOperationResult>;

/**
 * UI State Types
 */
export interface UIFolderState {
  // Core Data
  folders: Folder[];
  currentFolder: Folder | null;
  currentFolders: Folder[];
  isLoading: boolean;

  // Modal State
  itemToRename: Item | null;
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
  setItemToRename: (item: Item | null) => void;
  setPendingMove: (move: { sourceId: string; targetId: string | null } | null) => void;
  setFolderConflict: (conflict: FolderConflict | null) => void;
  openCreateModal: (parentId?: string | null) => void;
  closeCreateModal: () => void;
  setNewFolderName: (name: string) => void;
  clearModalStates: () => void;
}
