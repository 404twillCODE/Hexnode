const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const https = require('https');
const http = require('http');

// Get AppData\Roaming path (like Minecraft)
function getAppDataPath() {
  if (process.platform === 'win32') {
    return path.join(os.homedir(), 'AppData', 'Roaming', '.hexnode');
  } else if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', '.hexnode');
  } else {
    // Linux
    return path.join(os.homedir(), '.hexnode');
  }
}

const HEXNODE_DIR = getAppDataPath();
const SERVERS_DIR = path.join(HEXNODE_DIR, 'servers');
const BACKUPS_DIR = path.join(HEXNODE_DIR, 'backups');
const CONFIG_FILE = path.join(HEXNODE_DIR, 'servers.json');

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(HEXNODE_DIR, { recursive: true });
  await fs.mkdir(SERVERS_DIR, { recursive: true });
  await fs.mkdir(BACKUPS_DIR, { recursive: true });
}

// Get system information
async function getSystemInfo() {
  try {
    const totalMemoryGB = Math.round(os.totalmem() / (1024 * 1024 * 1024));
    const freeMemoryGB = Math.round(os.freemem() / (1024 * 1024 * 1024));
    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model || 'Unknown';
    const cpuCores = cpus.length;
    
    // Get disk space from all drives - return as array
    const drives = [];
    
    try {
      if (process.platform === 'win32') {
        const { execSync } = require('child_process');
        // Use PowerShell as primary method (wmic is deprecated in Windows 11)
        try {
          const result = execSync(`powershell -NoProfile -Command "Get-WmiObject -Class Win32_LogicalDisk -Filter 'DriveType=3' | Select-Object DeviceID,VolumeName,Size,FreeSpace | ConvertTo-Json"`, {
            encoding: 'utf8',
            timeout: 10000,
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'ignore'] // Suppress stderr to prevent spam
          });
          const parsed = result.trim();
          if (parsed) {
            try {
              const disks = JSON.parse(parsed);
              const diskArray = Array.isArray(disks) ? disks : [disks];
              diskArray.forEach(disk => {
                if (disk && disk.Size && disk.FreeSpace !== undefined && disk.DeviceID) {
                  drives.push({
                    letter: disk.DeviceID,
                    label: disk.VolumeName || disk.DeviceID,
                    totalGB: Math.round(disk.Size / (1024 * 1024 * 1024)),
                    freeGB: Math.round(disk.FreeSpace / (1024 * 1024 * 1024)),
                    usedGB: Math.round((disk.Size - disk.FreeSpace) / (1024 * 1024 * 1024))
                  });
                }
              });
            } catch (parseErr) {
              // Silently handle JSON parse errors
            }
          }
        } catch (err) {
          // Silently fail - don't spam console with errors
          // Try fallback with Get-CimInstance (newer PowerShell cmdlet)
          try {
            const result = execSync(`powershell -NoProfile -Command "Get-CimInstance -ClassName Win32_LogicalDisk -Filter 'DriveType=3' | Select-Object DeviceID,VolumeName,Size,FreeSpace | ConvertTo-Json"`, {
              encoding: 'utf8',
              timeout: 10000,
              windowsHide: true,
              stdio: ['ignore', 'pipe', 'ignore']
            });
            const parsed = result.trim();
            if (parsed) {
              try {
                const disks = JSON.parse(parsed);
                const diskArray = Array.isArray(disks) ? disks : [disks];
                diskArray.forEach(disk => {
                  if (disk && disk.Size && disk.FreeSpace !== undefined && disk.DeviceID) {
                    drives.push({
                      letter: disk.DeviceID,
                      label: disk.VolumeName || disk.DeviceID,
                      totalGB: Math.round(disk.Size / (1024 * 1024 * 1024)),
                      freeGB: Math.round(disk.FreeSpace / (1024 * 1024 * 1024)),
                      usedGB: Math.round((disk.Size - disk.FreeSpace) / (1024 * 1024 * 1024))
                    });
                  }
                });
              } catch (parseErr) {
                // Silently handle JSON parse errors
              }
            }
          } catch (err2) {
            // Silently fail - no drives will be shown
          }
        }
      } else {
        // Linux/Mac - try to get disk info
        try {
          const { execSync } = require('child_process');
          if (process.platform === 'darwin') {
            // macOS - get all mounted volumes
            const result = execSync(`df -g | awk 'NR>1 {print $1 " " $2 " " $4}'`, { encoding: 'utf8' });
            const lines = result.trim().split('\n');
            lines.forEach(line => {
              const parts = line.trim().split(/\s+/);
              if (parts.length >= 3) {
                const mountPoint = parts[0];
                const total = parseInt(parts[1]);
                const free = parseInt(parts[2]);
                if (total > 0 && free >= 0) {
                  drives.push({
                    letter: mountPoint,
                    label: mountPoint.split('/').pop() || mountPoint,
                    totalGB: total,
                    freeGB: free,
                    usedGB: total - free
                  });
                }
              }
            });
          } else {
            // Linux - get all mounted filesystems
            const result = execSync(`df -BG | awk 'NR>1 {print $1 " " $2 " " $4}'`, { encoding: 'utf8' });
            const lines = result.trim().split('\n');
            lines.forEach(line => {
              const parts = line.trim().split(/\s+/);
              if (parts.length >= 3) {
                const mountPoint = parts[0];
                const total = parseInt(parts[1]) || 0;
                const free = parseInt(parts[2]) || 0;
                if (total > 0 && free >= 0) {
                  drives.push({
                    letter: mountPoint,
                    label: mountPoint.split('/').pop() || mountPoint,
                    totalGB: total,
                    freeGB: free,
                    usedGB: total - free
                  });
                }
              }
            });
          }
        } catch (err) {
          // Silently fail - no drives will be shown
        }
      }
    } catch (error) {
      console.error('Failed to get storage info:', error);
    }

    return {
      cpu: {
        model: cpuModel,
        cores: cpuCores,
        threads: cpuCores
      },
      memory: {
        totalGB: totalMemoryGB,
        freeGB: freeMemoryGB,
        usedGB: totalMemoryGB - freeMemoryGB
      },
      drives: drives,
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname()
    };
  } catch (error) {
    return {
      cpu: { model: 'Unknown', cores: 0, threads: 0 },
      memory: { totalGB: 0, freeGB: 0, usedGB: 0 },
      storage: { totalGB: 0, freeGB: 0, usedGB: 0 },
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname()
    };
  }
}

