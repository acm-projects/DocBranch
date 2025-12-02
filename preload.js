const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script loaded!");

contextBridge.exposeInMainWorld("electronAPI", {
	setElementText: (selector, text) => {
		const element = document.getElementById(selector);
		if (element) element.textContent = text;
	},

	startOAuth: () => ipcRenderer.invoke('oauth-start'),

	startOAuthInApp: () => ipcRenderer.invoke('oauth-start-in-app'),

	onOAuthCallback: (cb) => {
		ipcRenderer.on('oauth-callback', (event, data) => cb(data));
	}
});