import { ElectronAPI } from './index';

declare global {
  interface Window {
    electron: ElectronAPI;
    /**
     * Expose Environment more conveniently for preload scripts
     */
    env: {
      /**
       * The build mode
       */
      MODE: string;
    };
  }
}

export {};
