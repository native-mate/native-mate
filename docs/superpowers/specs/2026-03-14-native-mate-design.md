# native-mate — Product Design Spec

**Date:** 2026-03-14
**Version:** 1.2
**Status:** Approved
**Scope:** Full product vision with Phase 1 architecture. Phases 2–5 are described at vision level; each will receive a dedicated spec before implementation begins.

---

## One-Line Pitch

The only React Native component library where every component is New Architecture native, platform-adaptive, animation-ready, fully accessible, copy-paste owned, and ships with a Figma kit that matches your code — plus an AI layer that generates, audits, and upgrades your UI.

---

## Core Philosophy

Copy-paste ownership model (inspired by shadcn/ui). Developers own the component code in their repo. Components are not black-box npm packages. The CLI is the primary distribution mechanism, but manual copy-paste is equally supported: component source files are browsable at `https://registry.native-mate.dev/components/[name]` and can be copied directly into `components/ui/` without using the CLI. The `index.json` metadata file is CLI-only and does not need to be copied manually.

---

## What We Are Not

- Not a wrapper around native platform UI kits
- Not a Material Design or Cupertino clone
- Not an npm-install-and-pray black box
- Not built on the legacy React Native bridge architecture
- Not targeting React Native Web (components target iOS and Android only; web rendering in the docs playground is best-effort via React Native Web and is not a supported deployment target)

---

## Target Developers

- Web developers moving to mobile (familiar with Tailwind/shadcn)
- React Native teams who want a design system they fully own
- Indie developers building production apps on Expo
- Design-engineering teams who need Figma-to-code parity

---

## Technical Foundation

| Decision | Choice | Rationale |
|---|---|---|
| Architecture | New Architecture only (Fabric + TurboModules) | No legacy bridge support |
| Styling | StyleSheet API + Custom Token System | Zero peer deps, every RN dev knows it, tokens are pure data |
| Animations | Reanimated 3 (peer dependency — consumer installs) | UI thread animations, no JS jank |
| Language | Full TypeScript, strict mode | Exported prop interfaces, zero `any` |
| Expo | SDK 54+ | Latest stable, tested iOS + Android |
| Monorepo | Turborepo | Industry standard for this project shape |

**No NativeWind. No Unistyles. No extra consumer configuration required beyond installing `@native-mate/core` and `react-native-reanimated`.**

---

## Package Structure

```
@native-mate/core   — npm package (token system, ThemeProvider, makeStyles, primitives)
@native-mate/cli    — npx tool (init, add, upgrade)
@native-mate/mcp    — MCP server (Claude, Cursor, VS Code Copilot)
```

**Peer dependencies for consumers:**
- `react-native-reanimated` ^3.0.0 (required — animations run on UI thread)
- `@native-mate/core` (required — token system and ThemeProvider)

Distribution model: **Hybrid**
- `@native-mate/core` ships on npm — token system, ThemeProvider, makeStyles utility, base primitives
- Complex components live in the registry, pulled via CLI — developer owns the code
- Registry hosted on GitHub raw files, served via Vercel (free tier) at `registry.native-mate.dev`

---

## Monorepo Structure

```
native-mate/
├── packages/
│   ├── core/              # @native-mate/core
│   │   └── src/
│   │       ├── tokens/    # design tokens + NativeMateConfig type
│   │       ├── theme/     # ThemeProvider, useTheme, makeStyles
│   │       ├── primitives/# Text, Icon, Spinner, Separator
│   │       └── utils/     # platform helpers, useBreakpoint hook
│   ├── cli/               # @native-mate/cli
│   │   └── src/
│   │       ├── commands/  # init, add, upgrade
│   │       └── registry/  # registry fetch + version logic
│   ├── mcp/               # @native-mate/mcp
│   │   └── src/
│   │       └── tools/     # get_component, list_components, generate_screen, etc.
│   └── registry/          # internal — component source + JSON builder
│       ├── components/    # actual component source files
│       └── scripts/       # build registry JSON, version bumper
├── apps/
│   ├── docs/              # Next.js — website + playground + marketing
│   ├── storybook/         # Expo app — Storybook for development + visual QA
│   └── preview/           # Expo app — QR code live device preview (deployed to Expo servers)
├── turbo.json
└── package.json
```

