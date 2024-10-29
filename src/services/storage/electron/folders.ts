import { FolderStorage } from '../../../core/storage/folders/types';
import { Folder, FolderData } from '../../../core/storage/folders/models';
import { 
  StorageError,
  StorageErrorCode,
  StorageChangeEvent,
  StorageAction
} from '../../../core/storage/base';

declare global {
  interface Window {
    api: {
      invoke: (channel: string, data?: any) => Promise<any>;
      on: (channel: string, callback: Function) => void;
      off: (channel: string, callback: Function) => void;
    };
  }
}

// Log levels to control console output
const enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class ElectronFolderStorage implements FolderStorage {
  private subscribers: Map<StorageAction, Set<Function>> = new Map();
  private generalSubscribers: Set<Function> = new Set();
  private logLevel: LogLevel = LogLevel.ERROR; // Default to errors only

  async load(): Promise<Folder[]> {
    return this.loadFolders();
  }

  async save(folders: Folder[]): Promise<Folder[]> {
    return this.saveFolders(folders);
  }

  async loadFolders(): Promise<Folder[]> {
    try {
      const result: FolderData = await window.api.invoke('load-folders');
      
      this.emitEvent({
        type: StorageAction.UPDATED,
        data: result.folders,
        timestamp: Date.now(),
        metadata: { operation: 'load' }
      }, LogLevel.DEBUG);

      return result.folders;
    } catch (error) {
      const storageError = new StorageError(
        'Failed to load folders',
        StorageErrorCode.STORAGE_ERROR,
        { originalError: error }
      );
      
      this.emitEvent(storageError.toEvent(), LogLevel.ERROR);
      throw storageError;
    }
  }

  async saveFolders(folders: Folder[]): Promise<Folder[]> {
    try {
      const data: FolderData = {
        folders,
        version: 1,
        lastBackup: new Date().toISOString()
      };
      
      const result: FolderData = await window.api.invoke('save-folders', data);

      this.emitEvent({
        type: StorageAction.UPDATED,
        data: result.folders,
        timestamp: Date.now(),
        metadata: { operation: 'save' }
      }, LogLevel.INFO);

      return result.folders;
    } catch (error) {
      const storageError = new StorageError(
        'Failed to save folders',
        StorageErrorCode.STORAGE_ERROR,
        { originalError: error }
      );
      
      this.emitEvent(storageError.toEvent(), LogLevel.ERROR);
      throw storageError;
    }
  }

  async restoreFolders(): Promise<Folder[]> {
    try {
      const result: FolderData = await window.api.invoke('restore-folders');

      this.emitEvent({
        type: StorageAction.UPDATED,
        data: result.folders,
        timestamp: Date.now(),
        metadata: { operation: 'restore' }
      }, LogLevel.INFO);

      return result.folders;
    } catch (error) {
      const storageError = new StorageError(
        'Failed to restore folders',
        StorageErrorCode.BACKUP_ERROR,
        { originalError: error }
      );
      
      this.emitEvent(storageError.toEvent(), LogLevel.ERROR);
      throw storageError;
    }
  }

  subscribe<T>(
    action: StorageAction,
    callback: (event: StorageChangeEvent<T>) => void
  ): () => void {
    if (!this.subscribers.has(action)) {
      this.subscribers.set(action, new Set());
    }
    this.subscribers.get(action)!.add(callback);

    return () => {
      const callbacks = this.subscribers.get(action);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(action);
        }
      }
    };
  }

  subscribeToUpdates(callback: () => void): () => void {
    this.generalSubscribers.add(callback);
    return () => {
      this.generalSubscribers.delete(callback);
    };
  }

  private emitEvent<T>(event: StorageChangeEvent<T>, level: LogLevel = LogLevel.DEBUG): void {
    // Emit to specific event subscribers
    const callbacks = this.subscribers.get(event.type);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }

    // Emit to general subscribers
    this.generalSubscribers.forEach(callback => callback());

    // Log events based on level
    if (level <= this.logLevel) {
      if (level === LogLevel.ERROR) {
        console.error('Folder storage event:', event);
      } else if (level === LogLevel.WARN) {
        console.warn('Folder storage event:', event);
      } else if (level === LogLevel.INFO) {
        console.info('Folder storage event:', event);
      } else {
        console.debug('Folder storage event:', event);
      }
    }
  }
}
