import { Folder } from '../../renderer/hooks/folders/types';

export interface OperationResult<T = void> {
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

export interface FolderOperationsType {
  createFolder: (data: CreateFolderData, folders: Folder[]) => Promise<OperationResult<Folder>>;
  moveFolder: (data: MoveFolderData, folders: Folder[]) => Promise<OperationResult>;
  renameFolder: (data: RenameFolderData, folders: Folder[]) => Promise<OperationResult>;
  deleteFolder: (id: string, folders: Folder[]) => Promise<OperationResult>;
}
