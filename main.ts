// main.ts (updated)
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

const isDev = process.env.NODE_ENV === 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    const buildPath = path.join(__dirname, '../frontend/dist/index.html');
    console.log('Loading from:', buildPath);
    
    // For BrowserRouter, we need to handle all routes by serving index.html
    mainWindow.loadFile(buildPath).catch((err) => {
      console.error('Failed to load file:', err);
    });

    // Handle deep links and routing
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.log('Failed load:', errorDescription);
      // Fallback to index.html for client-side routes
      if (!isDev && errorCode === -6) { // -6 is FILE_NOT_FOUND
        mainWindow?.loadFile(buildPath);
      }
    });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});