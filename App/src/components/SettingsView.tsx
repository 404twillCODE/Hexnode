import { motion } from "framer-motion";
import { useState } from "react";

export default function SettingsView() {
  const [resetting, setResetting] = useState(false);

  const handleResetSetup = async () => {
    if (!window.electronAPI) return;
    
    const confirmed = confirm('This will reset the first-time setup. The app will restart to show the setup screen again. Continue?');
    if (!confirmed) return;

    setResetting(true);
    try {
      await window.electronAPI.server.resetSetup();
      // Reload the app to trigger setup screen
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset setup:', error);
      alert('Failed to reset setup. Please try again.');
    } finally {
      setResetting(false);
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
        <h1 className="text-3xl font-semibold text-text-primary font-mono mb-2">
          SETTINGS
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          Configure system preferences
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 15 }}
        className="system-card p-8"
      >
        <h2 className="text-lg font-semibold text-text-primary font-mono mb-4">
          Development & Testing
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-text-secondary font-mono text-sm mb-2">
              Reset first-time setup to show the setup screen again on next launch.
            </p>
            <motion.button
              onClick={handleResetSetup}
              disabled={resetting}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: resetting ? 1 : 1.02 }}
              whileTap={{ scale: resetting ? 1 : 0.98 }}
            >
              {resetting ? "RESETTING..." : "RESET SETUP"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

