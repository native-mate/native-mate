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

  // Commerce / stats
  { name: 'cart-item', version: '0.1.0', description: 'Shopping cart item row with image, quantity stepper, swipe-to-remove, and animated price', category: 'display' },
  { name: 'payment-card', version: '0.1.0', description: 'Credit card display with gradient styling and masked numbers, or input form with validation', category: 'display' },
  { name: 'pricing-card', version: '0.1.0', description: 'Subscription plan card with price, features list, popular badge, and CTA button', category: 'display' },
  { name: 'product-card', version: '0.1.0', description: 'E-commerce product card with image, pricing, ratings, favorite toggle, and add-to-cart', category: 'display' },
  { name: 'quantity-stepper', version: '0.1.0', description: 'Plus/minus quantity control with animated press feedback and long-press rapid increment', category: 'forms' },
  { name: 'review-card', version: '0.1.0', description: 'User review card with star rating, author info, expandable text, images, and helpful voting', category: 'display' },
  { name: 'stat-card', version: '0.1.0', description: 'KPI metric card with animated counter, trend indicator, and skeleton loading', category: 'display' },
  { name: 'countdown', version: '0.1.0', description: 'Countdown timer with animated digit flip, card/inline/minimal variants', category: 'display' },
  { name: 'notification-card', version: '0.1.0', description: 'Notification list item with category accent, unread indicator, relative time, and swipe dismiss', category: 'display' },

  // Forms
  { name: 'chip', version: '0.1.0', description: 'Selectable chip with animated selection state, icon/avatar support, closable mode, and ChipGroup layout helper', category: 'forms' },
  { name: 'color-picker', version: '0.1.0', description: 'Color picker with preset swatches, hue/saturation/lightness sliders, and hex input', category: 'forms' },
  { name: 'date-picker', version: '0.1.0', description: 'Custom calendar date picker with scroll wheel time selector and bottom sheet presentation', category: 'forms' },
  { name: 'mention-input', version: '0.1.0', description: 'Text input with @mention autocomplete, user dropdown, and highlighted mention chips', category: 'forms' },
  { name: 'phone-input', version: '0.1.0', description: 'International phone number input with country picker, flag display, and auto-formatting', category: 'forms' },
  { name: 'pin-lock', version: '0.1.0', description: 'PIN entry screen with animated dot fill, number pad, shake on error, biometric button, and lockout timer', category: 'forms' },
  { name: 'rating', version: '0.1.0', description: 'Star rating with animated fill, half-star support, haptic feedback per star, and read-only display mode', category: 'forms' },
  { name: 'search-bar', version: '0.1.0', description: 'Animated search input with slide-in cancel button, suggestions dropdown, loading state, and clear button', category: 'forms' },
  { name: 'segmented-control', version: '0.1.0', description: 'iOS-style segmented toggle with animated sliding pill indicator', category: 'forms' },
  { name: 'social-login-button', version: '0.1.0', description: 'Branded social authentication buttons for Google, Apple, GitHub, Facebook, Twitter, and Discord', category: 'forms' },
  { name: 'toggle-group', version: '0.1.0', description: 'Multi-option toggle with animated sliding indicator, single/multiple selection modes, and icon support', category: 'forms' },
  { name: 'stepper', version: '0.1.0', description: 'Multi-step progress indicator with animated transitions and connecting lines', category: 'forms' },
  { name: 'file-upload', version: '0.1.0', description: 'File/image picker with dropzone, button, and compact variants, file previews, and progress bars', category: 'forms' },

  // Interaction
  { name: 'draggable-list', version: '0.1.0', description: 'Reorderable list with long-press drag, shadow lift, and smooth 60fps reorder animations', category: 'interaction' },
  { name: 'swipeable-row', version: '0.1.0', description: 'Swipe-to-reveal actions row with spring physics and destructive full-swipe', category: 'interaction' },

  // Navigation
  { name: 'fab', version: '0.1.0', description: 'Floating action button with speed dial fan-out, extended label mode, spring animations, and haptic feedback', category: 'navigation' },
  { name: 'speed-dial', version: '0.1.0', description: 'FAB speed dial with rotating icon, staggered spring-animated actions, backdrop dim, and labels', category: 'navigation' },
  { name: 'bottom-bar', version: '0.1.0', description: 'Bottom navigation bar with animated sliding indicator, badge support with pulse animation, and haptic feedback', category: 'navigation' },
  { name: 'breadcrumb', version: '0.1.0', description: 'Navigation breadcrumb path with configurable separators, middle truncation, and icon support', category: 'navigation' },
  { name: 'header', version: '0.1.0', description: 'Custom navigation header with large title mode, animated collapse on scroll, transparent/blur modes, and safe area awareness', category: 'navigation' },

  // Display
  { name: 'audio-player', version: '0.1.0', description: 'Audio player with play/pause, progress bar, track info, artwork, and compact mode', category: 'display' },
  { name: 'banner', version: '0.1.0', description: 'App banner with slide in/out animation, four variants (info/warning/success/error), action button, and auto-dismiss', category: 'feedback' },
  { name: 'carousel', version: '0.1.0', description: 'Horizontal snap carousel with animated expanding pagination dots, auto-play, loop mode, and configurable item width', category: 'display' },
  { name: 'chat-bubble', version: '0.1.0', description: 'Chat message bubble with sender alignment, delivery status, avatar, and bubble tail', category: 'display' },
  { name: 'comment', version: '0.1.0', description: 'Threaded comment with nested replies, like/reply actions, relative timestamps, and author interaction', category: 'display' },
  { name: 'data-table', version: '0.1.0', description: 'Data table with sortable columns, horizontal scroll, sticky header, striped rows, and loading skeleton', category: 'display' },
  { name: 'image', version: '0.1.0', description: 'Enhanced image with fade-in on load, shimmer/blur/color placeholders, fallback source, and error state with icon', category: 'display' },
  { name: 'list-item', version: '0.1.0', description: 'Universal list row with leading/trailing slots, press animation, destructive variant, compact mode, and divider support', category: 'display' },
  { name: 'markdown', version: '0.1.0', description: 'Markdown renderer supporting headings, bold, italic, code, links, lists, blockquotes, images, and rules', category: 'display' },
  { name: 'timeline', version: '0.1.0', description: 'Vertical timeline with animated stagger entrance, status nodes, and connecting lines', category: 'display' },
  { name: 'video-player', version: '0.1.0', description: 'Inline video player with play/pause overlay, progress bar, time display, and fullscreen toggle', category: 'display' },
  { name: 'reaction-bar', version: '0.1.0', description: 'Emoji reaction bar with animated count change, own-reaction highlight, and add reaction button', category: 'display' },

  // Layout
  { name: 'divider-label', version: '0.1.0', description: 'Labeled divider with center/left/right positioning, solid and dashed line variants, and theme-aware colors', category: 'layout' },
  { name: 'collapsible', version: '0.1.0', description: 'Simple expand/collapse section with animated height and chevron rotation', category: 'layout' },
  { name: 'onboarding-screen', version: '0.1.0', description: 'Full-screen onboarding slide with image, text, animated dot indicator, and navigation controls', category: 'layout' },
  { name: 'infinite-scroll', version: '0.1.0', description: 'Infinite scroll list wrapper with load-more trigger, loading indicator, and empty state', category: 'layout' },

  // Overlay
  { name: 'biometric-prompt', version: '0.1.0', description: 'Biometric authentication modal with pulse animation, success/error states, and fallback option', category: 'overlay' },
  { name: 'bottom-sheet-list', version: '0.1.0', description: 'Searchable bottom sheet list with single and multi-select, animated item appearance', category: 'overlay' },
  { name: 'dialog', version: '0.1.0', description: 'Confirm/cancel dialog with scale + fade animation, destructive variant, icon support, and backdrop dismiss', category: 'overlay' },
  { name: 'dropdown-menu', version: '0.1.0', description: 'Context menu anchored to a trigger with scale animation, icons, destructive items, and dividers', category: 'overlay' },

  // Feedback
  { name: 'pull-to-refresh', version: '0.1.0', description: 'Custom pull-to-refresh indicator with progress arc, spring animation, and haptic feedback', category: 'feedback' },
]
