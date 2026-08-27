# v0.5 review response — answers, gaps, and consumer requirements

Status: **review of `2026-08-27-v05-contracts-i18n-a11y-design.md`**
Author: patient-app side (Flabs white-label patient app — native-mate's first
production consumer, `D:\patient-app`).
Date: 2026-08-27 · Findings verified against **`c41a586`**

This responds to the v0.5 draft, which is marked "awaiting review". It has three
parts: answers to the four open questions, findings **not yet covered** by the
spec, and requirements from the first real consumer that should shape the wave.

---

## 0. Verified state of play (read before planning)

| Item | State |
|---|---|
| `useMotion`, `useReducedMotion`, `withAlpha` in core | ✅ exported (`packages/core/src/index.ts`) |
| `makeStyles` per-theme WeakMap cache | ✅ implemented (`packages/core/src/theme/makeStyles.ts`) |
| `useStrings` / any i18n slot in core | ❌ nothing i18n-shaped anywhere in `packages/core/src/` — this is v0.5 §2 |
| Registry adoption of the v0.4 primitives | ⚠️ **partial** — of 80 components: `testID` 21, `useMotion` 15, `withAlpha` 13, `forwardRef` 3 |
| CI gates in `packages/registry/scripts/` | `audit-deps.ts`, `audit-worklets.ts`, `build-registry.ts` only — no `audit-rtl`, `audit-hex`, `audit-fonts`, or `audit-availability` |

**The single most important observation:** the v0.4 primitives exist in core, and
adoption across the 80 components is roughly 20% done — highest for `testID` (26%),
lowest for `forwardRef` (4%, i.e. 3 components). Migrated already: `skeleton`,
`otp-input`, `date-picker`, `card`. Not yet: `toast`, `infinite-scroll`,
`phone-input`. Finishing that sweep is the cheapest available win — the hard part,
the hooks themselves, is already written, and the work is entirely non-breaking.

---

## 1. Answers to the open questions

### Q1 — RNGH as a peer dependency: acceptable?

**Yes, but make it an *optional* peer with graceful degradation, not a hard requirement.**

In practice every consumer already has it: React Navigation depends on RNGH, and it
ships in the default Expo template. So the real-world break is near zero. But "near
zero" isn't zero, and a hard peer dep turns a UI-library upgrade into a native
rebuild for anyone who doesn't have it.

Use the pattern the library already uses for `expo-haptics`:

```ts
let Gesture: any = null
try { Gesture = require('react-native-gesture-handler') } catch {}
```

When RNGH is absent, `sheet` keeps today's tap-to-dismiss behaviour with no drag,
and `toast` loses swipe-to-dismiss but keeps its timer and actions. Log a one-time
`__DEV__` warning naming the missing capability. This also lets the gesture rework
ship without being gated on the breaking release.

### Q2 — `errorMessage` deprecation window?

**One minor, with a loud dev warning, then remove.**

You are shipping a codemod, which makes removal cheap for consumers — that's the
whole argument for not carrying the alias indefinitely. Every permanent alias
doubles the branch count in each component's prop handling forever, and the
inconsistency is precisely what §1 exists to kill.

