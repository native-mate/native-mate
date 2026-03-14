# Deployment Guide

This project has five things to deploy, each going to a different platform. Do them in order — the registry URL must be live before you publish npm packages, because the CLI and MCP server fetch from it.

---

## 1. Docs Site + Registry (Vercel)

The Next.js docs site and the built registry JSON both live on Vercel.

**Account:** vercel.com — free Hobby tier is enough to start.

**Steps:**

1. Push this repo to GitHub (github.com → New repository → push).
2. Go to vercel.com → Add New Project → Import your GitHub repo.
3. Vercel auto-detects Next.js. Set the **Root Directory** to `docs`.
4. Under **Build & Output Settings**, override the build command to:
   ```
   cd .. && npm run build --workspace=packages/registry && cd docs && next build
   ```
   This builds the registry JSON into `packages/registry/dist/registry/` before Next.js builds.
5. Add an environment variable: `NODE_ENV=production`
6. Click Deploy.

**After deploy**, your site is at `https://your-project.vercel.app`. Set a custom domain (e.g. `native-mate.dev`) in Vercel → Domains.

**Serve the registry from Vercel:**
The registry JSON files at `packages/registry/dist/registry/` need to be publicly accessible. The simplest way is to copy them into `docs/public/registry/` as part of the build. Add this to `docs/package.json`:

```json
"build": "node scripts/copy-registry.js && next build"
```

Create `docs/scripts/copy-registry.js`:
```js
const fs = require('fs')
const path = require('path')
const src = path.join(__dirname, '../../packages/registry/dist/registry')
const dest = path.join(__dirname, '../public/registry')
fs.cpSync(src, dest, { recursive: true })
```

Registry will then be accessible at `https://native-mate.dev/registry/button/latest.json`.

Update the registry URL in:
- `packages/cli/src/registry/client.ts`
- `packages/mcp/src/index.ts`
- `packages/figma-plugin/manifest.json` (allowedDomains)

---

## 2. npm Packages

Packages to publish: `@native-mate/core`, `@native-mate/cli`, `@native-mate/mcp`, `@native-mate/framer`

**Account:** npmjs.com → Sign up → create an org called `native-mate` (or use a personal scope like `@yourname`).

**One-time setup:**
```bash
npm login
# Enter your npm username, password, email
```

**Build and publish each package:**
```bash
# Build everything first
npm run build

# Publish core
cd packages/core
npm publish --access public

# Publish CLI
cd ../cli
npm publish --access public

# Publish MCP server
cd ../mcp
npm publish --access public

# Publish Framer components
cd ../framer
npm publish --access public
```

**Version bumping** (before each release):
```bash
# Patch release (bug fixes): 0.1.0 → 0.1.1
npm version patch

# Minor release (new features): 0.1.0 → 0.2.0
npm version minor
```

**After publishing**, users can install via:
```bash
npx @native-mate/cli init
npm install @native-mate/core
```

---

## 3. VS Code Extension (VS Code Marketplace)

**Account:** marketplace.visualstudio.com → Sign in with a Microsoft account → Create a publisher named `native-mate`.

You also need an Azure DevOps organization to generate a Personal Access Token (PAT):

1. Go to dev.azure.com → create a free organization.
2. Click your avatar → Personal Access Tokens → New Token.
3. Scope: **Marketplace → Manage**. Copy the token.

**Install the packaging tool:**
```bash
npm install -g @vscode/vsce
```

**Package and publish:**
```bash
cd packages/vscode-extension

# Build first
npm run build

# Login with your PAT
vsce login native-mate
# Paste your PAT when prompted

# Package into a .vsix file (for testing)
vsce package

# Publish to marketplace
vsce publish
```

**Test locally before publishing:**
In VS Code: press `Ctrl+Shift+P` → "Extensions: Install from VSIX" → select the `.vsix` file.

The extension will appear at: `marketplace.visualstudio.com/items?itemName=native-mate.native-mate`

---

## 4. Figma Plugin (Figma Community)

**Account:** figma.com — any free account works. You publish plugins through the Figma desktop app.

**Build the plugin:**
```bash
cd packages/figma-plugin
npm run build
# Outputs: dist/code.js and dist/ui.html
```

**Test locally first:**
1. Open Figma desktop app.
2. Main menu → Plugins → Development → Import plugin from manifest.
3. Select `packages/figma-plugin/manifest.json`.
4. Run it from Plugins → Development → native-mate.

**Publish to Figma Community:**
1. Open the plugin in development mode (step above).
2. Right-click the plugin → Publish.
3. Fill in name, description, cover image (1920×960px recommended).
4. Click Publish. It goes through a review (usually 1–3 days).

**Update the plugin ID** in `manifest.json` once Figma assigns a real ID after publishing.

---

## 5. MCP Server (npm + manual config)

The MCP server is distributed as an npm package (`@native-mate/mcp`) and users run it locally. No separate server hosting needed.

**Users add it to Claude Desktop** by editing `~/Library/Application Support/Claude/claude_desktop_config.json`:
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

**Users add it to Cursor** via `.cursor/mcp.json` in their project:
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

The `mcp.config.json` already in the repo root is a ready-to-use template for this.

---

## Deployment Order

```
1. Push repo to GitHub
2. Deploy docs + registry to Vercel  ← registry URL must be live first
3. Update registry URL in cli/mcp/figma-plugin source
4. npm publish: core → cli → mcp → framer
5. vsce publish (VS Code extension)
6. Publish Figma plugin via desktop app
```

---

## Domain Setup (optional but recommended)

Buy `native-mate.dev` on Namecheap, Cloudflare, or Google Domains (~$10/year). Then:

- In Vercel → your project → Domains → Add `native-mate.dev`
- Vercel gives you DNS records to add at your registrar
- After propagation (up to 24h), your site and registry are live at the custom domain

Registry endpoints will then be:
```
https://native-mate.dev/registry/{component}/latest.json
https://native-mate.dev/registry/{component}/{version}.json
```
