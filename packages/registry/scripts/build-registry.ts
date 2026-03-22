import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const COMPONENTS_DIR = path.join(__dirname, '../components')
const DIST_DIR = path.join(__dirname, '../dist/registry')

function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16)
}

function buildRegistry() {
  if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true })

  const componentDirs = fs.readdirSync(COMPONENTS_DIR).filter((d) =>
    fs.statSync(path.join(COMPONENTS_DIR, d)).isDirectory()
  )

  for (const name of componentDirs) {
    const dir = path.join(COMPONENTS_DIR, name)
    const metaPath = path.join(dir, 'index.json')
    if (!fs.existsSync(metaPath)) continue

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    const files: Array<{ path: string; content: string; hash: string }> = []

    for (const file of meta.files) {
      if (file.path.endsWith('.stories.tsx')) continue
      const filePath = path.join(dir, file.path)
      if (!fs.existsSync(filePath)) { console.warn(`Missing: ${filePath}`); continue }

      let raw = fs.readFileSync(filePath, 'utf-8')
      // Transform cross-component imports from directory layout (../name/name)
      // to flat file layout (./name) for CLI output
      raw = raw.replace(/from\s+['"]\.\.\/([^/]+)\/\1['"]/g, "from './$1'")
      const lines = raw.split('\n')
      // Only strip existing header if present; otherwise keep all lines
      const hasHeader = lines[0]?.startsWith('// native-mate:')
      const bodyLines = hasHeader ? lines.slice(1) : lines
      const body = bodyLines.join('\n')
      const hash = hashContent(body)
      const header = `// native-mate: ${name}@${meta.version} | hash:${hash}`
      const content = [header, ...bodyLines].join('\n')
      files.push({ path: file.path, content, hash })
    }

    const output = { name, version: meta.version, description: meta.description ?? '', files, dependencies: meta.dependencies }
    const outDir = path.join(DIST_DIR, name)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, `${meta.version}.json`), JSON.stringify(output, null, 2))
    fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(output, null, 2))
    console.log(`✓ ${name}@${meta.version}`)
  }
  // Build index.json
  const index = {
    components: componentDirs
      .filter((name) => fs.existsSync(path.join(COMPONENTS_DIR, name, 'index.json')))
      .map((name) => {
        const meta = JSON.parse(fs.readFileSync(path.join(COMPONENTS_DIR, name, 'index.json'), 'utf-8'))
        return {
          name,
          version: meta.version,
          description: meta.description ?? '',
          category: meta.category ?? 'other',
        }
      }),
  }
  fs.writeFileSync(path.join(DIST_DIR, 'index.json'), JSON.stringify(index, null, 2))
  console.log(`\n✓ index.json (${index.components.length} components)`)
  console.log(`Registry built → ${DIST_DIR}`)
}

buildRegistry()
