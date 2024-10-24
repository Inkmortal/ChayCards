/**
 * Environment Type Declarations for Renderer Process
 *
 * This file provides TypeScript type definitions for the renderer process,
 * including Vite's client types and our Electron IPC bridge API.
 */

/// <reference types="vite/client" />

import { ElectronAPI } from '../../../preload'

declare global {
  /**
   * Extends the Window interface to include our Electron API
   * This makes TypeScript aware of the IPC bridge methods
   * that are injected by our preload script and available
   * in the renderer process through window.electron
   */
  interface Window {
    electron: ElectronAPI
  }
}
