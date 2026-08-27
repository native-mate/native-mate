import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Motion — native-mate' }

export default function MotionPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Motion</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        One place for every component to ask &ldquo;may I animate, and how fast?&rdquo;.{' '}
        <code className="text-zinc-300">useMotion()</code> reads durations from the theme&apos;s
        animation tokens and honours the OS reduce-motion setting automatically.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Signature</h2>
      <CodeBlock language="ts" code={`function useMotion(): Motion

interface Motion {
  /** OS reduce-motion is on: skip infinite loops, render final states. */
  reduced: boolean
  /** Timing config for a speed token — duration 0 when motion is reduced. */
  timing: (speed?: SpeedKey) => { duration: number }
  /** Spring config from tokens — near-instant when motion is reduced. */
  spring: () => { damping: number; stiffness: number; mass: number }
  /** Repeat count for looping animations: 1 (single pass) when reduced, else -1. */
  loops: (count?: number) => number
}

type SpeedKey = 'fast' | 'normal' | 'slow'`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">What each call returns</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Call</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Normal</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Reduced motion</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["timing('fast')", '{ duration: theme.animation.speed.fast }', '{ duration: 0 }'],
              ["timing()", "defaults to 'normal'", '{ duration: 0 }'],
              ['spring()', 'theme.animation.easing.spring', '{ damping: 100, stiffness: 1000, mass: 0.1 }'],
              ['loops(-1)', '-1 (infinite)', '1 (single pass)'],
              ['loops(3)', '3', '1'],
              ['reduced', 'false', 'true'],
            ].map(([call, normal, reduced], i) => (
              <tr key={call} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{call}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{normal}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{reduced}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Durations come from tokens</h2>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">timing()</code> is a thin read of{' '}
        <code className="text-zinc-300">theme.animation.speed</code>, and{' '}
        <code className="text-zinc-300">spring()</code> returns{' '}
        <code className="text-zinc-300">theme.animation.easing.spring</code>. Retheming the speed
        tokens retimes every animation in the registry at once:
      </p>
      <CodeBlock language="ts" code={`// preset defaults
animation: {
  speed:  { fast: 150, normal: 250, slow: 400 },
  easing: {
    standard:   [0.4, 0.0, 0.2, 1],
    decelerate: [0.0, 0.0, 0.2, 1],
    spring:     { damping: 15, stiffness: 200, mass: 1 },
  },
}`} />
      <p className="mt-3 text-sm text-zinc-400">
        <code className="text-zinc-300">animation.speed</code> is overridable through
        ThemeProvider&apos;s <code className="text-zinc-300">overrides</code>; easing is not.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Reduced motion</h2>
      <div className="space-y-3 text-sm text-zinc-400">
        <p>
          ThemeProvider reads the OS reduce-motion setting and, when it is on, runs the resolved
          theme through <code className="text-zinc-300">collapseMotion()</code> — which sets{' '}
          <code className="text-zinc-300">{'animation.speed = { fast: 0, normal: 0, slow: 0 }'}</code>.
          Because every timing-based animation in the registry reads its duration from those tokens,
          zeroing them makes the whole library instant with no per-component work.
        </p>
        <p>
          This matters for real users, not for tidiness. People with vestibular disorders turn
          reduce-motion on precisely to stop the animations this library ships: pulsing skeletons,
          sweeping shimmers, parallax slides. An infinite loop that keeps running is the one that
          triggers nausea and migraine — so <code className="text-zinc-300">loops(-1)</code> returns{' '}
          <code className="text-zinc-300">1</code> under reduced motion, and the loop stops after a
          single pass instead of running forever.
        </p>
        <p>
          Purely decorative loops should skip the animation entirely rather than run once. Branch on{' '}
          <code className="text-zinc-300">motion.reduced</code> and set the resting value directly.
        </p>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Opting out</h2>
      <CodeBlock language="tsx" code={`// Default: OS reduce-motion collapses animation.speed to 0
<ThemeProvider preset="zinc">
  <RootNavigator />
</ThemeProvider>

// Opt out app-wide — animations keep their token durations
<ThemeProvider preset="zinc" respectReducedMotion={false}>
  <RootNavigator />
</ThemeProvider>`} />
      <p className="mt-3 text-sm text-zinc-400">
        Note that <code className="text-zinc-300">respectReducedMotion={'{false}'}</code> only stops
        the token collapse. <code className="text-zinc-300">useMotion()</code> still reports{' '}
        <code className="text-zinc-300">reduced: true</code> and still clamps{' '}
        <code className="text-zinc-300">loops()</code>, so infinite loops stay off.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="tsx" code={`import { useEffect } from 'react'
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence,
} from 'react-native-reanimated'
import { useMotion, useTheme } from '@native-mate/core'

function PulsingDot() {
  const motion = useMotion()
  const theme = useTheme()
  const opacity = useSharedValue(1)

  // Compute every motion config OUTSIDE the worklet — plain numbers only.
  const fast = motion.timing('fast')
  const dotColor = theme.colors.primary

  useEffect(() => {
    // Decorative loop: under reduce-motion, settle instead of animating.
    if (motion.reduced) {
      opacity.value = 0.85
      return
    }
    opacity.value = withRepeat(
      withSequence(withTiming(0.4, fast), withTiming(1, fast)),
      motion.loops(-1),
      false,
    )
  }, [motion.reduced])

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return <Animated.View style={[{ backgroundColor: dotColor }, style]} />
}`} />

      <div className="mt-6 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 text-sm text-amber-300">
        <strong>Compute motion config outside the worklet.</strong> A Reanimated worklet must only
        close over plain values. Call{' '}
        <code className="text-amber-200">motion.timing()</code> /{' '}
        <code className="text-amber-200">motion.spring()</code> in the component body and pass the
        resulting object in — never call a hook, read the theme, or capture an element-typed prop
        inside <code className="text-amber-200">useAnimatedStyle</code>.
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">useReducedMotion</h2>
      <p className="mb-3 text-sm text-zinc-400">
        The underlying hook is exported too, for cases that aren&apos;t about durations at all —
        swapping an animated illustration for a static one, say. It wraps Reanimated&apos;s{' '}
        <code className="text-zinc-300">useReducedMotion</code> (added in 3.5) and falls back to{' '}
        <code className="text-zinc-300">false</code> on older peers where the export doesn&apos;t
        exist.
      </p>
      <CodeBlock language="tsx" code={`import { useReducedMotion } from '@native-mate/core'

function Hero() {
  const reduced = useReducedMotion()
  return reduced ? <StaticPoster /> : <AnimatedPoster />
}`} />
    </article>
  )
}
