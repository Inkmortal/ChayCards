import { StorageInterface } from '../../storage/types';
import { Folder } from '../../../renderer/hooks/folders/types';
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
}
