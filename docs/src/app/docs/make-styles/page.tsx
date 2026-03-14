import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'makeStyles — native-mate' }

export default function MakeStylesPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">makeStyles</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        The canonical way to define themed styles. Called at module level, returns a hook that
        calls <code className="text-zinc-300">StyleSheet.create()</code> once per theme change.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Signature</h2>
      <CodeBlock language="ts" code={`function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: ResolvedTheme) => T
): () => T`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="tsx" code={`import { makeStyles, useTheme } from '@native-mate/core'

// 1. Call at module level
const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.foreground,
    lineHeight: theme.typography.lineHeight.normal,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
}))

// 2. Call the hook inside the component
function MyScreen() {
  const styles = useStyles() // memoised — only recreated when theme changes

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Why not inline StyleSheet.create?</h2>
      <div className="space-y-3 text-sm text-zinc-400">
        <p>
          <code className="text-zinc-300">StyleSheet.create()</code> called inside a component
          re-runs on every render. <code className="text-zinc-300">makeStyles</code> wraps it in{' '}
          <code className="text-zinc-300">useMemo</code>, so the style object is only recreated when
          the resolved theme actually changes (dark/light switch or preset change).
        </p>
        <p>
          It also keeps all style definitions co-located with the component in a readable factory
          pattern, with full type inference from token keys.
        </p>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Accessing theme alongside styles</h2>
      <CodeBlock language="tsx" code={`function MyComponent() {
  const styles = useStyles()
  const theme = useTheme() // if you need theme values directly

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      ...
    </View>
  )
}`} />
    </article>
  )
}
