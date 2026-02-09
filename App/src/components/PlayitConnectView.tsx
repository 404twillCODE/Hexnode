import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useToast } from "./ToastProvider";

const PLAYIT_GLOBAL_ID = "__playit_global__";
const MAX_LOG_LINES = 200;
const PLAYIT_DOWNLOAD = "https://playit.gg/download";
const PLAYIT_DASHBOARD = "https://playit.gg/dashboard";

export default function PlayitConnectView() {
  const [hasSecret, setHasSecret] = useState(false);
  const [importingConfig, setImportingConfig] = useState(false);
  const [status, setStatus] = useState<{
    running: boolean;
    connected: boolean;
    publicAddress: string | null;
    lastError: string | null;
    claimUrl: string | null;
  }>({ running: false, connected: false, publicAddress: null, lastError: null, claimUrl: null });
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [logLines, setLogLines] = useState<{ id: number; line: string; type: string }[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const { notify } = useToast();

  const api = window.electronAPI?.playit;

  useEffect(() => {
    if (!api) return;
    api.getStatus(PLAYIT_GLOBAL_ID).then(setStatus);
    api.hasSecret(PLAYIT_GLOBAL_ID).then((r: { hasSecret: boolean }) => setHasSecret(r.hasSecret));
    const interval = setInterval(() => {
      api.getStatus(PLAYIT_GLOBAL_ID).then(setStatus);
    }, 2000);
    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const unsub = api.onLog((name: string, line: string, type: string) => {
      if (name !== PLAYIT_GLOBAL_ID) return;
      setLogLines((prev) => {
        const next = [...prev, { id: Date.now() + Math.random(), line, type }];
        return next.slice(-MAX_LOG_LINES);
      });
    });
    return unsub;
  }, [api]);

  useEffect(() => {
    if (logLines.length > 0) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logLines.length]);

  const handleImportConfig = async () => {
    if (!api) return;
    if (typeof api.importConfigFromFile !== "function") {
      notify({
        type: "error",
        title: "Import unavailable",
        message: "Restart Nodexity fully (quit and reopen) to use this.",
      });
      return;
    }
    setImportingConfig(true);
    try {
      const result = await api.importConfigFromFile(PLAYIT_GLOBAL_ID);
      if (result.canceled) {
        setImportingConfig(false);
        return;
      }
      if (result.success) {
        setHasSecret(true);
        notify({ type: "success", title: "Config linked", message: "Playit is linked. You can start the agent below." });
      } else {
        notify({ type: "error", title: "Import failed", message: result.error || "Could not read config file." });
      }
    } catch (e) {
      notify({ type: "error", title: "Import failed", message: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      setImportingConfig(false);
    }
  };

  const handleStart = async () => {
    if (!api) return;
    setStarting(true);
    try {
      const installResult = await api.ensureInstalled();
      if (!installResult.success && installResult.error) {
        notify({ type: "error", title: "Playit agent", message: installResult.error });
        setStarting(false);
        return;
      }
      const result = await api.start(PLAYIT_GLOBAL_ID, {});
      if (result.success) {
        setLogLines([]);
        notify({ type: "success", title: "Agent started", message: "Playit is running in the background." });
      } else {
        notify({ type: "error", title: "Start failed", message: result.error || "Could not start." });
      }
    } catch (e) {
      notify({ type: "error", title: "Start failed", message: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      setStarting(false);
    }
  };

  const handleStop = async () => {
    if (!api) return;
    setStopping(true);
    try {
      await api.stop(PLAYIT_GLOBAL_ID);
      notify({ type: "info", title: "Agent stopped", message: "Playit has been stopped." });
    } catch (e) {
      notify({ type: "error", title: "Stop failed", message: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      setStopping(false);
    }
  };

  const copyAddress = () => {
    const addr = status.publicAddress || status.claimUrl;
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    notify({ type: "success", title: "Copied", message: "Address copied to clipboard." });
  };

  if (!api) {
    return (
      <div className="h-full overflow-y-auto p-8">
        <div className="system-card p-6 text-center text-text-muted font-mono text-sm">
          Connect playit.gg is not available. Restart the app if you just updated.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 font-mono">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-text-primary uppercase tracking-wider">
          Connect playit.gg
        </h1>
        <p className="text-sm text-text-secondary">
          Give your Minecraft servers a public address without port forwarding. Install playit once, set up your tunnel, then close the playit app and run it through Nodexity here — we’ll launch and manage it in the background.
        </p>

        {/* Setup steps */}
        <div className="system-card p-6 border-l-4 border-accent">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
            Setup (one time)
          </h2>
          <ol className="space-y-3 text-sm text-text-secondary list-decimal list-inside">
            <li>
              <strong className="text-text-primary">Install playit</strong> from{" "}
              <a href={PLAYIT_DOWNLOAD} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                playit.gg/download
              </a>
              . Run the app and sign in or create an account.
            </li>
            <li>
              <strong className="text-text-primary">Set up your tunnel</strong> in the playit app (claim your agent in the browser if asked, then add a Minecraft tunnel for port 25565 or your server’s port).
            </li>
            <li>
              <strong className="text-text-primary">Close the playit app</strong> completely. Nodexity will run the agent for you from here.
            </li>
            <li>
              Below, click <strong className="text-text-primary">Select config file</strong> and choose the config file playit created (often in your user folder or playit’s data folder — e.g. <code className="bg-background-secondary px-1 rounded text-xs">config.toml</code>). That links your setup to Nodexity.
            </li>
          </ol>
        </div>

        {/* Link config */}
        <div className="system-card p-6">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">
            Link your playit config
          </h2>
          <p className="text-xs text-text-muted mb-4">
            After you’ve installed playit and set up your tunnel, select the config file so Nodexity can run the agent. You only need to do this once.
          </p>
          <motion.button
            onClick={handleImportConfig}
            disabled={importingConfig}
            className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {importingConfig ? "SELECTING..." : "SELECT CONFIG FILE"}
          </motion.button>
          {hasSecret && (
            <p className="text-xs text-green-400/90 mt-2">Config linked. Start the agent below.</p>
          )}
        </div>

        {/* Start / Stop */}
        <div className="system-card p-6">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
            Run playit through Nodexity
          </h2>
          <div className="flex flex-wrap gap-2 items-center">
            {!status.running ? (
              <motion.button
                onClick={handleStart}
                disabled={starting || !hasSecret}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {starting ? "STARTING..." : "START AGENT"}
              </motion.button>
            ) : (
              <motion.button
                onClick={handleStop}
                disabled={stopping}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {stopping ? "STOPPING..." : "STOP AGENT"}
              </motion.button>
            )}
            {!hasSecret && (
              <span className="text-xs text-text-muted">Link your config file above first.</span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="system-card p-6">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Status</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-text-muted">Agent: </span>
              <span className={status.running ? "text-green-400" : "text-text-secondary"}>
                {status.running ? "Running" : "Stopped"}
              </span>
            </div>
            <div>
              <span className="text-text-muted">Connected: </span>
              <span className={status.connected ? "text-green-400" : "text-text-secondary"}>
                {status.connected ? "Yes" : "No"}
              </span>
            </div>
            {status.lastError && (
              <div className="col-span-2">
                <span className="text-text-muted">Last error: </span>
                <span className="text-red-400 text-xs">{status.lastError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Public address */}
        {(status.publicAddress || status.claimUrl) && (
          <div className="system-card p-6">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Public address</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="flex-1 min-w-0 truncate bg-background-secondary px-3 py-2 rounded text-sm text-accent">
                {status.publicAddress || status.claimUrl}
              </code>
              <motion.button
                onClick={copyAddress}
                className="btn-secondary text-xs px-3 py-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                COPY
              </motion.button>
            </div>
          </div>
        )}

        {/* Logs */}
        <div className="system-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Agent logs</h2>
            <a href={PLAYIT_DASHBOARD} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
              Open playit.gg dashboard →
            </a>
          </div>
          <div className="bg-background border border-border rounded p-3 h-48 overflow-y-auto text-xs font-mono text-text-secondary custom-scrollbar">
            {logLines.length === 0 && !status.running && (
              <div className="text-text-muted">Start the agent to see logs.</div>
            )}
            {logLines.length === 0 && status.running && (
              <div className="text-text-muted">Waiting for output...</div>
            )}
            {logLines.map(({ id, line, type }) => (
              <div key={id} className={`py-0.5 break-all ${type === "stderr" ? "text-red-400/90" : ""}`}>
                {line}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
