// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose functions to the renderer for basic DOM updates and OAuth flows
contextBridge.exposeInMainWorld('electronAPI', {
  setElementText: (selector, text) => {
    const element = document.getElementById(selector);
    if (element) {
      element.textContent = text;
    }
  },

  // Start the OAuth flow in the system browser (main process will open it)
  startOAuth: () => ipcRenderer.invoke('oauth-start'),

  // Listen for the OAuth callback URL data from the main process
  onOAuthCallback: (cb) => {
    ipcRenderer.on('oauth-callback', (event, data) => cb(data));
  }
});
