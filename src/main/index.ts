import { app, BrowserWindow } from 'electron';
import { join } from 'path';

function createWindow() {
  console.log('Creating main window');
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js')
    }
  });

  // Log when DOM is ready
  win.webContents.on('dom-ready', () => {
    console.log('DOM ready');
    // Open DevTools to see console logs
    win.webContents.openDevTools();
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV !== 'production') {
    console.log('Development mode: Loading from Vite dev server');
    const port = process.env.PORT || 5173;
    const url = `http://localhost:${port}`;
    console.log(`Loading URL: ${url}`);
    win.loadURL(url);
  } else {
    // In production, load the built files
    console.log('Production mode: Loading built files');
    const indexPath = join(__dirname, '../renderer/index.html');
    console.log(`Loading file: ${indexPath}`);
    win.loadFile(indexPath);
  }

  // Log any load errors
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

app.whenReady().then(() => {
  console.log('App is ready');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
