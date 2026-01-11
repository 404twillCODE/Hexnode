import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

interface Server {
  id: string;
  name: string;
  version: string;
  status: "ACTIVE" | "STOPPED" | "PLANNED" | "STARTING";
  port: number;
  ramGB?: number;
}

interface ServerCardProps {
  server: Server;
  onStart?: () => void;
  onStop?: () => void;
}

export default function ServerCard({ server, onStart, onStop }: ServerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ y: -2 }}
      className="system-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary font-mono mb-1">
            {server.name}
          </h3>
          <p className="text-sm text-text-muted font-mono">
            {server.version} • Port {server.port}
            {server.ramGB && ` • ${server.ramGB}GB RAM`}
          </p>
        </div>
        <StatusBadge status={server.status} />
      </div>
      <div className="flex gap-2 mt-4">
        {(server.status === "STOPPED" || server.status === "PLANNED") && (
          <motion.button
            onClick={onStart}
            disabled={server.status === "STARTING"}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: server.status === "STARTING" ? 1 : 1.02 }}
            whileTap={{ scale: server.status === "STARTING" ? 1 : 0.98 }}
          >
            START
          </motion.button>
        )}
        {server.status === "ACTIVE" && (
          <motion.button
            onClick={onStop}
            className="btn-secondary flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            STOP
          </motion.button>
        )}
        {server.status === "STARTING" && (
          <div className="text-xs text-yellow-500 font-mono uppercase tracking-wider py-2.5 px-6 flex-1 text-center">
            Starting...
          </div>
        )}
      </div>
    </motion.div>
  );
}

