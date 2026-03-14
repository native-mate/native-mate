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
npx native-mate init`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Existing project</h2>
      <CodeBlock language="bash" code={`# If you don't have reanimated yet
npm install react-native-reanimated react-native-safe-area-context

# Init native-mate
npx native-mate init`} />

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
