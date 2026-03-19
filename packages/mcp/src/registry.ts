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
  // Primitives
  { name: 'button',       version: '0.3.0', description: '6 variants, 3 sizes, ButtonGroup, icon-only, rounded pill, custom color, haptic, full-width, loading, spring animation.', category: 'primitives' },
  { name: 'text',         version: '0.1.0', description: '13 variants (h1–h6, body, label, caption, overline, code), 6 weight presets, color tokens, align, transform, truncation, selectable.', category: 'primitives' },
  { name: 'icon',         version: '0.1.0', description: 'Ionicons wrapper — xs/sm/md/lg/xl/2xl size presets, all theme color tokens, opacity, decorative a11y hiding.', category: 'primitives' },
  { name: 'spinner',      version: '0.1.0', description: '3 variants (circle/dots/pulse), 4 size presets, all theme colors, speed control (slow/normal/fast/ms), label, overlay mode.', category: 'primitives' },
  { name: 'separator',    version: '0.1.0', description: 'Horizontal/vertical divider — optional centered label, dashed style, custom thickness/color/spacing, decorative a11y.', category: 'primitives' },

  // Forms
  { name: 'input',        version: '0.3.0', description: '3 sizes, prefix/suffix icons+text, floating label, password toggle, clearable (Ionicons), char count, shake on error, haptic on focus.', category: 'forms' },
  { name: 'textarea',     version: '0.2.0', description: 'Auto-growing multi-line: min/max rows, char count, floating label, submit-on-Enter, mention detection, mic icon (Ionicons), shake on error.', category: 'forms' },
  { name: 'checkbox',     version: '0.2.0', description: 'Indeterminate state, description, sizes, custom color, label-left, error, CheckboxGroup, Ionicons checkmark, haptic.', category: 'forms' },
  { name: 'radio',        version: '0.2.0', description: 'Card style, description, sizes, horizontal group, error, disabled options, haptic, smooth color transition.', category: 'forms' },
  { name: 'switch',       version: '0.2.0', description: '3 sizes, label+description, custom color, loading spinner, labelPosition left/right, haptic, spring animation.', category: 'forms' },
  { name: 'slider',       version: '0.2.0', description: 'Single + Range slider, showValue, marks/ticks, custom color, disabled, spring thumb, haptic. Reliable PanResponder via gestureState.dx.', category: 'forms' },
  { name: 'select',       version: '0.2.0', description: 'Searchable, multi-select with Checkbox chips, option groups, descriptions, clearable, error, keyboard-aware sheet.', category: 'forms' },
  { name: 'otp-input',    version: '0.2.0', description: '3 variants (box/underline/rounded), secure mode, alphanumeric, blinking cursor, shake on error, success state, resend timer, haptic.', category: 'forms' },

  // Layout
  { name: 'card',         version: '0.2.0', description: 'CardHeader/CardContent/CardFooter sub-components, loading skeleton prop, image cover, 3 variants (elevated/outline/flat), pressable, Ionicons.', category: 'layout' },
  { name: 'accordion',    version: '0.1.0', description: 'Animated height expansion, single or multi-open, Ionicons chevron.', category: 'layout' },
  { name: 'tabs',         version: '0.1.0', description: 'Horizontal tabs with sliding indicator animation.', category: 'layout' },

  // Display
  { name: 'badge',        version: '0.3.0', description: '6 variants + info, 3 sizes, 3 appearances (solid/soft/outline), animated pulse dot, count overflow (99+), icon slot, dismissible, Ionicons.', category: 'display' },
  { name: 'avatar',       version: '0.2.0', description: 'Image + auto-initials/color from name, 5 sizes, status dot (online/offline/busy/away), circle/square shape, AvatarGroup with overflow count.', category: 'display' },
  { name: 'tag',          version: '0.2.0', description: 'Selectable chip with animated color, 5 variants, icon slot, 3 sizes, removable, TagGroup (single/multi select), haptic.', category: 'display' },
  { name: 'empty-state',  version: '0.1.0', description: 'Icon + heading + description + action.', category: 'display' },

  // Overlay
  { name: 'sheet',        version: '0.1.0', description: 'Bottom sheet with snap points, drag-to-close, keyboard-aware lift.', category: 'overlay' },
  { name: 'modal',        version: '0.2.0', description: 'Animated dialog with title, description, close button, footer actions (default/primary/destructive), backdrop dismiss, lifecycle-safe animation.', category: 'overlay' },
  { name: 'action-sheet', version: '0.2.0', description: 'iOS-style bottom sheet with handle, title/message header, actions with destructive variant, separate cancel button, Ionicons, lifecycle-safe animation.', category: 'overlay' },
  { name: 'tooltip',      version: '0.2.0', description: 'Contextual text bubble on press-and-hold, 4 placements (top/bottom/left/right), arrow indicator, delay, Modal-based screen-level positioning.', category: 'overlay' },
  { name: 'popover',      version: '0.1.0', description: 'Interactive content bubble anchored to any element, 4 placements, arrow indicator, backdrop dismiss, scrollable content, Modal-based screen-level positioning.', category: 'overlay' },
  { name: 'alert',        version: '0.2.0', description: '5 variants (default/info/success/warning/destructive), Ionicons icon, dismissible, action button, description text.', category: 'overlay' },

  // Feedback
  { name: 'toast',        version: '0.3.0', description: '4 variants, Modal screen-level positioning, avatar for social notifications, multiple actions, swipe-to-dismiss (horizontal+vertical), progress bar, persistent, useToast hook, Ionicons.', category: 'feedback' },
  { name: 'progress',     version: '0.2.0', description: 'Linear bar + circular ring, 3 sizes, showValue, indeterminate shimmer, custom color/trackColor, correct circular inner background.', category: 'feedback' },
  { name: 'skeleton',     version: '0.2.0', description: 'Shimmer + pulse variants, SkeletonText (multi-line), SkeletonAvatar (circle + text), SkeletonCard (image + text).', category: 'feedback' },
]
