# native-mate

A production-grade React Native + Expo UI component library inspired by shadcn/ui. Copy components directly into your project, own the code, and never fight a library again.

> **Status:** v1.0 — 28 components, CLI, docs site, MCP server, VS Code extension
>
> [![npm core](https://img.shields.io/npm/v/@native-mate/core?label=core)](https://www.npmjs.com/package/@native-mate/core) [![npm cli](https://img.shields.io/npm/v/@native-mate/cli?label=cli)](https://www.npmjs.com/package/@native-mate/cli) [![npm mcp](https://img.shields.io/npm/v/@native-mate/mcp?label=mcp)](https://www.npmjs.com/package/@native-mate/mcp)

---

## What it is

native-mate gives you 30 fully-typed, themeable React Native components that you copy into your own codebase via a CLI. There's no runtime dependency to update — you own the source. The token system supports four built-in presets (zinc, slate, rose, midnight) with full dark mode.

```bash
npx @native-mate/cli init
npx @native-mate/cli add button card input
```

---

## Packages

| Package | npm | Description |
|---|---|---|
| [`@native-mate/core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@native-mate/core)](https://www.npmjs.com/package/@native-mate/core) | Token system, theme provider, `makeStyles`, `useTheme`, `useBreakpoint` |
| [`@native-mate/cli`](./packages/cli) | [![npm](https://img.shields.io/npm/v/@native-mate/cli)](https://www.npmjs.com/package/@native-mate/cli) | CLI — `init`, `add`, `list`, `upgrade` commands |
| [`@native-mate/mcp`](./packages/mcp) | [![npm](https://img.shields.io/npm/v/@native-mate/mcp)](https://www.npmjs.com/package/@native-mate/mcp) | MCP server for Claude and Cursor integration |
| [`packages/registry`](./packages/registry) | — | Component source + registry build script |
| [`packages/vscode-extension`](./packages/vscode-extension) | — | VS Code extension — add components from the command palette |
| [`docs`](./docs) | — | Next.js documentation site ([live](https://native-mate.vercel.app)) |

---

## Components

**Primitives:** Button, Text, Icon, Spinner, Separator

**Forms:** Input, Textarea, Checkbox, Radio, Switch, Slider, Select, OTP Input

**Layout:** Card, Accordion, Tabs, Screen

**Display:** Badge, Avatar, Tag, Empty State, Alert

**Overlay:** Sheet, Modal, Action Sheet, Toast, Tooltip, Popover

**Feedback:** Progress, Skeleton

---

## Getting started

### Prerequisites

- Node 18+
- Expo SDK 51+ or bare React Native 0.74+
- `react-native-reanimated` ^3.0

### Install the core package

```bash
npm install @native-mate/core
```

Wrap your app in the theme provider:

```tsx
import { ThemeProvider } from '@native-mate/core'

export default function App() {
  return (
    <ThemeProvider preset="zinc">
      <YourApp />
    </ThemeProvider>
  )
}
```

### Add components via CLI

```bash
# Set up native-mate in your project
npx @native-mate/cli init

# Add individual components
npx @native-mate/cli add button
npx @native-mate/cli add card input badge

# Upgrade components to latest
npx @native-mate/cli upgrade
```

Components are written into your project (default: `components/ui/`). You own the code.

---

## Theming

Four built-in presets — pass any to `ThemeProvider`:

```tsx
<ThemeProvider preset="zinc">   // dark zinc — default
<ThemeProvider preset="slate">  // dark blue-grey
<ThemeProvider preset="rose">   // dark with rose accent
<ThemeProvider preset="midnight"> // deep black with purple accent
```

Override individual tokens:

```tsx
<ThemeProvider preset="zinc" overrides={{ colors: { primary: '#6366f1' } }}>
```

Use `makeStyles` for component styles that respond to the theme:

```tsx
import { makeStyles } from '@native-mate/core'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
  },
}))
```

---

## MCP Server (Claude + Cursor)

Install once and Claude / Cursor can list, search, and scaffold native-mate components for you.

**Claude Desktop** — add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

**Cursor** — add `.cursor/mcp.json` to your project root:

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

**Claude Code:**

```bash
claude mcp add native-mate npx @native-mate/mcp
```

Available tools: `list_components`, `get_component`, `search_components`, `generate_theme_config`, `get_add_command`

---

## Monorepo development

```bash
# Install all deps
npm install

# Build everything
npm run build

# Run all tests
npm run test

# Type-check everything
npm run lint

# Run docs site locally
cd docs && npm run dev

# Run Storybook
cd apps/storybook && npm run storybook
```

Built with [Turborepo](https://turbo.build). Each package builds independently; `turbo` handles the dependency order.

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full guide covering Vercel (docs + registry), npm (packages), VS Code Marketplace (extension), and Figma Community (plugin).

---

## License

MIT
