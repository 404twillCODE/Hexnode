import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    electronAPI?: {
      server: {
        checkJava: () => Promise<{ installed: boolean; version: string | null }>;
        getPaperVersions: () => Promise<string[]>;
        getSystemInfo: () => Promise<{
          cpu: { model: string; cores: number; threads: number };
          memory: { totalGB: number; freeGB: number; usedGB: number };
          drives: Array<{ letter: string; label: string; totalGB: number; freeGB: number; usedGB: number }>;
          platform: string;
          arch: string;
          hostname: string;
        }>;
        isSetupComplete: () => Promise<boolean>;
        getAppSettings: () => Promise<any>;
        saveAppSettings: (settings: any) => Promise<void>;
        completeSetup: (settings?: any) => Promise<void>;
        resetSetup: () => Promise<void>;
        showFolderDialog: (options: { title: string; defaultPath?: string }) => Promise<{ success: boolean; path?: string; canceled?: boolean }>;
        listServers: () => Promise<Server[]>;
        createServer: (serverName: string, version?: string | null, ramGB?: number) => Promise<{ success: boolean; error?: string; path?: string; jarFile?: string; version?: string; build?: number }>;
        startServer: (serverName: string, ramGB?: number) => Promise<{ success: boolean; error?: string; pid?: number }>;
        stopServer: (serverName: string) => Promise<{ success: boolean; error?: string }>;
        updateServerRAM: (serverName: string, ramGB: number) => Promise<{ success: boolean; error?: string }>;
        sendCommand: (serverName: string, command: string) => Promise<{ success: boolean; error?: string }>;
        onServerLog: (callback: (data: { serverName: string; type: 'stdout' | 'stderr'; data: string }) => void) => void;
        removeServerLogListener: () => void;
      };
    };
  }
}

export interface Server {
  id: string;
  name: string;
  version: string;
  status: 'ACTIVE' | 'STOPPED' | 'PLANNED' | 'STARTING';
  port: number;
  ramGB?: number;
}

export interface JavaStatus {
  installed: boolean;
  version: string | null;
  loading: boolean;
}

export function useServerManager() {
  const [servers, setServers] = useState<Server[]>([]);
  const [javaStatus, setJavaStatus] = useState<JavaStatus>({ installed: false, version: null, loading: true });
  const [loading, setLoading] = useState(true);

  const checkJava = useCallback(async () => {
    if (!window.electronAPI) return;
    setJavaStatus(prev => ({ ...prev, loading: true }));
    try {
      const result = await window.electronAPI.server.checkJava();
      setJavaStatus({ installed: result.installed, version: result.version, loading: false });
    } catch (error) {
      setJavaStatus({ installed: false, version: null, loading: false });
    }
  }, []);

  const loadServers = useCallback(async () => {
    if (!window.electronAPI) return;
    try {
      const serverList = await window.electronAPI.server.listServers();
      setServers(serverList);
    } catch (error) {
      console.error('Failed to load servers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createServer = useCallback(async (serverName: string = 'default', version?: string | null, ramGB: number = 4) => {
    if (!window.electronAPI) return { success: false, error: 'Electron API not available' };
    try {
      const result = await window.electronAPI.server.createServer(serverName, version, ramGB);
      if (result.success) {
        await loadServers();
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [loadServers]);

  const getPaperVersions = useCallback(async () => {
    if (!window.electronAPI) return [];
    try {
      return await window.electronAPI.server.getPaperVersions();
    } catch (error) {
      console.error('Failed to fetch Paper versions:', error);
      return [];
    }
  }, []);

  const updateServerRAM = useCallback(async (serverName: string, ramGB: number) => {
    if (!window.electronAPI) return { success: false, error: 'Electron API not available' };
    try {
      const result = await window.electronAPI.server.updateServerRAM(serverName, ramGB);
      if (result.success) {
        await loadServers();
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [loadServers]);

  const startServer = useCallback(async (serverName: string, ramGB: number = 4) => {
    if (!window.electronAPI) return { success: false, error: 'Electron API not available' };
    try {
      const result = await window.electronAPI.server.startServer(serverName, ramGB);
      if (result.success) {
        await loadServers();
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [loadServers]);

  const stopServer = useCallback(async (serverName: string) => {
    if (!window.electronAPI) return { success: false, error: 'Electron API not available' };
    try {
      const result = await window.electronAPI.server.stopServer(serverName);
      if (result.success) {
        await loadServers();
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [loadServers]);

  const sendCommand = useCallback(async (serverName: string, command: string) => {
    if (!window.electronAPI) return { success: false, error: 'Electron API not available' };
    try {
      return await window.electronAPI.server.sendCommand(serverName, command);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  useEffect(() => {
    checkJava();
    loadServers();
    
    // Poll server status periodically
    const interval = setInterval(() => {
      loadServers();
    }, 2000);

    return () => clearInterval(interval);
  }, [checkJava, loadServers]);

  return {
    servers,
    javaStatus,
    loading,
    checkJava,
    getPaperVersions,
    createServer,
    startServer,
    stopServer,
    updateServerRAM,
    sendCommand,
    refreshServers: loadServers,
  };
}

