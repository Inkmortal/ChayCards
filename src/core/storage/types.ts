import { Folder } from '../../renderer/hooks/folders/types';

export interface StorageInterface {
  loadFolders(): Promise<Folder[]>;
  saveFolders(folders: Folder[]): Promise<Folder[]>;
}
