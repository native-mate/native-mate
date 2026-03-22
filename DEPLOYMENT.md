# Deployment Guide

Repo: `github.com/native-mate/native-mate` (already pushed)

You can publish npm packages immediately — the GitHub raw fallback works as the registry without any hosting. The docs site and custom domain can come later.

---

## Quick Start: Publish to npm first

The CLI, MCP server, and all tools use a fallback chain:
1. `https://registry.native-mate.dev/{component}/latest.json` (custom domain — set up later)
2. `https://raw.githubusercontent.com/native-mate/native-mate/main/packages/registry/dist/registry/{component}/latest.json` (works now)

Since the registry JSON is committed to the repo, **GitHub raw serves as your registry immediately**. You can publish npm packages right now.

---

## 1. npm Packages

Packages to publish: `@native-mate/core`, `@native-mate/cli`, `@native-mate/mcp`

### Create npm org (one-time)

1. Go to npmjs.com → Sign up (or log in)
2. Click your avatar → Add Organization → name it `native-mate`
3. Free tier is fine

### Log in from terminal

```bash
npm login
# Opens browser → sign in → done
```

### Build and publish

```bash
# Build everything
npm run build

# Publish in order (core first — others depend on it)
cd packages/core
npm publish --access public

cd ../cli
npm publish --access public

cd ../mcp
npm publish --access public

```

### After publishing

Users can now run:
```bash
npx @native-mate/cli init
npx @native-mate/cli add button card input
npx @native-mate/mcp  # MCP server via npx
```

### Version bumping (before each release)

```bash
cd packages/core
npm version patch  # 0.1.0 → 0.1.1

# or for new features:
npm version minor  # 0.1.0 → 0.2.0
```

---

## 2. VS Code Extension

### Test locally first (no account needed)

```bash
# 1. Build the extension
cd packages/vscode-extension
npm run build

# 2. Install the packaging tool
npm install -g @vscode/vsce

# 3. Package into a .vsix file
vsce package --allow-missing-repository
# Creates: native-mate-0.1.0.vsix
```

Then in VS Code:
1. Press `Ctrl+Shift+P`
2. Type "Extensions: Install from VSIX"
3. Select the `.vsix` file from `packages/vscode-extension/`
4. Reload VS Code

**Test it:**
- Open any project that has a `native-mate.json` file
- Status bar should show `$(package) native-mate` on the right
- Press `Ctrl+Shift+P` → type "native-mate" → you'll see all 3 commands:
  - **native-mate: Add component** — shows a QuickPick list of all components
  - **native-mate: Upgrade components** — runs upgrade in terminal
  - **native-mate: Open Theme Studio** — opens a webview with preset picker

### Publish to VS Code Marketplace

1. Go to marketplace.visualstudio.com → Sign in with Microsoft account
2. Click "Publish extensions" → Create a publisher → name: `native-mate`
3. Go to dev.azure.com → create a free org → Avatar → Personal Access Tokens → New Token
   - Scopes: select **Marketplace → Manage**
   - Copy the token

```bash
cd packages/vscode-extension

# Login (paste your PAT when prompted)
vsce login native-mate

# Publish
vsce publish
```

Extension appears at: `marketplace.visualstudio.com/items?itemName=native-mate.native-mate`

---

## 3. MCP Server

Already covered by npm publish (step 1). No separate hosting needed — runs locally via stdio.

### Users connect it to their AI tools:

**Claude Code:**
```bash
claude mcp add native-mate -- npx -y @native-mate/mcp
```

**Claude Desktop** — edit config file:
- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "native-mate": {
      "command": "npx",
      "args": ["-y", "@native-mate/mcp"]
    }
  }
}
```

**Cursor** — create `.cursor/mcp.json` in project root:
```json
{
  "mcpServers": {
    "native-mate": {
      "command": "npx",
      "args": ["-y", "@native-mate/mcp"]
    }
  }
}
```

**Windsurf / Continue / Zed** — same format, check their MCP docs for config file location.

---

## 4. Docs Site (Vercel)

Can do this anytime — not required for launch.

1. Go to vercel.com → Add New Project → Import `native-mate/native-mate`
2. Set **Root Directory** to `docs`
3. Override **Build Command**:
   ```
   cd .. && npm install --ignore-scripts --legacy-peer-deps && npm run build --workspace=packages/registry && cd docs && next build --webpack
   ```
4. Override **Install Command**:
   ```
   cd .. && npm install --ignore-scripts --legacy-peer-deps
   ```
5. Deploy

### Serve registry from Vercel (optional)

Create `docs/scripts/copy-registry.js`:
```js
const fs = require('fs')
const path = require('path')
const src = path.join(__dirname, '../../packages/registry/dist/registry')
const dest = path.join(__dirname, '../public/registry')
if (fs.existsSync(src)) fs.cpSync(src, dest, { recursive: true })
```

Update `docs/package.json` build script:
```json
"build": "node scripts/copy-registry.js && next build --webpack"
```

Registry will then be at `https://your-project.vercel.app/registry/button/latest.json`.

### Custom domain (optional)

Buy `native-mate.dev` (~$10/year) on Cloudflare, Namecheap, or Google Domains:
- Vercel → your project → Domains → Add `native-mate.dev`
- Add the DNS records Vercel gives you at your registrar
- After propagation, update `REGISTRY` URLs in `packages/mcp/src/registry.ts` and `packages/cli/src/registry/client.ts`

---

## 5. Figma Plugin

1. Open Figma Desktop (download from figma.com/downloads)
2. Build: `cd packages/figma-plugin && npm run build`
3. In Figma: Plugins → Development → Import plugin from manifest → select `packages/figma-plugin/manifest.json`
4. Test it
5. When ready: Plugins → Development → native-mate → "..." → Publish
6. Fill in name, description, cover image (1920×960px), tags
7. Submit for review (1–3 days)
8. After approval, update `manifest.json` with the real plugin ID Figma assigns

---

## Deployment Order

```
1. npm publish: core → cli → mcp               ← do this now
2. Test VS Code extension locally via .vsix
3. vsce publish (VS Code Marketplace)
4. Deploy docs to Vercel (when ready)
5. Custom domain (when ready)
6. Figma plugin (when ready)
```

Step 1 is all you need to launch. Everything else can follow.