// Check if setup is complete
async function isSetupComplete() {
  try {
    const configs = await loadServerConfigs();
    return configs._setupComplete === true;
  } catch {
    return false;
  }
}

// Get app settings
async function getAppSettings() {
  const configs = await loadServerConfigs();
  return configs._appSettings || {
    serversDirectory: SERVERS_DIR,
    backupsDirectory: BACKUPS_DIR,
    showBootSequence: true,
    minimizeToTray: false,
    startWithWindows: false,
    autoBackup: true,
    backupInterval: 24, // hours
    maxBackups: 10,
    notifications: {
      statusChanges: true,
      crashes: true,
      updates: true
    },
    defaultRAM: 4,
    defaultPort: 25565,
    devMode: false,
    consoleAutoScroll: true,
    maxConsoleLines: 1000,
    showTimestamps: true,
    statusRefreshRate: 2,
    reduceAnimations: false,
    autoUpdateCheck: true,
    consoleWordWrap: false,
    consoleFontSize: 12,
    debugLogging: false,
    showPerformanceMetrics: false,
    logLevel: 'info'
  };
}

// Save app settings
async function saveAppSettings(settings) {
  const configs = await loadServerConfigs();
  // Use defaults if paths are not provided
  const finalSettings = {
    ...settings,
    serversDirectory: settings.serversDirectory || SERVERS_DIR,
    backupsDirectory: settings.backupsDirectory || BACKUPS_DIR
  };
  configs._appSettings = finalSettings;
  await saveServerConfigs(configs);
  
  // Ensure the directories exist
  if (finalSettings.serversDirectory) {
    await fs.mkdir(finalSettings.serversDirectory, { recursive: true });
  }
  if (finalSettings.backupsDirectory && finalSettings.autoBackup) {
    await fs.mkdir(finalSettings.backupsDirectory, { recursive: true });
  }
}

