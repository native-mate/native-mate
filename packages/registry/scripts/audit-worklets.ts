// Flags Reanimated worklet bodies that capture element-typed props.
// A useAnimatedStyle/useDerivedValue worklet closure copies every referenced
// variable to the UI thread; a React element (FiberNode) cannot be serialized,
// so Reanimated 4 crashes at mount with "[Worklets] Cannot copy value of type
// FiberNode". Compute plain values outside the worklet instead.
//
// Usage: ts-node scripts/audit-worklets.ts   # report offenders, exit 1 if any
import fs from 'fs'
import path from 'path'

const COMPONENTS_DIR = path.join(__dirname, '../components')

const WORKLET_HOOKS = ['useAnimatedStyle', 'useDerivedValue', 'useAnimatedProps']

// Prop declarations typed as React elements in *.types.ts files.
const ELEMENT_PROP_RE = /(\w+)\??:\s*(?:React\.)?(?:ReactNode|ReactElement(?:<[^>]*>)?|JSX\.Element)/g

// Extract the balanced (...) argument span starting at the hook call.
function workletBodies(source: string): Array<{ hook: string; body: string; line: number }> {
  const out: Array<{ hook: string; body: string; line: number }> = []
  for (const hook of WORKLET_HOOKS) {
    let idx = 0
    while ((idx = source.indexOf(hook + '(', idx)) !== -1) {
      const start = idx + hook.length
      let depth = 0
      let end = start
      for (; end < source.length; end++) {
        if (source[end] === '(') depth++
        else if (source[end] === ')' && --depth === 0) break
      }
      out.push({
        hook,
        body: source.slice(start + 1, end),
        line: source.slice(0, idx).split('\n').length,
      })
      idx = end
    }
  }
  return out
}

// Reanimated invokes an animation's completion callback as (finished, current).
// When a new animation starts on the same shared value the old one is CANCELLED
// and its callback still fires, with finished === false. A callback that flips
// state or fires onDismiss without checking will close the thing that just
// opened — the cancelled hide runs after the show that cancelled it.
const COMPLETION_CB = /with(?:Timing|Spring|Decay)\([^\n]*?,\s*\(([^)]*)\)\s*=>\s*\{([\s\S]{0,400}?)\n\s*\}\)/g

function completionCallbacks(source: string, file: string): string[] {
  const out: string[] = []
  for (const m of source.matchAll(COMPLETION_CB)) {
    const [, params, body] = m
    if (!body.includes('runOnJS')) continue
    const checksFinished = /finished/.test(params) && /if\s*\(!\s*finished\s*\)/.test(body)
    if (!checksFinished) {
      const line = source.slice(0, m.index!).split('\n').length
      out.push(`${file}:${line} animation completion callback ignores \`finished\` — a cancelled animation still runs it`)
    }
  }
  return out
}

// GestureHandlerRootView ships flex: 1 and RNGH requires it. Overriding that
// with an absolute fill inside an RN Modal lets the root measure zero height on
// Android, which collapses any `bottom: 0` child to the top of the screen. Jest
// cannot catch this: HAS_RNGH is false there, so the root falls back to a plain
// View and the bug is unreachable.
const RNGH_ROOT_STYLE = /<Root\b[^>]*?style=\{(?:\[)?\s*styles\.(\w+)/g

function rnghRootStyles(source: string, file: string): string[] {
  if (!source.includes('GestureHandlerRootView')) return []
  const out: string[] = []
  for (const m of source.matchAll(RNGH_ROOT_STYLE)) {
    const name = m[1]
    const decl = source.match(new RegExp(`\\b${name}:\\s*\\{([^}]*)\\}`))
    if (!decl) continue
    if (/absoluteFill|position:\s*'absolute'/.test(decl[1])) {
      const line = source.slice(0, m.index!).split('\n').length
      out.push(`${file}:${line} RNGH root uses absolutely-positioned style \`${name}\` — it needs flex: 1`)
    }
  }
  return out
}

function auditComponent(name: string): string[] {
  const dir = path.join(COMPONENTS_DIR, name)
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))

  // children is element-typed even when not declared explicitly.
  const elementProps = new Set<string>(['children'])
  for (const f of files.filter((f) => f.endsWith('.types.ts'))) {
    const src = fs.readFileSync(path.join(dir, f), 'utf-8')
    for (const m of src.matchAll(ELEMENT_PROP_RE)) elementProps.add(m[1])
  }

  const findings: string[] = []
  for (const f of files.filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))) {
    const src = fs.readFileSync(path.join(dir, f), 'utf-8')
    findings.push(...completionCallbacks(src, `${name}/${f}`))
    findings.push(...rnghRootStyles(src, `${name}/${f}`))
    for (const { hook, body, line } of workletBodies(src)) {
      for (const prop of elementProps) {
        if (new RegExp(`\\b${prop}\\b`).test(body)) {
          findings.push(`${name}/${f}:${line} ${hook} worklet references element-typed prop "${prop}"`)
        }
      }

      // A worklet that reads `theme.…` captures the ENTIRE theme object and
      // copies it to the UI thread on every evaluation. Hoist the values you
      // need to plain consts outside the worklet so only strings/numbers cross.
      if (/\btheme\s*\./.test(body)) {
        findings.push(`${name}/${f}:${line} ${hook} worklet reads theme.* — hoist the value outside the worklet`)
      }

      // Returning a different set of keys per branch leaves the props from the
      // other branch stuck: Reanimated never resets a key it does not receive.
      if (/return\s*\{\s*\}/.test(body)) {
        findings.push(`${name}/${f}:${line} ${hook} worklet returns {} on one branch — return the same keys with neutral values`)
      }
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
    console.log(`✓ worklets are clean — no element captures, no theme reads, no branch-divergent keys (${names.length} components)`)
    return 0
  }
  for (const f of all) console.log(`✗ ${f}`)
  console.log(`\n${all.length} worklet issue(s). Compute plain values outside the worklet, and return the same keys from every branch.`)
  return 1
}

if (require.main === module) {
  process.exit(run())
}
