import Link from 'next/link'
import { CodeBlock } from '../CodeBlock'

const INSTALL_CMD = `npx native-mate init
npx native-mate add button card input`

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-96 rounded-full bg-zinc-800/30 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          New Architecture · Reanimated 3 · Expo SDK 54
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-zinc-50 md:text-6xl lg:text-7xl">
          React Native components
          <br />
          <span className="text-zinc-400">you actually own</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 leading-relaxed">
          Copy, paste, and customise production-grade UI components for React Native and Expo.
          No npm package to wrestle with — the code lives in your project.
        </p>

        {/* CTA buttons */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/docs/getting-started"
            className="rounded-lg bg-zinc-50 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Get started
          </Link>
          <Link
            href="/components"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50"
          >
            Browse components
          </Link>
        </div>

        {/* Code preview */}
        <div className="mx-auto max-w-lg">
          <CodeBlock language="bash" code={INSTALL_CMD} />
        </div>
      </div>
    </section>
  )
}
