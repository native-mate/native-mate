// Flags color literals baked into semantic roles. Every consuming app themes
// native-mate through `theme.colors`; a hex or rgb() literal standing in for a
// semantic token (primary, foreground, onPrimary, border…) is a branding bug —
// it survives every palette the consumer configures. White-label consumers hit
// this first and hardest.
//
// Report-only by design: each finding needs a human to pick the right token, so
// there is no --fix.
//
// Usage: ts-node scripts/audit-hex.ts   # report offenders, exit 1 if any
import fs from 'fs'
import path from 'path'

const COMPONENTS_DIR = path.join(__dirname, '../components')

// Literals that are *not* branding bugs, per component. Anything not listed
// here (and not covered by the structural rules in isAllowed) is a finding.
const BRAND_ALLOWLIST: Record<string, string[]> = {
  // Provider brand colors — Google/Apple/GitHub/Facebook/X/Discord mandate
  // exact button colors in their sign-in branding guidelines. Re-theming these
  // breaks the guidelines, not the brand.
  'social-login-button': [
    '#FFFFFF', '#1F1F1F', '#000000', '#24292F', '#1877F2', '#5865F2',
    '#131314', '#E3E3E3', '#8E918F', '#747775',
  ],
  // Card-network brand gradients (Visa, Mastercard, Amex, Discover) plus the
  // white foreground printed on every physical card face.
  'payment-card': [
    '#1A1F71', '#2B3A8F', '#EB001B', '#F79E1B', '#006FCF', '#0080EF',
    '#FF6000', '#FF8533', '#374151', '#6B7280', '#FFFFFF',
  ],
  // Review-star gold and the grey unfilled star: a universally recognised
  // rating convention, not a themeable accent.
  rating: ['#f59e0b'],
  'review-card': ['#F59E0B'],
  // Same star convention, plus the "liked" heart red (see comment/).
  'product-card': ['#F59E0B', '#D1D5DB', '#EF4444'],
  // Filled-heart red for the liked state — a platform convention like the star.
  comment: ['#EF4444'],
  // Violet for the "social" notification category; the source carries an
  // explicit "no semantic token for social; intentional" comment.
  'notification-card': ['#8b5cf6'],
  // Deterministic identity palette for initials avatars. These are data (a
  // hash bucket per name), not a semantic role, and must stay stable so the
  // same user keeps the same color across themes.
  avatar: [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#3b82f6',
  ],
  // The swatches *are* the component's content — a color picker that themed
  // its own palette would have nothing to pick from.
  'color-picker': [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#14B8A6', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
    '#D946EF', '#EC4899', '#F43F5E', '#78716C', '#000000', '#FFFFFF',
  ],
  // VS Code "Dark+" code-block theme. Syntax highlighting is its own palette;
  // brand colors would wreck contrast between token classes.
  markdown: ['#1E1E1E', '#D4D4D4'],
  // Video chrome sits on top of arbitrary video frames: the letterbox is black
  // and the controls are white on every player on every platform.
  'video-player': ['#000000', '#FFFFFF', '#1a1a1a'],
}

const HEX_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g
// Require a digit first so `hue2rgb(p, q, h)` is not mistaken for `rgb(...)`.
const RGB_RE = /\brgba?\(\s*\d[^)]*\)/g

// Blank out comments (preserving offsets, so line numbers stay accurate) so a
// bug reference like "PanResponder bug #28228" is not read as a color.
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

// #rgb / #rgba / #rrggbb / #rrggbbaa → rrggbb
function normalizeHex(literal: string): string {
  const body = literal.slice(1)
  const rgb = body.length <= 4 ? body.slice(0, 3).split('').map((ch) => ch + ch).join('') : body.slice(0, 6)
  return rgb.toLowerCase()
}

function isPureBlackOrWhiteHex(literal: string): boolean {
  const rgb = normalizeHex(literal)
  return rgb === '000000' || rgb === 'ffffff'
}

function isPureBlackOrWhiteRgb(literal: string): boolean {
  const nums = literal.replace(/^.*?\(/, '').split(',').map((v) => Number(v.trim()))
  const [r, g, b] = nums
  return (r === 0 && g === 0 && b === 0) || (r === 255 && g === 255 && b === 255)
}

function isAllowed(component: string, literal: string, line: string): boolean {
  const allowed = BRAND_ALLOWLIST[component] ?? []
  if (allowed.some((a) => a.toLowerCase() === literal.toLowerCase())) return true

  if (literal.startsWith('#')) {
    // Shadows are cast by light, not by the brand: pure black/white only.
    if (/shadowColor/.test(line) && isPureBlackOrWhiteHex(literal)) return true
    // Translucent pure black/white (#0006, #00000088) is a scrim, not a color.
    const alphaLen = literal.length - 1
    if ((alphaLen === 4 || alphaLen === 8) && isPureBlackOrWhiteHex(literal)) return true
    return false
  }

  // rgba(0,0,0,x) / rgba(255,255,255,x): backdrops, scrims, glass fills and
  // press veils. Pure black/white with alpha carries no hue to re-brand.
  return isPureBlackOrWhiteRgb(literal)
}

interface Finding {
  location: string
  literal: string
}

function auditComponent(name: string): Finding[] {
  const dir = path.join(COMPONENTS_DIR, name)
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))

  const findings: Finding[] = []
  for (const file of files) {
    const source = stripComments(fs.readFileSync(path.join(dir, file), 'utf-8'))
    const lines = source.split('\n')
    lines.forEach((line, idx) => {
      const literals = [...line.matchAll(HEX_RE), ...line.matchAll(RGB_RE)].map((m) => m[0])
      for (const literal of literals) {
        if (isAllowed(name, literal, line)) continue
        findings.push({ location: `${name}/${file}:${idx + 1}`, literal })
      }
    })
  }
  return findings
}

function run(): number {
  const names = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((d) => fs.statSync(path.join(COMPONENTS_DIR, d)).isDirectory())

  const all = names.flatMap(auditComponent)
  if (all.length === 0) {
    console.log(`✓ no hardcoded semantic colors (${names.length} components)`)
    return 0
  }
  for (const f of all) console.log(`✗ ${f.location} ${f.literal}`)
  console.log(
    `\n${all.length} hardcoded color literal(s) in semantic roles — replace with a theme.colors token,` +
      ` or add a documented entry to BRAND_ALLOWLIST if the color is genuinely brand-fixed.`
  )
  return 1
}

if (require.main === module) {
  process.exit(run())
}
