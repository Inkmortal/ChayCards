import { StorageInterface } from './types';
import { Folder } from '../hooks/folders/types';
import { loadFoldersFromApi, saveFoldersToApi } from '../hooks/folders/api';

export class ElectronStorage implements StorageInterface {
  async loadFolders(): Promise<Folder[]> {
    return await loadFoldersFromApi();
  }
  
  async saveFolders(folders: Folder[]): Promise<Folder[]> {
    return await saveFoldersToApi(folders);
  }
}
