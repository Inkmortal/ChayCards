/**
 * Type Definitions for Electron Preload Script
 *
 * This file extends the global Window interface to include our ElectronAPI,
 * making TypeScript aware of our IPC bridge API methods available in the renderer process.
 */

import { ElectronAPI } from './index'

declare global {
  /**
   * Extends the Window interface to include our custom electron API
   * This makes the electron API available globally in the renderer process
   * as window.electron
   */
  interface Window {
    electron: ElectronAPI & {
      // Process information including Node.js and Electron versions
      process: {
        versions: Record<string, string>
      }
    }
  }
}
