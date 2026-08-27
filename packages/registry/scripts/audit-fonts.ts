// Flags components that pin `fontFamily` to a literal string or to `undefined`.
// The brand font system is per-weight: consumers register a family per weight in
// `theme.typography.family` and components resolve it with
// `fontStyle(theme.typography, weight)` from core. A literal family ignores the
// consumer's brand font entirely; `fontFamily: undefined` is worse — it silently
// resets an inherited brand font back to the system face.
//
// Usage: ts-node scripts/audit-fonts.ts   # report offenders, exit 1 if any
import fs from 'fs'
import path from 'path'

const COMPONENTS_DIR = path.join(__dirname, '../components')

// `fontFamily: <value>` up to the end of the property. `fontFamily?: string` in
// a props type is not matched (the `?` breaks the pattern), which is intended —
// components may still accept a caller-supplied family.
const FONT_FAMILY_RE = /fontFamily\s*:\s*([^,\n}]+)/g

// Blank out comments (preserving offsets, so line numbers stay accurate).
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

// Sanctioned core resolvers. `fontStyle(theme.typography, weight)` covers the
// per-weight brand families; `monoFontFamily(theme.typography)` covers code and
// tabular text, returning `typography.family.mono` when a brand themes it and
// the platform's default mono face otherwise. Both are theme-driven, so a call
// to either is a resolution, not a hardcoded family.
const SANCTIONED_RESOLVER_RE = /^(?:monoFontFamily|fontStyle)\s*\(/

function describe(value: string): string | null {
  const v = value.trim()
  if (SANCTIONED_RESOLVER_RE.test(v)) return null
  if (v === 'undefined') return 'undefined (resets an inherited brand font)'
  // A bare literal, or Platform.select arms that are all literals.
  if (/^['"`]/.test(v)) return `literal ${v}`
  if (/^Platform\.select/.test(v) && /['"`]/.test(v)) return 'per-platform literals via Platform.select'
  return null
}

function auditComponent(name: string): string[] {
  const dir = path.join(COMPONENTS_DIR, name)
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))

  const findings: string[] = []
  for (const file of files) {
    const source = stripComments(fs.readFileSync(path.join(dir, file), 'utf-8'))
    for (const m of source.matchAll(FONT_FAMILY_RE)) {
      const detail = describe(m[1])
      if (!detail) continue
      const line = source.slice(0, m.index ?? 0).split('\n').length
      findings.push(`${name}/${file}:${line} fontFamily set to ${detail}`)
    }
  }
  return findings
}

function run(): number {
  const names = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((d) => fs.statSync(path.join(COMPONENTS_DIR, d)).isDirectory())

  const all = names.flatMap(auditComponent)
  if (all.length === 0) {
    console.log(`✓ every component resolves fonts through the theme (${names.length} components)`)
    return 0
  }
  for (const f of all) console.log(`✗ ${f}`)
  console.log(
    `\n${all.length} hardcoded fontFamily value(s) — resolve fonts with fontStyle(theme.typography, weight) from core.`
  )
  return 1
}

if (require.main === module) {
  process.exit(run())
}
