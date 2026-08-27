import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Installation — native-mate' }

export default function InstallationPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Installation</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        native-mate works with any React Native or Expo project. There is no npm package to install
        for components — they live in your codebase. The only runtime dependency is{' '}
        <code className="text-zinc-300">@native-mate/core</code>.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Prerequisites</h2>
      <ul className="mb-6 space-y-2 text-sm text-zinc-400 list-disc pl-5">
        <li>React Native ≥ 0.73 (New Architecture recommended)</li>
        <li>Expo SDK ≥ 51 (optional but recommended)</li>
        <li><code className="text-zinc-300">react-native-reanimated</code> ≥ 3.0</li>
        <li><code className="text-zinc-300">react-native-safe-area-context</code> ≥ 4.0 (for Screen component)</li>
        <li>TypeScript ≥ 5.0</li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">New Expo project</h2>
      <CodeBlock language="bash" code={`# Create project
npx create-expo-app my-app --template blank-typescript
cd my-app

# Install reanimated
npx expo install react-native-reanimated react-native-safe-area-context

# Init native-mate
npx @native-mate/cli init`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Existing project</h2>
      <CodeBlock language="bash" code={`# If you don't have reanimated yet
npm install react-native-reanimated react-native-safe-area-context

# Init native-mate
npx @native-mate/cli init`} />

      <div className="mt-4 rounded-lg border border-amber-900/50 bg-amber-950/30 p-4 text-sm text-amber-200/80">
        Always use the scoped package <code className="text-amber-100">@native-mate/cli</code>.
        The unscoped <code className="text-amber-100">native-mate</code> name on npm is an
        unrelated V8-bindings library — <code className="text-amber-100">npx native-mate</code> or{' '}
        <code className="text-amber-100">npm i -g native-mate</code> installs the wrong package
        and fails with <code className="text-amber-100">MODULE_NOT_FOUND</code>.
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">What init installs</h2>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">init</code> installs{' '}
        <code className="text-zinc-300">@native-mate/core</code> together with{' '}
        <code className="text-zinc-300">expo-haptics</code>. Haptics is an{' '}
        <em>optional</em> peer of core — package managers never install optional peers, and since
        v0.5 components get haptics through core&apos;s{' '}
        <code className="text-zinc-300">useHaptics()</code> rather than importing it themselves, so
        nothing else would pull it in. Installing it here means haptics work out of the box; turn
        them off app-wide with{' '}
        <code className="text-zinc-300">{'<ThemeProvider haptics={false}>'}</code>.
      </p>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">react-native-gesture-handler</code> is deliberately{' '}
        <strong className="text-zinc-200">not</strong> installed — it needs a native rebuild. It is
        only required for sheet drag-to-dismiss (and snap points) and toast swipe-to-dismiss. Without
        it, the sheet still opens and closes via its backdrop and the toast still auto-dismisses; a
        dev-only warning names the install command. Add it yourself if you want those gestures:
      </p>
      <CodeBlock language="bash" code={`npx expo install react-native-gesture-handler

# bare React Native
npm install react-native-gesture-handler`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Wrap your root with ThemeProvider</h2>
      <CodeBlock language="tsx" filename="App.tsx" code={`import { ThemeProvider } from '@native-mate/core'

export default function App() {
  return (
    <ThemeProvider preset="zinc">
      {/* your app */}
    </ThemeProvider>
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Add reanimated plugin to babel</h2>
      <p className="mb-3 text-sm text-zinc-400">Required for Reanimated to work on Android and iOS.</p>
      <CodeBlock language="js" filename="babel.config.js" code={`module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['react-native-reanimated/plugin'],
}`} />
    </article>
  )
}
