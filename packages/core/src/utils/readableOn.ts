import { parseColor } from './withAlpha'

// Picks a legible foreground for an ARBITRARY background — the case no `on*`
// token can cover, because the background is supplied by the caller at runtime
// (a custom Button color, a Switch track tint, a Chip fill). Token pairs like
// primary/onPrimary still handle every themed surface; this is only for fills
// the theme has never seen.
//
// WCAG relative luminance with the standard 0.179 threshold.
const NEAR_BLACK = '#111111'
const NEAR_WHITE = '#ffffff'

function channel(v: number): number {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(color: string): number | null {
  const parsed = parseColor(color)
  if (!parsed) return null
  const [r, g, b] = parsed
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function readableOn(background: string): string {
  const lum = relativeLuminance(background)
  // Unparseable background: assume a dark fill, which is the common case for
  // accent colors, and keep light text.
  if (lum === null) return NEAR_WHITE
  return lum > 0.179 ? NEAR_BLACK : NEAR_WHITE
}