// Mark setup as complete
async function completeSetup(settings = null) {
  const configs = await loadServerConfigs();
  configs._setupComplete = true;
  if (settings) {
    configs._appSettings = settings;
  }
  await saveServerConfigs(configs);
}

// Reset setup (for testing/development)
async function resetSetup() {
  const configs = await loadServerConfigs();
  delete configs._setupComplete;
  await saveServerConfigs(configs);
}

// Java detection
async function checkJava() {
  return new Promise((resolve) => {
    const javaProcess = spawn('java', ['-version']);
    let output = '';
    let errorOutput = '';

    javaProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    javaProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    javaProcess.on('close', (code) => {
      const fullOutput = output + errorOutput;
      if (code === 0 || fullOutput.includes('version')) {
        // Parse version from output
        const versionMatch = fullOutput.match(/version\s+"?(\d+\.\d+\.\d+)/i);
        const version = versionMatch ? versionMatch[1] : 'unknown';
        resolve({ installed: true, version });
      } else {
        resolve({ installed: false, version: null });
      }
    });

    javaProcess.on('error', () => {
      resolve({ installed: false, version: null });
    });
  });
}

// Get all Paper versions
async function getPaperVersions() {
  return new Promise((resolve, reject) => {
    const url = 'https://api.papermc.io/v2/projects/paper';
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.versions || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Get latest Paper version
async function getLatestPaperVersion() {
  const versions = await getPaperVersions();
  return versions[versions.length - 1];
}

// Get latest Paper build for a version
async function getLatestPaperBuild(version) {
  return new Promise((resolve, reject) => {
    const url = `https://api.papermc.io/v2/projects/paper/versions/${version}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const latestBuild = json.builds[json.builds.length - 1];
          resolve(latestBuild);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Download Paper server jar
async function downloadPaper(serverPath, version, build) {
  return new Promise((resolve, reject) => {
    const filename = `paper-${version}-${build}.jar`;
    const filepath = path.join(serverPath, filename);
    // PaperMC API endpoint for downloads
    const url = `https://api.papermc.io/v2/projects/paper/versions/${version}/builds/${build}/downloads/${filename}`;

    const file = require('fs').createWriteStream(filepath);
    
    const makeRequest = (requestUrl) => {
      const request = https.get(requestUrl, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirect
          makeRequest(response.headers.location);
        } else if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(filepath);
          });
        } else {
          file.close();
          if (require('fs').existsSync(filepath)) {
            require('fs').unlinkSync(filepath);
          }
          reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        }
      });
      
      request.on('error', (error) => {
        file.close();
        if (require('fs').existsSync(filepath)) {
          require('fs').unlinkSync(filepath);
        }
        reject(error);
      });
      
      request.setTimeout(30000, () => {
        request.destroy();
        file.close();
        if (require('fs').existsSync(filepath)) {
          require('fs').unlinkSync(filepath);
        }
        reject(new Error('Download timeout'));
      });
    };
    
    makeRequest(url);
  });
}

// Load server configs
async function loadServerConfigs() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Save server configs
async function saveServerConfigs(configs) {
  await ensureDirectories();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(configs, null, 2), 'utf8');
}

// Get server config
async function getServerConfig(serverName) {
  const configs = await loadServerConfigs();
  return configs[serverName] || null;
}

// Save server config
async function saveServerConfig(serverName, config) {
  const configs = await loadServerConfigs();
  configs[serverName] = {
    name: serverName,
    path: path.join(SERVERS_DIR, serverName),
    version: config.version || 'unknown',
    ramGB: config.ramGB || 4,
    status: config.status || 'STOPPED',
    port: config.port || 25565,
    ...config
  };
  await saveServerConfigs(configs);
}

