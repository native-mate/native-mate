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
    surface: string         // card, input, sheet background
    surfaceRaised: string   // elevated card, popover background
    border: string          // dividers, outlines, input borders
    primary: string         // brand/action colour
    onPrimary: string       // text/icons on primary
    foreground: string      // primary text
    onBackground: string    // content on the page background
    onSurface: string       // content on surface backgrounds
    muted: string           // secondary text, placeholders
    destructive: string     // errors, delete actions
    onDestructive: string   // text/icons on destructive
    success: string         // success states
    onSuccess: string       // text/icons on success
    warning: string         // warning states
    onWarning: string       // text/icons on warning
    info: string            // informational states
    onInfo: string          // text/icons on info
    overlay: string         // modal/sheet backdrop scrim
    input: string           // input field background
    ring: string            // focus ring
  }
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 }
  radius: { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 }
  typography: {
    size: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 30 }
    weight: { regular: '400', medium: '500', semibold: '600', bold: '700' }
    lineHeight: { tight: 18, normal: 22, relaxed: 28 }  // absolute px
    family?: {                                          // optional custom font families
      regular, medium, semibold, bold                   //   one family per weight
      mono?: string                                     //   optional code/tabular face
    }
  }
  animation: {
    speed: { fast: 150, normal: 250, slow: 400 }         // ms
    easing: {
      standard:   [0.4, 0.0, 0.2, 1]
      decelerate: [0.0, 0.0, 0.2, 1]
      spring:     { damping: 15, stiffness: 200, mass: 1 }
    }
  }
  colorScheme: 'light' | 'dark'
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

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">Typography</h2>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">size</code>, <code className="text-zinc-300">weight</code>,
        and <code className="text-zinc-300">lineHeight</code> always exist.{' '}
        <code className="text-zinc-300">family</code> is optional and only present when an app themes
        its fonts — see{' '}
        <a href="/docs/custom-tokens" className="text-blue-400 hover:text-blue-300">custom tokens</a>.
        Because it may be absent, read weights through{' '}
        <code className="text-zinc-300">fontStyle(theme.typography, &apos;semibold&apos;)</code>,
        which returns <code className="text-zinc-300">{'{ fontFamily }'}</code> when a family is
        themed and <code className="text-zinc-300">{'{ fontWeight }'}</code> when it is not.
      </p>

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Monospace text</h3>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">typography.family.mono</code> is the themeable monospace
        face, used for code spans, hex fields, and tabular figures. It is optional, so never read it
        directly — call <code className="text-zinc-300">monoFontFamily(theme.typography)</code>,
        which returns the themed face when a brand set one and falls back to the platform default
        (<code className="text-zinc-300">Menlo</code> on iOS,{' '}
        <code className="text-zinc-300">monospace</code> on Android) when it did not.
      </p>
      <CodeBlock language="tsx" code={`import { monoFontFamily, useTheme } from '@native-mate/core'

function Hex({ value }: { value: string }) {
  const theme = useTheme()
  return (
    <Text style={{ fontFamily: monoFontFamily(theme.typography), color: theme.colors.foreground }}>
      {value}
    </Text>
  )
}`} />
      <div className="mt-4 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 text-sm text-amber-300">
        <strong>Do not hardcode <code className="text-amber-200">&apos;monospace&apos;</code>.</strong>{' '}
        In a white-label app a font literal is a branding bug — the brand can never override it. The{' '}
        <code className="text-amber-200">audit-fonts</code> CI gate rejects{' '}
        <code className="text-amber-200">fontFamily</code> literals in registry components for
        exactly this reason.
      </div>

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
