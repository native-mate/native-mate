import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Color utilities — native-mate' }

export default function ColorsPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Color utilities</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Two small functions for the colours a theme can&apos;t predict:{' '}
        <code className="text-zinc-300">withAlpha</code> to tint any colour safely, and{' '}
        <code className="text-zinc-300">readableOn</code> to pick legible text on an arbitrary
        runtime fill.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">withAlpha</h2>
      <CodeBlock language="ts" code={`function withAlpha(color: string, alpha: number): string`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        Applies an alpha channel to any CSS-ish colour a theme token might hold, and always returns
        an <code className="text-zinc-300">rgba()</code> string. <code className="text-zinc-300">alpha</code>{' '}
        is clamped to 0–1 and multiplied by any alpha the input already carried.
      </p>

      <h3 className="mt-6 mb-2 text-base font-semibold text-zinc-200">Why not string concatenation</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Components used to write <code className="text-zinc-300">theme.colors.primary + &apos;15&apos;</code>.
        That works only if the token happens to be a 6-digit hex — the moment a brand override
        supplies <code className="text-zinc-300">rgb()</code>, a named colour, or an 8-digit hex, it
        silently produces garbage that React Native renders as something arbitrary.
      </p>
      <CodeBlock language="ts" code={`// Before — breaks on anything that isn't 6-digit hex
'#18181b'            + '15'  // '#18181b15'            ok
'rgb(24, 24, 27)'    + '15'  // 'rgb(24, 24, 27)15'    garbage
'rebeccapurple'      + '15'  // 'rebeccapurple15'      garbage
'#18181bcc'          + '15'  // '#18181bcc15'          garbage

// After — one code path, always valid
withAlpha('#18181b',         0.08)  // 'rgba(24, 24, 27, 0.08)'
withAlpha('rgb(24, 24, 27)', 0.08)  // 'rgba(24, 24, 27, 0.08)'
withAlpha('#18181bcc',       0.5)   // 'rgba(24, 24, 27, 0.4)'  — existing alpha respected`} />

      <h3 className="mt-6 mb-2 text-base font-semibold text-zinc-200">Accepted inputs</h3>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Format</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Example</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['3-digit hex', '#abc'],
              ['4-digit hex (with alpha)', '#abcd'],
              ['6-digit hex', '#18181b'],
              ['8-digit hex (with alpha)', '#18181bcc'],
              ['rgb()', 'rgb(24, 24, 27)'],
              ['rgba()', 'rgba(24, 24, 27, 0.5)'],
              ['named', 'black, white, red, green, blue, gray/grey, transparent'],
            ].map(([format, example], i) => (
              <tr key={format} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 text-xs text-zinc-400">{format}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-zinc-400">
        Anything it can&apos;t parse — an exotic named colour, say — is handed back unchanged rather
        than turned into something wrong. The colour stays correct, just opaque.
      </p>

      <CodeBlock language="tsx" code={`import { withAlpha, useTheme } from '@native-mate/core'

function Ripple() {
  const theme = useTheme()
  // Plain string, computed outside the worklet.
  const rippleColor = withAlpha(theme.colors.primary, 0.15)
  return <Animated.View style={{ backgroundColor: rippleColor }} />
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">readableOn</h2>
      <CodeBlock language="ts" code={`function readableOn(background: string): string  // '#111111' | '#ffffff'`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        Computes the WCAG relative luminance of the background and returns near-black{' '}
        <code className="text-zinc-300">#111111</code> above the standard{' '}
        <code className="text-zinc-300">0.179</code> threshold, near-white{' '}
        <code className="text-zinc-300">#ffffff</code> below it. An unparseable background is assumed
        dark — the common case for accent colours — so light text is kept.
      </p>

      <div className="mb-4 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 text-sm text-amber-300">
        <strong>When to use it — and when not to.</strong> Themed surfaces always use their paired
        token: <code className="text-amber-200">primary</code> pairs with{' '}
        <code className="text-amber-200">onPrimary</code>,{' '}
        <code className="text-amber-200">destructive</code> with{' '}
        <code className="text-amber-200">onDestructive</code>, and so on. Those pairs are chosen by
        the theme author and are always the right answer for a themed fill.{' '}
        <code className="text-amber-200">readableOn</code> is only for fills the theme has never seen
        — a caller-supplied Button <code className="text-amber-200">color</code>, a Switch track
        tint, a per-item Chip colour — because no <code className="text-amber-200">on*</code> token
        can cover a colour that doesn&apos;t exist until runtime.
      </div>

      <CodeBlock language="tsx" code={`import { readableOn, useTheme } from '@native-mate/core'

// Button's real label-colour rule:
// tint the transparent variants, contrast-pick a caller-supplied fill,
// and fall back to the variant's paired on* token otherwise.
const textColor = color
  ? (variant === 'outline' || variant === 'ghost' || variant === 'link'
      ? color
      : readableOn(color))
  : theme.colors[labelColorMap[variant]]`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Lower-level exports</h2>
      <CodeBlock language="ts" code={`function relativeLuminance(color: string): number | null
function parseColor(color: string): [number, number, number, number] | null`} />
      <ul className="mt-3 space-y-2 text-sm text-zinc-400 list-disc pl-5">
        <li>
          <code className="text-zinc-300">relativeLuminance</code> — WCAG relative luminance in{' '}
          <code className="text-zinc-300">0..1</code>, or <code className="text-zinc-300">null</code>{' '}
          if the colour can&apos;t be parsed. Useful for your own contrast thresholds, or for
          deciding between more than two foregrounds.
        </li>
        <li>
          <code className="text-zinc-300">parseColor</code> — the shared parser behind both
          utilities. Returns <code className="text-zinc-300">[r, g, b, a]</code> with channels in{' '}
          <code className="text-zinc-300">0..255</code> and alpha in{' '}
          <code className="text-zinc-300">0..1</code>, or <code className="text-zinc-300">null</code>{' '}
          for input it doesn&apos;t recognise.
        </li>
      </ul>
    </article>
  )
}
