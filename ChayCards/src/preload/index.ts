import { contextBridge, ipcRenderer } from 'electron';

// Custom APIs for renderer
const api = {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => {
      const validChannels = [
        'get-plugins',
        'get-plugin',
        'get-all-documents',
        'save-document',
        'delete-document'
      ];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      }
      throw new Error(`Invalid IPC channel: ${channel}`);
    }
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = api;
}
