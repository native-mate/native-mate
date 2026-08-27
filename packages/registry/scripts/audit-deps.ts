// Audits every component's index.json dependency metadata against the imports
// actually present in its source files. The CLI auto-installs npm and component
// dependencies from this metadata, so drift here means broken `native-mate add`.
//
// Usage:
//   ts-node scripts/audit-deps.ts         # report mismatches, exit 1 if any
//   ts-node scripts/audit-deps.ts --fix   # rewrite index.json files (and bump
//                                         # the patch version of changed ones)
import fs from 'fs'
import path from 'path'

const COMPONENTS_DIR = path.join(__dirname, '../components')

// Packages every consuming app is guaranteed to have: core's peer deps plus
// core itself. Everything else a component imports must be declared.
const BASELINE = new Set(['react', 'react-native', 'react-native-reanimated', '@native-mate/core'])

// Packages a component loads inside `try { require(...) } catch {}` to light up
// an extra capability. The CLI installs whatever this metadata declares, so
// listing these would force a native rebuild on every consumer for a feature
// that already degrades gracefully. They may be declared, but are never
// required — the component works without them.
const OPTIONAL = new Set(['react-native-gesture-handler', 'expo-haptics'])

const IMPORT_RE = /(?:from\s*|import\s*\(\s*|require\(\s*)['"]([^'"]+)['"]/g

function packageName(spec: string): string {
  const parts = spec.split('/')
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

interface AuditResult {
  name: string
  expectedNpm: string[]
  expectedComponents: string[]
  declaredNpm: string[]
  declaredComponents: string[]
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values)].sort()
}

function auditComponent(name: string): AuditResult | null {
  const dir = path.join(COMPONENTS_DIR, name)
  const metaPath = path.join(dir, 'index.json')
  if (!fs.existsSync(metaPath)) return null
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))

  const npm: string[] = []
  const components: string[] = []

  for (const file of meta.files ?? []) {
    if (file.path.endsWith('.stories.tsx')) continue
    const filePath = path.join(dir, file.path)
    if (!fs.existsSync(filePath)) continue
    const source = fs.readFileSync(filePath, 'utf-8')

    for (const match of source.matchAll(IMPORT_RE)) {
      const spec = match[1]
      if (spec.startsWith('.')) {
        const rel = spec.match(/^\.\.\/([^/]+)\//)
        if (rel && rel[1] !== name) components.push(rel[1])
        continue
      }
      const pkg = packageName(spec)
      if (!BASELINE.has(pkg) && !OPTIONAL.has(pkg)) npm.push(pkg)
    }
  }

  return {
    name,
    expectedNpm: sortedUnique(npm),
    expectedComponents: sortedUnique(components),
    // Optional packages are tolerated in metadata but never demanded, so an
    // existing declaration doesn't read as drift either way.
    declaredNpm: sortedUnique((meta.dependencies?.npm ?? []).filter((d: string) => !OPTIONAL.has(d))),
    declaredComponents: sortedUnique(meta.dependencies?.components ?? []),
  }
}

function bumpPatch(version: string): string {
  const parts = version.split('.')
  parts[2] = String(Number(parts[2]) + 1)
  return parts.join('.')
}

export function runAudit(fix: boolean): number {
  const names = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((d) => fs.statSync(path.join(COMPONENTS_DIR, d)).isDirectory())

  let mismatches = 0
  for (const name of names) {
    const result = auditComponent(name)
    if (!result) continue

    const npmOk = JSON.stringify(result.expectedNpm) === JSON.stringify(result.declaredNpm)
    const compOk = JSON.stringify(result.expectedComponents) === JSON.stringify(result.declaredComponents)
    if (npmOk && compOk) continue

    mismatches++
    console.log(`✗ ${name}`)
    if (!npmOk) console.log(`    npm        declared [${result.declaredNpm}] actual [${result.expectedNpm}]`)
    if (!compOk) console.log(`    components declared [${result.declaredComponents}] actual [${result.expectedComponents}]`)

    if (fix) {
      const metaPath = path.join(COMPONENTS_DIR, name, 'index.json')
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
      meta.dependencies = { npm: result.expectedNpm, components: result.expectedComponents }
      meta.version = bumpPatch(meta.version)
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
      console.log(`    fixed → ${meta.version}`)
    }
  }

  if (mismatches === 0) {
    console.log(`✓ dependency metadata matches imports for all ${names.length} components`)
  } else if (!fix) {
    console.log(`\n${mismatches} component(s) with dependency drift. Run with --fix to repair.`)
  }
  return fix ? 0 : mismatches === 0 ? 0 : 1
}

if (require.main === module) {
  process.exit(runAudit(process.argv.includes('--fix')))
}
