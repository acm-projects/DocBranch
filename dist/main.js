import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';
let mainWindow = null;
function createWindow() {
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
    }
    else {
        // Since main.ts is in root DocBranch folder, frontend is in same directory
        const buildPath = path.join(__dirname, 'frontend/dist/index.html');
        console.log('Loading from:', buildPath);
        console.log('File exists:', fs.existsSync(buildPath));
        if (fs.existsSync(buildPath)) {
            mainWindow.loadURL(`file://${buildPath}#/`);
        }
        else {
            console.error('Build file not found at:', buildPath);
        }
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
