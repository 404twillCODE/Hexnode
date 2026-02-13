## 🗺️ Roadmap

---

## 🖥️ Desktop App Roadmap

### ⏭️ Next 7 Days
- Version management & profile support (Launcher)
- Plan mod loader support (Fabric/Forge)
- Integrate with Server Manager
- ~~Implement missing backend functions (`importServer`, `readServerFileBinary`, etc.)~~ ✅
- ~~Add test framework + helper tests~~ ✅
- ~~Split serverManager.js into modules~~ ✅
- ~~Add Content Security Policy~~ ✅

#### 🧪 Manual Smoke Test Checklist
- [ ] App launches and shows boot sequence / main UI
- [ ] Settings view loads without errors
- [ ] Can create (Paper) server (downloads & starts)
- [ ] Server stop / restart works correctly
- [ ] File editor opens and navigates directories
- [ ] Binary/NBT file operations work (read + save)
- [ ] Import existing server folder works
- [ ] Delete world from World Manager works
- [ ] Closing app (with running server) prompts/shuts down cleanly
- [ ] Minimize to tray works when enabled

### 🗓️ Next 30 Days
- Convert Electron backend to TypeScript
- Add integration tests for IPC
- CI pipeline (lint, type, build, test)
- Fix exhaustive-deps warnings
- Add React error boundaries
- Add crash/error reporting

### ⏳ Next 90 Days
- macOS & Linux builds
- Code signing + auto-update
- State management migration
- Server status by stdout parsing
- Performance audit

---

#### ✅ Confidence & Verification

| Command         | Before                 | After                  | Status           |
|-----------------|-----------------------|------------------------|------------------|
| tsc --noEmit    | exit 0                | exit 0                 | No regressions   |
| eslint          | 0 errors, 17 warnings | 0 errors, 17 warnings  | Identical        |
| vite build      | success, 442.18 kB JS | success, 442.18 kB JS  | Identical output |
| vitest run      | N/A (no tests)        | 24 tests, 2 files pass | New              |
| barrel exports  | N/A                   | All 55 functions OK    | New              |

---

#### ⚠️ Risk Notes

- ~~6 missing backend functions~~ ✅ Implemented
- 17 react-hooks/exhaustive-deps warnings
- ~~serverManager.js large monolith~~ ✅ Split into 5 modules (still JS, not TS yet)
- `new Promise(async ...)` patterns left in downloads module
- Process management relies on sync Windows commands
- Persistence format unchanged (servers.json)

---

#### 📊 Maturity Assessment

| Dimension      | Current State                                 | Score  |
|----------------|-----------------------------------------------|--------|
| Testing        | vitest framework, 24 unit tests               | 3/10   |
| Architecture   | 5 focused backend modules + barrel re-export  | 6/10   |
| Type safety    | Frontend TS solid; backend untyped JS         | 4/10   |
| Build/Release  | Win-only portable EXE, no CI, unsigned        | 3/10   |
| Error handling | All IPC handlers implemented + guarded        | 6/10   |
| Security       | Path traversal checks + CSP enforced          | 6/10   |
| Performance    | Usage/system info caching                     | 6/10   |
| Crash reporting| None                                          | 1/10   |

---

#### 💡 Optional Future Product Ideas (App)

- Multi-server console view (split-pane logging)
- Server backup restore UI
- Mod manager for Fabric/Forge
- Server templates/presets
- Remote server management

---

## 🌐 Website Roadmap

### ⏭️ Next 7 Days
- ~~Add page metadata to all routes (SEO)~~ ✅
- ~~Fix npm audit vulnerabilities~~ ✅ (critical resolved; Next.js 14.2.0 → 14.2.35)
- ~~Add Prettier + format-on-save~~ ✅
- Replace placeholder donation URLs *(needs real account URLs)*
- ~~Add robots.txt and sitemap.xml~~ ✅

#### 🧪 Manual QA Smoke Checklist
- [ ] Home page loads, boot sequence plays, can skip
- [ ] Boot sequence does **NOT** restart on scroll
- [ ] All sections animate on scroll (Server Manager, Launcher, Hosting, Philosophy)
- [ ] Download button opens donate modal
- [ ] Footer links navigate correctly (client-side, no full reload)
- [ ] Settings page toggle works (enable/disable boot sequence)
- [ ] Navigation bar links work (Docs, Support, Status, Settings, Donate)
- [ ] Custom cursor trail works on desktop
- [ ] Mobile menu opens and closes
- [ ] Test on Chrome, Firefox, Edge

