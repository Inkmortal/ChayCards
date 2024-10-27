import { contextBridge, ipcRenderer } from 'electron';

// Log that preload script is starting
console.log('Preload script starting...');

// Create the API object
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
        throw error;
      }
    }
    throw new Error(`Invalid channel: ${channel}`);
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

// Expose the API to the renderer process
try {
  console.log('Preload: Exposing API to renderer process');
  contextBridge.exposeInMainWorld('api', api);
  console.log('Preload: API exposed successfully');
} catch (error) {
  console.error('Preload: Error exposing API:', error);
}

// Log that preload script is complete
console.log('Preload script complete');
