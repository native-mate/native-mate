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
})
