import { StorageInterface } from '../../storage/types';
import { Folder } from '../../../core/storage/folders/models';
import { 
  OperationResult,
  CreateFolderData,
  MoveFolderData,
  RenameFolderData,
  FolderOperationsType
} from '../types';
import { createFolder } from './create';
import { moveFolder } from './move';
import { renameFolder } from './rename';
import { deleteFolder } from './delete';
import { renameAndMoveFolder } from './renameAndMove';
import { replaceFolder, ReplaceFolderData } from './replace';

export class FolderOperations implements FolderOperationsType {
  private storage: StorageInterface;

  constructor(storage: StorageInterface) {
    this.storage = storage;
  }

  async createFolder(
    data: CreateFolderData,
    folders: Folder[]
  ): Promise<OperationResult<Folder>> {
    return await createFolder(data, folders, this.storage);
  }

  async moveFolder(
    data: MoveFolderData,
    folders: Folder[]
  ): Promise<OperationResult> {
    return await moveFolder(data, folders, this.storage);
  }

  async renameFolder(
    data: RenameFolderData,
    folders: Folder[]
  ): Promise<OperationResult> {
    return await renameFolder(data, folders, this.storage);
  }

  async deleteFolder(
    id: string, 
    folders: Folder[]
  ): Promise<OperationResult> {
    return await deleteFolder(id, folders, this.storage);
  }

  async renameAndMoveFolder(
    id: string,
    newName: string,
    targetId: string | null,
    folders: Folder[]
  ): Promise<OperationResult> {
    return await renameAndMoveFolder(id, newName, targetId, folders, this.storage);
  }

  async replaceFolder(
    data: ReplaceFolderData,
    folders: Folder[]
  ): Promise<OperationResult> {
    return await replaceFolder(data, folders, this.storage);
  }
}

export type {
  CreateFolderData,
  MoveFolderData,
  RenameFolderData,
  ReplaceFolderData
};
