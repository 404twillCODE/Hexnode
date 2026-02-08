# Nodexity

[![License (App: AGPL-3.0)](https://img.shields.io/badge/License-App%20AGPL--3.0-blue.svg)](App/LICENSE) [![License (Website: MIT)](https://img.shields.io/badge/License-Website%20MIT-green.svg)](Website/LICENSE) [![GitHub repo](https://img.shields.io/badge/GitHub-404twillCODE%2FNodexity-24292e?logo=github)](https://github.com/404twillCODE/Nodexity)

> **⚠️ Early Development Notice**
> 
> This project is currently in early development. Nothing is finished, and features are still being actively worked on. The software and website are not production-ready and may have bugs, incomplete features, or breaking changes.

## Overview

Nodexity is a local-first Minecraft server management system. It provides a desktop application for server creation and management, a custom Minecraft launcher for game and mod management, and planned hosting infrastructure. All data remains local and portable by default.

## Current Status

### In Development
- **Website**: Marketing and landing site for Nodexity
- **Server Manager**: Desktop application for creating and managing Minecraft servers

### Planned
- **Launcher**: Custom Minecraft launcher application
- **Premium Hosting**: Premium hosting infrastructure
- **Recycle Hosting**: Budget hosting using recycled business PCs

## Project Structure

- `/App` - Desktop application (Electron + React)
- `/Website` - Marketing/landing website (Next.js)

## Getting Started

This project is still in active development. Check back later for installation and usage instructions.

### Running the App Locally (Development)

If you want to check out the desktop application in its current development stage:

**Prerequisites:**
- Node.js (v20 or higher recommended)
- npm or yarn
- Java (required for running Minecraft servers)

**Steps:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/404twillCODE/Nodexity.git
   cd Nodexity
   ```

2. **Navigate to the App directory:**
   ```bash
   cd App
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the application in development mode:**
   ```bash
   npm run dev
   ```

   This will start the React development server and launch the Electron app. The app will automatically reload when you make changes to the code.

**Note:** The application is in early development and many features may be incomplete or non-functional. Expect bugs and missing functionality.

## Website

🌐 Live Website: [https://404twillCODE.github.io/Nodexity/](https://404twillCODE.github.io/Nodexity/)

> **Note:** The website is also in active development and may have incomplete features or styling issues.

## Community

- Discord: `https://discord.gg/RVTAEbdDBJ`

## Support

Want to support Nodexity development? Here are ways you can help:

- Join the Discord and share feedback: `https://discord.gg/RVTAEbdDBJ`
- Star the repo on GitHub
- Donate (coming soon):
  - GitHub Sponsors: [Coming soon](#)
  - Ko-fi: [Coming soon](#)
  - PayPal: [Coming soon](#)

See [DONATE.md](DONATE.md) for more information.

## Repository

GitHub: [https://github.com/404twillCODE/Nodexity](https://github.com/404twillCODE/Nodexity)

For renaming the repo and updating GitHub Settings (description, secrets, environments, Pages), see [docs/GITHUB_SETTINGS_CHECKLIST.md](docs/GITHUB_SETTINGS_CHECKLIST.md).

## License

This repository is **multi-licensed by directory**:

- `App/` (Desktop app / Server Manager): **AGPL-3.0**
- `Website/` (Marketing site): **MIT**

Hosting backend/infra code will be kept private until it is ready.

## Upgrade Notes (rebrand to Nodexity)

- **Brand:** All visible branding is now Nodexity (app name, window titles, tray, default paths).
- **Data directory:** New installs use `AppData\Roaming\.nodexity` (Windows). To keep using an existing `.hexnode` folder, set `NODEXITY_DATA_DIR` to that path.
- **Env:** Use `NODEXITY_DATA_DIR`; `HEXNODE_DATA_DIR` is still supported for one release with a deprecation warning.
- **URLs:** Update links to the new repo and GitHub Pages URL (e.g. `.../Nodexity/`). See [MIGRATION_REPORT.md](MIGRATION_REPORT.md) for full details.

## Disclaimer

Nodexity is not affiliated with Mojang AB or Microsoft. “Minecraft” is a trademark of Mojang AB.

