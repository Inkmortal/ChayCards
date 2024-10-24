import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { initializeDatabase } from './database';
import { getDatabase } from '../core/database/service';
import { DocumentTypeRegistry } from '../core/types/document';
import { flashcardPlugin } from '../plugins/flashcards/plugin';

async function createWindow(): Promise<void> {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// Initialize app
async function initialize(): Promise<void> {
  try {
    // Initialize database
    await initializeDatabase();

    // Register plugins
    DocumentTypeRegistry.registerPlugin(flashcardPlugin);

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    app.quit();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Initialize application
  await initialize();

  // Create main window
  await createWindow();

  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle database cleanup on app quit
app.on('before-quit', () => {
  const db = getDatabase();
  db.close();
});

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.

// IPC Handlers
ipcMain.handle('flashcard:create', async (_, data) => {
  return flashcardPlugin.createDocument(data);
});

ipcMain.handle('flashcard:update', async (_, id, data) => {
  return flashcardPlugin.updateDocument(id, data);
});

ipcMain.handle('flashcard:delete', async (_, id) => {
  return flashcardPlugin.deleteDocument(id);
});

ipcMain.handle('flashcard:getDue', async (_, deckId, limit) => {
  return flashcardPlugin.getDueCards(deckId, limit);
});

ipcMain.handle('flashcard:review', async (_, cardId, quality) => {
  return flashcardPlugin.processReview(cardId, quality);
});
