import { contextBridge, ipcRenderer } from 'electron';
import { StorageInterface } from '../core/storage/types';
import { StorageError, StorageErrorCode } from '../core/storage/base';

// Create the API object with proper error handling
const api = {
  invoke: async (channel: string, data?: any) => {
    const validChannels = ['load-folders', 'save-folders', 'restore-folders'];
    if (validChannels.includes(channel)) {
      try {
        console.log(`Preload: Invoking ${channel}`, data);
        const result = await ipcRenderer.invoke(channel, data);
        console.log(`Preload: ${channel} result:`, result);
        return result;
      } catch (error) {
        console.error(`Preload: Error in ${channel}:`, error);
        throw new StorageError(
          `Failed to execute ${channel}`,
          StorageErrorCode.STORAGE_ERROR,
          { originalError: error }
        );
      }
    }
    throw new StorageError(
      `Invalid channel: ${channel}`,
      StorageErrorCode.INVALID_DATA
    );
  },
  on: (channel: string, callback: Function) => {
    const validChannels = ['folders-updated'];
    if (validChannels.includes(channel)) {
      console.log(`Preload: Registering listener for ${channel}`);
      const subscription = (_event: any, ...args: any[]) => callback(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        console.log(`Preload: Removing listener for ${channel}`);
        ipcRenderer.removeListener(channel, subscription);
      };
    }
  },
  off: (channel: string, callback: Function) => {
    const validChannels = ['folders-updated'];
    if (validChannels.includes(channel)) {
      console.log(`Preload: Removing listener for ${channel}`);
      ipcRenderer.removeListener(channel, callback as any);
    }
  }
};

// Create storage interface that uses the API
const storage: StorageInterface = {
  async loadFolders() {
    const result = await api.invoke('load-folders');
    return result.folders;
  },
  async saveFolders(folders) {
    const result = await api.invoke('save-folders', { folders });
    return result.folders;
  }
};

// Expose both API and storage to renderer
contextBridge.exposeInMainWorld('api', api);
contextBridge.exposeInMainWorld('storage', storage);

// Type declarations
declare global {
  interface Window {
    api: typeof api;
    storage: StorageInterface;
  }
}

// Log that preload script is complete
console.log('Preload script complete');
