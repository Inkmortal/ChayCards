import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI & {
      ipcRenderer: {
        invoke(channel: 'get-plugins'): Promise<Array<{ type: string; displayName: string }>>;
        invoke(channel: 'get-plugin', type: string): Promise<any>;
        invoke(channel: 'get-all-documents'): Promise<any[]>;
        invoke(channel: 'save-document', type: string, data: any): Promise<any>;
      };
    };
  }
}
