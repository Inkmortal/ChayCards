import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { loadFolders, saveFolders, restoreFromBackup } from './api/folders';

let mainWindow: BrowserWindow | null = null;

// Register IPC handlers
function registerIpcHandlers() {
  console.log('Registering IPC handlers...');

  // First remove any existing handlers
  ipcMain.removeHandler('load-folders');
  ipcMain.removeHandler('save-folders');
  ipcMain.removeHandler('restore-folders');

  // Then register new handlers
  ipcMain.handle('load-folders', async () => {
    console.log('load-folders handler called');
    return await loadFolders();
  });

  ipcMain.handle('save-folders', async (event, data) => {
    console.log('save-folders handler called');
    const savedData = await saveFolders(data);
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('folders-updated');
    });
    return savedData;
  });

  ipcMain.handle('restore-folders', async () => {
    console.log('restore-folders handler called');
    return await restoreFromBackup();
  });

  console.log('IPC handlers registered');
}

function createWindow() {
  if (mainWindow !== null) {
    return;
  }

  console.log('Creating window...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js')
    }
  });

  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM ready');
    if (process.env.NODE_ENV !== 'production') {
      mainWindow?.webContents.openDevTools();
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5173;
    const url = `http://localhost:${port}`;
    console.log(`Loading dev server: ${url}`);
    mainWindow.loadURL(url);
  } else {
    const indexPath = join(__dirname, '../renderer/index.html');
    console.log(`Loading production build: ${indexPath}`);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize app
const init = async () => {
  try {
    // Wait for app to be ready
    await app.whenReady();
    console.log('App ready');

    // Register IPC handlers first
    registerIpcHandlers();

    // Create window after handlers are registered
    createWindow();
  } catch (error) {
    console.error('Error during initialization:', error);
    app.quit();
  }
};

// Start initialization
init().catch(error => {
  console.error('Failed to initialize app:', error);
  app.quit();
});

// Handle app events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Log any errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});
