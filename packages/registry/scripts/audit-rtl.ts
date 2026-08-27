// Flags physical direction properties in component styles. React Native mirrors
// the *logical* properties (marginStart/End, paddingStart/End, borderStart/End*,
// start/end) automatically when I18nManager.isRTL is set; the physical ones
// (marginLeft, paddingRight, borderLeftWidth, left:, right:) never flip. A single
// physical property is enough to leave an icon overlapping text, a divider on the
// wrong edge, or an absolutely-positioned badge hanging off the wrong corner the
// moment an Arabic or Hebrew locale is enabled — and it renders perfectly in
// every LTR screenshot, so nothing catches it before a user does.
//
// Report-only by design: each finding needs a human to decide whether the
// property is genuinely physical (see PHYSICAL_ALLOWLIST), so there is no --fix.
//
// Usage: ts-node scripts/audit-rtl.ts   # report offenders, exit 1 if any
import fs from 'fs'
import path from 'path'

const COMPONENTS_DIR = path.join(__dirname, '../components')

// Physical properties that have a logical counterpart RN will mirror for us.
const PHYSICAL_RE =
  /\b(marginLeft|marginRight|paddingLeft|paddingRight|borderLeftWidth|borderRightWidth|borderLeftColor|borderRightColor)\s*:/g
