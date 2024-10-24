import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { database } from '../core/database/service';
import { DocumentTypeRegistry, BaseDocument } from '../core/types/document';
import { PluginLoader } from '../core/plugins/loader';
import { coreSchema } from '../core/database/schema';

// Initialize registry
const registry = new DocumentTypeRegistry();

// Initialize database schema
async function initializeDatabase() {
  try {
    await database.run(coreSchema);
  } catch (error) {
    console.error('Error initializing core schema:', error);
  }
}

// Load plugins
async function loadPlugins() {
  try {
    const loader = new PluginLoader();
    const plugins = await loader.loadPlugins();

    if (plugins.length === 0) {
      console.warn('No plugins were loaded');
      return;
    }

    // Register each loaded plugin
    for (const plugin of plugins) {
      try {
        await plugin.initialize();
        registry.registerPlugin(plugin);
        console.log(`Registered plugin: ${plugin.displayName}`);
      } catch (error) {
        console.error(`Error initializing plugin ${plugin.displayName}:`, error);
      }
    }
  } catch (error) {
    console.error('Error during plugin loading:', error);
  }
}

// IPC Handlers
ipcMain.handle('get-plugins', () => {
  return registry.getAllPlugins().map(plugin => ({
    type: plugin.type,
    displayName: plugin.displayName
  }));
});

ipcMain.handle('get-plugin', (_, type: string) => {
  const plugin = registry.getPlugin(type);
  if (!plugin) throw new Error(`Plugin not found: ${type}`);

  // Only return serializable data
  return {
    type: plugin.type,
    displayName: plugin.displayName
  };
});

ipcMain.handle('get-all-documents', async () => {
  const plugins = registry.getAllPlugins();
  const allDocs: BaseDocument[] = [];

  for (const plugin of plugins) {
    try {
      const docs = await plugin.getAllDocuments();
      allDocs.push(...docs);
    } catch (error) {
      console.error(`Error getting documents from plugin ${plugin.type}:`, error);
    }
  }

  return allDocs;
});

ipcMain.handle('save-document', async (_, type: string, data: Partial<BaseDocument>) => {
  const plugin = registry.getPlugin(type);
  if (!plugin) throw new Error(`Plugin not found: ${type}`);

  try {
    if (data.id) {
      return await plugin.updateDocument(data.id, data);
    } else {
      return await plugin.createDocument(data);
    }
  } catch (error) {
    console.error(`Error saving document:`, error);
    throw error;
  }
});

ipcMain.handle('delete-document', async (_, type: string, id: string) => {
  const plugin = registry.getPlugin(type);
  if (!plugin) throw new Error(`Plugin not found: ${type}`);

  try {
    await plugin.deleteDocument(id);
  } catch (error) {
    console.error(`Error deleting document:`, error);
    throw error;
  }
});

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(async () => {
  try {
    // Initialize database
    await initializeDatabase();

    // Load and initialize plugins
    await loadPlugins();

    // Set up electron app
    electronApp.setAppUserModelId('com.electron');

    // Default open or close DevTools by F12 in development
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    createWindow();
  } catch (error) {
    console.error('Error during initialization:', error);
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
