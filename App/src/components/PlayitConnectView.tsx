import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useToast } from "./ToastProvider";

const PLAYIT_GLOBAL_ID = "__playit_global__";
const MAX_LOG_LINES = 200;
const PLAYIT_DOWNLOAD = "https://playit.gg/download";
const PLAYIT_DASHBOARD = "https://playit.gg/account/agents";

type ServerItem = { id: string; name: string };

export default function PlayitConnectView() {
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
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [linkedServerId, setLinkedServerId] = useState<string | null>(null);
  const [linkSelectId, setLinkSelectId] = useState<string>("");
  const [linking, setLinking] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const { notify } = useToast();

  const api = window.electronAPI?.playit;
  const serverApi = window.electronAPI?.server;

  useEffect(() => {
    if (!api) return;
    api.getStatus(PLAYIT_GLOBAL_ID).then(setStatus);
    const interval = setInterval(() => {
      api.getStatus(PLAYIT_GLOBAL_ID).then(setStatus);
    }, 2000);
    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    if (!serverApi?.listServers) return;
    serverApi.listServers().then((list: ServerItem[]) => setServers(list || []));
  }, [serverApi]);

  useEffect(() => {
    if (!api?.getLinkedServer) return;
    api.getLinkedServer().then((r: { serverId: string | null }) => setLinkedServerId(r?.serverId ?? null));
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

  const handleLinkToServer = async () => {
    if (!api?.setLinkedServer || !linkSelectId) return;
    setLinking(true);
    try {
      await api.setLinkedServer(linkSelectId);
      setLinkedServerId(linkSelectId);
      const name = servers.find((s) => s.id === linkSelectId)?.name ?? linkSelectId;
      notify({ type: "success", title: "Linked", message: `Address linked to ${name}.` });
    } catch (e) {
      notify({ type: "error", title: "Link failed", message: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      setLinking(false);
    }
  };

  const handleUnlink = async () => {
    if (!api?.setLinkedServer) return;
    setLinking(true);
    try {
      await api.setLinkedServer(null);
      setLinkedServerId(null);
      setLinkSelectId("");
      notify({ type: "info", title: "Unlinked", message: "Address is no longer linked to a server." });
    } catch (e) {
      notify({ type: "error", title: "Unlink failed", message: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      setLinking(false);
    }
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
              <strong className="text-text-primary">Close the playit app</strong> completely. Then click <strong className="text-text-primary">Start agent</strong> below — Nodexity will find your playit setup and run the agent in the background. The address connected to your playit account will appear here when the agent is running.
            </li>
          </ol>
        </div>

        {/* Start / Stop */}
        <div className="system-card p-6">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
            Run playit through Nodexity
          </h2>
          <p className="text-xs text-text-muted mb-3">
            Start the agent to run playit in the background. It will use your existing playit setup and the address for your account will show below when connected.
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            {!status.running ? (
              <motion.button
                onClick={handleStart}
                disabled={starting}
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
            {status.publicAddress && (
              <div className="col-span-2">
                <span className="text-text-muted">Public address: </span>
                <span className="text-accent font-mono text-xs break-all">{status.publicAddress}</span>
              </div>
            )}
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
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
              {status.publicAddress ? "Public address" : "Claim your agent"}
            </h2>
            {status.claimUrl && !status.publicAddress && (
              <p className="text-xs text-text-muted mb-2">First time? Open this link in your browser to claim the agent, then your address will appear here.</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <code className="flex-1 min-w-0 truncate bg-background-secondary px-3 py-2 rounded text-sm text-accent break-all">
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

            {status.publicAddress && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">Link to Minecraft server</h3>
                <p className="text-xs text-text-muted mb-2">Show this address on a server’s dashboard so players know where to connect.</p>
                {linkedServerId ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-text-secondary">
                      Linked to: <strong className="text-text-primary">{servers.find((s) => s.id === linkedServerId)?.name ?? linkedServerId}</strong>
                    </span>
                    <motion.button
                      type="button"
                      onClick={handleUnlink}
                      disabled={linking}
                      className="btn-secondary text-xs px-3 py-1.5"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {linking ? "…" : "Unlink"}
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={linkSelectId}
                      onChange={(e) => setLinkSelectId(e.target.value)}
                      className="bg-background border border-border rounded px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent/50 min-w-[140px]"
                    >
                      <option value="">Select server</option>
                      {servers.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <motion.button
                      type="button"
                      onClick={handleLinkToServer}
                      disabled={linking || !linkSelectId}
                      className="btn-primary text-xs px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {linking ? "Linking…" : "Link to server"}
                    </motion.button>
                  </div>
                )}
              </div>
            )}
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
            {logLines.map(({ id, line }) => {
              const isError = line.startsWith("[ERROR]");
              const isWarn = line.startsWith("[WARN]");
              return (
                <div
                  key={id}
                  className={`py-0.5 break-all ${isError ? "text-red-400/90" : isWarn ? "text-amber-400/90" : ""}`}
                >
                  {line}
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>
          <details className="mt-3 text-xs text-text-muted">
            <summary className="cursor-pointer hover:text-text-secondary">What these messages mean</summary>
            <ul className="mt-2 space-y-1 list-disc list-inside text-text-muted">
              <li><span className="text-red-400/90">[ERROR] failed to ping tunnel server</span> — Usually a temporary network or firewall issue; the agent will retry. If it keeps failing, check your internet and try again.</li>
              <li><span className="text-amber-400/90">[WARN] session expired</span> — The control connection was refreshed. Normal; no action needed.</li>
              <li><span className="text-text-secondary">Agent exited (SIGTERM)</span> — You (or the app) stopped the agent. Start again when you need it.</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
