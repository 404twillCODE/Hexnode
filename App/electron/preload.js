const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  windowControls: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
  },
  server: {
    checkJava: () => ipcRenderer.invoke('check-java'),
    getPaperVersions: () => ipcRenderer.invoke('get-paper-versions'),
    getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
    isSetupComplete: () => ipcRenderer.invoke('is-setup-complete'),
    getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
    saveAppSettings: (settings) => ipcRenderer.invoke('save-app-settings', settings),
    completeSetup: (settings) => ipcRenderer.invoke('complete-setup', settings),
    resetSetup: () => ipcRenderer.invoke('reset-setup'),
    showFolderDialog: (options) => ipcRenderer.invoke('show-folder-dialog', options),
    listServers: () => ipcRenderer.invoke('list-servers'),
    createServer: (serverName, version, ramGB) => ipcRenderer.invoke('create-server', serverName, version, ramGB),
    startServer: (serverName, ramGB) => ipcRenderer.invoke('start-server', serverName, ramGB),
    stopServer: (serverName) => ipcRenderer.invoke('stop-server', serverName),
    updateServerRAM: (serverName, ramGB) => ipcRenderer.invoke('update-server-ram', serverName, ramGB),
    sendCommand: (serverName, command) => ipcRenderer.invoke('send-server-command', serverName, command),
    onServerLog: (callback) => {
      ipcRenderer.on('server-log', (event, data) => callback(data));
    },
    removeServerLogListener: () => {
      ipcRenderer.removeAllListeners('server-log');
    },
  },
});

