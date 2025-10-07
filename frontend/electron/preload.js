// preload.js
const { contextBridge } = require('electron');

// Expose a function to the renderer to set the text content of an element
contextBridge.exposeInMainWorld('electronAPI', {
  setElementText: (selector, text) => {
    const element = document.getElementById(selector);
    if (element) {
      element.textContent = text;
    }
  }
});
