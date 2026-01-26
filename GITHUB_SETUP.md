# GitHub Setup Guide

This guide will walk you through setting up GitHub Discussions, Security Advisories, and Labels for your Hexnode repository.

## Prerequisites

- You need to be the repository owner or have admin access to `https://github.com/404twillCODE/Hexnode`
- A web browser

---

## Step 1: Enable GitHub Discussions

1. **Navigate to your repository:**
   - Go to: `https://github.com/404twillCODE/Hexnode`

2. **Open Settings:**
   - Click on the **"Settings"** tab at the top of the repository page (it's in the horizontal menu bar, next to "Insights")

3. **Find the Features section:**
   - In the left sidebar, scroll down and click on **"General"** (if not already selected)
   - Scroll down on the page until you see the **"Features"** section

4. **Enable Discussions:**
   - Look for **"Discussions"** in the Features section
   - You'll see a checkbox that says "Set up discussions"
   - **Check the box** next to "Set up discussions"
   - Click the **"Set up discussions"** button that appears

5. **Configure Discussions:**
   - You'll be taken to a setup page
   - Choose a category template (you can start with "General" or "Q&A")
   - Click **"Start discussions"**

6. **Verify:**
   - You should now see a **"Discussions"** tab appear in your repository's top navigation menu

---

## Step 2: Enable Security Advisories

1. **Still in Settings:**
   - Make sure you're still on the Settings page: `https://github.com/404twillCODE/Hexnode/settings`

2. **Go to Security section:**
   - In the left sidebar, scroll down and click on **"Security"**

3. **Enable Security Advisories:**
   - Scroll down to the **"Security Advisories"** section
   - You'll see a button that says **"Set up security advisories"** or **"Enable private vulnerability reporting"**
   - Click on it

4. **Enable Private Vulnerability Reporting:**
   - You'll see options for:
     - **"Private vulnerability reporting"** - Check this box
     - Optionally: **"Dependabot alerts"** - Recommended to enable
     - Optionally: **"Dependabot security updates"** - Recommended to enable
   - Click **"Save changes"** or **"Enable"**

5. **Verify:**
   - You should see a green checkmark or confirmation that security advisories are enabled

---

## Step 3: Create Labels

### Method 1: Using the Web Interface (Easiest)

1. **Go to Issues:**
   - Click on the **"Issues"** tab at the top of your repository

2. **Open Labels:**
   - On the Issues page, look at the right sidebar
   - You'll see a section called **"Labels"** with a link that says **"Labels"** - click it
   - OR go directly to: `https://github.com/404twillCODE/Hexnode/labels`

3. **Create the "bug" label:**
   - Click the **"New label"** button (usually in the top right)
   - **Label name:** `bug`
   - **Description:** `Something isn't working` (optional)
   - **Color:** Click the color picker and enter: `d73a4a` (or select a red color)
   - Click **"Create label"**

4. **Create the "enhancement" label:**
   - Click **"New label"** again
   - **Label name:** `enhancement`
   - **Description:** `New feature or request` (optional)
   - **Color:** Click the color picker and enter: `a2eeef` (or select a light blue color)
   - Click **"Create label"**

5. **Create the "help wanted" label:**
   - Click **"New label"** again
   - **Label name:** `help wanted`
   - **Description:** `Extra attention is needed` (optional)
   - **Color:** Click the color picker and enter: `008672` (or select a green/teal color)
   - Click **"Create label"**

### Method 2: Using GitHub CLI (If you have it installed)

If you have GitHub CLI (`gh`) installed, you can run these commands in your terminal:

```bash
gh label create bug --color d73a4a --repo 404twillCODE/Hexnode
gh label create enhancement --color a2eeef --repo 404twillCODE/Hexnode
gh label create "help wanted" --color 008672 --repo 404twillCODE/Hexnode
```

---

## Troubleshooting

### Can't find Settings?
- Make sure you're logged into GitHub
- Make sure you have admin/owner permissions on the repository
- The Settings tab only appears if you have the right permissions

### Discussions option not showing?
- Some repositories might need to be public or have certain settings enabled
- Try refreshing the page
- Make sure you're in the "General" section of Settings

### Labels page is empty or confusing?
- Make sure you're on the Labels page: `https://github.com/404twillCODE/Hexnode/labels`
- The "New label" button should be visible at the top right of the labels list

### Still having issues?
- Try using a different browser
- Clear your browser cache
- Make sure JavaScript is enabled in your browser

---

## Verification Checklist

After completing all steps, verify:

- [ ] "Discussions" tab appears in repository navigation
- [ ] Security Advisories shows as enabled in Settings → Security
- [ ] Three labels exist: `bug`, `enhancement`, `help wanted`
- [ ] Labels have the correct colors (red, light blue, green)

---

## Need More Help?

- GitHub Docs: https://docs.github.com
- GitHub Community: https://github.community

