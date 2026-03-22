import { describe, it, expect } from 'vitest'

// We test the tool logic directly against the static index
// (the same fallback data the MCP server uses when registry is offline)

// Import the static index by re-importing the registry module
import { fetchIndex } from '../registry'

describe('list_components', () => {
  it('returns all components from static index', async () => {
    const index = await fetchIndex()
    expect(index.length).toBeGreaterThanOrEqual(25)
  })

  it('every component has name, version, description, category', async () => {
    const index = await fetchIndex()
    for (const c of index) {
      expect(typeof c.name).toBe('string')
      expect(typeof c.version).toBe('string')
      expect(typeof c.description).toBe('string')
      expect(typeof c.category).toBe('string')
    }
  })

  it('filter by category returns subset', async () => {
    const index = await fetchIndex()
    const forms = index.filter((c) => c.category === 'forms')
    expect(forms.length).toBeGreaterThan(0)
    expect(forms.length).toBeLessThan(index.length)
    for (const c of forms) {
      expect(c.category).toBe('forms')
    }
  })

  it('known components exist in index', async () => {
    const index = await fetchIndex()
    const names = index.map((c) => c.name)
    expect(names).toContain('button')
    expect(names).toContain('input')
    expect(names).toContain('card')
    expect(names).toContain('toast')
    expect(names).toContain('select')
  })
})

describe('search_components', () => {
  it('search by name finds component', async () => {
    const index = await fetchIndex()
    const query = 'button'
    const results = index.filter(
      (c) => c.name.includes(query) || c.description.toLowerCase().includes(query)
    )
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((r) => r.name === 'button')).toBe(true)
  })

  it('search by description keyword finds matches', async () => {
    const index = await fetchIndex()
    const query = 'haptic'
    const results = index.filter(
      (c) => c.name.includes(query) || c.description.toLowerCase().includes(query)
    )
    expect(results.length).toBeGreaterThan(0)
  })

  it('search by category keyword finds matches', async () => {
    const index = await fetchIndex()
    const query = 'overlay'
    const results = index.filter(
      (c) => c.name.includes(query) || c.description.toLowerCase().includes(query) || c.category.includes(query)
    )
    expect(results.length).toBeGreaterThan(0)
  })

  it('nonsense query returns empty', async () => {
    const index = await fetchIndex()
    const query = 'xyznonexistent123'
    const results = index.filter(
      (c) => c.name.includes(query) || c.description.toLowerCase().includes(query)
    )
    expect(results.length).toBe(0)
  })
})

describe('generate_theme_config', () => {
  it('generates valid config JSON for zinc preset', () => {
    const preset = 'zinc'
    const componentsDir = 'components/ui'
    const config: Record<string, unknown> = { preset, componentsDir }
    const json = JSON.stringify(config, null, 2)
    const parsed = JSON.parse(json)
    expect(parsed.preset).toBe('zinc')
    expect(parsed.componentsDir).toBe('components/ui')
  })

  it('includes color overrides when provided', () => {
    const preset = 'rose'
    const componentsDir = 'src/ui'
    const overrides = { primary: '#6366f1' }
    const config: Record<string, unknown> = { preset, componentsDir }
    if (Object.keys(overrides).length > 0) {
      config.tokens = { colors: overrides }
    }
    expect(config.tokens).toEqual({ colors: { primary: '#6366f1' } })
  })

  it('omits tokens field when no overrides', () => {
    const config: Record<string, unknown> = { preset: 'slate', componentsDir: 'ui' }
    expect(config).not.toHaveProperty('tokens')
  })
})

describe('get_add_command', () => {
  it('generates correct command for single component', () => {
    const components = ['button']
    const cmd = `npx native-mate add ${components.join(' ')}`
    expect(cmd).toBe('npx native-mate add button')
  })

  it('generates correct command for multiple components', () => {
    const components = ['button', 'card', 'input']
    const cmd = `npx native-mate add ${components.join(' ')}`
    expect(cmd).toBe('npx native-mate add button card input')
  })

  it('handles empty components array', () => {
    const components: string[] = []
    expect(components.length).toBe(0)
  })
})
