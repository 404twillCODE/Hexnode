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
    listServers: () => ipcRenderer.invoke('list-servers'),
    createServer: (serverName) => ipcRenderer.invoke('create-server', serverName),
    startServer: (serverName, ramGB) => ipcRenderer.invoke('start-server', serverName, ramGB),
    stopServer: (serverName) => ipcRenderer.invoke('stop-server', serverName),
    sendCommand: (serverName, command) => ipcRenderer.invoke('send-server-command', serverName, command),
    onServerLog: (callback) => {
      ipcRenderer.on('server-log', (event, data) => callback(data));
    },
    removeServerLogListener: () => {
      ipcRenderer.removeAllListeners('server-log');
    },
  },
});

