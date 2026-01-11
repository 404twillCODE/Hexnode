'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import StatusBadge from "@/components/StatusBadge";
import ResourceBar from "@/components/ResourceBar";
import DeleteServerModal from "@/components/DeleteServerModal";
import InlineSlider from "@/components/InlineSlider";
import Toast from "@/components/Toast";
import { useServerContext } from "@/components/context/ServerContext";
import {
  fadeUp,
  fadeUpTransition,
  buttonHover,
  buttonTap,
} from "@/components/motionVariants";

type TabType = 'overview' | 'console' | 'files' | 'backups' | 'settings';

export default function ServerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { servers, resourcePool, startServer, stopServer, restartServer, deleteServer, updateServerRam } = useServerContext();
  const serverId = params.id as string;
  
  const server = servers.find((s) => s.id === serverId);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [ramAllocation, setRamAllocation] = useState(0);
  const [cpuCores, setCpuCores] = useState(2);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Initialize values from server
  useEffect(() => {
    if (server) {
      setRamAllocation(server.ram);
    }
  }, [server]);

  // Auto-save with debounce
  useEffect(() => {
    if (!server || ramAllocation === server.ram) return;

    const timer = setTimeout(() => {
      updateServerRam(serverId, ramAllocation);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [ramAllocation, server, serverId, updateServerRam]);

  if (!server) {
    return (
      <div className="p-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={fadeUpTransition}
        >
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-foreground">
              Server not found
            </h1>
            <p className="text-muted">
              The server you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/dashboard/servers"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              ← Back to Servers
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const isRunning = server.status === 'running';
  const isStopped = server.status === 'stopped';
  const isStarting = server.status === 'starting';

  // Mock resource usage data
  const ramUsage = isRunning ? Math.min(server.ram * 0.75, server.ram) : 0;
  const cpuUsage = isRunning ? 45 : 0;

  // Calculate pool stats (in GB)
  const totalPoolGB = resourcePool.totalRam;
  const currentlyUsedGB = resourcePool.usedRam;
  const availableGB = totalPoolGB - currentlyUsedGB;
  const currentServerRamGB = server.ram;
  const maxAllowedRamGB = availableGB + currentServerRamGB;

  // Mock server data
  const serverPort = 25565;
  const createdDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const storageGB = 20; // Read-only

  const handleStart = () => {
    startServer(serverId);
  };

  const handleStop = () => {
    stopServer(serverId);
  };

  const handleRestart = () => {
    restartServer(serverId);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteServer(serverId);
    setDeleteModalOpen(false);
    router.push('/dashboard/servers');
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'console', label: 'Console' },
    { id: 'files', label: 'Files' },
    { id: 'backups', label: 'Backups' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-full flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left: Server Info */}
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  {server.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted">
                  <span>{server.version}</span>
                  <span>•</span>
                  <span>{server.ram} GB RAM</span>
                </div>
              </div>
              <StatusBadge status={server.status} size="md" />
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              {isStopped && (
                <motion.button
                  onClick={handleStart}
                  disabled={isStarting}
                  className={`px-4 py-2 bg-accent text-foreground font-medium rounded-lg transition-colors ${
                    isStarting
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-accent/90'
                  }`}
                  whileHover={!isStarting ? buttonHover : {}}
                  whileTap={!isStarting ? buttonTap : {}}
                >
                  Start
                </motion.button>
              )}
              {isRunning && (
                <>
                  <motion.button
                    onClick={handleRestart}
                    disabled={isStarting}
                    className={`px-4 py-2 border border-foreground/20 text-foreground font-medium rounded-lg transition-colors ${
                      isStarting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-foreground/30 hover:bg-foreground/5'
                    }`}
                    whileHover={!isStarting ? buttonHover : {}}
                    whileTap={!isStarting ? buttonTap : {}}
                  >
                    Restart
                  </motion.button>
                  <motion.button
                    onClick={handleStop}
                    disabled={isStarting}
                    className={`px-4 py-2 bg-accent text-foreground font-medium rounded-lg transition-colors ${
                      isStarting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-accent/90'
                    }`}
                    whileHover={!isStarting ? buttonHover : {}}
                    whileTap={!isStarting ? buttonTap : {}}
                  >
                    Stop
                  </motion.button>
                </>
              )}
              {isStarting && (
                <div className="px-4 py-2 text-foreground font-medium rounded-lg bg-foreground/10">
                  Starting...
                </div>
              )}
              <motion.button
                onClick={handleDelete}
                className="px-4 py-2 border border-red-500/50 text-red-400 font-medium rounded-lg hover:bg-red-500/10 transition-colors"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Delete
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-foreground/10">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-accent'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    layoutId="activeTab"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Resource Configuration */}
            <motion.div
              className="p-6 border border-foreground/10 rounded-lg bg-background"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUpTransition}
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Resource Allocation
              </h2>
              <div className="space-y-6">
                {/* RAM Allocation */}
                <InlineSlider
                  label="RAM Allocation"
                  value={ramAllocation}
                  onChange={setRamAllocation}
                  min={1}
                  max={maxAllowedRamGB}
                  step={1}
                  unit="GB"
                  disabled={isStarting}
                />
                <div className="text-xs text-muted">
                  Available pool RAM: {availableGB.toFixed(1)} GB • 
                  Remaining after change: {(availableGB + currentServerRamGB - ramAllocation).toFixed(1)} GB
                </div>

                {/* CPU Cores */}
                <InlineSlider
                  label="CPU Cores"
                  value={cpuCores}
                  onChange={setCpuCores}
                  min={1}
                  max={8}
                  step={1}
                  unit="cores"
                  disabled={isStarting}
                />
                <div className="text-xs text-muted">
                  Shared CPU allocation
                </div>

                {/* Storage (Read-only) */}
                <InlineSlider
                  label="Storage"
                  value={storageGB}
                  onChange={() => {}}
                  min={0}
                  max={100}
                  unit="GB"
                  readOnly={true}
                />
                <div className="text-xs text-muted">
                  Storage is allocated per server instance
                </div>
              </div>
            </motion.div>

            {/* Server Info Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...fadeUpTransition, delay: 0.1 }}
            >
              <div className="p-4 border border-foreground/10 rounded-lg bg-background">
                <div className="text-sm text-muted mb-1">Allocated RAM</div>
                <div className="text-2xl font-semibold text-foreground">
                  {server.ram} GB
                </div>
              </div>
              <div className="p-4 border border-foreground/10 rounded-lg bg-background">
                <div className="text-sm text-muted mb-1">Port</div>
                <div className="text-2xl font-semibold text-foreground">
                  {serverPort}
                </div>
              </div>
              <div className="p-4 border border-foreground/10 rounded-lg bg-background">
                <div className="text-sm text-muted mb-1">Created</div>
                <div className="text-2xl font-semibold text-foreground">
                  {createdDate.toLocaleDateString()}
                </div>
              </div>
            </motion.div>

            {/* Resource Usage */}
            <motion.div
              className="p-6 border border-foreground/10 rounded-lg bg-background"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...fadeUpTransition, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Resource Usage
              </h2>
              <div className="flex flex-col gap-6">
                <ResourceBar
                  label="RAM"
                  value={ramUsage}
                  max={server.ram}
                  unit="GB"
                />
                <ResourceBar
                  label="CPU"
                  value={cpuUsage}
                  max={100}
                  unit="%"
                  percentage={cpuUsage}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Other Tabs - Coming Soon */}
        {activeTab !== 'overview' && (
          <motion.div
            className="p-12 border border-foreground/10 rounded-lg bg-background text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fadeUpTransition}
          >
            <p className="text-lg text-muted">Coming soon</p>
          </motion.div>
        )}

        {/* Danger Zone */}
        {activeTab === 'overview' && (
          <motion.div
            className="mt-8 p-6 border border-red-500/20 rounded-lg bg-red-500/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fadeUpTransition, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Danger Zone
            </h2>
            <div>
              <p className="text-sm text-muted mb-4">
                Permanently delete this server. This action cannot be undone.
              </p>
              <motion.button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-colors"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Delete Server
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Toast */}
      <Toast message="Saved ✓" isVisible={showSavedToast} />

      {/* Delete Confirmation Modal */}
      <DeleteServerModal
        isOpen={deleteModalOpen}
        serverName={server.name}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
