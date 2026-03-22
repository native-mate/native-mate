# @native-mate/cli

CLI tool for [native-mate](https://github.com/native-mate/native-mate) — add production-ready React Native components to your project.

## Install

No install needed. Run via npx:

```bash
npx @native-mate/cli init
```

## Commands

### `init`

Set up native-mate in your project. Prompts for preset and components directory, installs `@native-mate/core`, creates `native-mate.json`, updates `.cursorrules`.

```bash
npx @native-mate/cli init
npx @native-mate/cli init --preset zinc --yes  # skip prompts
```

### `add`

Add components to your project. Fetches source from the registry, resolves component dependencies, installs npm deps.

```bash
npx @native-mate/cli add button
npx @native-mate/cli add button card input toast
```

Components are written to your configured directory (default: `components/ui/`). You own the code.

### `list`

Browse all available components with descriptions and categories.

```bash
npx @native-mate/cli list
```

### `upgrade`

Check for and apply component updates. Compares file hashes to detect local modifications and warns before overwriting.

```bash
npx @native-mate/cli upgrade
npx @native-mate/cli upgrade button card
```

## Config

`native-mate.json` in your project root:

```json
{
  "preset": "zinc",
  "componentsDir": "components/ui"
}
```

## Package Manager Detection

Automatically detects npm, yarn, pnpm, or bun from lockfiles and uses the correct install command.

## License

MIT
