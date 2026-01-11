# HexNode

> **⚠️ Early Development Notice**
> 
> This project is currently in early development. Nothing is finished, and features are still being actively worked on. The software and website are not production-ready and may have bugs, incomplete features, or breaking changes.

## Overview

HexNode is a local-first Minecraft server management system. It provides a desktop application for server creation and management, USB-based portable deployment, and planned hosting infrastructure. All data remains local and portable by default.

## Current Status

### In Development
- **Software**: Desktop application for creating and managing Minecraft servers

### In Progress
- **USB Server**: Complete Minecraft server deployment on USB media

### Planned
- **Hosting**: Premium hosting infrastructure
- **Recycle Host**: Budget hosting using recycled business PCs

## Project Structure

- `/App` - Desktop application (Electron + React)
- `/Website` - Marketing/landing website (Next.js)

## Getting Started

This project is still in active development. Check back later for installation and usage instructions.

## Website

🌐 Live Website: [https://404twillCODE.github.io/Hexnode/](https://404twillCODE.github.io/Hexnode/)

> **Note:** The website is also in active development and may have incomplete features or styling issues.

### Deploying to GitHub Pages

The website is automatically deployed to GitHub Pages using GitHub Actions. To enable automatic deployment:

1. **Enable GitHub Pages in repository settings:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **GitHub Actions**
   - Save the settings

2. **Push the workflow file:**
   - The GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) is already set up
   - Push your changes to the `main` branch
   - The workflow will automatically build and deploy the website

3. **Manual deployment (alternative):**
   ```bash
   cd Website
   npm run build:gh-pages
   # Then push the 'out' directory contents to a 'gh-pages' branch
   ```

## Repository

GitHub: [https://github.com/404twillCODE/Hexnode](https://github.com/404twillCODE/Hexnode)

## License

TBD
