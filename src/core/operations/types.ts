import { Folder, FolderItem } from '../storage/folders/models';
import { FolderConflictResult } from './folders/conflicts';

// Operation Results
export interface OperationResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

export type CreateFolderResult = OperationResult<Folder>;
export type MoveFolderResult = OperationResult<FolderConflictResult>;
export type RenameFolderResult = OperationResult;
export type DeleteFolderResult = OperationResult;
export type ReplaceFolderResult = OperationResult;

// Operation Data Types
export interface CreateFolderData {
  name: string;
  parentId: string | null;
}

export interface MoveFolderData {
  sourceId: string;
  targetId: string | null;
}

export interface RenameFolderData {
  id: string;
  newName: string;
}

export interface ReplaceFolderData {
  sourceId: string;
  targetId: string | null;
}

// Core Operations Interface
export interface FolderOperationsType {
  createFolder: (data: CreateFolderData, folders: Folder[]) => Promise<CreateFolderResult>;
  moveFolder: (data: MoveFolderData, folders: Folder[]) => Promise<MoveFolderResult>;
  renameFolder: (data: RenameFolderData, folders: Folder[]) => Promise<RenameFolderResult>;
  deleteFolder: (id: string, folders: Folder[]) => Promise<DeleteFolderResult>;
  renameAndMoveFolder: (id: string, newName: string, targetId: string | null, folders: Folder[]) => Promise<RenameFolderResult>;
  replaceFolder: (data: ReplaceFolderData, folders: Folder[]) => Promise<ReplaceFolderResult>;
}

// UI Operation Types
export interface UIOperationHandlers {
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreateFolder?: (parentId: string | null) => void;
  onMove?: (sourceId: string, targetId: string | null) => void;
  onRename?: (id: string, newName: string) => void;
  onReplace?: (sourceId: string, targetId: string | null) => void;
}

// Operation Status
export type OperationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'conflict';

export interface OperationState {
  status: OperationStatus;
  error?: string;
  data?: any;
}