// `left:` / `right:` as a style key. Requires `{`, `,` or line start in front so
// `layout.left` / `anchor.right` reads and `const left = …` are not matched.
const EDGE_RE = /(?:^|[{,])\s*(left|right)\s*:/gm

// Genuine physical properties, per component file. Each entry says why the
// property cannot become its logical counterpart. Keyed `component/file.tsx`,
// valued by the property names allowed in that file.
const PHYSICAL_ALLOWLIST: Record<string, string[]> = {
  // Bubble and arrow are placed from `measureInWindow` coordinates — absolute
  // window x, which is measured from the physical left edge in every locale.
  // `start:` would resolve against the opposite edge and put the popover off
  // screen. The `position` prop ('top' | 'bottom' | 'left' | 'right') is a
  // geometric placement chosen by the caller, not a reading direction, so the
  // web arm's CSS percentages stay physical too. `borderLeftWidth` on the arrow
  // is one of two adjacent borders forming a triangle under `rotate: '45deg'` —
  // pure geometry.
  'popover/popover.tsx': [
    'left', 'right', 'marginLeft', 'marginRight', 'borderLeftWidth',
  ],
  // Same measured-coordinate positioning and same geometric `position` prop as
  // popover, above.
  'tooltip/tooltip.tsx': ['left', 'right', 'marginLeft', 'marginRight'],
  // `left:` inside a useAnimatedStyle worklet, driven by a shared value fed from
  // `onLayout`'s `layout.x` — a physical offset within the tab strip. Reanimated
  // applies worklet styles through updateProps, which does not resolve logical
  // edges, so the indicator must stay physical to animate at all.
  'tabs/tabs.tsx': ['left'],
  // Same: the active-tab indicator is animated from a measured `layout.x`.
  'bottom-bar/bottom-bar.tsx': ['left'],
  // Full-bleed `left: 0 / right: 0` inside a useAnimatedStyle worklet (the
  // shimmer overlay). Symmetric, so nothing to mirror, and worklet styles skip
  // logical-edge resolution.
  'image/image.tsx': ['left', 'right'],
  // Ring segments of a determinate spinner: borderTop/Right/Bottom/LeftColor are
  // the four quadrants of a circle rotated by `-90deg`. They are geometry, not
  // layout — mirroring one would run the progress arc backwards.
  'pull-to-refresh/pull-to-refresh.tsx': ['borderLeftColor', 'borderRightColor'],
  // Same quadrant geometry, in both the web (CSS `div`) and native arms. The web
  // arm is literal CSS, where `borderRightColor` has no logical spelling RN
  // would rewrite.
  'spinner/spinner.tsx': ['borderRightColor'],
  // Determinate ring built from two rotated half-circles: `leftClip`/`rightClip`
  // and their fills are the two halves of a circle, offset by exactly the
  // radius. Mirroring either edge would run the sweep backwards.
  'progress/progress.tsx': ['left', 'right'],
  // Shimmer overscan (`left: '-50%', right: '-50%'`) on an absolutely-filled
  // overlay swept by a translateX worklet. Symmetric, and worklet styles do not
  // resolve logical edges.
  'skeleton/skeleton.tsx': ['left', 'right'],
  // `align?: 'left' | 'right'` is a public prop: the caller names a physical
  // corner for the menu, exactly like Popover's `position`. The `position:
  // 'fixed'` outside-press catcher is literal web CSS, which has no `start`/
  // `end` spelling RN would rewrite.
  'dropdown-menu/dropdown-menu.tsx': ['left', 'right'],
  // The component's contract is physical: `leftActions` / `rightActions` panels
  // pinned to the physical edges, revealed by a raw `gestureState.dx`. Mirroring
  // the panels without mirroring the gesture would reveal the wrong actions.
  'swipeable-row/swipeable-row.tsx': ['left', 'right'],
  // The hue/alpha slider is one physical coordinate system: the thumb offset is
  // computed from `nativeEvent.locationX`, which is measured from the physical
  // left edge. `start:` on the thumb would decouple it from its own hit-testing.
  'color-picker/color-picker.tsx': ['left'],
  // Optical nudge that re-centres the play triangle (▶) inside its round button.
  // The glyph points right in every locale — its meaning is absolute, not
  // directional — so the nudge that centres it must stay on the left.
  'video-player/video-player.tsx': ['marginLeft'],
  'audio-player/audio-player.tsx': ['marginLeft'],
  // Full-bleed `top/left/right/bottom: 0` on the Android ripple overlay, inside a
  // useAnimatedStyle worklet. Symmetric, so nothing to mirror, and worklet styles
  // skip logical-edge resolution.
  'button/button.tsx': ['left', 'right'],
  // Not styles: these are `hitSlop` objects. RN's hitSlop accepts only physical
  // `left`/`right` and never mirrors them, so there is no logical spelling to
  // move to — the close button's asymmetric slop is swapped by hand on `isRTL`.
  'chip/chip.tsx': ['left', 'right'],
  // `position` ('bottom-right' | 'bottom-left' | 'bottom-center') is a public
  // prop naming a physical screen corner, exactly like Popover's `position`.
  // `bottom-center` resets the corner with `left: 0 / right: 0`, which only
  // overrides the physical edge it is paired with.
  'fab/fab.tsx': ['left', 'right'],
  // `left:` inside the floating-label useAnimatedStyle worklet, offset by the
  // prefix width. Reanimated applies worklet styles through updateProps, which
  // does not resolve logical edges.
  'input/input.tsx': ['left'],
  // Same worklet-positioned floating label as input, above.
  'textarea/textarea.tsx': ['left'],
  // `left:` inside a useAnimatedStyle worklet, driven from the active item's
  // measured `layout.x` — same case as tabs and bottom-bar.
  'toggle-group/toggle-group.tsx': ['left'],
  // Track, fill and thumb(s) are one physical coordinate system: every offset is
  // derived from `nativeEvent.locationX` and `gestureState.dx`, both measured
  // from the physical left edge. `start:` on the thumb would decouple it from
  // its own hit-testing and drag maths.
  'slider/slider.tsx': ['left'],
  // Same caller-named physical corner as fab (`position`), plus a `direction`
  // prop ('up' | 'left') naming the physical axis the actions expand along.
  // `paddingRight` is the gap between that leftward action row and the FAB it
  // hangs off; mirroring it without mirroring the caller's chosen corner would
  // push the row through the button.
  'speed-dial/speed-dial.tsx': ['left', 'right', 'paddingRight'],
}

// ─── PENDING_OTHER_AGENTS ────────────────────────────────────────────────────
// TEMPORARY. These files still carry physical direction properties and are being
// converted to logical ones in a separate, concurrent pass — they are NOT
// exempt, and none of them has been reviewed for a genuine physical case. The
// block exists only so this gate can land and pass today; delete each entry as
// its conversion merges, and delete the block itself once it is empty. Anything
// that is genuinely physical belongs in PHYSICAL_ALLOWLIST above, with a reason.
const PENDING_OTHER_AGENTS: string[] = [
  // Empty: sheet and toast were the last two, and both are converted (their
  // physical edges are now `start`/`end`, `borderStart/EndWidth`). Left in place
  // as an empty list only so a concurrent pass has somewhere to land; delete the
  // block, and its two references below, once nothing needs it.
]

// Blank out comments (preserving offsets, so line numbers stay accurate) so a
// prose mention of `marginLeft:` in a rationale comment is not read as code.
function stripComments(source: string): string {
  const out = source.split('')
  let i = 0
  let quote = ''
  while (i < source.length) {
    const c = source[i]
    if (quote) {
      if (c === '\\') i++
      else if (c === quote) quote = ''
      i++
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c
      i++
      continue
    }
    if (c === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') out[i++] = ' '
      continue
    }
    if (c === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2)
      const stop = end === -1 ? source.length : end + 2
      for (; i < stop; i++) if (source[i] !== '\n') out[i] = ' '
      continue
    }
    i++
  }
  return out.join('')
}

