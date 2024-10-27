import { Folder, FolderData } from './types';

declare global {
  interface Window {
    api: {
      invoke: (channel: string, data?: any) => Promise<any>;
      on: (channel: string, callback: Function) => void;
      off: (channel: string, callback: Function) => void;
    };
  }
}

export async function loadFoldersFromApi(): Promise<Folder[]> {
  try {
    console.log('Loading folders from API');
    const result: FolderData = await window.api.invoke('load-folders');
    console.log('Loaded folders:', result);
    return result.folders;
  } catch (error) {
    console.error('Error loading folders:', error);
    throw error;
  }
}

export async function saveFoldersToApi(folders: Folder[]): Promise<Folder[]> {
  try {
    console.log('Saving folders to API:', folders);
    const data: FolderData = {
      folders,
      version: 1,
      lastBackup: new Date().toISOString()
    };
    const result: FolderData = await window.api.invoke('save-folders', data);
    console.log('Save result:', result);
    return result.folders;
  } catch (error) {
    console.error('Error saving folders:', error);
    throw error;
  }
}

export async function restoreFoldersFromBackup(): Promise<Folder[]> {
  try {
    console.log('Restoring folders from backup');
    const result: FolderData = await window.api.invoke('restore-folders');
    console.log('Restored folders:', result);
    return result.folders;
  } catch (error) {
    console.error('Error restoring folders:', error);
    throw error;
  }
}

export function subscribeToFolderUpdates(callback: () => void): () => void {
  window.api.on('folders-updated', callback);
  return () => window.api.off('folders-updated', callback);
}
