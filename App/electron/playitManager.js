/**
 * playitManager.js – Manages playit.gg agent per server (one agent process per server).
 * Runs the official playit-agent binary as a hidden subprocess; secret via env (never CLI).
 * Cross-platform: Windows (hidden console), macOS, Linux.
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const https = require('https');
const crypto = require('crypto');

// Lazy load serverManager to avoid circular dependency; use getServerConfig when needed
let _getServerConfig = null;
function getServerConfig(serverName) {
  if (!_getServerConfig) {
    const sm = require('./serverManager');
    _getServerConfig = sm.getServerConfig;
  }
  return _getServerConfig(serverName);
}

function getAppDataPath() {
  if (process.platform === 'win32') {
    return path.join(os.homedir(), 'AppData', 'Roaming', '.hexnode');
  }
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', '.hexnode');
  }
  return path.join(os.homedir(), '.hexnode');
}

const APP_DATA = getAppDataPath();
const PLAYIT_ROOT = path.join(APP_DATA, 'playit');
const PLAYIT_BIN_DIR = path.join(PLAYIT_ROOT, 'bin');
const PLAYIT_SECRETS_FILE = path.join(PLAYIT_ROOT, 'secrets.enc');
const PLAYIT_LINKED_SERVER_FILE = path.join(PLAYIT_ROOT, 'linked-server.json');

/** Single app-wide playit agent (sidebar "Connect playit.gg" page). */
const PLAYIT_GLOBAL_ID = '__playit_global__';

// In-memory state per server: { process, logCallbacks, status }
const agents = new Map();

// Encryption for fallback secret storage (best-effort; keytar preferred when available)
const ENCRYPT_ALGO = 'aes-256-gcm';
const SALT_LEN = 16;
const IV_LEN = 16;
const TAG_LEN = 16;
const KEY_LEN = 32;

function deriveKey(salt) {
  const base = process.env.NODEXITY_PLAYIT_KEY || os.hostname() + os.userInfo().username + 'nodexity-playit';
  return crypto.pbkdf2Sync(base, salt, 100000, KEY_LEN, 'sha256');
}

async function loadEncryptedSecrets() {
  try {
    const raw = await fs.readFile(PLAYIT_SECRETS_FILE);
    const salt = raw.slice(0, SALT_LEN);
    const iv = raw.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const tag = raw.slice(SALT_LEN + IV_LEN, SALT_LEN + IV_LEN + TAG_LEN);
    const cipher = raw.slice(SALT_LEN + IV_LEN + TAG_LEN);
    const key = deriveKey(salt);
    const decipher = crypto.createDecipheriv(ENCRYPT_ALGO, key, iv);
    decipher.setAuthTag(tag);
    const str = Buffer.concat([decipher.update(cipher), decipher.final()]).toString('utf8');
    return JSON.parse(str);
  } catch (e) {
    if (e.code === 'ENOENT') return {};
    throw e;
  }
}

async function saveEncryptedSecrets(obj) {
  await fs.mkdir(path.dirname(PLAYIT_SECRETS_FILE), { recursive: true });
  const salt = crypto.randomBytes(SALT_LEN);
  const key = deriveKey(salt);
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ENCRYPT_ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(obj), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  await fs.writeFile(PLAYIT_SECRETS_FILE, Buffer.concat([salt, iv, tag, enc]));
}

let keytar = null;
try {
  keytar = require('keytar');
} catch (e) {
  // keytar not installed or native module failed
}

const KEYTAR_SERVICE = 'Nodexity';
function keytarAccount(serverName) {
  return `playit-${serverName}`;
}

async function getStoredSecret(serverName) {
  if (keytar && typeof keytar.getPassword === 'function') {
    const secret = await keytar.getPassword(KEYTAR_SERVICE, keytarAccount(serverName));
    if (secret) return secret;
  }
  const secrets = await loadEncryptedSecrets();
  return secrets[serverName] || null;
}

async function setStoredSecret(serverName, secret) {
  if (keytar && typeof keytar.setPassword === 'function') {
    await keytar.setPassword(KEYTAR_SERVICE, keytarAccount(serverName), secret || '');
  }
  const secrets = await loadEncryptedSecrets();
  if (secret) secrets[serverName] = secret; else delete secrets[serverName];
  await saveEncryptedSecrets(secrets);
}

/** Check if playit secret is set (without returning it). */
async function hasPlayitSecret(serverName) {
  const s = await getStoredSecret(serverName);
  return !!s && s.length > 0;
}

