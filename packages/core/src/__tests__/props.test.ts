import { describe, it, expect, beforeEach } from 'vitest'
import { resolveError, resolveHaptic } from '../types/props'
import { mergeStrings, defaultStrings } from '../i18n/strings'
import { devWarn, deprecatedProp, __resetDevWarnings } from '../utils/devWarn'

describe('resolveError', () => {
  it('treats a string as an error with a message', () => {
    expect(resolveError('Required')).toEqual({ hasError: true, message: 'Required' })
  })

  it('treats an empty string as no error', () => {
    expect(resolveError('')).toEqual({ hasError: false, message: '' })
  })

  it('supports the boolean form other components used', () => {
    expect(resolveError(true)).toEqual({ hasError: true })
    expect(resolveError(false)).toEqual({ hasError: false })
    expect(resolveError(undefined)).toEqual({ hasError: false })
  })
})

describe('resolveHaptic', () => {
  it('defaults to light when unspecified', () => {
    expect(resolveHaptic()).toBe('light')
    expect(resolveHaptic(true)).toBe('light')
  })

  it('disables on false and none', () => {
    expect(resolveHaptic(false)).toBeNull()
    expect(resolveHaptic('none')).toBeNull()
  })

  it('passes explicit styles through', () => {
    expect(resolveHaptic('heavy')).toBe('heavy')
    expect(resolveHaptic('medium')).toBe('medium')
  })
})

describe('strings', () => {
  it('returns English defaults with no overrides', () => {
    expect(mergeStrings()).toBe(defaultStrings)
    expect(mergeStrings().cancel).toBe('Cancel')
  })

  it('merges partial overrides over English', () => {
    const s = mergeStrings({ cancel: 'Annuler' })
    expect(s.cancel).toBe('Annuler')
    expect(s.confirm).toBe(defaultStrings.confirm)
  })

  it('supports function-valued strings for interpolation', () => {
    expect(mergeStrings().resendIn(30)).toBe('Resend in 30s')
    expect(mergeStrings({ resendIn: (n) => `${n}s` }).resendIn(5)).toBe('5s')
  })
})

describe('devWarn', () => {
  beforeEach(() => __resetDevWarnings())

  it('warns once per key, so a long list emits one line', () => {
    const seen: string[] = []
    const original = console.warn
    console.warn = (m: string) => { seen.push(m) }
    try {
      for (let i = 0; i < 200; i++) devWarn('dup', 'same message')
    } finally {
      console.warn = original
    }
    expect(seen).toHaveLength(1)
  })

  it('deprecatedProp returns the value and names the migration', () => {
    const seen: string[] = []
    const original = console.warn
    console.warn = (m: string) => { seen.push(m) }
    try {
      expect(deprecatedProp('errorMessage', 'error', 'boom')).toBe('boom')
    } finally {
      console.warn = original
    }
    expect(seen[0]).toContain('errorMessage')
    expect(seen[0]).toContain('migrate v0.5')
  })
})
