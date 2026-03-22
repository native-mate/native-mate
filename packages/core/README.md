# @native-mate/core

Token system, theme provider, and primitive components for [native-mate](https://github.com/native-mate/native-mate).

## Install

```bash
npm install @native-mate/core
```

## Setup

Wrap your app in `ThemeProvider`:

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

## Presets

Four built-in presets: `zinc`, `slate`, `rose`, `midnight`

```tsx
<ThemeProvider preset="zinc" />       // neutral grays (default)
<ThemeProvider preset="slate" />      // cool blue-gray
<ThemeProvider preset="rose" />       // warm rose accents
<ThemeProvider preset="midnight" />   // deep dark with purple
```

## Hooks

### `useTheme()`

Access resolved tokens inside any component:

```tsx
import { useTheme } from '@native-mate/core'

function MyComponent() {
  const theme = useTheme()
  return <View style={{ backgroundColor: theme.colors.background }} />
}
```

### `makeStyles(factory)`

Create memoized, theme-aware StyleSheets:

```tsx
import { makeStyles } from '@native-mate/core'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
  },
}))
```

### `useBreakpoint()`

Responsive breakpoints: `sm` (<768), `md` (768–1023), `lg` (1024+)

```tsx
import { useBreakpoint } from '@native-mate/core'

const bp = useBreakpoint() // 'sm' | 'md' | 'lg'
```

## Token Categories

| Category | Examples |
|---|---|
| Colors | `background`, `foreground`, `primary`, `destructive`, `muted` |
| Spacing | `xs` (4), `sm` (8), `md` (12), `lg` (16), `xl` (24) |
| Radius | `sm` (6), `md` (10), `lg` (16), `full` (9999) |
| Typography | `size`, `weight`, `lineHeight` |
| Animation | `speed.fast` (150ms), `speed.normal` (250ms) |

## Overrides

```tsx
<ThemeProvider
  preset="zinc"
  overrides={{
    dark: { colors: { primary: '#6366f1' } },
  }}
>
```

## License

MIT