---

## Token System

All tokens are typed TypeScript constants exported from `@native-mate/core`. The `ThemeProvider` resolves light/dark at runtime using `useColorScheme()` synchronously — zero flicker on cold start. Components consume via `useTheme()` and always receive pre-resolved flat values — no conditional logic needed inside component code.

### makeStyles

`makeStyles` is a utility exported from `@native-mate/core`. It takes a factory function that receives the resolved theme tokens and returns a `StyleSheet.create()`-compatible style object. It is called outside the component render function (at module level or inside a custom hook) so styles are created once per theme, not on every render.

```ts
// Signature
function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: ResolvedTheme) => T
): () => T

// Usage in a component file
const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  label: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.medium,
  },
}))

// Inside component
const styles = useStyles()
```

### Token Categories (complete values)

```ts
colors: {
  // Semantic surface colors
  background:    { light: '#ffffff',  dark: '#0a0a0a'  },
  surface:       { light: '#f4f4f5',  dark: '#18181b'  },
  surfaceRaised: { light: '#ffffff',  dark: '#27272a'  },
  border:        { light: '#e4e4e7',  dark: '#3f3f46'  },
  // Primary action
  primary:       { light: '#18181b',  dark: '#fafafa'  },
  onPrimary:     { light: '#fafafa',  dark: '#18181b'  },
  // Text
  foreground:    { light: '#09090b',  dark: '#fafafa'  },
  onBackground:  { light: '#09090b',  dark: '#fafafa'  },
  onSurface:     { light: '#18181b',  dark: '#e4e4e7'  },
  muted:         { light: '#71717a',  dark: '#a1a1aa'  },
  // Semantic states
  destructive:   { light: '#ef4444',  dark: '#f87171'  },
  onDestructive: { light: '#ffffff',  dark: '#ffffff'  },
  success:       { light: '#22c55e',  dark: '#4ade80'  },
  onSuccess:     { light: '#ffffff',  dark: '#000000'  },
  warning:       { light: '#f59e0b',  dark: '#fbbf24'  },
  onWarning:     { light: '#ffffff',  dark: '#000000'  },
}

spacing: {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48
}

radius: {
  sm: 6, md: 10, lg: 16, xl: 24, full: 9999
}

typography: {
  size:       { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 30 },
  weight:     { regular: '400', medium: '500', semibold: '600', bold: '700' },
  // Absolute pixel values (React Native does not support unitless multipliers)
  // Values are pre-computed for the md font size (15px) as baseline
  lineHeight: { tight: 18, normal: 22, relaxed: 28 },
}

animation: {
  speed:  { fast: 150, normal: 250, slow: 400 },  // milliseconds
  easing: {
    standard:   [0.4, 0.0, 0.2, 1],   // cubic bezier
    decelerate: [0.0, 0.0, 0.2, 1],
    spring:     { damping: 15, stiffness: 200, mass: 1 },
  },
}
```

All values above are for the **Zinc** preset (default). Other presets change only the `colors` object — all other token categories are shared across presets.

### ResolvedTheme type (exported from @native-mate/core)

`ResolvedTheme` is the flat, mode-resolved version of the token system — no `{ light, dark }` objects, just direct values. This is what `useTheme()` returns and what `makeStyles` receives.

### NativeMateConfig type (exported from @native-mate/core)

