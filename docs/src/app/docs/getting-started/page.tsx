import { CodeBlock } from '@/components/CodeBlock'

export const metadata = {
  title: 'Getting started — native-mate',
}

export default function GettingStartedPage() {
  return (
    <article className="prose prose-invert max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Getting started</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        native-mate is a copy-paste component system for React Native. You run a CLI command,
        the component source lands in your project, and you own it completely.
      </p>

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">Requirements</h2>
      <ul className="mb-6 space-y-1 text-sm text-zinc-400 list-disc pl-4">
        <li>React Native ≥ 0.73 (New Architecture recommended)</li>
        <li>Expo SDK ≥ 51 (optional, but recommended)</li>
        <li>react-native-reanimated ≥ 3.0</li>
        <li>TypeScript ≥ 5.0</li>
      </ul>

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">1. Init your project</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Run this from your project root. It installs <code className="text-zinc-300">@native-mate/core</code>,
        creates <code className="text-zinc-300">native-mate.json</code>, and updates your <code className="text-zinc-300">.cursorrules</code>.
      </p>
      <CodeBlock language="bash" code="npx native-mate init" />

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">2. Add your first component</h2>
      <CodeBlock language="bash" code="npx native-mate add button" />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        The component is written to <code className="text-zinc-300">components/ui/button.tsx</code> (or wherever you
        configured). No runtime imports — just source files you own completely.
      </p>

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">3. Import and use</h2>
      <CodeBlock
        language="tsx"
        filename="screens/HomeScreen.tsx"
        code={`import { Button } from '~/components/ui/button'

export function HomeScreen() {
  return (
    <Button variant="default" size="md" onPress={() => console.log('hi')}>
      Get started
    </Button>
  )
}`}
      />

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">Wrap your app in ThemeProvider</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Required once, at the root of your app. Resolves design tokens and provides them via context.
      </p>
      <CodeBlock
        language="tsx"
        filename="App.tsx"
        code={`import { ThemeProvider } from '@native-mate/core'

export default function App() {
  return (
    <ThemeProvider preset="zinc">
      <RootNavigator />
    </ThemeProvider>
  )
}`}
      />

      <div className="mt-12 rounded-xl border border-zinc-700 bg-zinc-900 p-5">
        <p className="text-sm font-medium text-zinc-50 mb-1">Next steps</p>
        <ul className="space-y-1 text-sm text-zinc-400">
          <li>→ <a href="/docs/tokens" className="text-zinc-300 hover:text-white underline">Read about the token system</a></li>
          <li>→ <a href="/components" className="text-zinc-300 hover:text-white underline">Browse all 28 components</a></li>
          <li>→ <a href="/themes" className="text-zinc-300 hover:text-white underline">Try the Theme Studio</a></li>
        </ul>
      </div>
    </article>
  )
}
