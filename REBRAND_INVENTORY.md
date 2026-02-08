# Phase 0 — Rebrand Inventory (HexNode → Nodexity)

## 1. Text occurrences (HexNode / hexnode / HEXNODE)

### App (Desktop)
| File | Occurrences |
|------|-------------|
| `App/electron/serverManager.js` | HEXNODE_DATA_DIR (env), HEXNODE_DIR (variable), .hexnode (path), "HexNode" (User-Agent), "Get HexNode directory", getHexnodeDir |
| `App/electron/main.js` | tray "HexNode", "Show HexNode", User-Agent "HexNode", GitHub URL 404twillCODE/Hexnode |
| `App/package.json` | name "hexnode-desktop", description "HexNode Desktop Application" |
| `App/package-lock.json` | name "hexnode-desktop" |
| `App/electron-builder.json` | appId "com.hexnode.desktop", productName "HexNode", artifactName "HexNode.exe" |
| `App/index.html` | title "HexNode" |
| `App/src/App.tsx` | "HexNode" (update message, "Close HexNode") |
| `App/src/components/ServerList.tsx` | "HexNode" (first server CTA) |
| `App/src/components/SetupOptionsView.tsx` | "HexNode", ".hexnode" (paths in UI) |
| `App/src/components/SetupView.tsx` | "WELCOME TO HEXNODE" |
| `App/src/components/SettingsView.tsx` | ".hexnode" (path display) |
| `App/src/components/TitleBar.tsx` | "HEXNODE" |
| `App/src/components/Sidebar.tsx` | "HEXNODE" |
| `App/src/components/BootSequence.tsx` | "HexNode Server Manager", "HexNode" |
| `App/src/components/HexNodeTyping.tsx` | Component name, "HEXNODE" text |
| `App/src/components/CreateServerButton.tsx` | "Hexnode" (import copy, labels) |

### Website (active)
| File | Occurrences |
|------|-------------|
| `Website/package.json` | name "hexnode" |
| `Website/package-lock.json` | name "hexnode" |
| `Website/app/layout.tsx` | title "Hexnode" |
| `Website/app/page.tsx` | HexNodeTyping import/usage, "HexNode" (copy), GitHub Hexnode links |
| `Website/app/launcher/page.tsx` | "HexNode" (meta, copy) |
| `Website/app/docs/page.tsx` | "Hexnode", clone URL Hexnode |
| `Website/app/privacy/page.tsx` | "Hexnode" |
| `Website/app/donate/page.tsx` | "Hexnode", GitHub Hexnode |
| `Website/app/terms/page.tsx` | "Hexnode" |
| `Website/app/faq/page.tsx` | "Hexnode" (Q&A) |
| `Website/app/software/page.tsx` | GitHub Hexnode/releases |
| `Website/next.config.js` | basePath '/Hexnode' |
| `Website/components/SystemFrame.tsx` | "HexNode", "Hexnode" (footer) |
| `Website/components/BootSequence.tsx` | "HexNode System Initialization", "HexNode" |
| `Website/components/HexNodeTyping.tsx` | HexNodeTypingProps, "HEXNODE" |

### Unused/Website
| File | Occurrences |
|------|-------------|
| `Unused/Website/package.json` | name "hexnode" |
| `Unused/Website/package-lock.json` | name "hexnode" |
| `Unused/Website/app/layout.tsx` | metadataBase hexnode.com, "HEXNODE" metadata |
| `Unused/Website/app/dashboard/settings/page.tsx` | user@hexnode.com |
| `Unused/Website/app/api/ai/route.ts` | "HEXNODE Assistant" prompts |
| Plus multiple layout/page files with "HEXNODE" in descriptions/titles |

### Repo root / docs
| File | Occurrences |
|------|-------------|
| `README.md` | "HexNode", "Hexnode", GitHub URLs, 404twillCODE.github.io/Hexnode |
| `package-lock.json` | name "Hexnode" |
| `GITHUB_SETUP.md` | Hexnode repo URLs |
| `DISCORD_SETUP.md` | Hexnode server name, copy |
| `DONATE.md` | Hexnode |
| `TRADEMARKS.md` | Hexnode |
| `SECURITY.md` | Hexnode |
| `CONTRIBUTING.md` | Hexnode |
| `CODE_OF_CONDUCT.md` | Hexnode |

