import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'useTheme — native-mate' }

export default function UseThemePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">useTheme</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Access the full resolved theme — colours, spacing, radius, typography, and animation — from
        any component inside ThemeProvider.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="tsx" code={`import { useTheme } from '@native-mate/core'

function PriceTag({ amount }: { amount: number }) {
  const theme = useTheme()

  return (
    <View
      style={{
        backgroundColor: theme.colors.success,
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
      }}
    >
      <Text
        style={{
          color: theme.colors.successForeground,
          fontSize: theme.typography.size.sm,
          fontWeight: theme.typography.weight.semibold,
        }}
      >
        \${amount.toFixed(2)}
      </Text>
    </View>
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Return type</h2>
      <CodeBlock language="ts" code={`interface ResolvedTheme {
  colors: Record<string, string>   // all color tokens, resolved to hex
  spacing: Record<string, number>
  radius: Record<string, number>
  typography: {
    size: Record<string, number>
    weight: Record<string, string>
    lineHeight: Record<string, number>
  }
  animation: {
    speed: { fast: number; normal: number; slow: number }
    easing: { standard: number[]; decelerate: number[]; spring: SpringConfig }
  }
  colorScheme: 'light' | 'dark'
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Rules</h2>
      <ul className="space-y-2 text-sm text-zinc-400 list-disc pl-5">
        <li>Must be called inside a component wrapped by ThemeProvider</li>
        <li>Re-renders when theme changes (dark/light or preset change)</li>
        <li>For styles, prefer <code className="text-zinc-300">makeStyles</code> — it memoises the StyleSheet</li>
        <li>Use <code className="text-zinc-300">useTheme</code> directly when you need a value conditionally (e.g. an animation colour)</li>
      </ul>
    </article>
  )
}
