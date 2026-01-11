const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';
const serverManager = require('./serverManager');

let mainWindow = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0a0a0a',
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
    },
  });

  mainWindow = win;

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  return win;
}

// Window controls
ipcMain.on('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

// Java detection
ipcMain.handle('check-java', async () => {
  return await serverManager.checkJava();
});

// Server management IPC handlers
ipcMain.handle('list-servers', async () => {
  return await serverManager.listServers();
});

ipcMain.handle('create-server', async (event, serverName) => {
  return await serverManager.createServer(serverName);
});

ipcMain.handle('start-server', async (event, serverName, ramGB) => {
  const result = await serverManager.startServer(serverName, ramGB);
  
  if (result.success) {
    // Set up log streaming
    const process = serverManager.getServerProcess(serverName);
    if (process && mainWindow) {
      process.stdout.on('data', (data) => {
        mainWindow.webContents.send('server-log', {
          serverName,
          type: 'stdout',
          data: data.toString(),
        });
      });

      process.stderr.on('data', (data) => {
        mainWindow.webContents.send('server-log', {
          serverName,
          type: 'stderr',
          data: data.toString(),
        });
      });
    }
  }
  
  return result;
});

ipcMain.handle('stop-server', async (event, serverName) => {
  return await serverManager.stopServer(serverName);
});

ipcMain.handle('send-server-command', async (event, serverName, command) => {
  const process = serverManager.getServerProcess(serverName);
  if (process) {
    process.stdin.write(command + '\n');
    return { success: true };
  }
  return { success: false, error: 'Server not running' };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Stop all servers before quitting
  const { listServers, stopServer } = serverManager;
  listServers().then(servers => {
    servers.forEach(server => {
      if (server.status === 'ACTIVE') {
        stopServer(server.name);
      }
    });
  });
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

