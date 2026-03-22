# native-mate for VS Code

Add and manage [native-mate](https://native-mate.vercel.app) React Native components directly from VS Code. No terminal needed.

## Features

### Add Components
Open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run **native-mate: Add component** to browse and install components via a searchable quick pick menu.

### Upgrade Components
Run **native-mate: Upgrade components** to check for and apply updates to your installed components.

### Theme Studio
Run **native-mate: Open Theme Studio** to preview all 4 theme presets (zinc, slate, rose, midnight) and copy the config JSON.

## Quick Start

1. Install the extension
2. Open a React Native / Expo project
3. Run `native-mate: Add component` from the command palette
4. If no `native-mate.json` exists, the extension offers to run `native-mate init` for you

## Requirements

- VS Code >= 1.85.0
- A React Native or Expo project

## What is native-mate?

native-mate is a copy-paste component library for React Native — like shadcn/ui but for mobile. 28 production-ready, animated, accessible, TypeScript-first components.

- **CLI:** `npx @native-mate/cli init` → `npx @native-mate/cli add button`
- **Core:** `npm install @native-mate/core` — theme provider, tokens, primitives
- **MCP:** Works with Claude Code and Cursor via `@native-mate/mcp`
- **Docs:** [native-mate.vercel.app](https://native-mate.vercel.app)

## npm Packages

- [@native-mate/core](https://www.npmjs.com/package/@native-mate/core) — Token system, ThemeProvider, primitives
- [@native-mate/cli](https://www.npmjs.com/package/@native-mate/cli) — CLI tool
- [@native-mate/mcp](https://www.npmjs.com/package/@native-mate/mcp) — MCP server for AI tools

## Links

- [GitHub](https://github.com/native-mate/native-mate)
- [Documentation](https://native-mate.vercel.app)
- [Components](https://native-mate.vercel.app/components)

## License

MIT
