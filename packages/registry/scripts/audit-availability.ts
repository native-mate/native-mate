// Guards the contract between what the registry index advertises and what
// `native-mate add` can actually install. Three ways it can break:
//
//   1. A component ships in components/ but never reaches the built index — it
//      is invisible in the interactive picker and skipped by `add --all`.
//   2. The index lists a component whose source directory is gone, or whose
//      dist entry has no latest.json — the CLI resolves `latest` and 404s.
//   3. The CLI reintroduces a hardcoded block-list. A stale COMING_SOON set
//      once hid shipped components; add.ts must stay purely index-driven.
//
// Usage: ts-node scripts/audit-availability.ts   # report mismatches, exit 1 if any
import fs from 'fs'
import path from 'path'

const COMPONENTS_DIR = path.join(__dirname, '../components')
const DIST_DIR = path.join(__dirname, '../dist/registry')
const INDEX_PATH = path.join(DIST_DIR, 'index.json')
const ADD_COMMAND = path.join(__dirname, '../../cli/src/commands/add.ts')

// Identifiers that would gate installability outside the registry index.
const BLOCK_LIST_RE = /\b(COMING_SOON|UNAVAILABLE|UNRELEASED|BLOCK(?:ED)?_?LIST|BLOCKLIST|EXCLUDED?_?(?:COMPONENTS|LIST))\b/g

function sourceComponents(): string[] {
  return fs
    .readdirSync(COMPONENTS_DIR)
    .filter((d) => fs.statSync(path.join(COMPONENTS_DIR, d)).isDirectory())
    .filter((d) => fs.existsSync(path.join(COMPONENTS_DIR, d, 'index.json')))
    .sort()
}

function auditCli(): string[] {
  if (!fs.existsSync(ADD_COMMAND)) return [`${path.relative(process.cwd(), ADD_COMMAND)} not found`]
  const source = fs.readFileSync(ADD_COMMAND, 'utf-8')
  const findings: string[] = []
  for (const m of source.matchAll(BLOCK_LIST_RE)) {
    const line = source.slice(0, m.index ?? 0).split('\n').length
    findings.push(`cli/src/commands/add.ts:${line} hardcoded availability gate "${m[0]}" — the index is the only source of truth`)
  }
  return findings
}

function auditIndex(names: string[]): string[] {
  const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'))
  const advertised: string[] = (index.components ?? []).map((c: { name: string }) => c.name)

  const findings: string[] = []
  for (const name of names) {
    if (!advertised.includes(name)) {
      findings.push(`${name} has an index.json but is missing from dist/registry/index.json — the CLI cannot see it`)
    }
  }
  for (const name of advertised) {
    if (!names.includes(name)) {
      findings.push(`${name} is advertised in dist/registry/index.json but has no source directory`)
      continue
    }
    const latest = path.join(DIST_DIR, name, 'latest.json')
    if (!fs.existsSync(latest)) {
      findings.push(`${name} is advertised but dist/registry/${name}/latest.json is missing — \`native-mate add ${name}\` would 404`)
      continue
    }
    const advertisedVersion = (index.components ?? []).find((c: { name: string }) => c.name === name)?.version
    const builtVersion = JSON.parse(fs.readFileSync(latest, 'utf-8')).version
    if (advertisedVersion && builtVersion && advertisedVersion !== builtVersion) {
      findings.push(`${name} index advertises ${advertisedVersion} but latest.json serves ${builtVersion}`)
    }
  }
  return findings
}

function run(): number {
  const names = sourceComponents()
  const findings = auditCli()

  if (!fs.existsSync(INDEX_PATH)) {
    for (const f of findings) console.log(`✗ ${f}`)
    console.log('  dist/registry/index.json not built yet — skipping index cross-check')
    return findings.length === 0 ? 0 : 1
  }

  findings.push(...auditIndex(names))

  if (findings.length === 0) {
    console.log(`✓ all ${names.length} components are installable via the registry index`)
    return 0
  }
  for (const f of findings) console.log(`✗ ${f}`)
  console.log(`\n${findings.length} availability mismatch(es) — rebuild the registry or remove the gate.`)
  return 1
}

if (require.main === module) {
  process.exit(run())
}
