import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { writeCursorRules } from '../utils/cursorrules'

describe('writeCursorRules', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'nm-cr-'))
  })

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true })
  })

  it('creates .cursorrules if it does not exist', () => {
    writeCursorRules(tmp)
    expect(existsSync(join(tmp, '.cursorrules'))).toBe(true)
  })

  it('written file contains native-mate marker', () => {
    writeCursorRules(tmp)
    const content = readFileSync(join(tmp, '.cursorrules'), 'utf-8')
    expect(content).toContain('# native-mate')
  })

  it('written file contains key guidelines', () => {
    writeCursorRules(tmp)
    const content = readFileSync(join(tmp, '.cursorrules'), 'utf-8')
    expect(content).toContain('makeStyles')
    expect(content).toContain('useTheme')
    expect(content).toContain('Reanimated')
    expect(content).toContain('native-mate add')
  })

  it('appends to existing .cursorrules without duplicating', () => {
    writeFileSync(join(tmp, '.cursorrules'), '# My project rules\n- Always use TypeScript\n')
    writeCursorRules(tmp)
    const content = readFileSync(join(tmp, '.cursorrules'), 'utf-8')
    expect(content).toContain('# My project rules')
    expect(content).toContain('# native-mate')
  })

  it('is idempotent — calling twice does not duplicate', () => {
    writeCursorRules(tmp)
    const first = readFileSync(join(tmp, '.cursorrules'), 'utf-8')
    writeCursorRules(tmp)
    const second = readFileSync(join(tmp, '.cursorrules'), 'utf-8')
    expect(first).toBe(second)
  })
})