const LOGICAL: Record<string, string> = {
  marginLeft: 'marginStart',
  marginRight: 'marginEnd',
  paddingLeft: 'paddingStart',
  paddingRight: 'paddingEnd',
  borderLeftWidth: 'borderStartWidth',
  borderRightWidth: 'borderEndWidth',
  borderLeftColor: 'borderStartColor',
  borderRightColor: 'borderEndColor',
  left: 'start',
  right: 'end',
}

function auditComponent(name: string): string[] {
  const dir = path.join(COMPONENTS_DIR, name)
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))

  const findings: string[] = []
  for (const file of files) {
    const key = `${name}/${file}`
    if (PENDING_OTHER_AGENTS.includes(key)) continue
    const allowed = PHYSICAL_ALLOWLIST[key] ?? []
    const source = stripComments(fs.readFileSync(path.join(dir, file), 'utf-8'))
    const hits = [
      ...[...source.matchAll(PHYSICAL_RE)].map((m) => ({ prop: m[1], index: m.index ?? 0 })),
      ...[...source.matchAll(EDGE_RE)].map((m) => ({ prop: m[1], index: m.index ?? 0 })),
    ]
    for (const { prop, index } of hits) {
      if (allowed.includes(prop)) continue
      const line = source.slice(0, index).split('\n').length
      findings.push(`${key}:${line} ${prop} — use ${LOGICAL[prop]} so RTL mirrors it`)
    }
  }
  return findings.sort()
}

function run(): number {
  const names = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((d) => fs.statSync(path.join(COMPONENTS_DIR, d)).isDirectory())

  const all = names.flatMap(auditComponent)
  if (all.length === 0) {
    console.log(
      `✓ every direction-sensitive style is logical (${names.length} components,` +
        ` ${PENDING_OTHER_AGENTS.length} file(s) pending conversion elsewhere)`
    )
    return 0
  }
  for (const f of all) console.log(`✗ ${f}`)
  console.log(
    `\n${all.length} physical direction propert(y/ies) — swap for the logical spelling so` +
      ` React Native mirrors it under RTL, or add a documented entry to PHYSICAL_ALLOWLIST` +
      ` if the property is genuinely physical (measured coordinates, worklet styles, glyph geometry).`
  )
  return 1
}

if (require.main === module) {
  process.exit(run())
}
