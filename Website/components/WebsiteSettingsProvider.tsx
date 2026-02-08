"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { WebsiteSettings } from "@/lib/website-settings";
import {
  defaultWebsiteSettings,
  getWebsiteSettings,
  saveWebsiteSettings as persistSettings,
} from "@/lib/website-settings";

const WebsiteSettingsContext = createContext<{
  settings: WebsiteSettings;
  setSetting: <K extends keyof WebsiteSettings>(
    key: K,
    value: WebsiteSettings[K]
  ) => void;
  setSettings: (partial: Partial<WebsiteSettings>) => void;
} | null>(null);

export function WebsiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettingsState] = useState<WebsiteSettings>(
    defaultWebsiteSettings
  );

  useEffect(() => {
    setSettingsState(getWebsiteSettings());
  }, []);

  const setSetting = useCallback(<K extends keyof WebsiteSettings>(
    key: K,
    value: WebsiteSettings[K]
  ) => {
    const next = persistSettings({ [key]: value });
    setSettingsState(next);
  }, []);

  const setSettings = useCallback((partial: Partial<WebsiteSettings>) => {
    const next = persistSettings(partial);
    setSettingsState(next);
  }, []);

  return (
    <WebsiteSettingsContext.Provider
      value={{ settings, setSetting, setSettings }}
    >
      {children}
    </WebsiteSettingsContext.Provider>
  );
}

export function useWebsiteSettings() {
  const ctx = useContext(WebsiteSettingsContext);
  if (!ctx) {
    throw new Error("useWebsiteSettings must be used within WebsiteSettingsProvider");
  }
  return ctx;
}

export function useWebsiteSettingsOptional() {
  return useContext(WebsiteSettingsContext);
}
