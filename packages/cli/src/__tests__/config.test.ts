import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { configExists, readConfig, writeConfig } from '../utils/config'

describe('config', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'nm-cfg-'))
  })

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true })
  })

  it('configExists returns false when no config', () => {
    expect(configExists(tmp)).toBe(false)
  })

  it('writeConfig creates native-mate.json', () => {
    writeConfig({ preset: 'zinc', componentsDir: 'components/ui' }, tmp)
    expect(configExists(tmp)).toBe(true)
  })

  it('readConfig returns written config', () => {
    const config = { preset: 'rose' as const, componentsDir: 'src/ui' }
    writeConfig(config, tmp)
    const read = readConfig(tmp)
    expect(read.preset).toBe('rose')
    expect(read.componentsDir).toBe('src/ui')
  })

  it('writeConfig writes valid JSON', () => {
    writeConfig({ preset: 'slate', componentsDir: 'components/ui' }, tmp)
    const raw = readFileSync(join(tmp, 'native-mate.json'), 'utf-8')
    expect(() => JSON.parse(raw)).not.toThrow()
  })

  it('readConfig throws on missing config', () => {
    expect(() => readConfig(tmp)).toThrow('native-mate.json not found')
  })

  it('readConfig throws on malformed JSON', () => {
    const fs = require('fs')
    fs.writeFileSync(join(tmp, 'native-mate.json'), '{ invalid json }')
    expect(() => readConfig(tmp)).toThrow('malformed')
  })

  it('preserves optional registry field', () => {
    const config = {
      preset: 'midnight' as const,
      componentsDir: 'ui',
      registry: 'https://custom.registry.dev',
    }
    writeConfig(config, tmp)
    const read = readConfig(tmp)
    expect(read.registry).toBe('https://custom.registry.dev')
  })
})
