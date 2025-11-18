import { app, BrowserWindow, ipcMain, protocol } from "electron";
import * as path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";
let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    const buildPath = path.join(__dirname, "frontend/dist/index.html");
    if (fs.existsSync(buildPath)) {
      mainWindow.loadURL(`file://${buildPath}`);
    } else {
      console.error("Build file not found:", buildPath);
    }
  }
}

// Register a protocol to serve PDF worker files
app.whenReady().then(() => {
  protocol.registerFileProtocol('pdf-worker', (request, callback) => {
    const url = request.url.replace('pdf-worker://', '');
    const workerPath = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', url);
    callback(workerPath);
  });
  
  createWindow();
});

// Keep only Electron-specific IPC handlers
ipcMain.handle("load-pdf", async (_, filePath: string) => {
  console.log(" IPC load-pdf called with:", filePath);
  const exists = fs.existsSync(filePath);
  console.log(" File exists?", exists);

  if (!exists) {
    throw new Error("File not found: " + filePath);
  }

  const data = fs.readFileSync(filePath);
  console.log("Read bytes:", data.length);
  return data.toString("base64");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});