```ts
export interface NativeMateTokenOverrides {
  colors?: Partial<Record<keyof TokenColors, string>>
  spacing?: Partial<typeof tokens.spacing>
  radius?: Partial<typeof tokens.radius>
  animation?: { speed?: Partial<typeof tokens.animation.speed> }
}

export interface NativeMateConfig {
  theme: 'zinc' | 'slate' | 'rose' | 'midnight'
  componentsDir: string
  registry: string
  // Optional: override individual token values on top of the chosen preset.
  // Theme Studio exports these when the user customizes beyond a preset.
  tokens?: {
    light?: NativeMateTokenOverrides
    dark?: NativeMateTokenOverrides
  }
}
```

The `tokens` override field is how Theme Studio exports custom configurations. The chosen `theme` preset provides the base; any values in `tokens` override individual tokens on top. Components and `ThemeProvider` apply overrides at runtime — no component file changes required.

### Theme Presets (v1)

| Preset | Vibe | Color basis |
|---|---|---|
| Zinc | Neutral, shadcn-familiar | Zinc/gray scale |
| Slate | Cool, professional | Blue-gray scale |
| Rose | Warm, consumer/lifestyle | Rose/pink scale |
| Midnight | Dark-first, developer tools | Dark neutral, vibrant accents |

User picks preset on `npx native-mate init`. Swappable by editing `native-mate.config.ts`. Since all component code uses semantic token names, swapping a preset changes the entire app's visual language without touching any component file.

### Breakpoints

The `useBreakpoint()` hook exported from `@native-mate/core/utils` maps device width to size classes:

```ts
breakpoints: { sm: 0, md: 768, lg: 1024 }
// sm = phones, md = tablets, lg = foldables/large tablets
```

---

## Component Architecture

Every component follows an identical structure:

```
registry/components/[name]/
├── [name].tsx          # component source (copied into user's project)
├── [name].types.ts     # exported prop interfaces
├── [name].stories.tsx  # Storybook stories (React Native format)
└── index.json          # registry metadata (version, deps, files)
```

The docs site playground does **not** consume `.stories.tsx` files directly. The playground renders components via React Native Web inside the Next.js app using a separate, minimal story format (a `preview.tsx` file per component in `apps/docs`). The Storybook app and the website playground are separate rendering targets.

### Rules (enforced across all components)

- `makeStyles(factory)` called at module level — styles created once per theme
- All Reanimated animations run on UI thread — `useAnimatedStyle`, `withSpring`, `withTiming` only
- Platform-adaptive: `Platform.OS` drives shadows, haptics, scroll physics
- Every prop interface exported and documented
- `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` present on all interactive components
- Version comment header in every installed file: `// native-mate: [component]@[version]`

### v1 Component List (25 components — definitive)

**Primitives (9):** Button, Text, Input, Textarea, Badge, Avatar, Icon, Separator, Spinner

**Layout (4):** Card, Sheet (bottom sheet), Modal, Screen (SafeAreaView wrapper with inset handling)

**Forms (6):** Checkbox, Radio, Switch, Select, Slider, OTPInput

**Feedback (4):** Toast, Alert, Progress, Skeleton

**Disclosure (2):** Tabs, Accordion

*Note: Accordion is a disclosure/layout pattern, categorized under Disclosure — not Navigation.*

---

## CLI Tool

Published as `@native-mate/cli`, invoked via `npx native-mate`. Detects package manager automatically (npm / yarn / pnpm / bun).

### Commands (v1)

```bash
npx native-mate init              # scaffold theme config + folder structure
npx native-mate add [component]   # pull component into configured components dir
npx native-mate upgrade           # check installed versions against registry
```

### init flow

1. Prompt: pick theme preset (Zinc / Slate / Rose / Midnight)
2. Prompt: components directory (default: `components/ui`)
3. Write `native-mate.config.ts` to project root
4. Auto-install `@native-mate/core` and `react-native-reanimated` via detected package manager. This is the one exception to the non-destructive CLI philosophy: these two packages are unconditionally required for any native-mate project, so installing them on `init` is unambiguous and safe.
5. Generate `.cursorrules` with: component list, import path conventions, token reference, and usage guidelines for AI tools

### add flow

