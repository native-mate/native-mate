import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Accessibility — native-mate' }

export default function AccessibilityPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Accessibility</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        The contracts every registry component honours: a testable root, imperative handles where
        focus has to be driven, modal focus restoration, 44pt touch targets, and live regions that
        announce at the right urgency.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">testID and derived sub-IDs</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Every component takes <code className="text-zinc-300">testID</code> and puts it on its root.
        Interactive children derive theirs from it with a stable suffix, so one prop gives a test
        access to the whole component. When <code className="text-zinc-300">testID</code> is
        omitted, the sub-IDs are <code className="text-zinc-300">undefined</code> rather than
        partial strings:
      </p>
      <CodeBlock language="tsx" code={`<View style={styles.wrapper} testID={testID}>
  <TextInput testID={testID ? \`\${testID}-input\` : undefined} />
  <Pressable testID={testID ? \`\${testID}-clear\` : undefined} />
  <Text testID={testID ? \`\${testID}-error\` : undefined}>{errorText}</Text>
</View>`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">Collections index their children:</p>
      <CodeBlock language="tsx" code={`<Input testID="email" />
// email, email-label, email-input, email-clear, email-toggle, email-error

<OTPInput testID="otp" length={6} />
// otp, otp-input, otp-cell-0 … otp-cell-5

<SearchBar testID="q" />      // q, q-input, q-clear
<PhoneInput testID="phone" /> // phone, phone-country, phone-input
<Rating testID="stars" />     // stars, stars-star-0 …
<Stepper testID="wizard" />   // wizard, wizard-item-0 …`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Imperative refs</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Input-like components are <code className="text-zinc-300">forwardRef</code> and expose a
        typed handle, so a form can drive focus without reaching into internals:
      </p>
      <div className="mb-3 overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Component</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Handle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Methods</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Input', 'InputHandle', 'focus() · blur() · clear() · isFocused()'],
              ['Textarea', 'TextareaHandle', 'focus() · blur() · clear() · isFocused()'],
              ['SearchBar', 'SearchBarHandle', 'focus() · blur() · clear() · isFocused()'],
              ['OTPInput', 'OTPInputHandle', 'focus() · blur() · clear()'],
              ['PhoneInput', 'PhoneInputHandle', 'focus() · blur() · clear()'],
            ].map(([component, handle, methods], i) => (
              <tr key={component} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 text-xs text-zinc-300">{component}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{handle}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{methods}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CodeBlock language="tsx" code={`import { useRef } from 'react'
import { Input, type InputHandle } from '@/components/ui/input'

function LoginForm() {
  const password = useRef<InputHandle>(null)

  return (
    <>
      <Input label="Email" returnKeyType="next" onSubmitEditing={() => password.current?.focus()} />
      <Input ref={password} label="Password" secureTextEntry />
      <Button onPress={() => password.current?.clear()}>Reset</Button>
    </>
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Modal focus</h2>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">Modal</code>, <code className="text-zinc-300">Dialog</code>,{' '}
        <code className="text-zinc-300">ActionSheet</code>, <code className="text-zinc-300">Sheet</code>{' '}
        and <code className="text-zinc-300">Popover</code> all set{' '}
        <code className="text-zinc-300">accessibilityViewIsModal</code> on their container, so the
        screen reader treats everything behind them as inert.
      </p>
      <p className="mb-3 text-sm text-zinc-400">
        Each also takes <code className="text-zinc-300">returnFocusRef</code>: a ref to the control
        that opened it, usually the trigger <code className="text-zinc-300">Pressable</code>. When
        the overlay finishes closing, screen-reader focus is sent back to that control via{' '}
        <code className="text-zinc-300">AccessibilityInfo.setAccessibilityFocus</code>, instead of
        being dropped at the top of the screen.
      </p>
      <CodeBlock language="tsx" code={`function DeleteButton() {
  const trigger = useRef(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <Pressable ref={trigger} onPress={() => setOpen(true)}>
        <Text>Delete</Text>
      </Pressable>

      <Dialog
        visible={open}
        onClose={() => setOpen(false)}
        title="Delete this item?"
        returnFocusRef={trigger}
      />
    </>
  )
}`} />
      <div className="mt-4 mb-3 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 text-sm text-amber-300">
        <strong>Contract:</strong> <code className="text-amber-200">returnFocusRef</code> is
        native-only and fully guarded — a missing ref, web, or an unavailable{' '}
        <code className="text-amber-200">AccessibilityInfo.setAccessibilityFocus</code> is a silent
        no-op. It never throws and never needs a platform check at the call site.
      </div>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">Popover</code> is the exception that needs nothing: it
        already owns its trigger, so it restores focus to its own anchor by default. Pass{' '}
        <code className="text-zinc-300">returnFocusRef</code> only when the control the user actually
        pressed lives somewhere else.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Touch targets</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Small controls — a chip, a clear button, a stepper node, a tag&apos;s remove icon — are well
        under the 44pt minimum. Rather than inflate them visually, components extend the{' '}
        <em>touchable</em> area with <code className="text-zinc-300">hitSlop</code>, computed from
        the rendered size:
      </p>
      <CodeBlock language="tsx" code={`// Chips are 28–34pt tall. hitSlop extends the touchable area without
// altering the rendered size. Horizontal slop stays small so adjacent chips
// in a ChipGroup can't steal each other's taps.
const chipHitSlop = {
  top: Math.max(0, Math.ceil((44 - dims.height) / 2)),
  bottom: Math.max(0, Math.ceil((44 - dims.height) / 2)),
  left: 4,
  right: 4,
}`} />
      <p className="mt-3 text-sm text-zinc-400">
        Icon-only buttons take the other route and are genuinely sized —{' '}
        <code className="text-zinc-300">md</code> renders at 44×44 with a matching{' '}
        <code className="text-zinc-300">minHeight</code>.
      </p>
      <p className="mt-3 text-sm text-zinc-400">
        Asymmetric slop needs manual mirroring under RTL — see{' '}
        <a href="/docs/rtl" className="text-blue-400 hover:underline">Right-to-left</a>.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Live regions</h2>
      <div className="mb-3 space-y-3 text-sm text-zinc-400">
        <p>
          Urgency is chosen per message, not per component. Validation errors must interrupt
          whatever is being read; incremental progress must not.
        </p>
      </div>
      <div className="mb-3 overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">What</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Region</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Where</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Validation error text', 'assertive + role="alert"', 'Input, Textarea, OTPInput'],
              ['Step change', 'polite + role="progressbar"', 'Stepper'],
              ['Indeterminate progress', 'polite + role="progressbar"', 'Spinner'],
              ['Each OTP digit as it lands', 'polite', 'OTPInput'],
              ['Transient messages', 'polite', 'Toast, Banner'],
            ].map(([what, region, where], i) => (
              <tr key={what} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 text-xs text-zinc-300">{what}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{region}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CodeBlock language="tsx" code={`// Validation errors must announce the moment they change — an assertive
// live region interrupts so the message isn't missed.
<Text
  variant="caption"
  accessibilityLiveRegion="assertive"
  accessibilityRole="alert"
>
  {errorText}
</Text>

// A step change is informational, so it waits its turn.
{
  accessibilityRole: 'progressbar',
  accessibilityValue: { min: 0, max: lastIndex, now: safeStep },
  accessibilityLiveRegion: 'polite',
  accessibilityLabel: \`Step \${safeStep + 1} of \${steps.length}: \${label}\`,
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Icon-only buttons need a label</h2>
      <p className="mb-3 text-sm text-zinc-400">
        An icon-only button renders no text, so{' '}
        <code className="text-zinc-300">accessibilityLabel</code> is the <em>only</em> accessible
        name a screen reader can announce. <code className="text-zinc-300">ButtonProps</code> is a
        discriminated union that makes it required when{' '}
        <code className="text-zinc-300">iconOnly</code> is <code className="text-zinc-300">true</code>:
      </p>
      <CodeBlock language="ts" code={`export interface ButtonIconOnlyProps extends ButtonBaseProps {
  iconOnly: true
  accessibilityLabel: string
}

export interface ButtonLabelledProps extends ButtonBaseProps {
  iconOnly?: false
  accessibilityLabel?: string
}

export type ButtonProps = ButtonIconOnlyProps | ButtonLabelledProps`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        The type is only half of it. A compile-time guarantee is invisible to a JavaScript consumer,
        and this library has plenty — so there is a matching dev-time runtime warning, which is what
        actually protects them:
      </p>
      <CodeBlock language="tsx" code={`if (iconOnly && !accessibilityLabel) {
  devWarn(
    'button:iconOnly-without-accessibilityLabel',
    '<Button iconOnly> is missing \`accessibilityLabel\`. Screen readers announce ' +
      'it as an unlabeled button. Pass accessibilityLabel="Close" (or similar).',
  )
}`} />
      <p className="mt-3 text-sm text-zinc-400">
        <code className="text-zinc-300">devWarn</code> is exported from{' '}
        <code className="text-zinc-300">@native-mate/core</code> and warns once per key in
        development only — use it for the same class of check in your own components.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Reduced motion</h2>
      <p className="mb-8 text-sm text-zinc-400">
        <code className="text-zinc-300">ThemeProvider</code> collapses animation to instant when the
        OS reduce-motion setting is on, and every component honours it. See{' '}
        <a href="/docs/motion" className="text-blue-400 hover:underline">Motion</a>.
      </p>
    </article>
  )
}
