// Audits the docs site's hand-written prop tables against each component's real
// .types.ts. Prop tables drift silently: a component gains `testID` or changes
// `error` from boolean to ErrorProp, and the docs keep describing the old API
// until a consumer writes the documented prop and gets nothing. That is the
// exact failure this repo has already paid for twice.
//
// Usage:
//   ts-node scripts/audit-docs-props.ts            # report drift, exit 1 if any
//   ts-node scripts/audit-docs-props.ts --missing  # only props absent from docs
import fs from 'fs'
import path from 'path'
import ts from 'typescript'

const COMPONENTS_DIR = path.join(__dirname, '../components')
const DOCS_FILE = path.join(__dirname, '../../../docs/src/app/components/[slug]/page.tsx')

// Props the docs deliberately omit from every table: inherited RN passthroughs
// and internal plumbing that is not part of the component's own contract.
const DOC_EXEMPT = new Set([
  'children', 'style', 'testID', 'accessibilityLabel', 'accessibilityHint',
  'accessibilityRole', 'accessibilityState', 'accessibilityValue',
])

// Documented props a component forwards from React Native without redeclaring
// them on its own interface.
const INHERITED_OK = new Set(['style', 'edges', 'onLayout', 'pointerEvents'])

function pascal(slug: string): string {
  return slug.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('')
}

/** Prop names declared on the component's main `<Name>Props` interface. */
function propsFromTypes(slug: string): Set<string> | null {
  const file = path.join(COMPONENTS_DIR, slug, `${slug}.types.ts`)
  if (!fs.existsSync(file)) return null
  const sf = ts.createSourceFile(file, fs.readFileSync(file, 'utf-8'), ts.ScriptTarget.ES2020, true)
  const wanted = `${pascal(slug)}Props`
  const out = new Set<string>()

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === wanted) {
      for (const member of node.members) {
        if ((ts.isPropertySignature(member) || ts.isMethodSignature(member)) && member.name) {
          out.add(member.name.getText(sf).replace(/['"]/g, ''))
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return out.size > 0 ? out : null
}

/** Prop names the docs site documents, per component slug. */
function propsFromDocs(): Map<string, Set<string>> {
  const src = fs.readFileSync(DOCS_FILE, 'utf-8')
  const result = new Map<string, Set<string>>()

  // Each entry looks like:  'badge': { ... props: [ { name: 'variant', ... } ] ... },
  const entryRe = /^ {2}'?([a-z][a-z-]*)'?:\s*\{/gm
  const starts: Array<{ slug: string; index: number }> = []
  for (const m of src.matchAll(entryRe)) starts.push({ slug: m[1], index: m.index! })

  starts.forEach((entry, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : src.length
    const body = src.slice(entry.index, end)
    const propsBlock = body.match(/props:\s*\[([\s\S]*?)\n\s{4}\]/)
    const names = new Set<string>()
    if (propsBlock) {
      for (const nm of propsBlock[1].matchAll(/\{\s*name:\s*'([^']+)'/g)) names.add(nm[1])
    }
    result.set(entry.slug, names)
  })

  return result
}

export function runAudit(missingOnly: boolean): number {
  if (!fs.existsSync(DOCS_FILE)) {
    console.log('✓ docs prop tables not present in this checkout — skipping')
    return 0
  }

  const documented = propsFromDocs()
  let drifted = 0

  for (const [slug, docProps] of documented) {
    const real = propsFromTypes(slug)
    if (!real) continue // no types file (composite/aliased component) — nothing to compare

    const missing = [...real].filter((p) => !docProps.has(p) && !DOC_EXEMPT.has(p))
    // A documented prop that is not on the interface is a phantom — a consumer
    // writes it and gets silence. Two exceptions: spread notation for inherited
    // props (`...TextInputProps`), and RN passthroughs a component forwards
    // without redeclaring.
    const phantom = missingOnly
      ? []
      : [...docProps].filter(
          (p) => !real.has(p) && !p.startsWith('...') && !INHERITED_OK.has(p),
        )

    if (missing.length === 0 && phantom.length === 0) continue
    drifted++
    console.log(`✗ ${slug}`)
    if (missing.length) console.log(`    undocumented: ${missing.join(', ')}`)
    if (phantom.length) console.log(`    not in types: ${phantom.join(', ')}`)
  }

  if (drifted === 0) {
    console.log(`✓ docs prop tables match component types (${documented.size} documented)`)
    return 0
  }
  console.log(`\n${drifted} component(s) whose docs disagree with their types.`)
  return 1
}

if (require.main === module) {
  process.exit(runAudit(process.argv.includes('--missing')))
}
