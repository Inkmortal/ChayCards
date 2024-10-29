import { DataStorage, StorageEventEmitter, StorageChangeEvent } from '../base';
import { Folder } from './models';

/**
 * Folder event data types
 */
export interface FolderEventData {
  folders?: Folder[];
  folder?: Folder;
  folderId?: string;
  parentId?: string | null;
  error?: {
    code: string;
    message: string;
    context?: any;
  };
}

/**
 * Folder-specific storage interface
 */
export interface FolderStorage extends DataStorage<Folder[]>, StorageEventEmitter {
  /**
   * Load folders from storage
   * Emits: UPDATED event with loaded folders
   */
  loadFolders(): Promise<Folder[]>;

  /**
   * Save folders to storage
   * Emits: UPDATED event with saved folders
   * @param folders Folders to save
   */
  saveFolders(folders: Folder[]): Promise<Folder[]>;

  /**
   * Restore folders from backup
   * Emits: UPDATED event with restored folders
   */
  restoreFolders(): Promise<Folder[]>;
}
