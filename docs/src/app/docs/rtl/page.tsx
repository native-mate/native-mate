import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Right-to-left — native-mate' }

export default function RTLPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Right-to-left</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Every registry component lays out correctly in Arabic, Hebrew and Farsi. Layout is handled
        by using logical style properties everywhere; the parts React Native does not mirror —
        iconography, hit slop, transforms — are handled explicitly.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">What React Native flips for you</h2>
      <p className="mb-3 text-sm text-zinc-400">
        When <code className="text-zinc-300">I18nManager.isRTL</code> is set, React Native mirrors
        the <em>logical</em> style properties automatically. Use these instead of their physical
        counterparts and layout is free:
      </p>
      <div className="mb-3 overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Use this</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Not this</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['marginStart / marginEnd', 'marginLeft / marginRight'],
              ['paddingStart / paddingEnd', 'paddingLeft / paddingRight'],
              ['borderStartWidth / borderEndWidth', 'borderLeftWidth / borderRightWidth'],
              ['borderStartColor / borderEndColor', 'borderLeftColor / borderRightColor'],
              ['start / end', 'left / right'],
            ].map(([logical, physical], i) => (
              <tr key={logical} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{logical}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{physical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">flexDirection: &apos;row&apos;</code> also reverses, so rows
        of content read in the right order without any work.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">What it does not flip</h2>
      <div className="mb-3 space-y-3 text-sm text-zinc-400">
        <p>
          <strong className="text-zinc-300">Iconography.</strong> A chevron-forward still points
          right in an RTL layout, where it means &quot;back&quot;. Glyphs are picked, not styled, so
          nothing mirrors them.
        </p>
        <p>
          <strong className="text-zinc-300">hitSlop.</strong> React Native&apos;s{' '}
          <code className="text-zinc-300">hitSlop</code> object accepts only physical{' '}
          <code className="text-zinc-300">left</code>/<code className="text-zinc-300">right</code>{' '}
          and never mirrors them.
        </p>
        <p>
          <strong className="text-zinc-300">transform translateX.</strong> A translation is a
          physical axis. A thumb that travels +20 in LTR must travel −20 in RTL.
        </p>
        <p>
          <strong className="text-zinc-300">Measured coordinates.</strong>{' '}
          <code className="text-zinc-300">measureInWindow</code>,{' '}
          <code className="text-zinc-300">onLayout</code>&apos;s{' '}
          <code className="text-zinc-300">layout.x</code>,{' '}
          <code className="text-zinc-300">nativeEvent.locationX</code> and{' '}
          <code className="text-zinc-300">gestureState.dx</code> are all measured from the physical
          left edge in every locale. Positioning driven by them stays physical on purpose.
        </p>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">The direction helpers</h2>
      <CodeBlock language="ts" code={`function isRTL(): boolean

function directionalIcon<T>(ltr: T, rtl: T): T

function useDirection(): {
  isRTL: boolean
  /** +1 in LTR, -1 in RTL — for translateX offsets and swipe distances. */
  sign: 1 | -1
  icon: <T>(ltr: T, rtl: T) => T
}`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">isRTL()</code> and{' '}
        <code className="text-zinc-300">directionalIcon()</code> are plain functions, callable
        anywhere — including in a default prop value.{' '}
        <code className="text-zinc-300">useDirection()</code> is the hook form and bundles all three
        for use inside a component.
      </p>

      <h3 className="mt-6 mb-3 text-base font-semibold text-zinc-50">Picking a directional glyph</h3>
      <CodeBlock language="tsx" code={`import { directionalIcon, useDirection } from '@native-mate/core'

// A "drill in" chevron on a list row: points the way the user reads.
<Icon name={directionalIcon('chevron-forward', 'chevron-back')} />

// A back button — as a default prop value, outside any component body.
leftIcon = directionalIcon('chevron-back', 'chevron-forward')

// Or through the hook.
function Crumb() {
  const { icon } = useDirection()
  return <Icon name={icon('chevron-forward', 'chevron-back')} />
}`} />

      <h3 className="mt-6 mb-3 text-base font-semibold text-zinc-50">Signing a translateX</h3>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">sign</code> is a plain number, so a Reanimated worklet can
        safely close over it:
      </p>
      <CodeBlock language="tsx" code={`import { useDirection } from '@native-mate/core'

function Toggle({ value }: { value: boolean }) {
  // \`sign\` is 1 in LTR, -1 in RTL.
  const { sign } = useDirection()
  const progress = useSharedValue(value ? 1 : 0)

  // translateX is a physical axis RN never mirrors, so the thumb's travel is
  // signed by hand — off sits at the start edge and on at the end edge in both
  // directions.
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * travel * sign }],
  }))

  return <Animated.View style={thumbStyle} />
}`} />
      <p className="mt-3 text-sm text-zinc-400">
        The same <code className="text-zinc-300">sign</code> applies to swipe distances: a
        dismiss gesture that travels toward the start edge is{' '}
        <code className="text-zinc-300">distance * sign</code>, so it mirrors with the layout.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Which icons flip</h2>
      <div className="mb-3 space-y-3 text-sm text-zinc-400">
        <p>
          The rule is meaning, not shape. An icon flips when it points along the axis the user
          reads; it stays put when its direction is absolute.
        </p>
      </div>
      <div className="mb-3 overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Icon</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Flips?</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Why</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Forward / back, next / previous', 'Yes', 'Reading direction — "next" must point the way the text runs'],
              ['Drill-in chevron on a row', 'Yes', 'Points into the next screen, which arrives from the end edge'],
              ['Month step in a date picker', 'Yes', 'Earlier/later maps onto the reading axis'],
              ['Vertical carets (up / down)', 'No', 'Vertical axis is unaffected by text direction'],
              ['Play, pause, skip, media transport', 'No', 'The play triangle points right in every locale'],
              ['Checkmarks, stars', 'No', 'Shapes with no direction — flipping is pure noise'],
            ].map(([icon, flips, why], i) => (
              <tr key={icon} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 text-xs text-zinc-300">{icon}</td>
                <td className={`px-4 py-3 font-mono text-xs ${flips === 'Yes' ? 'text-blue-400' : 'text-zinc-500'}`}>{flips}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">The audit-rtl gate</h2>
      <div className="mb-3 space-y-3 text-sm text-zinc-400">
        <p>
          A physical property renders perfectly in every LTR screenshot, so nothing catches it
          before a user does. <code className="text-zinc-300">audit-rtl</code> runs on every
          registry build and lint, scanning component sources for physical direction properties that
          have a logical counterpart RN would mirror. It is report-only by design — each finding
          needs a human to decide whether the property is genuinely physical, so there is no{' '}
          <code className="text-zinc-300">--fix</code>.
        </p>
        <p>Exceptions are allowlisted per file, each with a written reason. They fall into three groups:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong className="text-zinc-300">Rotated geometry</strong> — a popover arrow built from
            two adjacent borders under <code className="text-zinc-300">rotate: &apos;45deg&apos;</code>,
            or a progress ring&apos;s quadrant border colours. Mirroring one would run the arc
            backwards.
          </li>
          <li>
            <strong className="text-zinc-300">Worklet-bound edges</strong> — a tab indicator or
            floating label positioned from a measured{' '}
            <code className="text-zinc-300">layout.x</code> inside{' '}
            <code className="text-zinc-300">useAnimatedStyle</code>. Reanimated applies worklet
            styles through <code className="text-zinc-300">updateProps</code>, which does not
            resolve logical edges, so those must stay physical to animate at all.
          </li>
          <li>
            <strong className="text-zinc-300">Props that name a physical corner by contract</strong> —
            Popover&apos;s <code className="text-zinc-300">position</code>, DropdownMenu&apos;s{' '}
            <code className="text-zinc-300">align</code>, Fab&apos;s{' '}
            <code className="text-zinc-300">position</code>, SwipeableRow&apos;s{' '}
            <code className="text-zinc-300">leftActions</code>/
            <code className="text-zinc-300">rightActions</code>. The caller chose a geometric
            placement, not a reading direction.
          </li>
        </ul>
      </div>
      <CodeBlock language="bash" code={`ts-node scripts/audit-rtl.ts   # report offenders, exit 1 if any`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Note for component authors: hitSlop</h2>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">hitSlop</code> has no logical spelling — RN accepts only
        physical <code className="text-zinc-300">left</code>/
        <code className="text-zinc-300">right</code> there and never mirrors them. Symmetric slop is
        fine as-is. Asymmetric slop must be swapped by hand, because the row it leans away from has
        flipped to the other side:
      </p>
      <CodeBlock language="tsx" code={`const { isRTL } = useDirection()

// Close icon slop reaches ~44pt while biasing away from the label, so the
// main press target isn't swallowed.
const closeHitSlop = {
  top: verticalSlop,
  bottom: verticalSlop,
  left: isRTL ? awayFromLabel : towardLabel,
  right: isRTL ? towardLabel : awayFromLabel,
}`} />
      <p className="mt-3 text-sm text-zinc-400">
        Because these are <code className="text-zinc-300">hitSlop</code> objects rather than styles,{' '}
        <code className="text-zinc-300">audit-rtl</code> flags them as physical properties — the
        allowlist entry explains why they stay.
      </p>
    </article>
  )
}