/** Try to find playit config in common install locations and extract secret_key. */
function getDefaultPlayitConfigPaths() {
  const home = os.homedir();
  const paths = [];
  // Nodexity's own global run dir (agent may write config here after first claim)
  paths.push(path.join(PLAYIT_ROOT, 'global', 'config.toml'));
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    const localAppData = process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
    paths.push(path.join(appData, 'playit', 'config.toml'));
    paths.push(path.join(localAppData, 'playit', 'config.toml'));
    paths.push(path.join(appData, 'Playit', 'config.toml'));
    paths.push(path.join(appData, 'playit-agent', 'config.toml'));
    paths.push(path.join(localAppData, 'Playit', 'config.toml'));
  } else if (process.platform === 'darwin') {
    paths.push(path.join(home, 'Library', 'Application Support', 'playit', 'config.toml'));
    paths.push(path.join(home, '.config', 'playit', 'config.toml'));
  } else {
    paths.push(path.join(home, '.config', 'playit', 'config.toml'));
    paths.push(path.join(home, '.playit', 'config.toml'));
  }
  return paths;
}

function extractSecretFromConfigContent(content) {
  if (!content || typeof content !== 'string') return null;
  const tomlMatch = content.match(/secret_key\s*=\s*["']([^"']+)["']/);
  if (tomlMatch) return tomlMatch[1].trim();
  const jsonMatch = content.match(/"secret_key"\s*:\s*["']([^"']+)["']/);
  if (jsonMatch) return jsonMatch[1].trim();
  return null;
}

async function tryDetectPlayitConfig() {
  const paths = getDefaultPlayitConfigPaths();
  for (const filePath of paths) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const secret = extractSecretFromConfigContent(content);
      if (secret && secret.length > 0) return { success: true, secret };
    } catch (e) {
      if (e.code !== 'ENOENT') {
        // Ignore missing file; continue to next path
      }
    }
  }
  return { success: false };
}

/** Get download URL and binary name for current platform. */
function getPlayitAsset() {
  const platform = process.platform;
  const arch = process.arch;
  // GitHub release asset names: playit-linux-amd64, playit-linux-aarch64, playit-windows-x86_64.exe, etc.
  let name = null;
  if (platform === 'win32') {
    name = arch === 'x64' ? 'playit-windows-x86_64.exe' : 'playit-windows-x86.exe';
  } else if (platform === 'darwin') {
    // No official macOS binary; use Linux amd64 for Intel, aarch64 for Apple Silicon (may need Rosetta/experimental)
    name = arch === 'arm64' ? 'playit-linux-aarch64' : 'playit-linux-amd64';
  } else if (platform === 'linux') {
    if (arch === 'x64') name = 'playit-linux-amd64';
    else if (arch === 'arm64') name = 'playit-linux-aarch64';
    else if (arch === 'arm') name = 'playit-linux-armv7';
    else if (arch === 'ia32') name = 'playit-linux-i686';
    else name = 'playit-linux-amd64';
  }
  return name;
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Nodexity/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function ensurePlayitAgentInstalled(onProgress) {
  await fs.mkdir(PLAYIT_BIN_DIR, { recursive: true });
  const assetName = getPlayitAsset();
  if (!assetName) {
    throw new Error(`Unsupported platform: ${process.platform}/${process.arch}`);
  }
  const finalPath = path.join(PLAYIT_BIN_DIR, process.platform === 'win32' ? 'playit.exe' : 'playit');
  const exists = await fs.access(finalPath).then(() => true).catch(() => false);
  if (exists) {
    return { success: true, path: finalPath, alreadyInstalled: true };
  }

  if (onProgress) onProgress({ phase: 'fetching', message: 'Fetching latest playit-agent release...' });
  const release = await httpsGet('https://api.github.com/repos/playit-cloud/playit-agent/releases/latest');
  const tag = release.tag_name || 'v0.17.1';
  const assets = release.assets || [];
  const asset = assets.find((a) => a.name === assetName);
  if (!asset) {
    throw new Error(`No playit binary for ${process.platform}/${process.arch}. Asset name expected: ${assetName}`);
  }
  const downloadUrl = asset.browser_download_url;
  const downloadPath = path.join(PLAYIT_BIN_DIR, asset.name);
  if (onProgress) onProgress({ phase: 'downloading', message: 'Downloading playit agent...' });
  await downloadFile(downloadUrl, downloadPath);
  try {
    await fs.rename(downloadPath, finalPath);
  } catch (e) {
    await fs.copyFile(downloadPath, finalPath);
    await fs.unlink(downloadPath).catch(() => {});
  }
  if (process.platform !== 'win32') {
    await fs.chmod(finalPath, 0o755);
  }
  if (onProgress) onProgress({ phase: 'done', message: 'Playit agent ready.' });
  return { success: true, path: finalPath, alreadyInstalled: false };
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = require('fs').createWriteStream(filepath);
    https.get(url, { headers: { 'User-Agent': 'Nodexity/1.0' } }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        require('fs').unlinkSync(filepath);
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        require('fs').unlinkSync(filepath);
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(filepath); });
    }).on('error', (err) => {
      file.close();
      if (require('fs').existsSync(filepath)) require('fs').unlinkSync(filepath);
      reject(err);
    });
  });
}

