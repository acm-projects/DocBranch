const { app, BrowserWindow, ipcMain, shell } = require('electron');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const openai = new OpenAI({
  //baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY,
});

let mainWindow;

// Make sure the app can be a protocol handler (e.g. docbranch://callback)
const CUSTOM_PROTOCOL = process.env.ELECTRON_CUSTOM_PROTOCOL || 'docbranch';

async function callAI() {
  try {
    console.log('Calling OpenAI...');
    // const completion = await openai.chat.completions.create({
    //   //model: 'deepseek/deepseek-r1-0528-qwen3-8b:free'
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: 'What is the meaning of life?' }],
    // });

    // Dummy response for testing without actual API call (cause these things expensive af)
    const completion = {
      "id": "chatcmpl-abc123",
      "object": "chat.completion",
      "created": 1690000000,
      "model": "gpt-3.5-turbo",
      "choices": [
        {
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "The meaning of life is a question that has fascinated philosophers, scientists, and thinkers for centuries. Many believe it is about finding happiness, purpose, and connection with others, while others see it as a journey of personal growth and discovery."
          },
          "finish_reason": "stop"
        }
      ],
      "usage": {
        "prompt_tokens": 15,
        "completion_tokens": 32,
        "total_tokens": 47
      }
    }

    const aiResponse = completion.choices[0].message.content;
    console.log('Got AI response:', aiResponse);

    // Directly run JS in renderer to update DOM
    if (mainWindow && aiResponse) {
      mainWindow.webContents.executeJavaScript(
        `window.electronAPI.setElementText('output', ${JSON.stringify(aiResponse)});`
      );
    }
  } catch (err) {
    console.error('OpenAI call failed:', err);
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(
        `window.electronAPI.setElementText('output', 'Error: ${err.message}');`
      );
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.on('did-finish-load', () => {
    callAI();
  });
}

// Handle protocol activation on macOS (open-url)
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) mainWindow.webContents.send('oauth-callback', url);
});

// If second instance is opened (Windows), capture protocol URL from argv
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    // On Windows the protocol url will be in argv
    const url = argv.find((a) => typeof a === 'string' && a.startsWith(`${CUSTOM_PROTOCOL}://`));
    if (url && mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.webContents.send('oauth-callback', url);
    }
  });

  app.whenReady().then(() => {
    // Try to register protocol handler. When running in development
    // (typically via `electron .`), Windows requires registering the
    // executable path and the app path as args so the OS launches the
    // correct app with the URL as a parameter. Use the pattern below so
    // protocol clicks are routed to the running/installed app instead of
    // confusing Windows into appending querystrings to the app path.
    try {
      if (process.defaultApp || process.argv[0].endsWith('electron') || process.execPath.endsWith('electron.exe')) {
        // Development: explicitly provide execPath and app args
        const appPath = path.resolve(process.argv[1] || '.');
        app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL, process.execPath, [appPath]);
      } else {
        // Packaged/installed app: simple registration
        app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL);
      }
    } catch (e) {
      console.warn('Protocol registration failed', e?.message || e);
    }

    createWindow();
  });
}

// IPC: start OAuth by opening system browser to the provider's authorize URL
ipcMain.handle('oauth-start', async () => {
  // Start a temporary local HTTP server so the auth server can redirect back
  // to a loopback URI. This avoids relying on OS protocol handlers in dev.
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const fullUrl = `http://127.0.0.1:${server.address().port}${req.url}`;
        console.log('[oauth-local] received request:', fullUrl);
        // Send the raw URL to the renderer so it can extract tokens
        if (mainWindow) mainWindow.webContents.send('oauth-callback', fullUrl);

        // Respond with a small success page the user sees in the system browser.
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h2>Sign-in complete. You can close this window.</h2></body></html>');

        // Close the server after handling the callback
        setTimeout(() => {
          try { server.close(); } catch (e) {}
        }, 500);
      } catch (err) {
        console.error('[oauth-local] callback handler error', err);
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const backendHost = process.env.AUTH_SERVER_HOST || 'http://localhost:3100';
      const url = `${backendHost}/login?electron=1&local_port=${port}`;
      console.log('[oauth-local] opening system browser to:', url);
      shell.openExternal(url).then(() => resolve({ opened: true })).catch(reject);
    });
  });
});