Warn once per prop per session (module-level `Set` of already-warned prop names, so
a list of 200 rows doesn't emit 200 warnings):

```
[native-mate] `errorMessage` is deprecated and will be removed in v0.6.
Use `error` (accepts string | boolean). Run: npx @native-mate/cli migrate v0.5
```

### Q3 — `Intl` reliance for date-picker locales?

**Hybrid, with the fallback path explicit and non-throwing — and do not source
`firstDayOfWeek` from `Intl`.**

Hermes' Intl support varies: `Intl.DateTimeFormat` exists on modern RN, but the
available locale *data* on Android depends on how the app was built, and a missing
locale silently degrades to English rather than throwing. So:

1. Try `Intl.DateTimeFormat(locale, …)` for month and weekday names.
2. Fall back to the `strings` slot from §2.
3. Never throw, and never assume the returned names are actually in `locale`.
4. Document that apps needing *guaranteed* non-English names should pass
   `strings.months` / `strings.weekdaysShort` explicitly.

`Intl.Locale.prototype.weekInfo` — the API that would give you the first day of the
week — is poorly supported and absent in Hermes. Take `firstDayOfWeek?: 0..6` as a
prop with a documented default; do not try to derive it.

### Q4 — `iconOnly` + required label as a type-level error?

**Do both: the type-level discriminated union *and* a runtime `__DEV__` warning.**

The type error is the right primary mechanism, and breaking at compile time is
correct — an icon-only button with no accessible name is invisible to screen
readers, which is a genuine accessibility failure, not a style nit.

But type-level alone protects only TypeScript consumers, and **native-mate's first
production consumer is JavaScript** — patient-app is JS/JSX by project rule, no
TypeScript files. A compile-time-only guarantee would not catch a single unlabeled
icon button in the app most likely to be audited for accessibility. The runtime
warning is what actually protects that case.

This generalizes: for any rule the library wants to *guarantee* rather than merely
document, assume a JS consumer and add the dev-time runtime check.

---

## 2. Open findings not covered by the v0.5 spec

An 80-item audit was run against the published registry, then **re-verified
line-by-line against `c41a586`**: 16 were already fixed, 7 partially fixed, 57 still
open. Only the open and partial items are listed here; the already-fixed list is in
the appendix so nobody re-audits them.

Everything in P0–P1 is non-breaking (or breaks only code that was already a no-op)
and can ship as `v0.4.x` without waiting for the breaking wave.

### P0 — Correctness

1. **`toast` has no queue.** The provider holds a single `toast`/`visible` pair and
   `show()` overwrites it (`toast.tsx:377-390`), so a second toast destroys the
   first with no queueing and no max-visible policy. *(The related timer bug is
   fixed — the effect is now keyed `[visible, id]` with a monotonic id at
   `toast.tsx:177`. Only the queue remains.)*

2. **`sheet` captures stale closures.** `runShow`/`runHide` are recreated every
   render but the effect calling them is keyed on `[visible]` alone
   (`sheet.tsx:66-101`), so `animation`, `sheetHeight`, and `onClose` go stale.
   `setTimeout(runShow, 10)` (`sheet.tsx:96`) is a mount hack — use `onLayout` or
   `requestAnimationFrame`.

3. **`SkeletonText` still produces negative widths.** `` `${100 - i * 8}%` `` is
   unclamped (`skeleton.tsx:214`), so any `lines > 13` goes negative. *(The
   `SkeletonCard lines={0}` crash is fixed.)*

4. **`input`'s password toggle leaks a timer.** `setTimeout(() =>
   inputRef.current?.focus(), 10)` is never cleared and isn't guarded against
   unmount (`input.tsx:266`).

### P1 — Dead or misleading API (documented, non-functional)

Worse than a missing feature: a consumer reads the type, writes the prop, gets silence.

5. **`date-picker` still advertises a sheet it doesn't render.** There is no Modal
   in the file, yet `visible` (`:433`) and `onClose` (`:430`) remain. *(`sheetHeight`
   is now consumed as `minHeight` at `:440`, and the unused Reanimated imports are
   gone.)* Either implement the sheet or delete `visible`/`onClose`.

6. **`card`'s `size` prop is only half-wired.** `sizeTokens` is now consumed, but
   *only* for the loading skeleton's `pad`/`gap` (`card.tsx:167`). Its `radius` and
   `headerPad` entries are unused, and CardHeader/Content/Footer still hardcode
   16/12/8 and `fontSize` 15/12/13 (`:76-99`, `:126-127`). So `size` visibly does
   nothing for real content.

7. **`infinite-scroll` has no first-class refresh.** The misleading "Pull down to
   refresh" copy is gone (now "Check back later.", `:117`), but there is still no
   `onRefresh`/`refreshControl` prop — it's reachable only by threading
   `flatListProps`. For the single most common list interaction, that should be a
   named prop.

8. **`sheet`'s `snapPoints` is still phantom** — only `snapPoints?.[0] ?? height` is
   read (`sheet.tsx:58`) — and the drag handle is a bare `<View>` with no gesture
   handler anywhere (`sheet.tsx:133`). *(Covered by spec §5; noted for cross-reference.)*

9. **`timeline` keeps a `setTimeout(…, 10)` mount hack** (`:231`) while `FadeInDown`
   sits imported and unused (`:13`). *(Covered by spec §7.)*

### P2 — Missing API that blocks real use

10. **`phone-input` can't produce a usable value.** `onChangeText` emits raw digits
    with no dial code and there is no `onChangeFormatted(e164, isValid)`
    (`phone-input.types.ts:16`); there is no controlled `country` prop, so
    `defaultCountry` changes after mount are ignored (`:308-310`); and the country
    list is 20 hardcoded English names (`:26-47`). *(Autofill is fixed —
    `autoComplete="tel"` + `textContentType="telephoneNumber"` at `:407-408`.)*

11. **`search-bar` can't respond to the keyboard's search key.**
    `returnKeyType="search"` is hardcoded (`:191`) with no `onSubmitEditing` in the
    prop type. It ships a `loading` prop but no debounce (`:184`), so every consumer
    reimplements one — `debounceMs` + `onDebouncedChangeText` would pay for itself
    immediately.

12. **`toast`'s `show()` returns nothing** (`toast.types.ts:36-38`) — no
    `dismiss(id)`, no `update(id, cfg)`, so the loading→success pattern is impossible.

13. **`sheet` has no scroll support** — content sits in a plain `View`
    (`:142-144`) — no imperative ref, and no `onDismiss` after the exit animation.

14. **`ChipGroup` is a dumb flex wrapper** (`chip.tsx:205-226`) with no
    `value`/`onChange`, so every consumer rebuilds selection state, and it hardcodes
    `accessibilityRole="radiogroup"` (`:221`) though chips are commonly multi-select.

15. **`stepper` doesn't clamp `currentStep`** (`:320-324`) — out-of-range silently
    renders all-completed or all-upcoming — and `StepItem` has no `id`
    (`stepper.types.ts:4-8`), so both branches key by index (`:332`, `:399`).

16. **`infinite-scroll` list hygiene**: an extra `<View>` wraps every row (`:195`);
    the default `keyExtractor` is the array index (`:200-203`);
    `ItemSeparatorComponent` is a node re-wrapped in a fresh arrow each render
    (`:227-231`), remounting the separator; and core's `Spinner` is imported but
    unused in favour of `ActivityIndicator` (`:8`). *(FlatList passthrough is fixed
    via `flatListProps` at `:241`.)*

### P3 — Quality

17. **`input` still lets consumers clobber `style`.** `{...rest}` now correctly
    precedes `value`/`editable`/`accessibilityLabel` (`:240`), but `style` is applied
    *before* the spread (`:229-237`), so it remains overridable.

18. **`button`**: `withSpring` is called inside the `useAnimatedStyle` body (`:80`),
    restarting the animation on every style evaluation; the ripple is
    `rgba(255,255,255,0.15)` (`:91`), invisible on `outline`/`ghost`/light themes; a
    custom `color` forces a `#fff` label with no contrast check (`:97-99`);
    `_groupStyle` is injected via `cloneElement` and leaked into the public type
    (`:55`, `:225`) — use a `ButtonGroupContext`; and there is no `style` escape
    hatch (`button.types.ts:7`).

