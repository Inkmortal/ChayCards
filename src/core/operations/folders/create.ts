import { Folder } from '../../../renderer/hooks/folders/types';
import { CreateFolderData, OperationResult } from '../types';
import { StorageInterface } from '../../storage/types';
import { validateFolderName } from './validation';

export async function createFolder(
  data: CreateFolderData,
  folders: Folder[],
  storage: StorageInterface
): Promise<OperationResult<Folder>> {
  try {
    const isValid = await validateFolderName(data.name, data.parentId, folders);
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid folder name or folder already exists'
      };
    }

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: data.name,
      parentId: data.parentId,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    // Add to folders and save
    const updatedFolders = [...folders, newFolder];
    await storage.saveFolders(updatedFolders);

    return {
      success: true,
      data: newFolder
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create folder'
    };
  }
}
