declare global {
  interface Window {
    api: {
      invoke: (channel: string, data?: any) => Promise<any>;
      on: (channel: string, callback: Function) => void;
      off: (channel: string, callback: Function) => void;
    };
  }
}

const DEBUG = process.env.NODE_ENV === 'development';

function logOperation(operation: string, data?: any) {
  if (!DEBUG) return;
  console.group(`🔄 IPC Bridge - ${operation}`);
  console.log('Payload:', data);
  console.groupEnd();
}

function logError(operation: string, error: any) {
  if (!DEBUG) return;
  console.group(`❌ IPC Bridge Error - ${operation}`);
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.groupEnd();
}

async function invokeWithErrorHandling(channel: string, data?: any) {
  try {
    logOperation(`Invoking ${channel}`, data);
    const response = await window.api.invoke(channel, data);
    
    if (response?.error) {
      logError(channel, response.error);
      throw new Error(response.error.message || 'Operation failed');
    }
    
    return response;
  } catch (error) {
    logError(channel, error);
    throw error;
  }
}

export async function loadFolders() {
  return invokeWithErrorHandling('load-folders');
}

export async function saveFolders(data: any) {
  return invokeWithErrorHandling('save-folders', data);
}

export async function restoreFolders() {
  return invokeWithErrorHandling('restore-folders');
}

type FolderUpdateCallback = (data: any) => void;

export function subscribeFolderUpdates(callback: FolderUpdateCallback) {
  const wrappedCallback = (event: any, data: any) => {
    try {
      logOperation('Folder Update Event', data);
      callback(data);
    } catch (error) {
      logError('Folder Update Callback', error);
    }
  };

  window.api.on('folders-updated', wrappedCallback);
  return () => window.api.off('folders-updated', wrappedCallback);
}

export async function moveFolder(sourceId: string, targetId: string | null) {
  return invokeWithErrorHandling('move-folder', { sourceId, targetId });
}

export async function renameFolder(id: string, newName: string) {
  return invokeWithErrorHandling('rename-folder', { id, newName });
}

export async function deleteFolder(id: string) {
  return invokeWithErrorHandling('delete-folder', { id });
}
