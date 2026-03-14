import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Dark mode — native-mate' }

export default function DarkModePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Dark mode</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        native-mate resolves dark/light tokens synchronously from <code className="text-zinc-300">useColorScheme()</code>,
        so there is zero flicker on mount — even on Android.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Automatic (follows system)</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Default behaviour — ThemeProvider reads the device colour scheme.
      </p>
      <CodeBlock language="tsx" code={`<ThemeProvider preset="zinc">
  {/* automatically light or dark based on system settings */}
</ThemeProvider>`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Force a mode</h2>
      <CodeBlock language="tsx" code={`// Always dark
<ThemeProvider preset="zinc" forcedColorScheme="dark">

// Always light
<ThemeProvider preset="zinc" forcedColorScheme="light">`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Let the user toggle</h2>
      <CodeBlock language="tsx" filename="ThemeContext.tsx" code={`import { useState } from 'react'
import { ThemeProvider } from '@native-mate/core'

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark' | undefined>(undefined)

  return (
    <ThemeProvider preset="zinc" forcedColorScheme={mode}>
      {children}
      {/* pass setMode down via context or state manager */}
    </ThemeProvider>
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Reading mode inside a component</h2>
      <CodeBlock language="tsx" code={`import { useTheme } from '@native-mate/core'

function MyComponent() {
  const theme = useTheme()
  const isDark = theme.colorScheme === 'dark'

  return (
    <View style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
      {/* ... */}
    </View>
  )
}`} />

      <div className="mt-8 rounded-xl border border-zinc-700 bg-zinc-900 p-5">
        <p className="text-sm font-medium text-zinc-50 mb-2">Why no flicker?</p>
        <p className="text-sm text-zinc-400">
          <code className="text-zinc-300">useColorScheme()</code> is synchronous in React Native —
          the OS colour scheme is known before the first render. ThemeProvider resolves tokens with{' '}
          <code className="text-zinc-300">useMemo</code>, so the correct theme is available
          immediately without any effect-based switching.
        </p>
      </div>
    </article>
  )
}
