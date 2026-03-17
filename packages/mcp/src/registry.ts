const REGISTRY = 'https://registry.native-mate.dev'
const GITHUB_FALLBACK = 'https://raw.githubusercontent.com/native-mate/native-mate/main/packages/registry/dist/registry'

export interface RegistryFile {
  path: string
  content: string
  hash: string
}

export interface RegistryComponent {
  name: string
  version: string
  description: string
  files: RegistryFile[]
  dependencies: {
    npm: string[]
    components: string[]
  }
}

export interface ComponentIndex {
  name: string
  version: string
  description: string
  category: string
}

export async function fetchIndex(): Promise<ComponentIndex[]> {
  try {
    const res = await fetch(`${REGISTRY}/index.json`)
    if (!res.ok) throw new Error('bad status')
    const data = (await res.json()) as { components: ComponentIndex[] }
    return data.components
  } catch {
    // Return a static list as fallback when registry is not yet live
    return STATIC_INDEX
  }
}

export async function fetchComponent(name: string): Promise<RegistryComponent> {
  try {
    const res = await fetch(`${REGISTRY}/components/${name}/latest.json`)
    if (!res.ok) throw new Error('not found')
    return res.json() as Promise<RegistryComponent>
  } catch {
    const res = await fetch(`${GITHUB_FALLBACK}/${name}/latest.json`)
    if (!res.ok) throw new Error(`Component "${name}" not found`)
    return res.json() as Promise<RegistryComponent>
  }
}

// Static index used as fallback before the registry goes live
const STATIC_INDEX: ComponentIndex[] = [
  { name: 'button', version: '0.2.0', description: '6 variants, 3 sizes, icon support, full-width, loading state, and spring animation.', category: 'primitives' },
  { name: 'text', version: '0.1.0', description: 'Typed typography with size, weight, and color tokens.', category: 'primitives' },
  { name: 'icon', version: '0.1.0', description: 'SVG icon wrapper with size and color from tokens.', category: 'primitives' },
  { name: 'spinner', version: '0.1.0', description: 'Animated loading indicator in three sizes.', category: 'primitives' },
  { name: 'separator', version: '0.1.0', description: 'Horizontal or vertical divider line.', category: 'primitives' },
  { name: 'input', version: '0.1.0', description: 'Text input with label, error state, and prefix/suffix.', category: 'forms' },
  { name: 'textarea', version: '0.1.0', description: 'Auto-growing multi-line text input.', category: 'forms' },
  { name: 'checkbox', version: '0.1.0', description: 'Animated checkbox with indeterminate state.', category: 'forms' },
  { name: 'switch', version: '0.1.0', description: 'Toggle switch with smooth Reanimated transition.', category: 'forms' },
  { name: 'slider', version: '0.1.0', description: 'Range slider with haptic feedback.', category: 'forms' },
  { name: 'select', version: '0.1.0', description: 'Bottom-sheet select, searchable.', category: 'forms' },
  { name: 'card', version: '0.1.0', description: 'Container with header, content, and footer slots.', category: 'layout' },
  { name: 'accordion', version: '0.1.0', description: 'Animated height expansion, single or multi-open.', category: 'layout' },
  { name: 'tabs', version: '0.1.0', description: 'Horizontal tabs with sliding indicator animation.', category: 'layout' },
  { name: 'badge', version: '0.1.0', description: '5 semantic variants + dot indicator.', category: 'display' },
  { name: 'avatar', version: '0.1.0', description: 'Image, initials fallback, status dot, group stack.', category: 'display' },
  { name: 'tag', version: '0.1.0', description: 'Compact dismissible label chip.', category: 'display' },
  { name: 'empty-state', version: '0.1.0', description: 'Icon + heading + description + action.', category: 'display' },
  { name: 'sheet', version: '0.1.0', description: 'Bottom sheet with snap points and drag-to-close.', category: 'overlay' },
  { name: 'dialog', version: '0.1.0', description: 'Modal dialog with accessible focus management.', category: 'overlay' },
  { name: 'action-sheet', version: '0.1.0', description: 'iOS-style action sheet built on Sheet.', category: 'overlay' },
  { name: 'tooltip', version: '0.1.0', description: 'Contextual bubble anchored to any element.', category: 'overlay' },
  { name: 'toast', version: '0.1.0', description: 'Auto-dismissing notification: success/error/warning.', category: 'feedback' },
  { name: 'progress', version: '0.1.0', description: 'Linear bar and circular ring variants.', category: 'feedback' },
  { name: 'skeleton', version: '0.1.0', description: 'Shimmer placeholder for loading content.', category: 'feedback' },
]
