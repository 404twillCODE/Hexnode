'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonHover, buttonTap } from '@/components/motionVariants';

interface DeleteServerModalProps {
  isOpen: boolean;
  serverName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteServerModal({
  isOpen,
  serverName,
  onConfirm,
  onCancel,
}: DeleteServerModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText === serverName;

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      setConfirmText('');
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    onCancel();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
          >
            <motion.div
              className="bg-background border border-foreground/10 rounded-lg shadow-2xl max-w-md w-full p-6"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Delete Server
              </h3>
              <p className="text-muted mb-4">
                This action cannot be undone. This will permanently delete the server and all its data.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type <span className="font-semibold text-red-400">{serverName}</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={serverName}
                  className="w-full px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-red-500/50 transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-3 justify-end">
                <motion.button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-foreground/20 text-foreground font-medium rounded-lg hover:border-foreground/30 hover:bg-foreground/5 transition-colors"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  disabled={!isConfirmed}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    isConfirmed
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-foreground/10 text-muted cursor-not-allowed'
                  }`}
                  whileHover={isConfirmed ? buttonHover : {}}
                  whileTap={isConfirmed ? buttonTap : {}}
                >
                  Delete Server
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


