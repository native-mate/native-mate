import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { join, extname, isAbsolute, resolve } from 'path'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import { printBranding } from '../utils/branding'

interface MigrateOptions {
  dry?: boolean
  path?: string
}

const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx'])
const SKIP_DIRS = new Set(['node_modules', '.git', '.expo', 'dist', 'build', 'ios', 'android', '.next'])

interface Rewrite {
  name: string
  /** Applied to file contents; returns [newSource, replacementCount]. */
  apply: (src: string) => [string, number]
  /** Sites that need a human — reported, never rewritten. */
  flag?: (src: string) => number
}

// Renaming a prop by name alone would also hit `const errorMessage = ...`, so
// both patterns are anchored to JSX-attribute syntax:
//   valued     — `name={…}` / `name="…"`, with no space before `=` (a variable
//                declaration is written `name = value`, which this misses)
//   shorthand  — `name` followed by whitespace, `/`, or `>`, and NOT by `=`
const valuedAttr = (name: string) => new RegExp(`(\\s)${name}(=[{"'])`, 'g')
const shorthandAttr = (name: string) => new RegExp(`(\\s)${name}\\b(?!\\s*[=:.\\w])`, 'g')

function renameAttr(src: string, from: string, to: string): [string, number] {
  let count = 0
  let out = src.replace(valuedAttr(from), (_m, ws, tail) => {
    count++
    return `${ws}${to}${tail}`
  })
  out = out.replace(shorthandAttr(from), (_m, ws) => {
    count++
    return `${ws}${to}`
  })
  return [out, count]
}

const RENAMES: Array<[string, string]> = [
  ['errorMessage', 'error'],
  ['hapticOnFocus', 'haptic'],
  ['hapticOnDrag', 'haptic'],
  ['hapticOnPress', 'haptic'],
]

// Exported for tests: the whole rename surface, applied to one source string.
export function applyV05Codemod(src: string): { code: string; counts: Record<string, number>; manualIcons: number } {
  let code = src
  const counts: Record<string, number> = {}
  for (const [from, to] of RENAMES) {
    const [next, n] = renameAttr(code, from, to)
    code = next
    if (n > 0) counts[`${from} → ${to}`] = (counts[`${from} → ${to}`] || 0) + n
  }
  return { code, counts, manualIcons: (code.match(/\sicon=["'][^"']+["']/g) || []).length }
}

const REWRITES: Rewrite[] = [
  ...RENAMES.map(([from, to]): Rewrite => ({
    name: `${from} → ${to}`,
    apply: (src) => renameAttr(src, from, to),
  })),
  {
    // icon="chevron-forward" can't be rewritten safely: the replacement is a
    // JSX element whose icon set the codemod can't choose for the caller.
    name: 'icon="<string>" (manual)',
    apply: (src) => [src, 0],
    flag: (src) => (src.match(/\sicon=["'][^"']+["']/g) || []).length,
  },
]

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue
    const full = join(dir, entry)
    let s
    try {
      s = statSync(full)
    } catch {
      continue
    }
    if (s.isDirectory()) walk(full, out)
    else if (EXTS.has(extname(entry))) out.push(full)
  }
  return out
}

export async function migrate(version: string | undefined, options: MigrateOptions) {
  printBranding()
  p.intro(pc.bgCyan(pc.black(' native-mate migrate ')))

  const target = (version || 'v0.5').replace(/^v?/, 'v')
  if (target !== 'v0.5') {
    p.log.error(`No migration available for "${target}". Supported: v0.5`)
    process.exit(1)
  }

  const cwd = options.path
    ? (isAbsolute(options.path) ? options.path : resolve(process.cwd(), options.path))
    : process.cwd()
  const files = walk(cwd)
  p.log.step(`Scanning ${pc.cyan(String(files.length))} file(s) under ${pc.dim(cwd)}`)

  const counts = new Map<string, number>()
  const manual: Array<{ file: string; count: number }> = []
  let changedFiles = 0

  for (const file of files) {
    let src: string
    try {
      src = readFileSync(file, 'utf-8')
    } catch {
      continue
    }
    let next = src

    for (const rule of REWRITES) {
      if (rule.flag) {
        const n = rule.flag(next)
        if (n > 0) manual.push({ file, count: n })
        continue
      }
      const [applied, n] = rule.apply(next)
      next = applied
      if (n > 0) counts.set(rule.name, (counts.get(rule.name) || 0) + n)
    }

    if (next !== src) {
      changedFiles++
      if (!options.dry) writeFileSync(file, next, 'utf-8')
    }
  }

  if (counts.size === 0 && manual.length === 0) {
    p.outro(pc.green('Already on the v0.5 prop contracts — nothing to change.'))
    return
  }

  for (const [rule, n] of counts) {
    p.log.success(`${rule} ${pc.dim(`(${n})`)}`)
  }

  if (manual.length > 0) {
    const total = manual.reduce((a, b) => a + b.count, 0)
    p.log.warn(
      `${total} string-valued ${pc.cyan('icon')} prop(s) need a manual edit — ` +
        `icon is now a ReactNode:`,
    )
    p.log.info(pc.dim('  icon="star"  →  icon={<Ionicons name="star" size={16} />}'))
    for (const m of manual.slice(0, 10)) {
      p.log.message(`  ${pc.dim(m.file)} ${pc.yellow(`×${m.count}`)}`)
    }
    if (manual.length > 10) p.log.message(pc.dim(`  …and ${manual.length - 10} more file(s)`))
  }

  p.outro(
    options.dry
      ? pc.yellow(`Dry run — ${changedFiles} file(s) would change. Re-run without --dry to apply.`)
      : pc.green(`Updated ${changedFiles} file(s).`),
  )
}
