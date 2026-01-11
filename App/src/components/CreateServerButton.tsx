import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useServerManager } from "../hooks/useServerManager";

export default function CreateServerButton() {
  const { createServer, getPaperVersions } = useServerManager();
  const [isCreating, setIsCreating] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [serverName, setServerName] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [versions, setVersions] = useState<string[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [ramGB, setRamGB] = useState(4);
  const [maxRAM, setMaxRAM] = useState(16); // Safe default

  useEffect(() => {
    // Get system RAM info (safe default to 16GB if unavailable)
    if (navigator.deviceMemory) {
      setMaxRAM(Math.max(4, Math.floor(navigator.deviceMemory / 1024)));
    }
  }, []);

  useEffect(() => {
    if (showInput && versions.length === 0) {
      loadVersions();
    }
  }, [showInput]);

  const loadVersions = async () => {
    setLoadingVersions(true);
    try {
      const paperVersions = await getPaperVersions();
      setVersions(paperVersions);
      if (paperVersions.length > 0 && !selectedVersion) {
        setSelectedVersion(paperVersions[paperVersions.length - 1]); // Latest version
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleCreate = async () => {
    if (!serverName.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      const result = await createServer(serverName.trim(), selectedVersion, ramGB);
      if (result.success) {
        setShowInput(false);
        setServerName("");
        setSelectedVersion(null);
        setRamGB(4);
      } else {
        alert(`Failed to create server: ${result.error || "Unknown error"}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setServerName("");
    setSelectedVersion(null);
    setRamGB(4);
  };

  if (showInput) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="system-card p-6 min-w-[500px]"
      >
        <h3 className="text-lg font-semibold text-text-primary font-mono mb-4">
          CREATE SERVER
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary font-mono mb-2">
              Server Name
            </label>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="my-server"
              className="w-full bg-background-secondary border border-border px-3 py-2 text-text-primary font-mono text-sm focus:outline-none focus:border-accent/50 rounded"
              disabled={isCreating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isCreating) {
                  handleCreate();
                } else if (e.key === "Escape") {
                  handleCancel();
                }
              }}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-mono mb-2">
              Minecraft Version
            </label>
            {loadingVersions ? (
              <div className="text-text-muted font-mono text-sm py-2">
                Loading versions...
              </div>
            ) : (
              <select
                value={selectedVersion || ""}
                onChange={(e) => setSelectedVersion(e.target.value || null)}
                disabled={isCreating}
                className="w-full bg-background-secondary border border-border px-3 py-2 text-text-primary font-mono text-sm focus:outline-none focus:border-accent/50 rounded"
              >
                <option value="">Select version...</option>
                {versions.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-mono mb-2">
              RAM Allocation: {ramGB}GB
            </label>
            <input
              type="range"
              min="1"
              max={maxRAM}
              value={ramGB}
              onChange={(e) => setRamGB(parseInt(e.target.value))}
              disabled={isCreating}
              className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #2EF2A2 0%, #2EF2A2 ${(ramGB / maxRAM) * 100}%, #111111 ${(ramGB / maxRAM) * 100}%, #111111 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-text-muted font-mono mt-1">
              <span>1GB</span>
              <span>{maxRAM}GB</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <motion.button
            onClick={handleCreate}
            disabled={isCreating || !serverName.trim() || !selectedVersion}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: (isCreating || !serverName.trim() || !selectedVersion) ? 1 : 1.02 }}
            whileTap={{ scale: (isCreating || !serverName.trim() || !selectedVersion) ? 1 : 0.98 }}
          >
            {isCreating ? "CREATING..." : "CREATE"}
          </motion.button>
          <motion.button
            onClick={handleCancel}
            disabled={isCreating}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isCreating ? 1 : 1.02 }}
            whileTap={{ scale: isCreating ? 1 : 0.98 }}
          >
            CANCEL
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={() => setShowInput(true)}
      className="btn-primary"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      CREATE SERVER
    </motion.button>
  );
}