/** Strip ANSI escape codes; use space so words don't get concatenated (cursor moves etc.). */
function stripAnsi(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, ' ')
    .replace(/\u001b\[?[0-9;]*[a-zA-Z]/g, ' ')
    .replace(/\u001b\][^\u001b]*(\u001b\\)?/g, ' ')
    .replace(/\u001b./g, ' ')
    .replace(/[\u0000-\u001f]/g, ' ')
    .trim();
}

/** Remove orphaned escape fragments that appear when ESC is lost (e.g. ?25l, ?1049h). */
function stripEscapeFragments(str) {
  return str
    .replace(/\?[0-9]*[hl]/g, ' ')
    .replace(/\?[0-9]+[a-zA-Z]/g, ' ')
    .replace(/\?25[hl]/g, ' ');
}

/** Fix common word breaks caused by TTY cursor/overwrite sequences in playit output. */
function prettifyLogLine(s) {
  return s
    .replace(/\bchecki g\b/gi, 'checking')
    .replace(/\bsecret ey\b/gi, 'secret key')
    .replace(/\bs arting\b/gi, 'starting')
    .replace(/\btunn l\b/gi, 'tunnel')
    .replace(/\btunnel connectio\b/gi, 'tunnel connection')
    .replace(/\br gist red\b/gi, 'registered')
    .replace(/\bregist red\b/gi, 'registered')
    .replace(/\bsess on\b/gi, 'session')
    .replace(/\bses ion\b/gi, 'session')
    .replace(/\bex ired\b/gi, 'expired')
    .replace(/\bxpir d\b/gi, 'expired')
    .replace(/\bexp r d\b/gi, 'expired')
    .replace(/\bssion exp r d\b/gi, 'session expired')
    .replace(/\bssion expired\b/gi, 'session expired')
    .replace(/\bcontr l\b/gi, 'control')
    .replace(/\baddress _selector\b/gi, 'address_selector')
    .replace(/\bconnected_contr l\b/gi, 'connected_control')
    .replace(/\bmaintained_cont ol\b/gi, 'maintained_control')
    .replace(/\bestabl shed\b/gi, 'established')
    .replace(/\bestabl shed_control\b/gi, 'established_control')
    .replace(/\bes ablished\b/gi, 'established')
    .replace(/\bes ablished_control\b/gi, 'established_control')
    .replace(/\bauth nticat\b/gi, 'authenticate')
    .replace(/\bauthe ticate\b/gi, 'authenticate')
    .replace(/\buthenticate\b/gi, 'authenticate')
    .replace(/\b d uthenticate\b/gi, 'authenticate')
    .replace(/\bmainta ned\b/gi, 'maintained')
    .replace(/\bmai tained\b/gi, 'maintained')
    .replace(/\bmainta ned_control\b/gi, 'maintained_control')
    .replace(/\bmai tained_control\b/gi, 'maintained_control')
    .replace(/\brequir s\b/gi, 'requires')
    .replace(/\br qu res\b/gi, 'requires')
    .replace(/\bad res\b/gi, 'address')
    .replace(/\bd ta ls\b/gi, 'details')
    .replace(/\bag nt\b/gi, 'agent')
    .replace(/\b gent\b/gi, ' agent')
    .replace(/\bplayit_ag nt\b/gi, 'playit_agent')
    .replace(/\bau h\b/gi, 'auth')
    .replace(/\butorun\b/gi, 'autorun')
    .replace(/\bini ial\b/gi, 'initial')
    .replace(/\bconn cted_con rol\b/gi, 'connected_control')
    .replace(/\breg ster\b/gi, 'register')
    .replace(/\bKeepAl v\b/gi, 'KeepAlive')
    .replace(/\bnd KeepAl v\b/gi, 'send KeepAlive')
    .replace(/\bnd KeepAlive\b/gi, 'send KeepAlive')
    .replace(/\bchannel r qu res\b/gi, 'channel requires')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Clean a log line for display: strip ANSI, fragments, box-drawing; collapse spaces; drop noise. */
function cleanLogLine(str) {
  const s = stripEscapeFragments(stripAnsi(str))
    .replace(/[┌┐└┘│─├┤┬┴┼]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Skip lines that are only digits, only ? junk, or too short to be useful
  if (!s || /^[\d\s?]+$/.test(s) || s.length < 3) return '';
  return s;
}

/** Clean and prettify a log line for display. All lines get word-fix prettify. */
function cleanLogLineForDisplay(str) {
  const s = cleanLogLine(str);
  if (!s) return '';
  return prettifyLogLine(s);
}

/** Extract a short, readable error message from a log line (no ANSI, no box-drawing). */
function cleanErrorLine(str) {
  const s = stripEscapeFragments(stripAnsi(str));
  const noBox = s.replace(/[┌┐└┘│─├┤┬┴┼]/g, ' ').replace(/\s+/g, ' ').trim();
  const errMatch = noBox.match(/\[ERROR\]\s*(.+)/i) || noBox.match(/error[:\s]+(.+)/i);
  const msg = errMatch ? errMatch[1].trim() : noBox.slice(0, 200);
  return prettifyLogLine(msg);
}

/** Parse a line of playit output for connection status or public address. */
function parsePlayitLine(line, state) {
  const raw = line.toString();
  const s = stripEscapeFragments(stripAnsi(raw));
  if (!s) return;
  if (/\[ERROR\]|error|failed|invalid|unauthorized/i.test(s)) {
    state.lastError = cleanErrorLine(raw);
  }
  // Claim/join URL: https://playit.gg/... (for first-time setup)
  const claimMatch = s.match(/https?:\/\/[^\s"'<>)\]]+playit\.gg[^\s"'<>)\]]*/i);
  if (claimMatch) state.claimUrl = claimMatch[0].trim();
  // Public address: playit tunnel host (e.g. ability-personality.gl.joinmc.link or xxx.playit.gg)
  const joinMcMatch = s.match(/([a-z0-9][a-z0-9.-]*\.(?:gl\.)?joinmc\.link)(?::\d+)?(?:\s*=>|$)/i);
  if (joinMcMatch) state.publicAddress = joinMcMatch[1].trim();
  const playitAddrMatch = s.match(/(?:connection|address|connect to|join|tunnel|your (?:server )?address is?)[:\s]+([a-z0-9.-]+\.playit\.gg(?::\d+)?)/i)
    || s.match(/([a-z0-9.-]+\.playit\.gg(?::\d+)?)/i)
    || s.match(/playit\.gg[:\s]+([a-z0-9.-]+(?::\d+)?)/i)
    || s.match(/([a-z0-9][a-z0-9.-]*\.playit\.gg(?::\d+)?)/i)
    || s.match(/(?:address|connect|join)[:\s]+([a-z0-9][a-z0-9.-]*(?::\d+)?)/i);
  if (playitAddrMatch) state.publicAddress = playitAddrMatch[1].trim();
  if (/connected|running|ready|listening|logged in|authenticated|tunnel (?:is )?active|=>\s*\d/i.test(s)) state.connected = true;
}

function getAgentState(serverName) {
  let s = agents.get(serverName);
  if (!s) {
    s = { running: false, connected: false, publicAddress: null, lastError: null, claimUrl: null, logCallbacks: [] };
    agents.set(serverName, s);
  }
  return s;
}

function emitLog(serverName, line, type) {
  const state = getAgentState(serverName);
  state.logCallbacks.forEach((cb) => {
    try { cb(serverName, line, type); } catch (e) { /* ignore */ }
  });
}

async function startPlayit(serverName, options, mainWindow) {
  const state = getAgentState(serverName);
  if (state.process) {
    return { success: false, error: 'Playit agent is already running.' };
  }
  let secret = await getStoredSecret(serverName);
  if (!secret || !secret.trim()) {
    if (serverName === PLAYIT_GLOBAL_ID) {
      const detected = await tryDetectPlayitConfig();
      if (detected.success) {
        secret = detected.secret;
        await setStoredSecret(serverName, secret);
      }
    }
  }
  // For global agent: allow starting without secret so the agent can run and show a claim URL in the logs
  if ((!secret || !secret.trim()) && serverName !== PLAYIT_GLOBAL_ID) {
    return { success: false, error: 'No playit secret set for this server.' };
  }
  if (!secret) secret = '';

  const { path: agentPath } = await ensurePlayitAgentInstalled();
  const isGlobal = serverName === PLAYIT_GLOBAL_ID;
  const cwd = isGlobal
    ? path.join(PLAYIT_ROOT, 'global')
    : path.join(PLAYIT_ROOT, 'servers', serverName);
  await fs.mkdir(cwd, { recursive: true });

  const env = { ...process.env, SECRET_KEY: secret, NO_COLOR: '1', TERM: 'dumb' };
  const spawnOpts = {
    cwd,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  };
  // No console window on Windows: run playit in the background
  if (process.platform === 'win32') {
    spawnOpts.windowsHide = true;
    spawnOpts.creationFlags = 0x08000000; // CREATE_NO_WINDOW
  }

  const child = spawn(agentPath, [], spawnOpts);
  state.process = child;
  state.running = true;
  state.connected = false;
  state.publicAddress = null;
  state.lastError = null;
  state.claimUrl = null;

  const pushToRenderer = (line, type) => {
    emitLog(serverName, line, type);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('playit-log', { serverName, line, type });
    }
  };

  const onData = (data, type) => {
    const lines = data.toString().split(/\r?\n/).filter(Boolean);
    lines.forEach((line) => {
      parsePlayitLine(line, state);
      const cleaned = cleanLogLineForDisplay(line);
      if (cleaned.length > 0) pushToRenderer(cleaned, type);
    });
  };

  child.stdout.on('data', (data) => onData(data, 'stdout'));
  child.stderr.on('data', (data) => onData(data, 'stderr'));
  child.on('error', (err) => {
    state.lastError = err.message;
    state.running = false;
    state.process = null;
    pushToRenderer(`Process error: ${err.message}`, 'stderr');
  });
  child.on('exit', (code, signal) => {
    state.running = false;
    state.process = null;
    state.connected = false;
    if (code != null && code !== 0) state.lastError = `Exit code ${code}`;
    if (signal) state.lastError = `Signal ${signal}`;
    pushToRenderer(`Playit agent exited (code=${code}, signal=${signal})`, 'stderr');
  });

  return { success: true };
}

function stopPlayit(serverName) {
  const state = getAgentState(serverName);
  if (!state.process) {
    return { success: true, wasRunning: false };
  }
  state.process.kill('SIGTERM');
  state.process = null;
  state.running = false;
  state.connected = false;
  return { success: true, wasRunning: true };
}

async function restartPlayit(serverName, mainWindow) {
  stopPlayit(serverName);
  await new Promise((r) => setTimeout(r, 500));
  return startPlayit(serverName, {}, mainWindow);
}

function getPlayitStatus(serverName) {
  const state = getAgentState(serverName);
  return {
    running: state.running,
    connected: state.connected,
    publicAddress: state.publicAddress || null,
    lastError: state.lastError || null,
    claimUrl: state.claimUrl || null,
  };
}

function subscribePlayitLogs(serverName, callback) {
  const state = getAgentState(serverName);
  state.logCallbacks.push(callback);
  return () => {
    const idx = state.logCallbacks.indexOf(callback);
    if (idx !== -1) state.logCallbacks.splice(idx, 1);
  };
}

function stopAllPlayit() {
  const names = Array.from(agents.keys());
  names.forEach((name) => stopPlayit(name));
}

/** Get the server id that the playit tunnel address is linked to (or null). */
async function getLinkedServer() {
  try {
    const raw = await fs.readFile(PLAYIT_LINKED_SERVER_FILE, 'utf8');
    const data = JSON.parse(raw);
    return typeof data.serverId === 'string' && data.serverId.length > 0 ? data.serverId : null;
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}

/** Link the playit tunnel address to a Minecraft server by id. Pass null to unlink. */
async function setLinkedServer(serverId) {
  await fs.mkdir(PLAYIT_ROOT, { recursive: true });
  if (!serverId || serverId.trim() === '') {
    await fs.unlink(PLAYIT_LINKED_SERVER_FILE).catch(() => {});
    return;
  }
  await fs.writeFile(PLAYIT_LINKED_SERVER_FILE, JSON.stringify({ serverId: serverId.trim() }), 'utf8');
}

module.exports = {
  ensurePlayitAgentInstalled,
  startPlayit,
  stopPlayit,
  restartPlayit,
  getPlayitStatus,
  subscribePlayitLogs,
  stopAllPlayit,
  getStoredSecret,
  setStoredSecret,
  hasPlayitSecret,
  tryDetectPlayitConfig,
  getLinkedServer,
  setLinkedServer,
  PLAYIT_GLOBAL_ID,
};
