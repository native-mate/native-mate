# v0.5 — Prop contracts, i18n/RTL, and accessibility

Status: **draft, awaiting review**
Scope: breaking changes to `@native-mate/core` types and every registry component.
Prerequisite: v0.4 (shipped) — `useMotion`, `withAlpha`, reduced-motion collapse,
`makeStyles` per-theme cache, CJS/ESM packaging, forwardRef/testID/memo wave.

## Why this is a separate wave

Everything here changes public prop shapes or adds required plumbing across all 80
components. v0.4 was additive and could ship component-by-component; these cannot.
Doing them as one deliberate breaking release keeps consumers to a single migration
instead of a trickle of small breaks.

## 1. Standardized prop contracts

Three prop shapes are inconsistent across components today:

| Prop | Current variants | Problem |
|---|---|---|
| `error` | `string` (input, phone-input) vs `boolean` + `errorMessage` (otp-input) | Callers can't move between components without rewriting |
| `haptic` | `HapticStyle` union (button) vs `boolean` (several) vs `hapticOnFocus`/`hapticOnDrag` bespoke names | No single way to disable haptics app-wide |
| `icon` | `string` cast to `any` and passed to Ionicons (Ionicons-locked) vs `ReactNode` | Icon-set choice is baked into components |

**Proposed contract**, exported from core as shared types:

```ts
// core/src/types/props.ts
export type ErrorProp = string | boolean          // string implies true + message
export type HapticProp = boolean | HapticStyle     // false disables; true = 'light'
export type IconProp = React.ReactNode             // never a string
```

- `error`: accept `string | boolean` everywhere. A string renders as the message; a
  bare `true` sets error styling with no text. Components that had `errorMessage` keep
  it as a deprecated alias for one minor.
- `haptic`: one prop name, `haptic`, on every component that vibrates. `false`
  disables. Bespoke names (`hapticOnFocus`, `hapticOnDrag`) become deprecated aliases.
  Additionally, a `HapticsProvider`-less global kill switch: `ThemeProvider`'s new
  `haptics={false}` disables them library-wide (parallels `respectReducedMotion`).
- `icon`: always `ReactNode`. Components stop importing Ionicons for caller-supplied
  icons. Where a component needs a *default* icon it keeps its own Ionicons import —
  that's an internal detail, not a caller contract.

**Migration**: codemod-able. Ship a `native-mate migrate v0.5` CLI subcommand that
rewrites `errorMessage=` → `error=`, `hapticOnFocus`/`hapticOnDrag` → `haptic`, and
flags `icon="name"` string usages for manual review (they need a JSX element).

## 2. i18n

~15 hardcoded English strings across components: "Cancel", "Resend", "Didn't receive
the code?", "Loading more...", "No items yet", "Read more", month and day names.

**Proposed**: a `strings` slot on ThemeProvider plus per-component overrides.

```ts
export interface NativeMateStrings {
  cancel: string; confirm: string; clear: string; close: string
  resend: string; resendPrompt: string
  loadingMore: string; empty: string; readMore: string; readLess: string
  months: string[]; monthsShort: string[]; weekdaysShort: string[]
}
```

- `ThemeProvider` gains `strings?: Partial<NativeMateStrings>`, merged over English
  defaults, exposed via `useStrings()`.
- Every component reads its copy from `useStrings()`; each keeps a local prop override
  (e.g. `cancelLabel`) so one-off changes don't need provider config.
- Defaults ship as `en`. No bundled locale data beyond English — apps that need more
  pass their own (they already have an i18n library).

## 3. RTL

`marginLeft`/`paddingRight`/`left:` are used throughout instead of the
start/end logical properties, and chevrons never flip under `I18nManager.isRTL`.

- Mechanical sweep: `marginLeft`→`marginStart`, `marginRight`→`marginEnd`,
  `paddingLeft`→`paddingStart`, `paddingRight`→`paddingEnd`, `left`/`right` on
  absolutely-positioned elements → `start`/`end`.
- Directional icons (chevron-forward/back, arrow-forward/back, breadcrumb separators,
  swipe affordances) pick their glyph from `I18nManager.isRTL`.
- Add an `audit-rtl.ts` script to the registry build (sibling of `audit-deps` and
  `audit-worklets`) that fails CI on new physical-direction properties in component
  styles, so the sweep can't regress.

