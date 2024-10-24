/**
 * Preload Script
 *
 * This file serves as the bridge between Electron's main process and renderer process,
 * implementing secure IPC (Inter-Process Communication) through context isolation.
 */

import { contextBridge, ipcRenderer } from 'electron'
import { FlashcardDocument } from '../plugins/flashcards/types'

/**
 * ElectronAPI Type Definition
 * Defines the interface for all available IPC communications between renderer and main process
 */
export type ElectronAPI = {
  // Flashcard-related operations
  flashcards: {
    // Creates a new flashcard with partial data
    create: (data: Partial<FlashcardDocument>) => Promise<FlashcardDocument>
    // Updates an existing flashcard by ID
    update: (id: string, data: Partial<FlashcardDocument>) => Promise<FlashcardDocument>
    // Deletes a flashcard by ID
    delete: (id: string) => Promise<void>
    // Retrieves due cards from a specific deck
    getDue: (deckId: string, limit: number) => Promise<FlashcardDocument[]>
    // Records a review for a card with quality rating (SuperMemo SM-2 algorithm)
    review: (cardId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => Promise<FlashcardDocument>
  }
  // Node.js process information
  process: {
    versions: NodeJS.ProcessVersions
  }
}

/**
 * API Implementation
 * Maps each API method to corresponding IPC channel invocations
 */
const api: ElectronAPI = {
  flashcards: {
    // Maps each flashcard operation to an IPC channel
    create: (data) => ipcRenderer.invoke('flashcard:create', data),
    update: (id, data) => ipcRenderer.invoke('flashcard:update', id, data),
    delete: (id) => ipcRenderer.invoke('flashcard:delete', id),
    getDue: (deckId, limit) => ipcRenderer.invoke('flashcard:getDue', deckId, limit),
    review: (cardId, quality) => ipcRenderer.invoke('flashcard:review', cardId, quality)
  },
  process: {
    versions: process.versions
  }
}

/**
 * Context Bridge Setup
 * Exposes the API to the renderer process based on context isolation status
 *
 * Context isolation is a security feature that ensures preload scripts and renderer
 * process run in different contexts, preventing direct access to Node.js APIs
 */
if (process.contextIsolated) {
  try {
    // Expose API through contextBridge when context isolation is enabled
    contextBridge.exposeInMainWorld('electron', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // Fallback for when context isolation is disabled
  // @ts-expect-error Window electron property is defined in dts
  window.electron = api
}
