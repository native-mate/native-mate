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

      const raw = fs.readFileSync(filePath, 'utf-8')
      const lines = raw.split('\n')
      // Hash is computed over content WITHOUT the first header line
      const contentWithoutHeader = lines.slice(1).join('\n')
      const hash = hashContent(contentWithoutHeader)
      const header = `// native-mate: ${name}@${meta.version} | hash:${hash}`
      const content = [header, ...lines.slice(1)].join('\n')
      files.push({ path: file.path, content, hash })
    }

    const output = { name, version: meta.version, description: meta.description ?? '', files, dependencies: meta.dependencies }
    const outDir = path.join(DIST_DIR, name)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, `${meta.version}.json`), JSON.stringify(output, null, 2))
    fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(output, null, 2))
    console.log(`✓ ${name}@${meta.version}`)
  }
  console.log(`\nRegistry built → ${DIST_DIR}`)
}

buildRegistry()
