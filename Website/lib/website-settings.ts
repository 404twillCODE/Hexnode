const STORAGE_KEY = "nodexity-website-settings";

export interface WebsiteSettings {
  showBootSequence: boolean;
  showDevBanner: boolean;
}

const defaults: WebsiteSettings = {
  showBootSequence: true,
  showDevBanner: true,
};

function getStored(): WebsiteSettings {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<WebsiteSettings>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

function setStored(settings: WebsiteSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function getWebsiteSettings(): WebsiteSettings {
  return getStored();
}

export function saveWebsiteSettings(partial: Partial<WebsiteSettings>): WebsiteSettings {
  const next = { ...getStored(), ...partial };
  setStored(next);
  return next;
}

export { defaults as defaultWebsiteSettings };
