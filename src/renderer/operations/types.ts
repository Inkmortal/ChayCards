import { Folder } from '../hooks/folders/types';

export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
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

// Add interfaces for testing
export interface FolderServiceMock {
  createFolder: jest.Mock<Promise<OperationResult<Folder>>>;
  moveFolder: jest.Mock<Promise<OperationResult>>;
  renameFolder: jest.Mock<Promise<OperationResult>>;
  deleteFolder: jest.Mock<Promise<OperationResult>>;
}

export interface TestFolder extends Folder {
  children?: TestFolder[];
}
