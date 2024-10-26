import { contextBridge } from 'electron';

// Empty for now - we'll add IPC communication later
contextBridge.exposeInMainWorld('api', {});
