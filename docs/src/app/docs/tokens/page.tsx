import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Token system — native-mate' }

const TOKEN_USAGE = `import { useTheme } from '@native-mate/core'
import { StyleSheet, View } from 'react-native'

function MyComponent() {
  const theme = useTheme()

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
      }}
    />
  )
}`

const MAKE_STYLES = `import { makeStyles } from '@native-mate/core'

// Called at module level — returns a hook
const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.foreground,
  },
}))

function MyComponent() {
  const styles = useStyles() // memoised per theme change
  return <View style={styles.container} />
}`

const TOKEN_SHAPE = `interface ResolvedTheme {
  colors: {
    background: string      // page/screen background
    surface: string         // card, input, overlay bg
    border: string          // dividers, outlines
    foreground: string      // primary text
    mutedForeground: string // secondary text, placeholders
    primary: string         // brand/action colour
    primaryForeground: string
    destructive: string
    destructiveForeground: string
    success: string
    successForeground: string
    warning: string
    warningForeground: string
    overlay: string         // modal scrim
    input: string
    ring: string            // focus ring
    // + more
  }
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 }
  radius: { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 }
  typography: {
    size: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 30 }
    weight: { regular: '400', medium: '500', semibold: '600', bold: '700' }
    lineHeight: { tight: 18, normal: 22, relaxed: 28 }  // absolute px
  }
  animation: {
    speed: { fast: 150, normal: 250, slow: 400 }         // ms
    easing: { standard, decelerate, spring }
  }
}`

export default function TokensPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Token system</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        native-mate uses a semantic token system. Instead of hardcoded colours, you reference tokens
        like <code className="text-zinc-300">theme.colors.primary</code> — and the correct light/dark
        value is resolved automatically.
      </p>

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">Token shape</h2>
      <p className="mb-3 text-sm text-zinc-400">Every resolved theme has this structure:</p>
      <CodeBlock language="ts" code={TOKEN_SHAPE} />

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">useTheme()</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Access the current resolved theme directly inside any component wrapped in ThemeProvider.
      </p>
      <CodeBlock language="tsx" code={TOKEN_USAGE} />

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">makeStyles()</h2>
      <p className="mb-3 text-sm text-zinc-400">
        The preferred way to define styles. Call it at module level — it returns a hook that
        calls <code className="text-zinc-300">StyleSheet.create()</code> once per theme change.
      </p>
      <CodeBlock language="tsx" code={MAKE_STYLES} />

      <div className="mt-10 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 text-sm text-amber-300">
        <strong>Note on lineHeight:</strong> Values are absolute pixels (not CSS multipliers).
        <code className="ml-1 text-amber-200">tight: 18</code>,{' '}
        <code className="text-amber-200">normal: 22</code>,{' '}
        <code className="text-amber-200">relaxed: 28</code>.
        React Native requires absolute line heights.
      </div>
    </article>
  )
}