19. **`toast`**: the native (`:292-368`) and web (`:242-290`) branches are duplicated
    ~90-line JSX copies that have already drifted — the web branch still has no
    `panHandlers`. Positioning is now `Platform.select` (Android
    `StatusBar.currentHeight + 8`, iOS a hardcoded 56, web 48) at `:116-120`, which
    is better than the old flat 48 but still isn't real safe-area insets, so it
    collides with the Dynamic Island. Action buttons are `paddingVertical: 4` with
    no `hitSlop` (`:57`) — roughly a 24pt target.

20. **`otp-input` accessibility**: the hidden 1×1 `opacity: 0` TextInput (`:277`)
    carries only a static label while the visible cells (`:255-267`) are unlabeled
    and not hidden from assistive tech, so digits get double-announced with no value
    feedback. `Cell` is also unmemoized and calls `useTheme()` + `useMotion()` per
    cell (`:28`, `:45-46`) — every keystroke re-renders and re-subscribes all of them.

21. **`badge`**: no accessibility semantics at all — the root `View` has no role or
    label (`:94`) and the dismiss Pressable is unlabeled (`:118`). `PulseDot` runs
    `withRepeat(…, -1)` with no reduced-motion gate and no `cancelAnimation` cleanup
    (`:46-55`) — notable since `useMotion` already exists in core. *(The `info`
    variant's hardcoded hex is fixed — now `theme.colors.info ?? '#3b82f6'`.)*

22. **`segmented-control`**: `shadowColor: '#000'` (`:30`) is wrong in dark mode;
    segment layouts live in React state written per-`onLayout` (`:62`, `:70`),
    causing N re-renders on mount; and the indicator animates `left`/`width`
    (`:85-88`) — layout properties — instead of `translateX`/`scaleX`.

23. **`empty-state`** reimplements Button locally (`:33-83`), diverging from Button's
    variants, haptics, loading, disabled, and a11y; and its `variant` dispatch
    returns three different component types (`:342-344`), so changing variant
    remounts and loses animation state.

24. **`list-item`**: the press worklet reads `theme.colors.surface`, capturing the
    whole theme object (`:81-86`); and `chevron-forward` never flips —
    `I18nManager` isn't imported (`:149-154`). *(It is now `React.memo`'d at `:60`.)*

