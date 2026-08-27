# v0.5 — Prop contracts, i18n/RTL, and accessibility

Status: **implemented** — core 0.5.0 + CLI 1.1.0 + 27 components shipped in
`0a250b5` and `e4f4d22`. Sections 1–5 are done; §6's remaining a11y items and
§7's perf items are tracked in the roadmap. See the sequencing section for what
is deliberately still open.
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

Revised after consumer review. The original order put the largest migration ahead of
fixes that make apps broken *today*; steps 1–4 now ship with no migration at all.

1. **v0.4 adoption wave** — make the 80 components actually consume `useMotion`,
   `withAlpha`, `makeStyles`, `forwardRef`, `testID`, `React.memo`. Non-breaking, and
   the hooks are already written. *(In progress — partial adoption landed in
   `c41a586`; coverage is uneven and being completed.)*
2. **P0 correctness** — toast queue + timer, infinite-scroll threshold unit error,
   phone-input digit loss, skeleton crashes, date-picker inert `disabled`, sheet
   stale closures. Non-breaking, ships as 0.4.x.
3. **P1 dead-API cleanup** — props that are documented but do nothing (`card.size`,
   `date-picker.sheetHeight`, `otp-input.borderAnim`, phone-input's unused animation
   imports). Technically breaking, but only breaks code that was already a no-op —
   call it out explicitly in the changelog rather than bundling it silently.
4. **Accessibility wave** (§6) — independent of contracts, parallelizable, and the
   highest-value item for a consumer whose users are elderly or vision-impaired
   patients reading their own medical results.
5. **Contracts + codemod** (§1) — the breaking release proper.
6. **i18n `strings` slot + RTL sweep + `audit-rtl`** (§2–3), including `search-bar`'s
   hardcoded `width: 60` Cancel button, which clips for "Annuler", "Abbrechen",
   "रद्द करें", and "キャンセル" — invisible until the day a second locale ships.
7. **RNGH gesture rework** (§5) + the perf items in §7. No longer blocked on the
   breaking release now that RNGH is an optional peer.
8. **Date-picker locale** (§4) — depends on the `strings` slot, and its dead sheet API
   must be resolved first so locale work isn't built on top of it.

## Consumer-critical component order

If a per-component wave needs an order, these 14 are what the first production
consumer actually depends on: `otp-input`, `phone-input`, `search-bar`, `list-item`,
`card`, `badge`, `skeleton`, `empty-state`, `timeline`, `stepper`,
`segmented-control`, `sheet`, `toast`, `button`. They are going direct to FlashList
rather than using `infinite-scroll`, and their booking flow needs a narrow
"next N days" slot picker rather than a general calendar — so `date-picker` and
`infinite-scroll` still need their dead APIs fixed, but neither blocks that consumer.

## Resolved decisions

Answered by the first production consumer in
`2026-08-27-v05-review-response.md`. All four are now settled:

1. **RNGH is an *optional* peer, not a hard requirement.** Use the same
   `try { require(...) } catch {}` pattern the library already uses for
   `expo-haptics`. Without RNGH, `sheet` keeps tap-to-dismiss with no drag and
   `toast` loses swipe-to-dismiss but keeps its timer and actions; emit a one-time
   `__DEV__` warning naming the missing capability. **Consequence: the gesture
   rework no longer needs to be gated on the breaking release** — it can ship in a
   0.4.x.
2. **`errorMessage` gets one minor with a loud dev warning, then removal in v0.6.**
   The codemod makes removal cheap, and a permanent alias doubles the branch count in
   every component forever. Warn once per prop name per session via a module-level
   `Set` so a 200-row list doesn't emit 200 warnings.
3. **Date-picker locales are hybrid, non-throwing.** Try `Intl.DateTimeFormat`, fall
   back to the `strings` slot, never throw, and never assume returned names are
   actually in the requested locale (Hermes' Android locale data depends on how the
   app was built and degrades silently to English). `firstDayOfWeek` is a plain
   `0..6` prop — `Intl.Locale.prototype.weekInfo` is absent in Hermes, so it must not
   be derived.
4. **`iconOnly` needs both the type-level discriminated union and a `__DEV__` runtime
   warning.** This generalizes into a standing rule below.

### Standing rule: assume a JavaScript consumer

native-mate's first production consumer is **JavaScript, not TypeScript** — project
rule, JS + JSX only. Every type-level guarantee the library ships is invisible there.
**Any rule the library wants to *guarantee* rather than merely document needs a
`__DEV__` runtime check in addition to its type.** This applies to the `iconOnly`
label requirement and to every future constraint of the same shape.

### Standing rule: a hardcoded color is a white-label bug

Each lab in the consumer's app supplies its own palette, so a literal like
`otp-input`'s `#22c55e` doesn't merely look wrong at night — it renders a
competitor's green inside another lab's branded app. Same for `fontFamily`
literals and `fontFamily: undefined`, which silently drop a brand font. Both classes
get CI gates (`audit-hex`, `audit-fonts`) rather than one-time sweeps.
