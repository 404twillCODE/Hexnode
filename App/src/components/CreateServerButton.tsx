import { motion } from "framer-motion";
import { useState } from "react";
import { useServerManager } from "../hooks/useServerManager";

export default function CreateServerButton() {
  const { createServer } = useServerManager();
  const [isCreating, setIsCreating] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [serverName, setServerName] = useState("default");

  const handleCreate = async () => {
    if (!serverName.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      const result = await createServer(serverName.trim());
      if (result.success) {
        setShowInput(false);
        setServerName("default");
      } else {
        alert(`Failed to create server: ${result.error || "Unknown error"}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (showInput) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex gap-2 items-center"
      >
        <input
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          placeholder="Server name"
          className="bg-background-secondary border border-border px-3 py-1.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent/50 rounded"
          disabled={isCreating}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            } else if (e.key === "Escape") {
              setShowInput(false);
            }
          }}
          autoFocus
        />
        <motion.button
          onClick={handleCreate}
          disabled={isCreating}
          className="btn-primary"
          whileHover={{ scale: isCreating ? 1 : 1.02 }}
          whileTap={{ scale: isCreating ? 1 : 0.98 }}
        >
          {isCreating ? "CREATING..." : "CREATE"}
        </motion.button>
        <motion.button
          onClick={() => {
            setShowInput(false);
            setServerName("default");
          }}
          disabled={isCreating}
          className="btn-secondary"
          whileHover={{ scale: isCreating ? 1 : 1.02 }}
          whileTap={{ scale: isCreating ? 1 : 0.98 }}
        >
          CANCEL
        </motion.button>
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

