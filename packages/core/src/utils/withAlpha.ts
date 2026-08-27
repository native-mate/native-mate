// Applies an alpha channel to any CSS-ish color a theme token might hold.
// Components used to do `theme.colors.primary + '15'`, which silently produces
// garbage for rgb()/named/8-digit-hex brand overrides. Always returns rgba().
const NAMED: Record<string, [number, number, number]> = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  transparent: [0, 0, 0],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
}

export function parseColor(color: string): [number, number, number, number] | null {
  const c = color.trim().toLowerCase()

  if (c.startsWith('#')) {
    const hex = c.slice(1)
    const expand = (s: string) => parseInt(s.length === 1 ? s + s : s, 16)
    if (hex.length === 3 || hex.length === 4) {
      const [r, g, b, a] = [hex[0], hex[1], hex[2], hex[3]]
      return [expand(r), expand(g), expand(b), a === undefined ? 1 : expand(a) / 255]
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
      if ([r, g, b].some(Number.isNaN)) return null
      return [r, g, b, a]
    }
    return null
  }

  const fn = c.match(/^rgba?\(([^)]+)\)$/)
  if (fn) {
    const parts = fn[1].split(/[,/\s]+/).filter(Boolean).map(Number)
    if (parts.length < 3 || parts.slice(0, 3).some(Number.isNaN)) return null
    return [parts[0], parts[1], parts[2], parts[3] === undefined ? 1 : parts[3]]
  }

  if (c === 'transparent') return [0, 0, 0, 0]
  const named = NAMED[c]
  return named ? [named[0], named[1], named[2], 1] : null
}

export function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha))
  const parsed = parseColor(color)
  // Unparseable (exotic named color): hand back the original rather than
  // rendering something wrong — the color stays correct, just opaque.
  if (!parsed) return color
  const [r, g, b, existing] = parsed
  return `rgba(${r}, ${g}, ${b}, ${Number((existing * a).toFixed(3))})`
}
