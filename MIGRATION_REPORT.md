# HexNode → Nodexity Migration Report

## Summary

Full platform rebrand from **HexNode** / **hexnode** / **HEXNODE** to **Nodexity** / **nodexity** / **NODEXITY** across the codebase. All phases completed except validation of the Desktop App build (blocked by pre-existing TypeScript/preload errors).

---

## 1. Renamed Files / Folders

| Previous | New |
|----------|-----|
| `App/src/components/HexNodeTyping.tsx` | `App/src/components/NodexityTyping.tsx` |
| `Website/components/HexNodeTyping.tsx` | `Website/components/NodexityTyping.tsx` |

**Note:** Repo root folder name (e.g. `Hexnode` on disk) was not changed. Rename the folder locally and/or rename the GitHub repo to `Nodexity` if desired; then ensure `Website/next.config.js` `basePath` matches the repo name for GitHub Pages (currently set to `/Nodexity`).

---

## 2. Updated Identifiers

| Type | Old | New |
|------|-----|-----|
| **npm package (App)** | `hexnode-desktop` | `nodexity-desktop` |
| **npm package (Website)** | `hexnode` | `nodexity` |
| **npm package (Unused/Website)** | `hexnode` | `nodexity` |
| **Root package-lock name** | `Hexnode` | `Nodexity` |
| **Electron appId** | `com.hexnode.desktop` | `com.nodexity.desktop` |
| **Electron productName** | HexNode | Nodexity |
| **Electron portable artifact** | HexNode.exe | Nodexity.exe |
| **Default app data directory** | `.hexnode` | `.nodexity` (under AppData Roaming / Application Support / home) |
| **GitHub Pages basePath** | `/Hexnode` | `/Nodexity` |
| **API/compat function** | `getHexnodeDir()` | `getNodexityDir()` (returns `getAppDataPath()`) |

---

## 3. Environment Variable Mapping and .env Migration

| Old | New | Notes |
|-----|-----|------|
| `HEXNODE_DATA_DIR` | `NODEXITY_DATA_DIR` | Preferred. |

**Backward compatibility:** For one release cycle, if `NODEXITY_DATA_DIR` is not set and `HEXNODE_DATA_DIR` is set, the app uses `HEXNODE_DATA_DIR` and logs:

`[Nodexity] HEXNODE_DATA_DIR is deprecated. Use NODEXITY_DATA_DIR.`

**Migration steps:**

1. In any `.env` or deployment config, replace:
   - `HEXNODE_DATA_DIR` → `NODEXITY_DATA_DIR`
2. (Optional) Remove `HEXNODE_DATA_DIR` after updating to the new variable so the deprecation warning stops.

No `.env.example` was present in the repo; if you add one, use `NODEXITY_DATA_DIR` as the optional override for the app data directory.

---

## 4. Route / URL Mapping

- **No brand-based API route namespaces** were changed; no API path renames.
- **GitHub / GitHub Pages:** All references updated from `404twillCODE/Hexnode` and `404twillCODE.github.io/Hexnode/` to `404twillCODE/Nodexity` and `404twillCODE.github.io/Nodexity/`. If the repo is still named `Hexnode`, rename it to `Nodexity` (or align `basePath` in `Website/next.config.js` with the actual repo name).
- **Unused/Website metadata:** `metadataBase` updated from `https://hexnode.com` to `https://nodexity.com`.

---

## 5. Database / Storage

- **No brand-named databases or schemas.** Config is file-based (`servers.json` and server files under the app data directory). Default directory is now `.nodexity`; no SQL or schema renames.

---

## 6. Validation Commands

Run from repo root (Windows):

```powershell
# Website: lint + build
cd Website
npm run lint
npm run build

# App: lint (many pre-existing ESLint/TS issues); build fails on tsc
cd ..\App
npm run lint
npm run build
```

**Results:**

- **Website:** Lint passes; `npm run build` succeeds.
- **App:** Lint reports many pre-existing issues (e.g. `@typescript-eslint/no-explicit-any`, react-hooks). `npm run build` fails at `tsc` due to pre-existing type errors (e.g. `window.electronAPI` and preload API types, missing IPC methods in type definitions). These are unrelated to the rebrand. One syntax error in `CreateServerButton.tsx` (`) )}` → `) }`) was fixed during this migration.

---

## 7. Manual Steps Left

1. **Rename GitHub repo** (if desired): From `Hexnode` to `Nodexity` so clone URLs and GitHub Pages URL match the new branding. After renaming, confirm `Website/next.config.js` has `basePath: '/Nodexity'` (or the new repo name) for GitHub Pages.
2. **Rename local repo folder** (optional): e.g. from `Hexnode` to `Nodexity` and re-open in your IDE.
3. **Fix pre-existing App type/lint issues** so `npm run build` (and `npm run build:win` / `npm run build:exe`) succeeds; preload/IPC types and exposed APIs need to be aligned with the frontend.

---

## 8. Upgrade Notes (for README)

**What changed**

- **Brand:** HexNode → Nodexity everywhere (UI, window titles, tray, package names, app id, default data directory name, docs, and repo references).
- **Default data directory:** New installs use `AppData\Roaming\.nodexity` (Windows), `~/Library/Application Support/.nodexity` (macOS), or `~/.nodexity` (Linux). Existing installs that relied on `.hexnode` are not migrated automatically; you can set `NODEXITY_DATA_DIR` to your existing path to keep using it.
- **Environment variable:** Prefer `NODEXITY_DATA_DIR`; `HEXNODE_DATA_DIR` is still supported for one release with a deprecation warning.

**What users must update**

- **Env:** Replace `HEXNODE_DATA_DIR` with `NODEXITY_DATA_DIR` in `.env` or deployment configs when convenient.
- **URLs:** If you linked to the old repo or GitHub Pages URL, update to the new Nodexity repo and `.../Nodexity/` Pages URL.

**Compatibility**

- **One release:** `HEXNODE_DATA_DIR` is still read if `NODEXITY_DATA_DIR` is not set; a deprecation message is logged. After that period, only `NODEXITY_DATA_DIR` will be supported.
