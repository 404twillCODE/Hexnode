# GitHub Settings checklist (Nodexity rebrand)

Use this list after renaming the repo to **Nodexity** or when aligning GitHub settings with the new brand. **Do not guess or store secret values**—only rename references and document what you must change in the GitHub UI.

---

## 1. Repository name and description

| Item | Where | Action |
|------|--------|--------|
| **Repository name** | Settings → General → Repository name | If still `Hexnode`, rename to **Nodexity**. GitHub will redirect old URLs; update local remotes: `git remote set-url origin https://github.com/404twillCODE/Nodexity.git` |
| **Description** | Settings → General → Description | Set to a short Nodexity description (see [GITHUB_REPO_DESCRIPTION.md](GITHUB_REPO_DESCRIPTION.md)). |
| **Website** | Settings → General → Website | Set to `https://404twillCODE.github.io/Nodexity/` (or your custom domain). |
| **Topics** | Repo main page → ⚙️ next to About | Add/update topics (e.g. `nodexity`, `minecraft`, `electron`); remove old brand topics. |

---

## 2. Secrets and variables (Actions)

| Item | Where | Action |
|------|--------|--------|
| **Repository secrets** | Settings → Secrets and variables → Actions | If any secret **name** contains the old project name (e.g. `HEXNODE_*`), rename it to a **NODEXITY_*** or neutral name. **Do not change or document secret values.** |
| **Repository variables** | Settings → Secrets and variables → Actions → Variables | Same as above: rename variable names that reference the old brand; do not change values if they are environment-specific. |
| **Dependabot / CodeQL** | Settings → Code security and analysis | No change needed unless a config references the old repo name; then update the reference. |

---

## 3. Environments

| Item | Where | Action |
|------|--------|--------|
| **Environment names** | Settings → Environments | If you have environments named after the old project (e.g. `hexnode-production`), rename to **nodexity-production** (or equivalent). Update any workflow files that reference the environment name. |
| **Environment secrets/variables** | Inside each environment | Rename any secret/variable **names** that include the old brand; do not modify or document values. |
| **github-pages** | Settings → Environments | The workflow uses `environment: github-pages`; no change unless you renamed it. |

---

## 4. GitHub Pages

| Item | Where | Action |
|------|--------|--------|
| **Source** | Settings → Pages | Ensure **Source** is “GitHub Actions” (not “Deploy from a branch”) so the “Nodexity – Deploy to GitHub Pages” workflow is used. |
| **Custom domain** (optional) | Settings → Pages → Custom domain | If you set a custom domain, ensure DNS and any docs reference the Nodexity brand. No change to the domain value unless you are switching to a new domain. |
| **URL after rename** | — | After renaming the repo to Nodexity, the default Pages URL is **https://404twillCODE.github.io/Nodexity/** . Update any links in README, docs, and app (already set in this repo). |

---

## 5. Branch and default branch

| Item | Where | Action |
|------|--------|--------|
| **Default branch** | Settings → General → Default branch | Usually `main`; no change unless you use a branch name that included the old project name. |
| **Branch protection** | Settings → Branches | If a rule or name references the old project, rename or update the reference. |

---

## 6. Other Settings to review

| Item | Where | Action |
|------|--------|--------|
| **Discussions** | Settings → General → Features | If enabled, consider pinning a post that mentions the rebrand to Nodexity. |
| **Projects** | Repo or org Projects | If a project name or description uses the old brand, rename to Nodexity. |
| **Releases** | Repo → Releases | Existing release titles/tags stay as-is. New releases: use “Nodexity” in titles and release notes. |
| **Labels** | Issues/PRs → Labels | If you have labels like `hexnode-*`, rename to `nodexity-*` or a neutral name (optional). |

---

## 7. CODEOWNERS (if you add one later)

There is **no CODEOWNERS file** in the repo yet. If you add one:

- Use paths and team/repo references that match the **Nodexity** repo (e.g. `https://github.com/404twillCODE/Nodexity` or `@org/nodexity-maintainers`).
- Do not reference the old repo name in comments or paths.

---

## 8. Summary checklist (copy and use in GitHub)

- [ ] Repository renamed to **Nodexity** (Settings → General).
- [ ] Description and Website updated (Settings → General).
- [ ] Topics updated (About section on repo).
- [ ] Local git remote updated: `git remote set-url origin https://github.com/404twillCODE/Nodexity.git`
- [ ] Secrets/variables: any **names** containing the old brand renamed (values unchanged).
- [ ] Environments: any **names** containing the old brand renamed.
- [ ] GitHub Pages source is **GitHub Actions**; Pages URL is `https://404twillCODE.github.io/Nodexity/`.
- [ ] Branch protection and other settings checked for old brand references.
- [ ] New releases use “Nodexity” in titles and notes.
