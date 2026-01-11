import { motion } from "framer-motion";
import { useState } from "react";
import ServerCard from "./ServerCard";
import { useServerManager } from "../hooks/useServerManager";
import JavaStatusIndicator from "./JavaStatusIndicator";
import CreateServerButton from "./CreateServerButton";

export default function ServerList() {
  const { servers, startServer, stopServer, loading } = useServerManager();
  const [creating, setCreating] = useState(false);

  const handleStart = async (serverName: string) => {
    const server = servers.find(s => s.name === serverName);
    const ramGB = server?.ramGB || 4;
    const result = await startServer(serverName, ramGB);
    if (!result.success) {
      alert(`Failed to start server: ${result.error}`);
    }
  };

  const handleStop = async (serverName: string) => {
    const result = await stopServer(serverName);
    if (!result.success) {
      alert(`Failed to stop server: ${result.error}`);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary font-mono mb-2">
              SERVERS
            </h1>
            <p className="text-text-secondary font-mono text-sm">
              Manage your Minecraft server instances
            </p>
          </div>
          <div className="flex items-center gap-4">
            <JavaStatusIndicator />
            <CreateServerButton />
          </div>
        </div>
      </motion.div>
      {loading ? (
        <div className="text-text-muted font-mono text-sm">Loading servers...</div>
      ) : servers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="system-card p-8 text-center"
        >
          <p className="text-text-muted font-mono text-sm mb-4">
            No servers found. Create your first server to get started.
          </p>
          <CreateServerButton />
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
            >
              <ServerCard
                server={server}
                onStart={() => handleStart(server.name)}
                onStop={() => handleStop(server.name)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

