<<<<<<< HEAD
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})
=======
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
>>>>>>> 190b99a6a44905b3ba7377602222bd3274cb5b57
