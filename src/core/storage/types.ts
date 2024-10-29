import { Folder } from './folders/models';

export interface StorageInterface {
  loadFolders(): Promise<Folder[]>;
  saveFolders(folders: Folder[]): Promise<Folder[]>;
}
