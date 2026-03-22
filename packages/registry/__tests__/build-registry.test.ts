import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import crypto from 'crypto'

const DIST_DIR = join(__dirname, '../dist/registry')
const COMPONENTS_DIR = join(__dirname, '../components')

describe('registry build output', () => {
  it('dist/registry directory exists', () => {
    expect(existsSync(DIST_DIR)).toBe(true)
  })

  it('index.json exists and lists all components', () => {
    const indexPath = join(DIST_DIR, 'index.json')
    expect(existsSync(indexPath)).toBe(true)
    const index = JSON.parse(readFileSync(indexPath, 'utf-8'))
    expect(index).toHaveProperty('components')
    expect(Array.isArray(index.components)).toBe(true)
    expect(index.components.length).toBeGreaterThanOrEqual(25)
  })

  it('each component in index has name, version, description, category', () => {
    const index = JSON.parse(readFileSync(join(DIST_DIR, 'index.json'), 'utf-8'))
    for (const comp of index.components) {
      expect(comp).toHaveProperty('name')
      expect(comp).toHaveProperty('version')
      expect(comp).toHaveProperty('description')
      expect(comp).toHaveProperty('category')
      expect(typeof comp.name).toBe('string')
      expect(typeof comp.version).toBe('string')
    }
  })

  it('every component directory has a latest.json in dist', () => {
    const componentDirs = readdirSync(COMPONENTS_DIR).filter((d) => {
      return existsSync(join(COMPONENTS_DIR, d, 'index.json'))
    })
    for (const name of componentDirs) {
      const latestPath = join(DIST_DIR, name, 'latest.json')
      expect(existsSync(latestPath), `Missing latest.json for ${name}`).toBe(true)
    }
  })

  it('latest.json has correct structure (name, version, files, dependencies)', () => {
    const latest = JSON.parse(readFileSync(join(DIST_DIR, 'button', 'latest.json'), 'utf-8'))
    expect(latest).toHaveProperty('name', 'button')
    expect(latest).toHaveProperty('version')
    expect(latest).toHaveProperty('files')
    expect(latest).toHaveProperty('dependencies')
    expect(Array.isArray(latest.files)).toBe(true)
  })

  it('each file entry has path, content, and hash', () => {
    const latest = JSON.parse(readFileSync(join(DIST_DIR, 'button', 'latest.json'), 'utf-8'))
    for (const file of latest.files) {
      expect(file).toHaveProperty('path')
      expect(file).toHaveProperty('content')
      expect(file).toHaveProperty('hash')
      expect(typeof file.hash).toBe('string')
      expect(file.hash.length).toBe(16)
    }
  })

  it('file content starts with the native-mate header line', () => {
    const latest = JSON.parse(readFileSync(join(DIST_DIR, 'button', 'latest.json'), 'utf-8'))
    const mainFile = latest.files.find((f: any) => f.path.endsWith('.tsx'))
    expect(mainFile).toBeDefined()
    expect(mainFile.content.startsWith('// native-mate:')).toBe(true)
  })

  it('hash is deterministic — SHA-256 of content without header', () => {
    const latest = JSON.parse(readFileSync(join(DIST_DIR, 'button', 'latest.json'), 'utf-8'))
    const mainFile = latest.files.find((f: any) => f.path.endsWith('.tsx'))
    const lines = mainFile.content.split('\n')
    const contentWithoutHeader = lines.slice(1).join('\n')
    const expectedHash = crypto.createHash('sha256').update(contentWithoutHeader).digest('hex').slice(0, 16)
    expect(mainFile.hash).toBe(expectedHash)
  })
})
