const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const https = require('https');
const http = require('http');

const HEXNODE_DIR = path.join(os.homedir(), 'HexNode');
const SERVERS_DIR = path.join(HEXNODE_DIR, 'servers');

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(HEXNODE_DIR, { recursive: true });
  await fs.mkdir(SERVERS_DIR, { recursive: true });
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

// Get latest Paper version
async function getLatestPaperVersion() {
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
          const latestVersion = json.versions[json.versions.length - 1];
          resolve(latestVersion);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
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

// Create server
async function createServer(serverName = 'default') {
  try {
    await ensureDirectories();
    const serverPath = path.join(SERVERS_DIR, serverName);
    await fs.mkdir(serverPath, { recursive: true });

    // Check if server already exists
    const files = await fs.readdir(serverPath);
    const jarFile = files.find(f => f.endsWith('.jar') && f.startsWith('paper'));
    
    if (jarFile) {
      return { success: true, path: serverPath, jarFile, message: 'Server already exists' };
    }

    // Get latest Paper version and build
    const version = await getLatestPaperVersion();
    const build = await getLatestPaperBuild(version);
    
    // Download Paper
    const jarPath = await downloadPaper(serverPath, version, build);
    const jarFile = path.basename(jarPath);

    // Create eula.txt
    const eulaPath = path.join(serverPath, 'eula.txt');
    await fs.writeFile(eulaPath, 'eula=true\n', 'utf8');

    return { success: true, path: serverPath, jarFile, version, build };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Server process management
const serverProcesses = new Map();

// Start server
async function startServer(serverName, ramGB = 4) {
  try {
    const serverPath = path.join(SERVERS_DIR, serverName);
    
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

    const jarPath = path.join(serverPath, jarFile);
    const ramMB = ramGB * 1024;
    
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
    javaProcess.on('exit', (code) => {
      serverProcesses.delete(serverName);
    });

    javaProcess.on('error', (error) => {
      serverProcesses.delete(serverName);
    });

    return { success: true, pid: javaProcess.pid };
  } catch (error) {
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

    // Send stop command to server
    process.stdin.write('stop\n');
    
    // Force kill after 10 seconds if still running
    setTimeout(() => {
      if (serverProcesses.has(serverName)) {
        process.kill();
        serverProcesses.delete(serverName);
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
    const servers = await fs.readdir(SERVERS_DIR);
    const serverList = [];

    for (const serverName of servers) {
      const serverPath = path.join(SERVERS_DIR, serverName);
      const stat = await fs.stat(serverPath);
      
      if (stat.isDirectory()) {
        const files = await fs.readdir(serverPath);
        const jarFile = files.find(f => f.endsWith('.jar') && f.startsWith('paper'));
        const isRunning = serverProcesses.has(serverName);
        
        if (jarFile) {
          // Extract version from jar filename
          const versionMatch = jarFile.match(/paper-(\d+\.\d+\.\d+)/);
          const version = versionMatch ? versionMatch[1] : 'unknown';
          
          serverList.push({
            id: serverName,
            name: serverName,
            version,
            status: isRunning ? 'ACTIVE' : 'STOPPED',
            port: 25565, // Default port
          });
        }
      }
    }

    return serverList;
  } catch (error) {
    return [];
  }
}

module.exports = {
  checkJava,
  createServer,
  startServer,
  stopServer,
  getServerProcess,
  listServers,
  ensureDirectories,
};

