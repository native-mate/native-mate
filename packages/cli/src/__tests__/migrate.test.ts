import { describe, it, expect } from 'vitest'
import { applyV05Codemod } from '../commands/migrate'

describe('v0.5 codemod', () => {
  it('renames valued JSX attributes', () => {
    const { code } = applyV05Codemod('<OTPInput errorMessage="Invalid" hapticOnFocus={true} />')
    expect(code).toBe('<OTPInput error="Invalid" haptic={true} />')
  })

  it('renames shorthand boolean attributes, including self-closing', () => {
    expect(applyV05Codemod('<Input hapticOnDrag />').code).toBe('<Input haptic />')
    expect(applyV05Codemod('<Chip hapticOnDrag/>').code).toBe('<Chip haptic/>')
  })

  it('leaves variables and object keys alone', () => {
    const src = [
      "const errorMessage = 'not a prop'",
      "const obj = { errorMessage: 'also not a prop' }",
      'console.log(state.errorMessage)',
    ].join('\n')
    expect(applyV05Codemod(src).code).toBe(src)
  })

  it('counts every replacement, not every file', () => {
    const { counts } = applyV05Codemod(
      '<A errorMessage={x} /><B errorMessage="y" /><C hapticOnPress="heavy" />',
    )
    expect(counts['errorMessage → error']).toBe(2)
    expect(counts['hapticOnPress → haptic']).toBe(1)
  })

  it('flags string icons for a human instead of rewriting them', () => {
    const src = '<Button icon="star">Go</Button>'
    const { code, manualIcons } = applyV05Codemod(src)
    expect(code).toBe(src) // untouched — the replacement is a JSX element
    expect(manualIcons).toBe(1)
  })

  it('does not flag node-valued icons', () => {
    expect(applyV05Codemod('<Button icon={<Star />} />').manualIcons).toBe(0)
  })

  // Renaming into an element that already has the destination prop produces a
  // duplicate JSX attribute. That is legal JavaScript where the LAST one wins,
  // so it fails silently — `error={cond}` + `error="msg"` pins the field to a
  // permanent error state before the user types anything.
  describe('duplicate-attribute safety', () => {
    it('leaves an element that already has the destination prop untouched', () => {
      const src = '<OTPInput error={otpError} errorMessage="Wrong OTP" />'
      const { code, conflicts, counts } = applyV05Codemod(src)
      expect(code).toBe(src)
      expect(conflicts['errorMessage + error']).toBe(1)
      expect(counts['errorMessage → error']).toBeUndefined()
    })

    it('catches the shorthand form of the collision too', () => {
      const src = '<Input haptic="heavy" hapticOnFocus />'
      const { code, conflicts } = applyV05Codemod(src)
      expect(code).toBe(src)
      expect(conflicts['hapticOnFocus + haptic']).toBe(1)
    })

    it('still renames elements that only have the old prop', () => {
      const { code, conflicts } = applyV05Codemod('<Field errorMessage="only one" />')
      expect(code).toBe('<Field error="only one" />')
      expect(conflicts['errorMessage + error']).toBeUndefined()
    })

    it('handles a conflicting and a clean element in the same file', () => {
      const src = [
        '<A error={x} errorMessage="dup" />',
        '<B errorMessage="clean" />',
      ].join('\n')
      const { code, counts, conflicts } = applyV05Codemod(src)
      expect(code).toContain('<A error={x} errorMessage="dup" />') // untouched
      expect(code).toContain('<B error="clean" />') // renamed
      expect(counts['errorMessage → error']).toBe(1)
      expect(conflicts['errorMessage + error']).toBe(1)
    })

    it('does not confuse props across adjacent elements', () => {
      const src = '<A error={x} /><B errorMessage="msg" />'
      const { code, conflicts } = applyV05Codemod(src)
      expect(code).toBe('<A error={x} /><B error="msg" />')
      expect(conflicts['errorMessage + error']).toBeUndefined()
    })
  })
})