## 4. Date-picker locale

Structural, not cosmetic: week starts hardcoded to Sunday, English-only month/day
names, 24-hour-only time. Proposed props: `firstDayOfWeek?: 0..6`, `locale?: string`
(used with `Intl.DateTimeFormat` for month/day names where available, falling back to
the `strings` slot), `hour12?: boolean`. `Intl` is present in Hermes with
`hermes-intl` on modern RN; the fallback path must be explicit.

## 5. Gestures on the UI thread

- `sheet`: the drag handle is currently decorative — no drag gesture exists, and
  `snapPoints` is typed but only `[0]` is read. Rebuild on
  `react-native-gesture-handler` + Reanimated so the drag runs on the UI thread, and
  implement real snap points. **This adds RNGH as a peer dependency** — the main
  reason this is a breaking release.
- `toast`: swipe-to-dismiss uses `PanResponder` with
  `onStartShouldSetPanResponder: () => true`, which claims taps intended for action
  buttons. Move to RNGH so the action button wins its own taps.
- `sheet` also needs safe-area padding, `accessibilityViewIsModal`, and focus
  restore on close.

## 6. Accessibility wave

- **Touch targets**: chip (28–34pt), sm buttons (32pt), clear/close icons (~20–26pt),
  toast actions (~24pt) are all under the 44pt minimum. Fix with `hitSlop` and
  `minHeight`/`minWidth` — no visual change required.
- **Live regions**: error text nowhere uses `accessibilityLiveRegion="assertive"`.
- **Labels**: `iconOnly` buttons can render with no accessible name at all — make
  `accessibilityLabel` required (type-level) when `iconOnly` is set.
- **Modals**: sheet and phone-input's country picker lack `accessibilityViewIsModal`
  and any focus restore.
- **search-bar**: the hidden Cancel button stays screen-reader focusable at `width: 0`
  (needs `accessibilityElementsHidden` / `importantForAccessibility="no-hide-descendants"`),
  and the web branch sets `outlineStyle: 'none'`, killing the focus ring.
- **badge**: no accessibility semantics at all — needs `accessibilityRole="text"` and
  a label combining variant + count.
- **otp-input**: the hidden 1×1 TextInput plus unlabeled visible cells break
  VoiceOver/TalkBack — the cells need to be `accessibilityElementsHidden` with the
  real input carrying an `accessibilityLabel` and `accessibilityValue`.

## 7. Remaining performance items

Not breaking, but they belong with the gesture rework:

- Worklets capture the whole `theme` object (input, otp-input, chip, list-item,
  button) — hoist the specific color strings so only strings cross the bridge.
- Several worklets return different prop sets per branch (`return {}`), which
  Reanimated never resets — always return the same keys.
- `withSpring` is called inside a `useAnimatedStyle` body (button.tsx:82), restarting
  the animation on every style evaluation — drive a shared value from handlers.
- `segmented-control` stores layouts in React state (N re-renders on mount) and
  animates `left`/`width` instead of `translateX`/`scaleX`.
- `stepper`'s ConnectingLine animates percentage width/height — layout pass per frame.
- `timeline` uses a `setTimeout(…, 10)` mount hack while `FadeInDown` sits imported
  and unused; stagger is unbounded (100 items ≈ 10s) with no virtualization story.

## Sequencing

1. Contracts + codemod (`v0.5.0-alpha`) — largest blast radius, do first so the rest
   lands on stable prop shapes.
2. i18n `strings` slot + RTL sweep + `audit-rtl` CI gate.
3. Accessibility wave (independent of 1–2; can run in parallel).
4. RNGH gesture rework for sheet/toast + the perf items above.
5. Date-picker locale work last — it depends on the `strings` slot from step 2.

## Open questions for review

1. **RNGH as a peer dependency** — acceptable? It's near-universal in RN apps, but it
   is a real new requirement for consumers who don't have it.
2. **`errorMessage` deprecation window** — one minor, or keep the alias indefinitely?
3. **`Intl` reliance** for date-picker locales — acceptable to require, or should
   month/day names come exclusively from the `strings` slot?
4. **`iconOnly` + required label** as a *type-level* error — breaks existing code at
   compile time (intended), or runtime dev-warning only?
