import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { detectPackageManager, installCommand } from '../utils/detect-pm'

describe('detectPackageManager', () => {
  let tmp: string

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'nm-pm-'))
  })

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true })
  })

  it('detects npm from package-lock.json', () => {
    writeFileSync(join(tmp, 'package-lock.json'), '{}')
    expect(detectPackageManager(tmp)).toBe('npm')
  })

  it('detects yarn from yarn.lock', () => {
    writeFileSync(join(tmp, 'yarn.lock'), '')
    expect(detectPackageManager(tmp)).toBe('yarn')
  })

  it('detects pnpm from pnpm-lock.yaml', () => {
    writeFileSync(join(tmp, 'pnpm-lock.yaml'), '')
    expect(detectPackageManager(tmp)).toBe('pnpm')
  })

  it('detects bun from bun.lockb', () => {
    writeFileSync(join(tmp, 'bun.lockb'), '')
    expect(detectPackageManager(tmp)).toBe('bun')
  })

  it('defaults to npm when no lockfile', () => {
    expect(detectPackageManager(tmp)).toBe('npm')
  })

  it('bun takes priority over npm (both lockfiles present)', () => {
    writeFileSync(join(tmp, 'bun.lockb'), '')
    writeFileSync(join(tmp, 'package-lock.json'), '{}')
    expect(detectPackageManager(tmp)).toBe('bun')
  })
})

describe('installCommand', () => {
  it('generates correct npm command', () => {
    expect(installCommand('npm', ['react', 'react-dom'])).toBe('npm install react react-dom')
  })

  it('generates correct yarn command', () => {
    expect(installCommand('yarn', ['@native-mate/core'])).toBe('yarn add @native-mate/core')
  })

  it('generates correct pnpm command', () => {
    expect(installCommand('pnpm', ['chalk'])).toBe('pnpm add chalk')
  })

  it('generates correct bun command', () => {
    expect(installCommand('bun', ['a', 'b'])).toBe('bun add a b')
  })
})