25. **`timeline`**: `item.timestamp.toLocaleString()` with no locale or formatter
    prop (`:259`); stagger is unbounded, `index * staggerDelay` (`:232`), so 100
    items ≈ 10s; a11y strings `', completed' / ', current' / ', error'` are inline
    English (`:295`).

26. **`stepper`**: no `accessibilityRole="progressbar"` or `accessibilityValue` on
    either container (`:328`, `:395`) — a stepper *is* a progress indicator; and
    `ConnectingLine` animates percentage `width`/`height` (`:90-95`), forcing a
    layout pass per frame.

27. **`date-picker` locale + bounds**: `DAYS`/`MONTHS` are English literals
    (`:11-15`), the week is Sunday-start via raw `getDay()` (`:119-121`, `:253`), and
    the hour spinner is 0–23 only (`:526-531`) — all in scope for spec §4. Beyond
    that: `navigateMonth` ignores `minimumDate`/`maximumDate` (`:383-400`), and there
    is a `<Pressable accessibilityRole="text">` with no `onPress` (`:456-460`).
    `today` is `useMemo(() => new Date(), [visible])` (`:245`) but `CalendarGrid`
    receives no `visible` prop (`:506-514`), so the dep is effectively constant — an
    always-inline picker shows a stale "today" across midnight.

28. **`phone-input` country list perf and a11y**: inline `renderItem` closure with no
    `getItemLayout` (`:236-277`), and the picker Modal lacks
    `accessibilityViewIsModal` (`:210`).

29. **`sheet` layout and a11y**: fixed `height: sheetHeight` with no `maxHeight`
    clamp and no safe-area bottom padding (`:132`, `:142`), and no
    `accessibilityViewIsModal` or focus management (`:126-132`).

30. **`search-bar` a11y**: the Cancel Pressable stays mounted and screen-reader
    focusable inside a width-0 wrapper (`:207-213`), and the web branch sets
    `outlineStyle: 'none'` (`:181`), removing the keyboard focus ring.

31. **`card`**: `CardFooter` renders its `Separator` outside its own `View` via a
    fragment (`card.tsx:118-119`), which breaks when the parent Card sets `gap`.

### Addendum to spec §2 (i18n): a layout bug that only surfaces once translated

`search-bar` animates its Cancel button to a **hardcoded `width: 60`**
(`search-bar.tsx:110`, `:115`). "Cancel" fits; "Annuler", "Abbrechen", "रद्द करें",
and "キャンセル" clip. Measure via `onLayout`, or animate `opacity` + `marginEnd`
only. Worth folding into the i18n wave, since it is invisible until a second locale
ships.

