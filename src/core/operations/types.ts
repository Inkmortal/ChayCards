import { Folder } from '../storage/folders/models';
import { FolderConflictResult } from './folders/conflicts';

export interface OperationResult<T = FolderConflictResult> {
  success: boolean;
  error?: string;
  data?: T;
}

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

export interface FolderOperationsType {
  createFolder: (data: CreateFolderData, folders: Folder[]) => Promise<OperationResult<Folder>>;
  moveFolder: (data: MoveFolderData, folders: Folder[]) => Promise<OperationResult>;
  renameFolder: (data: RenameFolderData, folders: Folder[]) => Promise<OperationResult>;
  deleteFolder: (id: string, folders: Folder[]) => Promise<OperationResult>;
  renameAndMoveFolder: (id: string, newName: string, targetId: string | null, folders: Folder[]) => Promise<OperationResult>;
  replaceFolder: (data: ReplaceFolderData, folders: Folder[]) => Promise<OperationResult>;
}
