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
    for (const { hook, body, line } of workletBodies(src)) {
      for (const prop of elementProps) {
        if (new RegExp(`\\b${prop}\\b`).test(body)) {
          findings.push(`${name}/${f}:${line} ${hook} worklet references element-typed prop "${prop}"`)
        }
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
    console.log(`✓ no worklet captures element-typed props (${names.length} components)`)
    return 0
  }
  for (const f of all) console.log(`✗ ${f}`)
  console.log(`\n${all.length} worklet(s) capture element-typed props — compute plain values outside the worklet.`)
  return 1
}

if (require.main === module) {
  process.exit(run())
}
