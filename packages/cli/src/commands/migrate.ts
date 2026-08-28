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

// Renaming a prop by name alone would also hit `const errorMessage = ...`, so
// both patterns are anchored to JSX-attribute syntax:
//   valued     — `name={…}` / `name="…"`, with no space before `=` (a variable
//                declaration is written `name = value`, which this misses)
//   shorthand  — `name` followed by whitespace, `/`, or `>`, and NOT by `=`
const valuedAttr = (name: string) => new RegExp(`(\\s)${name}(=[{"'])`, 'g')
const shorthandAttr = (name: string) => new RegExp(`(\\s)${name}\\b(?!\\s*[=:.\\w])`, 'g')

function hasAttr(tag: string, name: string): boolean {
  return valuedAttr(name).test(tag) || shorthandAttr(name).test(tag)
}

// A JSX opening tag on a capitalised component, tolerating quoted strings and
// one level of nested braces inside expression attributes.
const OPENING_TAG = /<[A-Z][\w.]*((?:[^>"'{]|"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^{}]*\})*\})*)\/?>/g

/**
 * Renames a prop, but ONLY within a JSX element that does not already carry the
 * destination prop. Renaming blindly produces a duplicate attribute — and since
 * duplicate JSX props are legal JavaScript where the LAST one wins, the result
 * is silent: `error={cond}` followed by `error="msg"` pins the field to a
 * permanent error state. Conflicting elements are left untouched and reported
 * for manual review instead, the same way string icons are.
 */
function renameAttr(src: string, from: string, to: string): [string, number, number] {
  let count = 0
  let conflicts = 0

  const out = src.replace(OPENING_TAG, (tag) => {
    if (!hasAttr(tag, from)) return tag
    if (hasAttr(tag, to)) {
      conflicts++
      return tag
    }
    let next = tag.replace(valuedAttr(from), (_m, ws, tail) => {
      count++
      return `${ws}${to}${tail}`
    })
    next = next.replace(shorthandAttr(from), (_m, ws) => {
      count++
      return `${ws}${to}`
    })
    return next
  })

  return [out, count, conflicts]
}

const RENAMES: Array<[string, string]> = [
  ['errorMessage', 'error'],
  ['hapticOnFocus', 'haptic'],
  ['hapticOnDrag', 'haptic'],
  ['hapticOnPress', 'haptic'],
]

export interface CodemodResult {
  code: string
  counts: Record<string, number>
  manualIcons: number
  /** Elements carrying both the old and new prop — a human must merge them. */
  conflicts: Record<string, number>
}

// Exported for tests: the whole rename surface, applied to one source string.
export function applyV05Codemod(src: string): CodemodResult {
  let code = src
  const counts: Record<string, number> = {}
  const conflicts: Record<string, number> = {}
  for (const [from, to] of RENAMES) {
    const [next, n, c] = renameAttr(code, from, to)
    code = next
    if (n > 0) counts[`${from} → ${to}`] = (counts[`${from} → ${to}`] || 0) + n
    if (c > 0) conflicts[`${from} + ${to}`] = (conflicts[`${from} + ${to}`] || 0) + c
  }
  return { code, counts, manualIcons: (code.match(/\sicon=["'][^"']+["']/g) || []).length, conflicts }
}

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
  const conflicted: Array<{ file: string; pair: string; count: number }> = []
  let changedFiles = 0

  for (const file of files) {
    let src: string
    try {
      src = readFileSync(file, 'utf-8')
    } catch {
      continue
    }

    const { code, counts: fileCounts, manualIcons, conflicts } = applyV05Codemod(src)
    for (const [rule, n] of Object.entries(fileCounts)) {
      counts.set(rule, (counts.get(rule) || 0) + n)
    }
    for (const [pair, n] of Object.entries(conflicts)) {
      conflicted.push({ file, pair, count: n })
    }
    if (manualIcons > 0) manual.push({ file, count: manualIcons })

    if (code !== src) {
      changedFiles++
      if (!options.dry) writeFileSync(file, code, 'utf-8')
    }
  }

  if (counts.size === 0 && manual.length === 0 && conflicted.length === 0) {
    p.outro(pc.green('Already on the v0.5 prop contracts — nothing to change.'))
    return
  }

  for (const [rule, n] of counts) {
    p.log.success(`${rule} ${pc.dim(`(${n})`)}`)
  }

  if (conflicted.length > 0) {
    const total = conflicted.reduce((a, b) => a + b.count, 0)
    p.log.warn(
      `${total} element(s) already carry BOTH props — left untouched, merge them by hand:`,
    )
    p.log.info(
      pc.dim('  error={cond} errorMessage="msg"  →  error={cond ? "msg" : false}'),
    )
    p.log.info(
      pc.dim('  Renaming these would produce a duplicate JSX attribute where the last'),
    )
    p.log.info(
      pc.dim('  one silently wins — pinning the field to a permanent error state.'),
    )
    for (const c of conflicted.slice(0, 10)) {
      p.log.message(`  ${pc.dim(c.file)} ${pc.yellow(`${c.pair} ×${c.count}`)}`)
    }
    if (conflicted.length > 10) {
      p.log.message(pc.dim(`  …and ${conflicted.length - 10} more file(s)`))
    }
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