1. Fetch `index.json` for component from registry
2. Check `dependencies.components` — recursively add any component dependencies not already installed
3. Check `dependencies.npm` — prompt user to install any required npm packages (CLI does not auto-install npm deps beyond core; it prints the exact install command)
4. Write component file(s) to configured `componentsDir`
5. Print version comment header on first line of each file

### upgrade flow

1. Scan all files in `componentsDir` for version comment headers (`// native-mate: [name]@[version]`)
2. Fetch current version for each detected component from registry
3. Display diff table: component name, installed version, latest version, change type (patch/minor/major)
4. For patch updates: prompt to auto-apply (rewrites file, preserves header)
5. For minor/major updates: show diff URL, require explicit confirmation per component
6. If a component file has been modified since install (detected via hash stored in header), warn before overwriting

### Registry JSON format

```json
{
  "name": "button",
  "version": "1.2.0",
  "files": [
    { "path": "button.tsx", "content": "...", "hash": "sha256:abc123" }
  ],
  "dependencies": {
    "npm": [],
    "components": []
  }
}
```

### Version comment header format

```ts
// native-mate: button@1.2.0 | hash:abc123
```

The hash is a SHA-256 of the file content **as received from the registry, before the header line is prepended**. When checking for user modifications, the `upgrade` command strips the header line from the installed file, hashes the remainder, and compares against the stored hash. This avoids a circular reference where the hash would otherwise cover the line containing itself.

### native-mate.config.ts

```ts
import type { NativeMateConfig } from '@native-mate/core'

const config: NativeMateConfig = {
  theme: 'zinc',
  componentsDir: 'components/ui',
  registry: 'https://registry.native-mate.dev',
}

export default config
```

### Registry infrastructure

- Component JSON files are source-of-truth in `packages/registry/`
- Built and deployed to Vercel on every release tag
- Served at `registry.native-mate.dev` (Vercel free tier, custom domain)
- Public, unauthenticated, read-only
- No rate limiting for v1 (Vercel CDN handles load)
- CLI falls back to GitHub raw URLs if registry domain is unreachable

---

## Docs Site (apps/docs)

Next.js app. This IS the product's face — marketing landing page, interactive playground, and developer reference unified. Deployed to Vercel.

### Routes

- `/` — marketing landing page
- `/docs/getting-started` — init, add, theming guides
- `/docs/components/[name]` — one page per component
- `/themes` — Theme Studio (visual token editor)

### Component Pages

Each component page includes:
- Live playground — renders component via React Native Web in an iframe with device frame toggle (iPhone / Android)
- Prop controls panel — real-time updates, generates code block below
- Code block — reflects current prop values, copy-paste ready
- QR code — encodes a URL to a hosted Expo Go experience with the component pre-configured using URL params; scanned on device opens the live component in Expo Go
- Bundle size, New Architecture, platform parity badges
- `npx native-mate add [component]` install snippet

### QR Code / Live Device Preview