### 🗓️ Next 30 Days
- Add basic test infrastructure (Vitest/React Testing Library)
- ~~Add CI lint/typecheck/test gates (GitHub Actions)~~ ✅ (`.github/workflows/ci-website.yml`)
- ~~Accessibility audit + fixes (semantic HTML, skip links, ARIA)~~ ✅ (skip-to-content, footer `<nav>`, `#main-content`)
- ~~Add error boundary~~ ✅ (`app/error.tsx`)
- ~~Add Open Graph / Twitter cards for social preview~~ ✅ (root layout OG + Twitter metadata)
- Performance: lazy load below-fold sections

### ⏳ Next 90 Days
- Add E2E smoke tests (Playwright: home, nav, settings, download modal)
- Implement real status page (dynamic checks)
- Add Content Security Policy (CSP)
- Bundle analysis/code splitting
- Implement analytics (privacy-respecting)
- Upgrade Next.js to latest stable
- Component library extraction

---

#### ✅ Confidence & Verification

| Check                      | Baseline (before)   | After improvements   | Status   |
|----------------------------|---------------------|----------------------|----------|
| ESLint                     | 0 warnings/errors   | 0 warnings/errors    | Pass     |
| TypeScript (tsc --noEmit)  | 0 errors            | 0 errors             | Pass     |
| Production build           | 16/16 pages, static | 18/18 pages, static  | Pass     |
| Next.js version            | 14.2.0              | 14.2.35 (patched)    | Pass     |
| npm audit (critical)       | 1 critical          | 0 critical           | Pass     |
| npm audit (high)           | 3 high              | 4 high (residual*)   | Accepted |
| Bundle size (home)         | 12.9 kB             | 13 kB                | Pass     |
| Bundle size (shared)       | 87 kB               | 87.4 kB              | Pass     |

*Residual high vulns: `glob` CLI injection (dev-only), 2 Next.js DoS (config not used). All require major version upgrades.

---

#### ⚠️ Risk Notes

| Area                         | Why Avoided                                                       |
|------------------------------|-------------------------------------------------------------------|
| Donate page placeholder URLs  | Replacing URLs requires real account info from the developer      |
| Payment page validation      | Incomplete; fixing may change user-facing logic                   |
| Dead code (FloatingCard, getDelay) | Preserved for intended future use                          |
| Remaining npm high vulns     | Require Next.js 16+ / eslint-config-next 16+ (major upgrades)    |
| GitHub Pages basePath logic  | Changes may break deployment target                               |
| Supabase schema              | Not currently in use, left unchanged                              |

---

#### 📊 Maturity Assessment (Updated)

| Dimension         | Before | After | Notes                                                                         |
|-------------------|--------|-------|-------------------------------------------------------------------------------|
| Accessibility     | 3/10   | 5/10  | Added skip-to-content, footer nav landmark, main content ID                   |
| Performance (CWV) | 6/10   | 6/10  | Good load sizes; hooks properly hoisted; animation impact unchanged           |
| SEO hygiene       | 4/10   | 7/10  | All routes have metadata, OG/Twitter cards, robots.txt, sitemap.xml           |
| Test coverage     | 0/10   | 0/10  | No tests yet (next priority)                                                 |
| DX                | 5/10   | 7/10  | Prettier + format-on-save, CI gates, format check in pipeline                 |
| Security posture  | 5/10   | 7/10  | Critical vuln patched, security headers, error boundary                       |
| CI/CD             | 4/10   | 6/10  | PR gates: lint + typecheck + format check + build                             |
| Observability     | 1/10   | 2/10  | Error boundary logs errors; no external tracking yet                          |

---

#### 💡 Optional Future Product Ideas (Website)

- ~~Blog/changelog for updates~~ ✅
- ~~Newsletter signup for launch notifications~~ ✅
- Interactive server demo (embedded terminal simulation)
- Community showcase page
- ~~Comparison page (vs. other tools)~~ ✅
- Internationalization (i18n) for multi-language support

---

> 💬 **Stay Updated:**  
> [Join the Discord Community](https://discord.gg/rFJeUQ6CbE)