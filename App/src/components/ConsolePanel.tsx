import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useServerManager } from "../hooks/useServerManager";

interface ConsoleLine {
  id: string;
  text: string;
  timestamp: string;
  type?: 'stdout' | 'stderr' | 'command';
}

export default function ConsolePanel() {
  const { servers, sendCommand } = useServerManager();
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const [input, setInput] = useState("");
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeServer = servers.find(s => s.status === 'ACTIVE' || s.status === 'RUNNING');

  useEffect(() => {
    if (activeServer && !selectedServer) {
      setSelectedServer(activeServer.name);
    } else if (!activeServer) {
      setSelectedServer(null);
    }
  }, [activeServer, selectedServer]);

  useEffect(() => {
    if (!window.electronAPI) return;

    const handleLog = (data: { serverName: string; type: 'stdout' | 'stderr'; data: string }) => {
      if (data.serverName === selectedServer) {
        const logLines = data.data.split('\n');
        logLines.forEach((line, index) => {
          if (line.trim() || index === logLines.length - 1) {
            const newLine: ConsoleLine = {
              id: Date.now().toString() + Math.random() + index,
              text: line || ' ',
              timestamp: new Date().toLocaleTimeString(),
              type: data.type,
            };
            setLines(prev => {
              // Limit to last 1000 lines to prevent memory issues
              const newLines = [...prev, newLine];
              return newLines.slice(-1000);
            });
          }
        });
      }
    };

    window.electronAPI.server.onServerLog(handleLog);

    return () => {
      window.electronAPI?.server.removeServerLogListener();
    };
  }, [selectedServer]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, autoScroll]);

  const handleClear = () => {
    setLines([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedServer) return;

    const command = input.trim();
    const commandLine: ConsoleLine = {
      id: Date.now().toString(),
      text: `> ${command}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'command',
    };
    setLines(prev => [...prev, commandLine]);

    const result = await sendCommand(selectedServer, command);
    if (!result.success) {
      const errorLine: ConsoleLine = {
        id: Date.now().toString() + 'error',
        text: `Error: ${result.error}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'stderr',
      };
      setLines(prev => [...prev, errorLine]);
    }

    setInput("");
  };

  return (
    <div className="h-full flex flex-col p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary font-mono mb-2">
              CONSOLE
            </h1>
            <p className="text-text-secondary font-mono text-sm">
              System output and command interface
            </p>
          </div>
          <div className="flex items-center gap-4">
            {servers.length > 0 && (
              <select
                value={selectedServer || ''}
                onChange={(e) => {
                  setSelectedServer(e.target.value || null);
                  setLines([]); // Clear console when switching servers
                }}
                className="bg-background-secondary border border-border px-4 py-2 text-text-primary font-mono text-sm focus:outline-none focus:border-accent/50 rounded"
              >
                <option value="">Select server...</option>
                {servers.map(server => (
                  <option key={server.id} value={server.name}>
                    {server.name} ({server.status})
                  </option>
                ))}
              </select>
            )}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-text-secondary font-mono text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-4 h-4 accent-accent cursor-pointer"
                />
                Auto-scroll
              </label>
              <motion.button
                onClick={handleClear}
                disabled={lines.length === 0}
                className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: lines.length === 0 ? 1 : 1.02 }}
                whileTap={{ scale: lines.length === 0 ? 1 : 0.98 }}
              >
                CLEAR
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="flex-1 system-card p-6 flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto font-mono text-sm text-text-secondary mb-4"
        >
          {lines.length === 0 ? (
            <div className="text-text-muted text-sm">
              {selectedServer
                ? `Console for ${selectedServer}. Start the server to see output.`
                : "Select a server to view console output."}
            </div>
          ) : (
            <div className="space-y-0.5">
              {lines.map((line, index) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex gap-3 py-0.5 px-2 rounded ${
                    line.type === 'stderr' 
                      ? 'text-red-400 bg-red-400/10' 
                      : line.type === 'command' 
                      ? 'text-accent bg-accent/10' 
                      : index % 2 === 0 
                      ? 'bg-background-secondary/30' 
                      : ''
                  }`}
                >
                  <span className="text-text-muted text-xs flex-shrink-0">{line.timestamp}</span>
                  <span className="whitespace-pre-wrap break-words flex-1">{line.text}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedServer ? `> Enter command for ${selectedServer}...` : "> Select a server first..."}
            disabled={!selectedServer}
            className="flex-1 bg-background-secondary border border-border px-4 py-2 text-text-primary font-mono text-sm focus:outline-none focus:border-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <motion.button
            type="submit"
            disabled={!selectedServer || !input.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: !selectedServer || !input.trim() ? 1 : 1.02 }}
            whileTap={{ scale: !selectedServer || !input.trim() ? 1 : 0.98 }}
          >
            SEND
          </motion.button>
        </form>
      </div>
    </div>
  );
}