The QR code links to a minimal hosted Expo app (`apps/preview` in the monorepo, deployed to Expo's servers). The URL encodes component name and prop values as query params. The preview app reads these params and renders the requested component. Requires Expo Go installed on the device.

### Landing Page Sections

1. Hero — pitch + `npx native-mate init` terminal animation
2. Feature grid — ownership, animations, platform-adaptive, tokens
3. Live component showcase — scroll-driven
4. Theme preset switcher — live token swap demo
5. "Built With" showcase — submitted by community via GitHub PR to a YAML registry file
6. Footer — Discord, GitHub, npm

### Theme Studio (/themes)

Visual picker for colors, typography, radius, animation speed. Live preview updates components in real time (React Native Web). Export generates a `native-mate.config.ts` file for download.

---

## Storybook (apps/storybook)

Expo app running `@storybook/react-native`. Used internally for component development and visual QA on real devices and simulators. Stories live at `registry/components/[name]/[name].stories.tsx` in React Native Storybook format.

The docs site playground uses a **separate** `preview.tsx` file per component (in `apps/docs/previews/`) that renders the component for React Native Web. These are maintained in parallel with stories but are distinct files targeting different renderers.

---

## MCP Server (@native-mate/mcp)

Official MCP server. Compatible with Claude Desktop, Claude Code, Cursor, VS Code Copilot, and any MCP-compatible client.

### Tools

```
get_component(name)
  → Fetches component file from registry.
  → If native-mate.config.ts is present in CWD, substitutes the user's configured
    theme preset name into comments and import paths.
  → If no config is found, returns the raw Zinc-preset version with a notice.
  → Error: returns { error: "Component not found" } for unknown names.

list_components()
  → Returns array of { name, description, category, version, status } for all registry components.

generate_screen(description: string)
  → Context-provision tool for AI-assisted screen generation. Does NOT invoke an LLM internally.
  → Reads native-mate.config.ts for componentsDir, theme, and token overrides.
  → Fetches the component registry manifest (names, descriptions, prop interfaces).
  → Returns a structured context object: { components, tokens, importBasePath, description }
    so the calling AI (Claude, Cursor, etc.) can generate the screen with accurate imports and tokens.
  → Error: returns { error: "No config file found" } if config is absent.

apply_theme(preset: 'zinc' | 'slate' | 'rose' | 'midnight')
  → Reads and rewrites native-mate.config.ts in CWD with the new preset value.
  → Error: returns { error: "No config file found" } if config is absent.

check_accessibility(code: string)
  → Analyzes component usage in provided code string for missing accessibilityLabel,
    accessibilityRole, and accessibilityHint on interactive elements.
  → Returns array of { line, issue, suggestion }.
```

---

## Figma Integration

*Phase 5 — dedicated spec will be written before this phase begins.*

Vision:
- Official Figma component kit — 1:1 mapping to every code component, same semantic token names
- **Figma Plugin** (installed inside Figma):
  - Browse all native-mate components
  - Copy `npx native-mate add [component]` command
  - Export current Figma variable values as `native-mate.config.ts`
  - Import token values from `native-mate.config.ts` into Figma Variables
  - Note: Figma plugin cannot write directly to filesystem. Token export/import uses clipboard or a local companion CLI command (`npx native-mate figma-sync`) that reads/writes config

---

## Framer Integration

*Phase 5 — dedicated spec will be written before this phase begins.*

Vision:
- Framer is a web-based prototyping tool; this integration is for **design prototyping only**, not production mobile deployment
- native-mate component visuals importable as Framer components using React + Framer Motion
- Animations are re-implemented in Framer Motion (Reanimated does not run in browsers)
- Token values sync from `native-mate.config.ts` into Framer via a CLI sync script
- This is explicitly a **prototyping/handoff feature**, not a runtime target

---

## Build Phases

### Phase 1 — Core Library
Token system, ThemeProvider, makeStyles, 25 v1 components, Storybook app, `@native-mate/core` published to npm.

### Phase 2 — CLI Tool
`@native-mate/cli` with `init`, `add`, `upgrade`. Registry built and deployed to Vercel. `.cursorrules` generation. `apps/preview` Expo app for QR code device previews.

### Phase 3 — Docs Site
Next.js app with component playground (React Native Web), Theme Studio, marketing landing page, component preview files (`apps/docs/previews/`).

### Phase 4 — MCP Server
`@native-mate/mcp` with all 5 tools. Published to npm. Claude + Cursor integration guides.

### Phase 5 — Design Integrations + Community
Figma kit, Figma plugin (with `npx native-mate figma-sync`), Framer integration, VS Code extension, community registry, Discord bot, weekly Component Drop cadence. Each sub-item gets its own spec.

---

## What Is Explicitly Out of Scope

- `npx native-mate audit` — removed from CLI
- `npx native-mate from-image` — removed from CLI
- Legacy React Native bridge support
- NativeWind or any utility-class styling
- Material Design / Cupertino clones
- Black-box npm component packages
- React Native Web as a supported deployment target (used internally for docs playground only)
