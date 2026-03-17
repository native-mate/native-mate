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
  { name: 'button', version: '0.3.0', description: '6 variants, 3 sizes, ButtonGroup, icon-only, rounded pill, custom color, haptic, full-width, loading, spring animation.', category: 'primitives' },

  { name: 'text', version: '0.1.0', description: 'Typed typography with size, weight, and color tokens.', category: 'primitives' },
  { name: 'icon', version: '0.1.0', description: 'SVG icon wrapper with size and color from tokens.', category: 'primitives' },
  { name: 'spinner', version: '0.1.0', description: 'Animated loading indicator in three sizes.', category: 'primitives' },
  { name: 'separator', version: '0.1.0', description: 'Horizontal or vertical divider line.', category: 'primitives' },
  { name: 'input', version: '0.3.0', description: '3 sizes, prefix/suffix icons+text, floating label, password toggle with keyboard-keep, clearable, char count, shake on error, haptic on focus.', category: 'forms' },
  { name: 'textarea', version: '0.2.0', description: 'Auto-growing multi-line input: min/max rows, char count with warning, floating label, submit-on-Enter, mention detection (@), voice input slot, read-only, shake on error.', category: 'forms' },
  { name: 'checkbox', version: '0.2.0', description: 'Indeterminate state, description, sizes, custom color, label-left, error, CheckboxGroup with horizontal layout, haptic.', category: 'forms' },
  { name: 'radio', version: '0.2.0', description: 'Card style, description, sizes, horizontal group, error, disabled options, haptic, spring animation.', category: 'forms' },
  { name: 'switch', version: '0.2.0', description: '3 sizes, label+description, custom color, loading state with spinner, labelPosition left/right, haptic, spring animation.', category: 'forms' },
  { name: 'slider', version: '0.2.0', description: 'Single + Range slider, showValue, marks/ticks, custom color, disabled, spring thumb scale, haptic at each step.', category: 'forms' },
  { name: 'select', version: '0.2.0', description: 'Searchable, multi-select with chips, option groups, descriptions, clearable, error, required, disabled options, animated chevron.', category: 'forms' },
  { name: 'otp-input', version: '0.2.0', description: '3 variants (box/underline/rounded), secure mode, alphanumeric, blinking cursor, shake on error, success state, resend timer, haptic.', category: 'forms' },
  { name: 'card', version: '0.1.0', description: 'Container with header, content, and footer slots.', category: 'layout' },
  { name: 'accordion', version: '0.1.0', description: 'Animated height expansion, single or multi-open.', category: 'layout' },
  { name: 'tabs', version: '0.1.0', description: 'Horizontal tabs with sliding indicator animation.', category: 'layout' },
  { name: 'badge', version: '0.2.0', description: '6 semantic variants (+ warning), 3 sizes, dot indicator, count overflow (99+), dismissible, haptic.', category: 'display' },
  { name: 'avatar', version: '0.2.0', description: 'Image + auto-initials/color from name, 5 sizes, status dot (online/offline/busy/away), circle/square shape, AvatarGroup stack with overflow count.', category: 'display' },
  { name: 'tag', version: '0.1.0', description: 'Compact dismissible label chip.', category: 'display' },
  { name: 'empty-state', version: '0.1.0', description: 'Icon + heading + description + action.', category: 'display' },
  { name: 'sheet', version: '0.1.0', description: 'Bottom sheet with snap points and drag-to-close.', category: 'overlay' },
  { name: 'dialog', version: '0.1.0', description: 'Modal dialog with accessible focus management.', category: 'overlay' },
  { name: 'action-sheet', version: '0.1.0', description: 'iOS-style action sheet built on Sheet.', category: 'overlay' },
  { name: 'tooltip', version: '0.1.0', description: 'Contextual bubble anchored to any element.', category: 'overlay' },
  { name: 'toast', version: '0.2.0', description: 'Auto-dismissing notification: 4 variants, swipe-to-dismiss, action button, progress bar countdown, persistent mode, top/bottom position, useToast hook + ToastProvider, haptic on show.', category: 'feedback' },
  { name: 'progress', version: '0.2.0', description: 'Linear bar and circular ring variants, 3 sizes, showValue label, indeterminate shimmer animation, custom color/trackColor.', category: 'feedback' },
  { name: 'skeleton', version: '0.1.0', description: 'Shimmer placeholder for loading content.', category: 'feedback' },
]
