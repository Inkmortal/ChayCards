import { Folder } from '../hooks/folders/types';

export interface StorageInterface {
  loadFolders(): Promise<Folder[]>;
  saveFolders(folders: Folder[]): Promise<Folder[]>;
}
