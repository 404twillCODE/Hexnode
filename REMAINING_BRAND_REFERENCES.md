# Remaining HexNode / hexnode / HEXNODE References

**Searched:** `HexNode`, `hexnode`, `HEXNODE`, `hex-node`, `hex_node`  
**Result:** No `hex-node` or `hex_node` in repo.

---

## Code

| Location | Occurrence | Action |
|----------|------------|--------|
| `App/electron/serverManager.js` (lines 8, 15, 21–23) | Comment "legacy HEXNODE_*", `legacyDir = '.hexnode'`, `process.env.HEXNODE_DATA_DIR`, deprecation message | **Intentionally kept** — backward-compat env and legacy path name for one-release migration. |

---

## Docs

| Location | Occurrence | Action |
|----------|------------|--------|
| `README.md` (lines 103, 106–107) | Upgrade Notes heading "HexNode → Nodexity", ".hexnode" folder, "HEXNODE_DATA_DIR" in bullets | **Intentionally kept** — user-facing migration instructions; users need old names to find env/paths. |
| `MIGRATION_REPORT.md` (throughout) | Title and body: HexNode, hexnode, HEXNODE in tables and prose | **Intentionally kept** — historical migration report documenting old → new. |
| `REBRAND_INVENTORY.md` (throughout) | Phase 0 inventory listing old file names, package names, etc. | **Intentionally kept** — historical inventory of pre-migration state. |

---

## Configs

| Location | Occurrence | Action |
|----------|------------|--------|
| *(none)* | — | No remaining references in config files (package.json, electron-builder, next.config, etc. already updated). |

---

## Assets / build output

| Location | Occurrence | Action |
|----------|------------|--------|
| `App/release/HexNode-win32-x64/`, `App/release/.../HexNode.exe`, `.../HexNodeTyping.tsx` | Old Electron build output | **Regenerate, do not edit** — folder is in `.gitignore`; next `npm run build:win` will produce Nodexity.exe and Nodexity-named output. |

---

## Summary

- **Rename:** None. All remaining references are either intentional (legacy support, migration docs) or build artifacts (regenerate).
- **Safe fixes applied:** None required; optional cosmetic change: README Upgrade Notes heading could say "Rebrand to Nodexity" instead of "HexNode → Nodexity rebrand" (bullets still reference old names for user migration).
