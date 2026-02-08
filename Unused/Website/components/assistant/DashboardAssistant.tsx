'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useServerContext } from '@/components/context/ServerContext';
import { useAssistantContext } from '@/components/context/AssistantContext';
import { buttonHover, buttonTap } from '@/components/motionVariants';

interface Message {
  id: string;
  text: string;
  isAssistant: boolean;
}

export default function DashboardAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const { servers, resourcePool } = useServerContext();
  const {
    isOpen,
    setIsOpen,
    initialMessage,
    autoFillMode,
    onAutoFillCallback,
    setInitialMessage,
    setAutoFillMode,
    setOnAutoFillCallback,
  } = useAssistantContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial message when assistant opens
  useEffect(() => {
    if (isOpen && initialMessage) {
      setInputValue(initialMessage);
      // Auto-send after a brief delay
      setTimeout(() => {
        handleSendMessage(initialMessage);
        setInitialMessage(null);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMessage]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message to state
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      isAssistant: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const totalRam = resourcePool.totalRam;
      const usedRam = resourcePool.usedRam;
      const remainingRam = totalRam - usedRam;

      let contextString = `Current NODEXITY infrastructure:
- Total RAM pool: ${totalRam} GB
- Used RAM: ${usedRam} GB
- Remaining RAM: ${remainingRam} GB`;

      const serverList = servers.slice(0, 5);
      if (serverList.length > 0) {
        contextString += `\n- Servers:`;
        serverList.forEach((server) => {
          contextString += `\n  - ${server.name} (${server.type} ${server.version}, ${server.ram} GB, ${server.status})`;
        });
      }

      // Convert messages to API format
      const apiMessages = messages.map(msg => ({
        role: msg.isAssistant ? 'assistant' : 'user',
        content: msg.text,
      }));

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          context: contextString,
          autoFill: autoFillMode,
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Service unavailable');
      }

      const data = await response.json();
      
      // Handle auto-fill response
      if (autoFillMode && data.autoFill && onAutoFillCallback) {
        onAutoFillCallback(data.autoFill);
        setAutoFillMode(false);
        setOnAutoFillCallback(null);
      }

      // Add assistant response to state
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: data.response || 'Service unavailable',
        isAssistant: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Assistant request error:', error);
      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: 'Service unavailable. Please try again later.',
        isAssistant: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue('');
    handleSendMessage(message);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button - Icon only with subtle glow */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-background border border-foreground/10 rounded-xl shadow-lg flex items-center justify-center text-foreground hover:border-accent/50 transition-all"
        whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Click to close */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Chat Panel - Bottom-right, fixed position */}
            <motion.div
              className="fixed bottom-6 right-6 w-[380px] h-[520px] bg-background border border-foreground/10 rounded-lg shadow-2xl flex flex-col z-50"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Header */}
              <div className="p-4 border-b border-foreground/10 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Assistant
                  </h2>
                  <p className="text-xs text-muted">
                    Here to help
                  </p>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors rounded hover:bg-foreground/5"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Message Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && !isLoading && (
                  <motion.div
                    className="flex items-center justify-center h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-center">
                      <p className="text-sm text-muted">
                        Start a conversation to get help with your servers.
                      </p>
                    </div>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isAssistant ? 'justify-start' : 'justify-end'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        message.isAssistant
                          ? 'bg-foreground/5 text-foreground'
                          : 'bg-accent text-foreground'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="max-w-[80%] px-3 py-2 rounded-lg bg-foreground/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-foreground/10">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything…"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-foreground/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className={`px-4 py-2 bg-foreground/10 text-foreground font-medium rounded-lg transition-colors ${
                      isLoading || !inputValue.trim()
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-foreground/15'
                    }`}
                    whileHover={!isLoading && inputValue.trim() ? buttonHover : {}}
                    whileTap={!isLoading && inputValue.trim() ? buttonTap : {}}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