Also for that wave, the hardcoded English still in place:
`infinite-scroll.tsx:70,108,117` ("Loading more…", "No items yet", "Check back
later."), `timeline.tsx:295`, and `date-picker.tsx:11-15`.

---

## 3. Requirements from the first production consumer

Context: Flabs white-label patient app — one Expo codebase published as a separate
branded app per pathology lab. Patients book tests, track samples, and read their own
medical reports.

**The app is JavaScript, not TypeScript.** Project rule, JS + JSX only. Every
type-level guarantee the library ships is invisible here. Anything the library wants
to *enforce* needs a `__DEV__` runtime check as well (see Q4).

**Every hardcoded hex is a white-label bug, not just a dark-mode bug.** Each lab
supplies its own palette, so a literal doesn't merely look wrong at night — it
renders a competitor's colour inside another lab's branded app. The remaining
offender is `segmented-control.tsx:30`; `badge` now does this correctly, using
`theme.colors.info ?? '#3b82f6'` — token first, hex only as fallback. That pattern is
worth enforcing with an **`audit-hex`** CI gate alongside the existing
`audit-deps`/`audit-worklets`, allow-listing shadows and backdrops.

**Brand fonts are per-weight, and components must not opt out.** Identity is baked
per brand via `typography.family`. `input`'s floating label used to render with
`fontFamily: undefined` — now fixed (`input.tsx:206`) — which is exactly the failure
mode to guard against: one component silently rendering the system font inside an
otherwise fully branded screen. An **`audit-fonts`** check for `fontFamily` literals
and `undefined` assignments would catch the class permanently.

**Accessibility outranks everything else for this consumer.** A meaningful share of
patients are elderly or vision-impaired, and they are reading their own medical
results. The spec's §6 wave is the highest-value work in the entire draft from our
side — above the prop contracts.

**The 14 components we actually depend on**, if a per-component wave needs an order:
`otp-input`, `phone-input`, `search-bar`, `list-item`, `card`, `badge`, `skeleton`,
`empty-state`, `timeline`, `stepper`, `segmented-control`, `sheet`, `toast`,
`button`. We are going **direct to FlashList** rather than using `infinite-scroll`,
and our booking flow needs a narrow "next N days" slot picker rather than a general
calendar, so `date-picker` is likely unused by us — both should still have their dead
APIs resolved, but neither needs to block us.

**Registry metadata can advertise what the CLI can't install.** The MCP
`list_components` tool listed `tooltip@0.2.0` and `popover@0.1.0` while
`npx @native-mate/cli add tooltip popover` refused with "not available yet" — since
fixed in `4056ed5`. An **`audit-availability`** gate that fails CI when the registry
index lists a component the publish pipeline doesn't ship would prevent the class
recurring — same family as the earlier `badge` bug, where an undeclared
`@expo/vector-icons` import broke a consumer's Metro bundle and motivated
`audit-deps`.

---

## 4. Suggested sequencing change

The spec sequences prop contracts first, so everything lands on stable prop shapes.
That's sound for the *breaking* work, but it puts the largest migration ahead of
fixes that make apps broken today. Proposed order:

1. **Finish the v0.4 adoption wave** — bring the remaining ~80% of components onto
   `useMotion`, `withAlpha`, `makeStyles`, `forwardRef`, `testID`, `React.memo`.
   Non-breaking, purely additive, hooks already written. `toast`, `infinite-scroll`,
   and `phone-input` are untouched so far.
2. **P0 correctness** (§2) — non-breaking, shippable as `v0.4.x`. The toast queue is
   the one that most visibly misbehaves.
3. **P1 dead-API cleanup** — mostly deleting props that never worked, which breaks
   only code that was already a no-op. Call it out explicitly in the changelog
   rather than bundling it silently.
4. **Accessibility wave** (spec §6) — independent of contracts, parallelizable,
   highest value for this consumer.
5. **Contracts + codemod** (spec §1) — the breaking release proper.
6. **i18n `strings` slot + RTL sweep + `audit-rtl`** (spec §2–3), including the
   `search-bar` fixed-width Cancel bug and the string list in the §2 addendum above.
7. **RNGH gesture rework** (spec §5) + remaining perf items (spec §7).
8. **date-picker locale** (spec §4) — depends on the `strings` slot, and its phantom
   `visible`/`onClose` (P1 #5) should be resolved before locale work builds on it.

Steps 1–4 ship without a migration, so consumers get correctness and accessibility
improvements while the breaking wave is still being designed.

---

## Appendix — verified fixed at `c41a586` (do not re-audit)

These were open in the original audit and are confirmed resolved:

| Area | Fixed |
|---|---|
| `toast` | dismiss-timer bug — effect now keyed `[visible, id]` with a monotonic id |
| `infinite-scroll` | FlatList passthrough via `flatListProps`; `onEndReachedThreshold` unit error; misleading "pull to refresh" copy |
| `phone-input` | `formatPhone` digit truncation (`maskDigitCapacity`); Modal `animationType="slide"` + unused animation imports removed; `autoComplete`/`textContentType` autofill |
| `date-picker` | `disabled` now gates via `pointerEvents`; unused Reanimated imports and `SPRING` removed; `sheetHeight` consumed as `minHeight` |
| `skeleton` | `SkeletonCard lines={0}` crash clamped; `style` forwarded on web; shimmer sweep measured via `onLayout` instead of ±300px |
| `otp-input` | `borderAnim` now read via `interpolateColor`; resend cooldown moved to deadline timestamp + `setInterval`; hardcoded success green |
| `input` | floating label uses `theme.typography.family.regular`; `{...rest}` reordered before a11y/editable props |
| `chip` | close button restructured as a sibling, ending the nested-Pressable conflict |
| `badge` | `info` variant uses `theme.colors.info ?? '#3b82f6'` |
| `list-item` | `React.memo` applied |
| CLI | stale `COMING_SOON` gate blocking `tooltip`/`popover` (`4056ed5`) |
