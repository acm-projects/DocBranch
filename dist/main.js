import { app, BrowserWindow, ipcMain, protocol, shell } from "electron";
import * as path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === "development";
let mainWindow = null;
function createWindow() {
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
    }
    else {
        const buildPath = path.join(__dirname, "frontend/dist/index.html");
        if (fs.existsSync(buildPath)) {
            mainWindow.loadURL(`file://${buildPath}`);
        }
        else {
            console.error("Build file not found:", buildPath);
        }
    }
}
// OAuth / protocol handling for Electron: open system browser to backend /login
const CUSTOM_PROTOCOL = process.env.ELECTRON_CUSTOM_PROTOCOL || "docbranch";
const AUTH_BACKEND = process.env.AUTH_SERVER_HOST || "http://localhost:3100";
// Handle protocol activation on macOS
app.on('open-url', (event, url) => {
    event.preventDefault();
    if (mainWindow)
        mainWindow.webContents.send('oauth-callback', url);
});
// Single instance lock - capture protocol URL on Windows second-instance
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    app.quit();
}
else {
    app.on('second-instance', (event, argv) => {
        const url = argv.find((a) => typeof a === 'string' && a.startsWith(`${CUSTOM_PROTOCOL}://`));
        if (url && mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
            mainWindow.webContents.send('oauth-callback', url);
        }
    });
}
// Try to register protocol handler (works for installed apps)
app.whenReady().then(() => {
    try {
        // In development, register the protocol with explicit execPath and
        // app argument so Windows routes protocol URLs to the running Electron
        // instance instead of invoking Electron with a malformed app path.
        if (process.defaultApp || process.argv[0].endsWith('electron') || process.execPath.endsWith('electron.exe')) {
            const appPath = path.resolve(process.argv[1] || '.');
            app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL, process.execPath, [appPath]);
        }
        else {
            app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL);
        }
    }
    catch (e) {
        console.warn('Protocol registration failed', e);
    }
});
// IPC handler: start OAuth by opening backend /login with electron flag
ipcMain.handle('oauth-start', async () => {
    const url = `${AUTH_BACKEND}/login?electron=1&protocol=${encodeURIComponent(CUSTOM_PROTOCOL)}`;
    await shell.openExternal(url);
    return { opened: true };
});
// IPC handler: start OAuth inside an Electron BrowserWindow (in-app)
ipcMain.handle('oauth-start-in-app', async () => {
    return new Promise((resolve, reject) => {
        try {
            const authWin = new BrowserWindow({
                parent: mainWindow || undefined,
                modal: !!mainWindow,
                show: true,
                width: 600,
                height: 800,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    sandbox: true,
                },
            });
            const authUrl = `${AUTH_BACKEND}/login?electron=1&protocol=${encodeURIComponent(CUSTOM_PROTOCOL)}`;
            authWin.loadURL(authUrl).catch((e) => console.error('authWin loadURL failed', e));
            const cleanup = () => {
                try {
                    authWin.close();
                }
                catch (e) { }
            };
            const handler = (event, navigationUrl) => {
                try {
                    if (typeof navigationUrl === 'string' && navigationUrl.startsWith(`${CUSTOM_PROTOCOL}://`)) {
                        // Prevent navigation to the protocol handler - we capture it here
                        event.preventDefault?.();
                        const parsed = new URL(navigationUrl);
                        const access_token = parsed.searchParams.get('access_token');
                        const id_token = parsed.searchParams.get('id_token');
                        // Forward to renderer so it can set localStorage and navigate
                        if (mainWindow)
                            mainWindow.webContents.send('oauth-callback', navigationUrl);
                        resolve({ access_token, id_token, raw: navigationUrl });
                        cleanup();
                    }
                }
                catch (err) {
                    reject(err);
                    cleanup();
                }
            };
            authWin.webContents.on('will-redirect', handler);
            authWin.webContents.on('will-navigate', handler);
            authWin.on('closed', () => {
                reject(new Error('Auth window closed'));
            });
        }
        catch (err) {
            reject(err);
        }
    });
});
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
ipcMain.handle("load-pdf", async (_, filePath) => {
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
    if (process.platform !== "darwin")
        app.quit();
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
// Save resume JSON to disk
ipcMain.handle("save-resume", async (_, { resumeObj, filename }) => {
    try {
        const outDir = path.join(__dirname, 'backend', 'resume-generator', 'resume_json_files');
        if (!fs.existsSync(outDir))
            fs.mkdirSync(outDir, { recursive: true });
        const outFile = filename ? path.join(outDir, filename) : path.join(outDir, `resume_${Date.now()}.json`);
        fs.writeFileSync(outFile, JSON.stringify(resumeObj, null, 2), 'utf8');
        console.log('Saved resume JSON to', outFile);
        return outFile;
    }
    catch (err) {
        console.error('Failed to save resume JSON:', err);
        throw err;
    }
});
