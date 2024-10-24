import { contextBridge, ipcRenderer } from 'electron';
import { FlashcardDocument } from '../plugins/flashcards/types';

export type ElectronAPI = {
  flashcards: {
    create: (data: Partial<FlashcardDocument>) => Promise<FlashcardDocument>;
    update: (id: string, data: Partial<FlashcardDocument>) => Promise<FlashcardDocument>;
    delete: (id: string) => Promise<void>;
    getDue: (deckId: string, limit: number) => Promise<FlashcardDocument[]>;
    review: (cardId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => Promise<FlashcardDocument>;
  };
};

// Custom APIs for renderer
const api: ElectronAPI = {
  flashcards: {
    create: (data) => ipcRenderer.invoke('flashcard:create', data),
    update: (id, data) => ipcRenderer.invoke('flashcard:update', id, data),
    delete: (id) => ipcRenderer.invoke('flashcard:delete', id),
    getDue: (deckId, limit) => ipcRenderer.invoke('flashcard:getDue', deckId, limit),
    review: (cardId, quality) => ipcRenderer.invoke('flashcard:review', cardId, quality)
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
  // @ts-ignore (define in dts)
  window.electron = api;
}