// Create server
async function createServer(serverName = 'default', version = null, ramGB = null) {
  try {
    await ensureDirectories();
    // Get custom servers directory from settings, or use default
    const settings = await getAppSettings();
    const serversDir = settings.serversDirectory || SERVERS_DIR;
    const serverPath = path.join(serversDir, serverName);
    await fs.mkdir(serverPath, { recursive: true });

    // Check if server already exists
    const existingConfig = await getServerConfig(serverName);
    if (existingConfig) {
      const files = await fs.readdir(serverPath);
      const jarFile = files.find(f => f.endsWith('.jar') && f.startsWith('paper'));
      if (jarFile) {
        return { success: true, path: serverPath, jarFile, message: 'Server already exists' };
      }
    }

    // Use provided version or get latest
    const selectedVersion = version || await getLatestPaperVersion();
    const build = await getLatestPaperBuild(selectedVersion);
    
    // Download Paper
    const jarPath = await downloadPaper(serverPath, selectedVersion, build);
    const jarFile = path.basename(jarPath);

    // Use provided RAM or default from settings
    const serverRAM = ramGB !== null ? ramGB : (settings.defaultRAM || 4);
    const serverPort = settings.defaultPort || 25565;

    // Create eula.txt
    const eulaPath = path.join(serverPath, 'eula.txt');
    await fs.writeFile(eulaPath, 'eula=true\n', 'utf8');

    // Save server config
    await saveServerConfig(serverName, {
      version: selectedVersion,
      ramGB: serverRAM,
      status: 'STOPPED',
      port: serverPort
    });

    return { success: true, path: serverPath, jarFile, version: selectedVersion, build };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Server process management
const serverProcesses = new Map();

// Start server
async function startServer(serverName, ramGB = null) {
  try {
    // Get custom servers directory from settings, or use default
    const settings = await getAppSettings();
    const serversDir = settings.serversDirectory || SERVERS_DIR;
    const serverPath = path.join(serversDir, serverName);
    
    // Check if server directory exists
    try {
      await fs.access(serverPath);
    } catch {
      return { success: false, error: 'Server directory not found. Please create the server first.' };
    }
    
    // Check if server exists
    const files = await fs.readdir(serverPath);
    const jarFile = files.find(f => f.endsWith('.jar') && f.startsWith('paper'));
    
    if (!jarFile) {
      return { success: false, error: 'Server jar not found. Please create the server first.' };
    }

    // Check if already running
    if (serverProcesses.has(serverName)) {
      const existingProcess = serverProcesses.get(serverName);
      // Check if process is still alive
      if (existingProcess && !existingProcess.killed && existingProcess.pid) {
        return { success: false, error: 'Server is already running' };
      } else {
        // Process is dead, remove it
        serverProcesses.delete(serverName);
      }
    }

    // Get RAM from config or use provided/default
    const config = await getServerConfig(serverName);
    const serverRAM = ramGB !== null ? ramGB : (config?.ramGB || 4);
    
    // Update status to STARTING
    await saveServerConfig(serverName, {
      ...config,
      status: 'STARTING',
      ramGB: serverRAM
    });

    const jarPath = path.join(serverPath, jarFile);
    const ramMB = serverRAM * 1024;
    
    const javaProcess = spawn('java', [
      `-Xms${ramMB}M`,
      `-Xmx${ramMB}M`,
      '-jar',
      jarPath,
      'nogui'
    ], {
      cwd: serverPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    serverProcesses.set(serverName, javaProcess);

    // Handle process events
    javaProcess.on('exit', async (code) => {
      serverProcesses.delete(serverName);
      const currentConfig = await getServerConfig(serverName);
      if (currentConfig) {
        await saveServerConfig(serverName, {
          ...currentConfig,
          status: 'STOPPED'
        });
      }
    });

    javaProcess.on('error', async (error) => {
      serverProcesses.delete(serverName);
      const currentConfig = await getServerConfig(serverName);
      if (currentConfig) {
        await saveServerConfig(serverName, {
          ...currentConfig,
          status: 'STOPPED'
        });
      }
    });

    // Update status to RUNNING after a short delay (server is starting)
    setTimeout(async () => {
      if (serverProcesses.has(serverName)) {
        const currentConfig = await getServerConfig(serverName);
        if (currentConfig) {
          await saveServerConfig(serverName, {
            ...currentConfig,
            status: 'RUNNING'
          });
        }
      }
    }, 2000);

    return { success: true, pid: javaProcess.pid };
  } catch (error) {
    // Update status to STOPPED on error
    const config = await getServerConfig(serverName);
    if (config) {
      await saveServerConfig(serverName, {
        ...config,
        status: 'STOPPED'
      });
    }
    return { success: false, error: error.message };
  }
}

// Stop server
async function stopServer(serverName) {
  try {
    const process = serverProcesses.get(serverName);
    if (!process) {
      return { success: false, error: 'Server is not running' };
    }

    // Update status
    const config = await getServerConfig(serverName);
    if (config) {
      await saveServerConfig(serverName, {
        ...config,
        status: 'STOPPED'
      });
    }

    // Send stop command to server
    process.stdin.write('stop\n');
    
    // Force kill after 10 seconds if still running
    setTimeout(async () => {
      if (serverProcesses.has(serverName)) {
        process.kill();
        serverProcesses.delete(serverName);
        const currentConfig = await getServerConfig(serverName);
        if (currentConfig) {
          await saveServerConfig(serverName, {
            ...currentConfig,
            status: 'STOPPED'
          });
        }
      }
    }, 10000);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get server process for log streaming
function getServerProcess(serverName) {
  return serverProcesses.get(serverName);
}

// List servers
async function listServers() {
  try {
    await ensureDirectories();
    const configs = await loadServerConfigs();
    const serverList = [];
    // Get custom servers directory from settings, or use default
    const settings = await getAppSettings();
    const serversDir = settings.serversDirectory || SERVERS_DIR;
    const serverDirs = await fs.readdir(serversDir);

    for (const serverName of serverDirs) {
      const serverPath = path.join(serversDir, serverName);
      const stat = await fs.stat(serverPath);
      
      if (stat.isDirectory()) {
        const files = await fs.readdir(serverPath);
        const jarFile = files.find(f => f.endsWith('.jar') && f.startsWith('paper'));
        
        if (jarFile) {
          const config = configs[serverName];
          const isRunning = serverProcesses.has(serverName);
          
          // Determine status: check process first, then config
          let status = 'STOPPED';
          if (isRunning) {
            const process = serverProcesses.get(serverName);
            if (process && !process.killed && process.pid) {
              status = 'RUNNING';
            } else {
              status = 'STOPPED';
            }
          } else if (config && config.status === 'STARTING') {
            status = 'STARTING';
          } else if (config) {
            status = config.status || 'STOPPED';
          }
          
          // Extract version from jar filename if not in config
          let version = 'unknown';
          if (config && config.version) {
            version = config.version;
          } else {
            const versionMatch = jarFile.match(/paper-(\d+\.\d+\.\d+)/);
            if (versionMatch) {
              version = versionMatch[1];
            }
          }
          
          // Create config for existing servers without config (backward compatibility)
          if (!config) {
            // Save actual status (convert RUNNING to STOPPED for config since process map is source of truth)
            const configStatus = status === 'RUNNING' ? 'STOPPED' : status;
            await saveServerConfig(serverName, {
              version,
              ramGB: 4,
              status: configStatus,
              port: 25565
            });
          } else if (status === 'RUNNING' && config.status !== 'RUNNING') {
            // Update config if process is running but config says otherwise
            await saveServerConfig(serverName, {
              ...config,
              status: 'RUNNING'
            });
          }
          
          serverList.push({
            id: serverName,
            name: serverName,
            version,
            status: status === 'RUNNING' ? 'ACTIVE' : status,
            port: config?.port || 25565,
            ramGB: config?.ramGB || 4,
          });
        }
      }
    }

    return serverList;
  } catch (error) {
    return [];
  }
}

// Update server RAM
async function updateServerRAM(serverName, ramGB) {
  try {
    const config = await getServerConfig(serverName);
    if (!config) {
      return { success: false, error: 'Server not found' };
    }
    await saveServerConfig(serverName, {
      ...config,
      ramGB
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  checkJava,
  getPaperVersions,
  getLatestPaperVersion,
  createServer,
  startServer,
  stopServer,
  getServerProcess,
  listServers,
  updateServerRAM,
  getSystemInfo,
  isSetupComplete,
  getAppSettings,
  saveAppSettings,
  completeSetup,
  resetSetup,
  ensureDirectories,
};

