/**
 * Main Process Entry Point
 *
 * This file serves as the entry point for Electron's main process, handling:
 * - Window management
 * - Application lifecycle
 * - IPC (Inter-Process Communication)
 * - Plugin system initialization
 * - Database setup
 */

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initializeDatabase } from './database'
import { getDatabase } from '../core/database/service'
import { DocumentTypeRegistry } from '../core/types/document'
import { flashcardPlugin } from '../plugins/flashcards/plugin'

/**
 * Creates the main application window with appropriate settings
 * and loads the renderer process.
 */
async function createWindow(): Promise<void> {
  // Create the browser window with specific configurations
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    // Set icon for Linux platform
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // Load preload script for IPC bridge
      preload: join(__dirname, '../preload/index.js'),
      // Disable sandbox for database access
      sandbox: false
    }
  })

  // Show window when ready
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load appropriate URL based on environment
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // Development: Load from dev server
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // Production: Load local HTML file
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

/**
 * Initializes core application components:
 * - Database setup
 * - Plugin registration
 */
async function initialize(): Promise<void> {
  try {
    // Set up database connection and schema
    await initializeDatabase()

    // Register available plugins with document type registry
    DocumentTypeRegistry.registerPlugin(flashcardPlugin)

    console.log('Application initialized successfully')
  } catch (error) {
    console.error('Failed to initialize application:', error)
    app.quit()
  }
}

// Application Lifecycle Management

/**
 * Main application initialization when Electron is ready
 */
app.whenReady().then(async () => {
  // Set Windows-specific app user model ID
  electronApp.setAppUserModelId('com.electron')

  // Configure development tools and shortcuts
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Initialize core components
  await initialize()

  // Create and show main window
  await createWindow()

  // Handle macOS-specific window behavior
  app.on('activate', async function () {
    // Recreate window when dock icon is clicked (macOS)
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow()
    }
  })
})

/**
 * Handle application quit behavior
 */
app.on('window-all-closed', () => {
  // Quit application when all windows are closed (except on macOS)
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * Cleanup resources before quitting
 */
app.on('before-quit', () => {
  // Close database connection
  const db = getDatabase()
  db.close()
})

// IPC (Inter-Process Communication) Handlers

/**
 * Flashcard Plugin IPC Handlers
 * Bridge between renderer process and flashcard plugin functionality
 */
ipcMain.handle('flashcard:create', async (_, data) => {
  return flashcardPlugin.createDocument(data)
})

ipcMain.handle('flashcard:update', async (_, id, data) => {
  return flashcardPlugin.updateDocument(id, data)
})

ipcMain.handle('flashcard:delete', async (_, id) => {
  return flashcardPlugin.deleteDocument(id)
})

ipcMain.handle('flashcard:getDue', async (_, deckId, limit) => {
  return flashcardPlugin.getDueCards(deckId, limit)
})

ipcMain.handle('flashcard:review', async (_, cardId, quality) => {
  return flashcardPlugin.processReview(cardId, quality)
})
