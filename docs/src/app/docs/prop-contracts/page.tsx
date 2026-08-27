import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Prop contracts — native-mate' }

export default function PropContractsPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Prop contracts</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Before v0.5 these shapes differed per component: <code className="text-zinc-300">error</code>{' '}
        was a string in Input but boolean + <code className="text-zinc-300">errorMessage</code> in
        OtpInput; haptics were a union in Button, a boolean elsewhere, and bespoke names like{' '}
        <code className="text-zinc-300">hapticOnFocus</code> in others. v0.5 standardises all three
        in <code className="text-zinc-300">@native-mate/core</code>.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">The types</h2>
      <CodeBlock language="ts" code={`/** A string renders as the message; \`true\` sets error styling with no text. */
type ErrorProp = string | boolean

type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

/** \`false\` disables; \`true\` means 'light'. */
type HapticProp = boolean | HapticStyle

/** Always a node — never a string. Components own their own default icons. */
type IconProp = React.ReactNode`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">error</h2>
      <CodeBlock language="ts" code={`function resolveError(error?: ErrorProp): { hasError: boolean; message?: string }

resolveError('Email is required')  // { hasError: true,  message: 'Email is required' }
resolveError(true)                 // { hasError: true }
resolveError('')                   // { hasError: false, message: '' }
resolveError(false)                // { hasError: false }
resolveError(undefined)            // { hasError: false }`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        One prop covers both cases: a string is the message to render, and{' '}
        <code className="text-zinc-300">true</code> turns on error styling without any text — for a
        field inside a form that shows its errors in one place.
      </p>
      <CodeBlock language="tsx" code={`<Input error="Email is required" />   {/* red border + message */}
<Input error />                       {/* red border, no message */}
<Input />                             {/* normal */}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">haptic</h2>
      <CodeBlock language="ts" code={`function resolveHaptic(haptic?: HapticProp): 'light' | 'medium' | 'heavy' | null

resolveHaptic()          // 'light'  — the default
resolveHaptic(true)      // 'light'
resolveHaptic('medium')  // 'medium'
resolveHaptic(false)     // null — don't fire
resolveHaptic('none')    // null — don't fire`} />
      <CodeBlock language="tsx" code={`<Button haptic="heavy">Delete</Button>
<Button haptic={false}>Silent</Button>`} />

      <h3 className="mt-6 mb-2 text-base font-semibold text-zinc-200">App-wide kill switch</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Passing <code className="text-zinc-300">haptic={'{false}'}</code> at every call site
        doesn&apos;t scale, so ThemeProvider carries a single switch — for accessibility, battery, or
        a brand that simply doesn&apos;t want them:
      </p>
      <CodeBlock language="tsx" code={`<ThemeProvider preset="zinc" haptics={false}>
  <RootNavigator />
</ThemeProvider>`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        Every component routes its feedback through{' '}
        <code className="text-zinc-300">useHaptics()</code>, which reads that switch. Use it in your
        own components too:
      </p>
      <CodeBlock language="tsx" code={`import { useHaptics } from '@native-mate/core'

interface HapticsApi {
  /** Fires the resolved style unless haptics are disabled app-wide. */
  trigger: (haptic?: HapticProp) => void
  /** Notification-style feedback for success/error/warning outcomes. */
  notify: (type: 'success' | 'error' | 'warning') => void
  enabled: boolean
}

function SubmitRow({ haptic }: { haptic?: HapticProp }) {
  const haptics = useHaptics()

  const onSubmit = async () => {
    haptics.trigger(haptic)          // no-op when haptics={false}
    const ok = await save()
    haptics.notify(ok ? 'success' : 'error')
  }

  return <Button onPress={onSubmit}>Save</Button>
}`} />
      <p className="mt-3 text-sm text-zinc-400">
        <code className="text-zinc-300">expo-haptics</code> is an optional peer — when it
        isn&apos;t installed, <code className="text-zinc-300">trigger</code> and{' '}
        <code className="text-zinc-300">notify</code> quietly do nothing.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">icon</h2>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">IconProp</code> is{' '}
        <code className="text-zinc-300">React.ReactNode</code> — never a string. String icon names
        were cast to <code className="text-zinc-300">any</code> and handed to Ionicons, which locked
        every caller into one icon set. Components own their own default icons internally; when you
        pass one, you pass an element from whatever set you use.
      </p>
      <CodeBlock language="tsx" code={`// Before
<Button icon="star" />

// After
<Button iconLeft={<Ionicons name="star" size={16} color="#fff" />} />`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">iconOnly needs a label</h2>
      <p className="mb-3 text-sm text-zinc-400">
        An icon-only button renders no text, so{' '}
        <code className="text-zinc-300">accessibilityLabel</code> is the only accessible name a
        screen reader can announce. Without one it says &ldquo;button&rdquo; and nothing else.
      </p>
      <CodeBlock language="ts" code={`interface ButtonIconOnlyProps extends ButtonBaseProps {
  iconOnly: true
  accessibilityLabel: string     // required by the discriminated union
}

interface ButtonLabelledProps extends ButtonBaseProps {
  iconOnly?: false
  accessibilityLabel?: string
}

type ButtonProps = ButtonIconOnlyProps | ButtonLabelledProps`} />
      <p className="mt-3 text-sm text-zinc-400">
        The union enforces it at compile time, and Button <em>also</em> warns at runtime in dev. Both
        halves are needed: native-mate&apos;s first production consumer is JavaScript, where a
        type-level guarantee is completely invisible. Any rule the library wants to actually
        guarantee gets a runtime check as well.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Deprecations</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Deprecated</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Replacement</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Codemod</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['errorMessage', 'error', 'automatic'],
              ['hapticOnFocus', 'haptic', 'automatic'],
              ['hapticOnDrag', 'haptic', 'automatic'],
              ['hapticOnPress', 'haptic', 'automatic'],
              ['icon="<string>"', 'icon={<Node />}', 'flagged, manual'],
            ].map(([oldProp, newProp, codemod], i) => (
              <tr key={oldProp} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{oldProp}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-300">{newProp}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{codemod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        The old props still work. Each one warns <strong>once per prop per session</strong> in dev
        only — a 200-row list emits one line, not two hundred — and all of them are removed in{' '}
        <strong>v0.6</strong>.
      </p>
      <CodeBlock language="text" code={`[native-mate] \`errorMessage\` is deprecated and will be removed in v0.6. Use \`error\`. Run: npx @native-mate/cli migrate v0.5`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Migrating</h2>
      <CodeBlock language="bash" code={`# preview the changes
npx @native-mate/cli migrate v0.5 --dry

# apply them
npx @native-mate/cli migrate v0.5`} />
      <p className="mt-3 text-sm text-zinc-400">
        The codemod renames the deprecated attributes in place across your{' '}
        <code className="text-zinc-300">.ts/.tsx/.js/.jsx</code> files. String-valued{' '}
        <code className="text-zinc-300">icon</code> props can&apos;t be rewritten safely — the
        replacement is a JSX element whose icon set the codemod can&apos;t pick for you — so those
        are reported for a manual edit instead.
      </p>
    </article>
  )
}