---

## 2. Brand-tied systems

### Package names / workspaces
- **Root:** `package-lock.json` → name "Hexnode" (root has no package.json name; lockfile has "Hexnode").
- **App:** `package.json` name `hexnode-desktop` → `nodexity-desktop`.
- **Website:** `package.json` name `hexnode` → `nodexity`.
- **Unused/Website:** `package.json` name `hexnode` → `nodexity`.

### Imports / paths containing "hexnode"
- **Component filenames:** `App/src/components/HexNodeTyping.tsx`, `Website/components/HexNodeTyping.tsx` → rename to `NodexityTyping.tsx`; update all imports.

### App IDs / bundle identifiers
- **Electron:** `App/electron-builder.json` → `appId: "com.hexnode.desktop"` → `com.nodexity.desktop` (or keep namespace; user said com.company.nodexity).

### Docker / Compose
- **None found.** No docker-compose or Dockerfile in repo.

### Environment variables
- **Current:** `HEXNODE_DATA_DIR` (with deprecation warning; `NODEXITY_DATA_DIR` already preferred in serverManager.js).
- **Action:** Ensure all code uses `NODEXITY_*`; keep one-release fallback: if `NODEXITY_DATA_DIR` missing and `HEXNODE_DATA_DIR` set, use it and log deprecation.

### CI/CD
- **`.github/workflows/deploy-pages.yml`:** No hexnode in workflow; uses `Website/` and `Website/out`. Update only if repo or artifact names change (e.g. repo rename to Nodexity → basePath/assetPrefix may change).

### Domains / URLs
- **Unused/Website:** `metadataBase: 'https://hexnode.com'` → `https://nodexity.com`.
- **GitHub:** `https://github.com/404twillCODE/Hexnode`, `https://404twillCODE.github.io/Hexnode/` — update to Nodexity repo name when repo is renamed (or keep if repo stays "Hexnode" for now; user said "GitHub repo names references" so we update references to the new name).

### Protocol handlers
- **None found.** No `hexnode://` in codebase.

### Database / schema names
- **None found.** No brand-prefixed DB names; config is file-based (e.g. servers.json in app data).

### Data paths (default app data)
- **Default dir:** `.hexnode` under AppData Roaming (Windows) / Application Support (macOS) / home (Linux). Code already has `.nodexity` in serverManager (nodexityDir) but getAppDataPath is broken (incomplete + HEXNODE_DIR used in getHexnodeDir undefined). Will fix: default to `.nodexity`, with optional migration from `.hexnode` and env `NODEXITY_DATA_DIR` / legacy `HEXNODE_DATA_DIR`.

---

## 3. File and folder names to rename (Phase 1)

| Current | New |
|---------|-----|
| `App/src/components/HexNodeTyping.tsx` | `App/src/components/NodexityTyping.tsx` |
| `Website/components/HexNodeTyping.tsx` | `Website/components/NodexityTyping.tsx` |

**Note:** Repo root folder is `Hexnode` on disk; renaming the workspace folder is a user/IDE operation (e.g. rename in Explorer + re-open). We do not run git mv for the repo root name here; we update all internal references. If the GitHub repo is renamed from Hexnode to Nodexity, clone URLs and basePath in next.config.js will need to match (e.g. basePath `/Nodexity` for GitHub Pages).

---

## 4. Identifiers summary

| Type | Old | New |
|------|-----|-----|
| npm package (App) | hexnode-desktop | nodexity-desktop |
| npm package (Website) | hexnode | nodexity |
| Electron appId | com.hexnode.desktop | com.nodexity.desktop |
| Electron productName | HexNode | Nodexity |
| Electron artifactName | HexNode.exe | Nodexity.exe |
| Default data dir | .hexnode | .nodexity |
| Env var | HEXNODE_DATA_DIR | NODEXITY_DATA_DIR (keep fallback) |
| GitHub Pages basePath | /Hexnode | /Nodexity (when repo renamed) |
| Display / UI | HexNode / hexnode / HEXNODE | Nodexity / nodexity / NODEXITY |

Inventory complete. Proceeding to Phase 1.
