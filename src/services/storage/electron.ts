import { StorageInterface } from '../../core/storage/types';
import { Folder } from '../../renderer/hooks/folders/types';
import { loadFoldersFromApi, saveFoldersToApi } from '../../renderer/hooks/folders/api';

export class ElectronStorage implements StorageInterface {
  async loadFolders(): Promise<Folder[]> {
    return await loadFoldersFromApi();
  }
  
  async saveFolders(folders: Folder[]): Promise<Folder[]> {
    return await saveFoldersToApi(folders);
  }
}
