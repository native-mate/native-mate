import React from 'react'
import { notFound } from 'next/navigation'
import { CodeBlock } from '@/components/CodeBlock'
import Link from 'next/link'
import { ComponentPreview } from './ComponentPreview'
import { CopyPageButton } from '@/components/CopyPageButton'
import { TableOfContents } from '@/components/TableOfContents'
import { ThemeCustomizerProvider } from '@/components/ThemeCustomizerContext'
import { ThemeCustomizerPanel } from '@/components/ThemeCustomizerPanel'

// GitHub base URL — update once repo goes public
const GITHUB_BASE_URL = 'https://github.com/ayush-jadaun/native-mate'

// Ordered component slugs for prev / next navigation
const ALL_COMPONENT_SLUGS = [
  'text', 'icon', 'spinner', 'separator',
  'button', 'card', 'input', 'badge', 'sheet', 'accordion', 'tabs',
  'avatar', 'checkbox', 'switch', 'slider', 'select', 'textarea',
  'progress', 'skeleton', 'toast', 'radio', 'otp-input',
  'action-sheet', 'tag', 'empty-state', 'alert', 'modal',
  'cart-item', 'payment-card', 'pricing-card', 'product-card', 'quantity-stepper', 'review-card', 'stat-card', 'countdown', 'notification-card', 'chip', 'color-picker', 'date-picker', 'mention-input', 'phone-input', 'pin-lock', 'rating', 'search-bar', 'segmented-control', 'social-login-button', 'toggle-group', 'stepper', 'file-upload', 'draggable-list', 'swipeable-row', 'fab', 'speed-dial', 'audio-player', 'banner', 'carousel', 'chat-bubble', 'comment', 'data-table', 'image', 'list-item', 'markdown', 'timeline', 'video-player', 'reaction-bar', 'divider-label', 'biometric-prompt', 'bottom-sheet-list', 'dialog', 'dropdown-menu', 'popover', 'bottom-bar', 'breadcrumb', 'header', 'collapsible', 'onboarding-screen', 'infinite-scroll', 'pull-to-refresh', 'tooltip',
]

interface ComponentDoc {
  name: string
  slug: string
  description: string
  category: string
  npmDeps: string[]
  componentDeps: string[]
  props: Array<{ name: string; type: string; default?: string; description: string }>
  addCommand: string
  usageCode: string
  exampleCode?: string
  accessibility?: Array<{ feature: string; detail: string }>
}

export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  text: {
    name: 'Text',
    slug: 'text',
    description: 'Typed typography component with 13 semantic variants, 6 weight presets, color tokens, alignment, transform, and truncation support.',
    category: 'Primitives',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add text',
    accessibility: [
      { feature: 'Selectable', detail: 'Pass selectable to allow users to copy text content.' },
      { feature: 'Label', detail: 'Pass accessibilityLabel to override the read-out text for screen readers.' },
    ],
    props: [
      { name: 'variant', type: '"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"body"|"bodyLarge"|"bodySmall"|"label"|"caption"|"overline"|"code"', default: '"body"', description: 'Semantic typography preset — sets size, weight, and line-height.' },
      { name: 'weight', type: '"light"|"regular"|"medium"|"semibold"|"bold"|"extrabold"', description: 'Override the font weight independently of the variant.' },
      { name: 'color', type: '"foreground"|"muted"|"primary"|"destructive"|"success"|"warning"|string', description: 'Semantic color token or raw hex/rgb value.' },
      { name: 'align', type: '"left"|"center"|"right"|"justify"', description: 'Horizontal text alignment.' },
      { name: 'size', type: 'number', description: 'Explicit font-size in dp that overrides the variant size.' },
      { name: 'transform', type: '"none"|"uppercase"|"lowercase"|"capitalize"', description: 'CSS-like text transform.' },
      { name: 'muted', type: 'boolean', default: 'false', description: 'Shorthand for color="muted".' },
      { name: 'numberOfLines', type: 'number', description: 'Truncates text after N lines.' },
      { name: 'selectable', type: 'boolean', default: 'false', description: 'Enables text selection and copy on long-press.' },
    ],
    usageCode: `import { Text } from '~/components/ui/text'

// Variants
<Text variant="h1">Page Title</Text>
<Text variant="h3">Section heading</Text>
<Text variant="body">Regular paragraph text.</Text>
<Text variant="caption">Hint or metadata</Text>
<Text variant="overline">Section label</Text>
<Text variant="code">{'const x = 42'}</Text>

// Weights
<Text weight="bold">Bold label</Text>
<Text weight="light">Light note</Text>

// Colors (theme tokens)
<Text color="primary">Accent text</Text>
<Text color="success">All good</Text>
<Text color="destructive">Error message</Text>
<Text muted>Helper text</Text>

// Alignment
<Text align="center">Centered</Text>

// Truncation
<Text numberOfLines={1}>This long line will be cut…</Text>`,
    exampleCode: `import { Text } from '~/components/ui/text'
import { View } from 'react-native'

export function TypographyScale() {
  return (
    <View style={{ gap: 8, padding: 16 }}>
      <Text variant="h1">H1 — 36/700</Text>
      <Text variant="h2">H2 — 30/700</Text>
      <Text variant="h3">H3 — 24/600</Text>
      <Text variant="body">Body — 15/400</Text>
      <Text variant="caption" muted>Caption — 11/400</Text>
      <Text variant="overline">Overline</Text>
      <Text color="primary" weight="semibold">Primary semibold</Text>
      <Text color="success">Success</Text>
      <Text color="destructive">Destructive</Text>
    </View>
  )
}`,
  },

  icon: {
    name: 'Icon',
    slug: 'icon',
    description: 'Ionicons wrapper with semantic size presets (xs → 2xl), theme color tokens, opacity control, and correct accessibility hiding for decorative icons.',
    category: 'Primitives',
    npmDeps: ['@expo/vector-icons'],
    componentDeps: [],
    addCommand: 'npx native-mate add icon',
    accessibility: [
      { feature: 'Decorative', detail: 'Icons are hidden from VoiceOver/TalkBack by default (decorative=true). Pass decorative={false} + accessibilityLabel for meaningful icons.' },
    ],
    props: [
      { name: 'name', type: 'string', description: 'Any Ionicons icon name (e.g. "home", "heart-outline").' },
      { name: 'size', type: '"xs"|"sm"|"md"|"lg"|"xl"|"2xl"|number', default: '"md"', description: 'Preset (12/16/20/24/32/40 dp) or an explicit number.' },
      { name: 'color', type: '"foreground"|"muted"|"primary"|"destructive"|"success"|"warning"|"border"|string', default: '"foreground"', description: 'Semantic token or raw color value.' },
      { name: 'opacity', type: 'number', default: '1', description: 'Icon opacity (0–1).' },
      { name: 'decorative', type: 'boolean', default: 'true', description: 'When true, hidden from screen readers. Set false for interactive icons.' },
      { name: 'accessibilityLabel', type: 'string', description: 'Screen reader label. Required when decorative is false.' },
    ],
    usageCode: `import { Icon } from '~/components/ui/icon'

// Basic
<Icon name="home" />

// Sizes
<Icon name="star" size="xs" />  // 12dp
<Icon name="star" size="md" />  // 20dp (default)
<Icon name="star" size="xl" />  // 32dp
<Icon name="star" size={48} />  // custom

// Color tokens
<Icon name="checkmark-circle" color="success" size="lg" />
<Icon name="alert-circle"     color="warning" size="lg" />
<Icon name="close-circle"     color="destructive" size="lg" />
<Icon name="information-circle" color="primary" size="lg" />

// Custom color
<Icon name="heart" color="#f43f5e" size="xl" />

// Opacity
<Icon name="heart" color="#f43f5e" opacity={0.4} />

// Accessible (non-decorative)
<Icon
  name="trash"
  color="destructive"
  decorative={false}
  accessibilityLabel="Delete item"
/>`,
    exampleCode: `import { Icon } from '~/components/ui/icon'
import { View } from 'react-native'

export function IconExamples() {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      {/* Status icons */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Icon name="checkmark-circle" color="success"     size="xl" />
        <Icon name="alert-circle"     color="warning"     size="xl" />
        <Icon name="close-circle"     color="destructive" size="xl" />
        <Icon name="information-circle" color="primary"   size="xl" />
      </View>

      {/* Filled vs outline */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Icon name="heart"         color="primary" />
        <Icon name="heart-outline" color="primary" />
        <Icon name="star"          color="warning" />
        <Icon name="star-outline"  color="warning" />
      </View>

      {/* Dimmed */}
      <Icon name="lock-closed" color="muted" opacity={0.5} />
    </View>
  )
}`,
  },

  spinner: {
    name: 'Spinner',
    slug: 'spinner',
    description: 'Animated loading indicator with three variants (circle, dots, pulse), four size presets, speed control, all theme color tokens, and an optional full-screen overlay.',
    category: 'Primitives',
    npmDeps: ['react-native-reanimated'],
    componentDeps: [],
    addCommand: 'npx native-mate add spinner',
    accessibility: [
      { feature: 'Role', detail: 'accessibilityRole="progressbar" is set automatically.' },
      { feature: 'Label', detail: 'The label prop is read by screen readers (default: "Loading"). Pass a descriptive string when context matters.' },
      { feature: 'Live region', detail: 'accessibilityLiveRegion="polite" announces the spinner to screen readers without interrupting current speech.' },
    ],
    props: [
      { name: 'variant', type: '"circle"|"dots"|"pulse"', default: '"circle"', description: 'Animation style.' },
      { name: 'size', type: '"sm"|"md"|"lg"|number', default: '"md"', description: 'Preset (16/24/40 dp) or explicit dp.' },
      { name: 'color', type: '"primary"|"foreground"|"muted"|"destructive"|"success"|"warning"|string', default: '"primary"', description: 'Fill color — token or raw value.' },
      { name: 'speed', type: '"slow"|"normal"|"fast"|number', default: '"normal"', description: 'Cycle duration. Number = ms per full cycle.' },
      { name: 'label', type: 'string', default: '"Loading"', description: 'Accessible description for screen readers.' },
      { name: 'overlay', type: 'boolean', default: 'false', description: 'Renders the spinner centered over a semi-transparent full-parent overlay.' },
      { name: 'overlayOpacity', type: 'number', default: '0.6', description: 'Opacity of the overlay backdrop.' },
    ],
    usageCode: `import { Spinner } from '~/components/ui/spinner'

// Variants
<Spinner variant="circle" />
<Spinner variant="dots" />
<Spinner variant="pulse" />

// Sizes
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size={56} />

// Colors
<Spinner color="primary" />
<Spinner color="success" />
<Spinner color="destructive" />
<Spinner color="#a78bfa" />

// Speed
<Spinner speed="fast" />
<Spinner speed="slow" />
<Spinner speed={400} />  // custom ms

// Overlay — covers nearest positioned parent
<View style={{ position: 'relative' }}>
  <YourContent />
  {loading && <Spinner overlay overlayOpacity={0.5} />}
</View>`,
    exampleCode: `import { useState } from 'react'
import { Spinner } from '~/components/ui/spinner'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function SpinnerExample() {
  const [loading, setLoading] = useState(false)

  return (
    <View style={{ gap: 24, padding: 16 }}>
      <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
        <Spinner variant="circle" color="primary" />
        <Spinner variant="dots"   color="success" />
        <Spinner variant="pulse"  color="warning" />
      </View>

      <View style={{ position: 'relative', height: 120, backgroundColor: '#0f0f11', borderRadius: 12 }}>
        {loading && <Spinner overlay label="Processing…" />}
        <Button onPress={() => setLoading(l => !l)} style={{ margin: 16 }}>
          {loading ? 'Hide overlay' : 'Show overlay'}
        </Button>
      </View>
    </View>
  )
}`,
  },

  separator: {
    name: 'Separator',
    slug: 'separator',
    description: 'Horizontal and vertical divider line with optional centered label, dashed style, configurable thickness, color, and spacing. Accessibility-aware (decorative by default).',
    category: 'Primitives',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add separator',
    accessibility: [
      { feature: 'Decorative', detail: 'When decorative={true} (default) the separator is hidden from screen readers. Set decorative={false} when the separator has semantic meaning.' },
      { feature: 'Role', detail: 'When decorative={false}, accessibilityRole="separator" is applied automatically.' },
    ],
    props: [
      { name: 'orientation', type: '"horizontal"|"vertical"', default: '"horizontal"', description: 'Direction of the divider.' },
      { name: 'thickness', type: 'number', default: 'StyleSheet.hairlineWidth', description: 'Line width/height in dp.' },
      { name: 'color', type: 'string', description: 'Line color. Defaults to theme.colors.border.' },
      { name: 'spacing', type: 'number', default: '8', description: 'Margin on both sides (vertical for horizontal, horizontal for vertical).' },
      { name: 'label', type: 'string', description: 'Optional text centered in the line, e.g. "or".' },
      { name: 'labelColor', type: 'string', description: 'Label text color. Defaults to theme.colors.muted.' },
      { name: 'labelSize', type: 'number', default: '11', description: 'Label font size.' },
      { name: 'labelWeight', type: 'TextStyle["fontWeight"]', default: '"500"', description: 'Label font weight.' },
      { name: 'dashed', type: 'boolean', default: 'false', description: 'Renders the line as dashed instead of solid.' },
      { name: 'decorative', type: 'boolean', default: 'true', description: 'Hides from assistive technology when true.' },
    ],
    usageCode: `import { Separator } from '~/components/ui/separator'

// Default horizontal
<Separator />

// With label
<Separator label="or" />
<Separator label="continue with" />

// Dashed
<Separator dashed />
<Separator dashed label="or" />

// Custom thickness & color
<Separator thickness={2} color="#6366f1" />

// Vertical (inside a row)
<View style={{ flexDirection: 'row', height: 40 }}>
  <Button variant="ghost">Cut</Button>
  <Separator orientation="vertical" spacing={4} />
  <Button variant="ghost">Copy</Button>
  <Separator orientation="vertical" spacing={4} />
  <Button variant="ghost">Paste</Button>
</View>

// Custom spacing
<Separator spacing={16} label="section" />`,
    exampleCode: `import { Separator } from '~/components/ui/separator'
import { View } from 'react-native'

export function SeparatorExamples() {
  return (
    <View style={{ padding: 16, gap: 0 }}>
      <Separator />
      <Separator label="or" />
      <Separator dashed />
      <Separator dashed label="or" />
      <Separator thickness={2} color="#6366f1" />
      <Separator spacing={16} />

      {/* Toolbar with vertical separators */}
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 44 }}>
        <Button variant="ghost" size="sm">Cut</Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" size="sm">Copy</Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" size="sm">Paste</Button>
      </View>
    </View>
  )
}`,
  },

  button: {
    name: 'Button',
    slug: 'button',
    description: 'Feature-rich button with 6 variants, icon-only mode, button groups, rounded pill shape, custom colors, haptic feedback, and spring animation.',
    category: 'Primitives',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add button',
    accessibility: [
      { feature: 'Role', detail: 'accessibilityRole="button" is set automatically.' },
      { feature: 'Label', detail: 'accessibilityLabel is auto-derived from text children, or pass a custom one.' },
      { feature: 'Disabled state', detail: 'accessibilityState={{ disabled }} is set when disabled or loading.' },
      { feature: 'Busy state', detail: 'accessibilityState={{ busy: true }} is set when loading.' },
      { feature: 'Keyboard', detail: 'Fully pressable via assistive technology. Disabled buttons prevent interaction.' },
    ],
    props: [
      { name: 'variant', type: '"default" | "outline" | "ghost" | "destructive" | "secondary" | "link"', default: '"default"', description: 'Visual style of the button.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls height and padding.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows an ActivityIndicator and disables press.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables press.' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches button to fill container width.' },
      { name: 'rounded', type: 'boolean', default: 'false', description: 'Applies fully rounded pill shape (borderRadius: 9999).' },
      { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Square/circle button with only an icon, no text.' },
      { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"light"', description: 'Haptic feedback intensity on press. Requires expo-haptics (optional).' },
      { name: 'color', type: 'string', description: 'Custom color override. Sets background for default, border for outline.' },
      { name: 'iconLeft', type: 'React.ReactNode', description: 'Element rendered before the label.' },
      { name: 'iconRight', type: 'React.ReactNode', description: 'Element rendered after the label.' },
      { name: 'onPress', type: '() => void', description: 'Press handler.' },
    ],
    usageCode: `import { Button, ButtonGroup } from '~/components/ui/button'

// Variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="link">Learn more</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Rounded pill
<Button rounded>Rounded</Button>

// Icon only (square or circle)
<Button iconOnly iconLeft={<PlusIcon />} />
<Button iconOnly rounded iconLeft={<HeartIcon />} />

// With icons
<Button iconLeft={<PlusIcon />}>Add Item</Button>
<Button iconRight={<ArrowIcon />} variant="outline">Next</Button>

// Custom color
<Button color="#6366f1">Indigo</Button>
<Button color="#10b981" variant="outline">Emerald</Button>

// Full width
<Button fullWidth>Save Changes</Button>

// Haptic feedback
<Button haptic="light">Light tap</Button>
<Button haptic="heavy">Strong tap</Button>
<Button haptic="none">No haptic</Button>

// Button group (segmented control)
<ButtonGroup fullWidth>
  <Button>Day</Button>
  <Button>Week</Button>
  <Button>Month</Button>
</ButtonGroup>

<ButtonGroup fullWidth>
  <Button variant="outline">Cancel</Button>
  <Button variant="default">Confirm</Button>
</ButtonGroup>

// Loading & disabled
<Button loading>Saving…</Button>
<Button disabled>Disabled</Button>`,
    exampleCode: `import { Button, ButtonGroup } from '~/components/ui/button'
import { View } from 'react-native'

export function ButtonExamples() {
  return (
    <View style={{ gap: 16, padding: 16 }}>
      {/* All variants */}
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="link">Link</Button>

      {/* Rounded pill */}
      <Button rounded>Rounded</Button>
      <Button rounded variant="outline">Pill Outline</Button>

      {/* Icon only */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button iconOnly iconLeft={<PlusIcon />} />
        <Button iconOnly rounded iconLeft={<HeartIcon />} />
      </View>

      {/* With icons */}
      <Button iconLeft={<PlusIcon />}>Add Item</Button>

      {/* Custom colors */}
      <Button color="#6366f1">Indigo</Button>
      <Button color="#10b981">Emerald</Button>

      {/* Button group */}
      <ButtonGroup fullWidth variant="outline">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
        <Button>Year</Button>
      </ButtonGroup>

      <ButtonGroup fullWidth>
        <Button variant="outline">Cancel</Button>
        <Button variant="default">Confirm</Button>
      </ButtonGroup>

      {/* Full width */}
      <Button fullWidth>Full Width</Button>

      {/* States */}
      <Button loading>Loading…</Button>
      <Button disabled>Disabled</Button>
    </View>
  )
}`,
  },
  card: {
    name: 'Card',
    slug: 'card',
    description: 'Surface container with CardHeader, CardContent, CardFooter, CardMedia sub-components, spring press animation, accent stripe, built-in skeleton, and 4 variants.',
    category: 'Layout',
    npmDeps: [],
    componentDeps: ['skeleton'],
    addCommand: 'npx native-mate add card',
    props: [
      { name: 'variant', type: '"elevated" | "outline" | "flat" | "ghost"', default: '"elevated"', description: 'Card surface style.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Replaces children with an animated skeleton placeholder.' },
      { name: 'onPress', type: '() => void', description: 'Makes the card pressable with a spring scale animation.' },
      { name: 'activeScale', type: 'number', default: '0.97', description: 'Scale factor on press.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables press.' },
      { name: 'accent', type: 'string', description: 'Color of a left-side accent stripe (e.g. status indicators).' },
    ],
    usageCode: `import { Card, CardHeader, CardContent, CardFooter } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Text } from '@native-mate/core'

// Structured card with sub-components
<Card>
  <CardHeader title="Invitation" subtitle="You've been invited to Acme Corp" />
  <CardContent>
    <Text>Accept the invitation to start collaborating with your team.</Text>
  </CardContent>
  <CardFooter separated>
    <Button variant="outline" style={{ flex: 1 }}>Decline</Button>
    <Button style={{ flex: 1 }}>Accept</Button>
  </CardFooter>
</Card>

// Pressable card
<Card onPress={() => router.push('/detail')}>
  <CardHeader title="Settings" subtitle="Manage your account" trailing={<ChevronRight />} />
</Card>

// Loading skeleton
<Card loading />

// Cover image
<Card image={{ uri: 'https://...' }} imageHeight={200}>
  <CardHeader title="Mountain Retreat" subtitle="3 nights · $240" />
</Card>`,
    exampleCode: `import { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function CardExample() {
  const [loading, setLoading] = useState(true)

  return (
    <View style={{ gap: 16, padding: 16 }}>
      {/* Loading state */}
      <Card loading={loading} />

      {/* Structured card */}
      <Card variant="outline">
        <CardHeader
          title="Workspace plan"
          subtitle="Up to 10 team members"
          trailing={<Button size="sm" variant="ghost">Edit</Button>}
        />
        <CardContent>
          <Text muted>Your workspace is on the Pro plan. Renews on March 1, 2026.</Text>
        </CardContent>
        <CardFooter separated>
          <Button variant="ghost" style={{ flex: 1 }}>Cancel plan</Button>
          <Button style={{ flex: 1 }}>Upgrade</Button>
        </CardFooter>
      </Card>

      <Button variant="outline" onPress={() => setLoading(l => !l)}>
        Toggle loading
      </Button>
    </View>
  )
}`,
  },
  input: {
    name: 'Input',
    slug: 'input',
    description: 'Feature-rich text input with 3 sizes, prefix/suffix slots, floating label, password toggle, clearable, character count, shake on error, and haptic on focus.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add input',
    accessibility: [
      { feature: 'Label', detail: 'accessibilityLabel is auto-set from the label prop.' },
      { feature: 'Disabled state', detail: 'accessibilityState={{ disabled }} is set when disabled.' },
      { feature: 'Keyboard', detail: 'Fully focusable and editable via assistive technology.' },
    ],
    props: [
      { name: 'label', type: 'string', description: 'Label shown above the input (or floating inside when floatingLabel is true).' },
      { name: 'error', type: 'string', description: 'Error message shown below. Turns border red and triggers shake animation.' },
      { name: 'hint', type: 'string', description: 'Helper text shown below the input.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls height, font size, and padding.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Shows a red asterisk (*) after the label.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims input and prevents editing.' },
      { name: 'prefix', type: 'React.ReactNode', description: 'Icon or element rendered inside the input, before the text.' },
      { name: 'suffix', type: 'React.ReactNode', description: 'Icon or element rendered inside the input, after the text.' },
      { name: 'prefixText', type: 'string', description: 'Text addon attached to the left (e.g. "$", "https://"). Has a border separator.' },
      { name: 'suffixText', type: 'string', description: 'Text addon attached to the right (e.g. "USD", ".com"). Has a border separator.' },
      { name: 'clearable', type: 'boolean', default: 'false', description: 'Shows a clear (×) button when input has a value.' },
      { name: 'onClear', type: '() => void', description: 'Called when the clear button is pressed.' },
      { name: 'showPasswordToggle', type: 'boolean', default: 'false', description: 'Shows a Show/Hide toggle for password inputs. Use with secureTextEntry.' },
      { name: 'showCount', type: 'boolean', default: 'false', description: 'Shows character count below the input. Pair with maxLength.' },
      { name: 'maxLength', type: 'number', description: 'Maximum character limit. Shown as x/max when showCount is true.' },
      { name: 'floatingLabel', type: 'boolean', default: 'false', description: 'Label animates from placeholder position to top of border on focus (Material Design style).' },
      { name: 'hapticOnFocus', type: 'boolean', default: 'false', description: 'Triggers a light haptic tap when input is focused. Requires expo-haptics (optional).' },
      { name: '...TextInputProps', type: 'TextInputProps', description: 'All standard React Native TextInput props are forwarded.' },
    ],
    usageCode: `import { Input } from '~/components/ui/input'

// Basic
<Input label="Email" placeholder="you@example.com" />

// Sizes
<Input size="sm" placeholder="Small" />
<Input size="lg" placeholder="Large" />

// Required
<Input label="Name" required />

// Prefix & suffix text
<Input label="Price" prefixText="$" suffixText="USD" />
<Input label="Website" prefixText="https://" />

// Prefix & suffix icons
<Input prefix={<SearchIcon />} placeholder="Search..." clearable />
<Input suffix={<CheckIcon />} label="Email" />

// Password with toggle
<Input label="Password" secureTextEntry showPasswordToggle />

// Character count
<Input label="Bio" showCount maxLength={160} />

// Floating label (Material Design style)
<Input floatingLabel label="Email Address" />

// Error (triggers shake animation)
<Input label="Username" error="Already taken" />

// Haptic on focus
<Input label="Name" hapticOnFocus />`,
    exampleCode: `import { Input } from '~/components/ui/input'
import { View } from 'react-native'

export function InputExamples() {
  return (
    <View style={{ gap: 16, padding: 16 }}>
      <Input label="Email" placeholder="you@example.com" />
      <Input label="Price" prefixText="$" suffixText="USD" />
      <Input label="Password" secureTextEntry showPasswordToggle />
      <Input label="Bio" showCount maxLength={160} />
      <Input floatingLabel label="Floating Label" />
      <Input label="Search" placeholder="Type..." clearable />
      <Input label="Username" error="Already taken" />
      <Input label="Company" disabled value="Acme Inc." />
    </View>
  )
}`,
  },
  textarea: {
    name: 'Textarea',
    slug: 'textarea',
    description: 'Auto-growing multi-line input with min/max rows, character count with warning threshold, floating label, submit-on-Enter, mention detection, voice input slot, read-only, shake on error, and haptic focus.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add textarea',
    accessibility: [
      { feature: 'Label', detail: 'accessibilityLabel is auto-set from the label prop.' },
      { feature: 'Disabled state', detail: 'accessibilityState={{ disabled }} is set when disabled.' },
      { feature: 'Read-only', detail: 'editable={false} prevents editing while keeping content selectable.' },
      { feature: 'Keyboard', detail: 'Fully focusable via assistive technology.' },
    ],
    props: [
      { name: 'label', type: 'string', description: 'Label above or floating inside the textarea.' },
      { name: 'error', type: 'string', description: 'Error message. Turns border red and triggers shake.' },
      { name: 'hint', type: 'string', description: 'Helper text below the textarea.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Shows a red asterisk after the label.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims and prevents editing.' },
      { name: 'readOnly', type: 'boolean', default: 'false', description: 'Prevents editing but keeps content selectable.' },
      { name: 'minRows', type: 'number', default: '3', description: 'Minimum visible rows before content shrinks.' },
      { name: 'maxRows', type: 'number', default: '10', description: 'Maximum rows before scroll activates.' },
      { name: 'showCount', type: 'boolean', default: 'false', description: 'Shows character count. Pair with maxLength.' },
      { name: 'countWarnAt', type: 'number', default: '0.8', description: 'Fraction of maxLength at which count turns amber (0–1).' },
      { name: 'floatingLabel', type: 'boolean', default: 'false', description: 'Label animates from inside to above border on focus.' },
      { name: 'submitOnEnter', type: 'boolean', default: 'false', description: 'Pressing Enter calls onSubmit instead of inserting a newline.' },
      { name: 'onSubmit', type: '(value: string) => void', description: 'Called when Enter is pressed with submitOnEnter enabled.' },
      { name: 'onMention', type: '(query: string) => void', description: 'Called when user types @ followed by text. Passes the query string.' },
      { name: 'voiceInput', type: 'boolean', default: 'false', description: 'Shows a microphone button inside the textarea.' },
      { name: 'onVoicePress', type: '() => void', description: 'Called when the microphone button is pressed.' },
      { name: '...TextInputProps', type: 'TextInputProps', description: 'All standard React Native TextInput props are forwarded.' },
    ],
    usageCode: `import { Textarea } from '~/components/ui/textarea'

// Basic
<Textarea label="Bio" placeholder="Tell us about yourself..." />

// Min/max rows (auto-grow)
<Textarea label="Message" minRows={2} maxRows={6} />

// Character count with warning
<Textarea label="Tweet" showCount maxLength={280} countWarnAt={0.8} />

// Floating label
<Textarea floatingLabel label="Notes" />

// Submit on Enter (Slack-style chat)
<Textarea
  label="Message"
  submitOnEnter
  onSubmit={(text) => sendMessage(text)}
  minRows={1}
  maxRows={4}
/>

// Mention detection
<Textarea onMention={(query) => fetchSuggestions(query)} />

// Voice input
<Textarea voiceInput onVoicePress={() => startSpeechToText()} />

// Read-only
<Textarea label="Terms" value={termsText} readOnly />

// Error state
<Textarea label="Review" error="Review cannot be empty" />`,
    exampleCode: `import { useState } from 'react'
import { Textarea } from '~/components/ui/textarea'
import { View } from 'react-native'

export function TextareaExamples() {
  const [bio, setBio] = useState('')
  const [msg, setMsg] = useState('')

  return (
    <View style={{ gap: 16, padding: 16 }}>
      <Textarea label="Bio" placeholder="Tell us about yourself..." showCount maxLength={160} value={bio} onChangeText={setBio} />
      <Textarea label="Message" minRows={2} maxRows={6} value={msg} onChangeText={setMsg} />
      <Textarea floatingLabel label="Notes" placeholder="Add notes..." />
      <Textarea label="Tweet" showCount maxLength={280} countWarnAt={0.8} />
      <Textarea label="Message" submitOnEnter onSubmit={() => {}} minRows={1} maxRows={4} />
      <Textarea label="Terms" value="By using this app you agree to our terms." readOnly />
      <Textarea label="Review" error="Review cannot be empty" />
      <Textarea label="Disabled" value="Cannot edit." disabled />
    </View>
  )
}`,
  },
  checkbox: {
    name: 'Checkbox',
    slug: 'checkbox',
    description: 'Animated checkbox with indeterminate state, descriptions, 3 sizes, custom color, label-left, error state, CheckboxGroup with horizontal layout, and haptic feedback.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add checkbox',
    accessibility: [
      { feature: 'Role', detail: 'accessibilityRole="checkbox" on each item.' },
      { feature: 'State', detail: 'accessibilityState={{ checked, disabled }} — supports "mixed" for indeterminate.' },
      { feature: 'Label', detail: 'accessibilityLabel defaults to the label prop.' },
    ],
    props: [
      { name: 'checked', type: 'boolean', description: 'Checked state.' },
      { name: 'onChange', type: '(checked: boolean) => void', description: 'Called when the checkbox is toggled.' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows a dash (─) instead of a checkmark. Used for parent "select all" patterns.' },
      { name: 'label', type: 'string', description: 'Label text next to the checkbox.' },
      { name: 'description', type: 'string', description: 'Secondary helper text below the label.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Box size — 16/20/24px.' },
      { name: 'color', type: 'string', description: 'Custom fill color when checked.' },
      { name: 'labelPosition', type: '"right" | "left"', default: '"right"', description: 'Which side the label appears on.' },
      { name: 'error', type: 'string', description: 'Error message shown below. Turns box red.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims and prevents interaction.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Light haptic on toggle. Requires expo-haptics (optional).' },
    ],
    usageCode: `import { Checkbox, CheckboxGroup } from '~/components/ui/checkbox'

<Checkbox checked={checked} onChange={setChecked} label="Accept terms" />

// With description
<Checkbox checked={v} onChange={setV} label="Subscribe" description="Weekly updates" />

// Indeterminate (select-all parent)
<Checkbox checked={false} indeterminate onChange={handleParent} label="Select all" />

// Sizes
<Checkbox size="sm" checked onChange={() => {}} label="Small" />
<Checkbox size="lg" checked onChange={() => {}} label="Large" />

// Custom color
<Checkbox checked onChange={() => {}} label="Emerald" color="#10b981" />

// Label on left
<Checkbox checked={v} onChange={setV} label="Dark mode" labelPosition="left" />

// Error
<Checkbox checked={false} onChange={() => {}} label="Accept" error="Required" />

// Group
<CheckboxGroup
  label="Skills"
  options={[
    { label: 'TypeScript', value: 'ts' },
    { label: 'React Native', value: 'rn' },
    { label: 'GraphQL', value: 'gql', disabled: true },
  ]}
  value={selected}
  onChange={setSelected}
/>

// Horizontal group
<CheckboxGroup options={days} value={selected} onChange={setSelected} horizontal />`,
    exampleCode: `import { Checkbox, CheckboxGroup } from '~/components/ui/checkbox'
import { View } from 'react-native'

export function CheckboxExamples() {
  const [terms, setTerms] = useState(false)
  const [skills, setSkills] = useState(['ts'])

  return (
    <View style={{ gap: 20, padding: 16 }}>
      <Checkbox checked={terms} onChange={setTerms} label="Accept terms" description="By checking this you agree to our ToS" />
      <Checkbox checked={false} indeterminate onChange={() => {}} label="Select all items" />
      <CheckboxGroup
        label="Your stack"
        options={[
          { label: 'TypeScript', value: 'ts', description: 'Typed JavaScript' },
          { label: 'React Native', value: 'rn' },
          { label: 'Expo', value: 'expo' },
        ]}
        value={skills}
        onChange={setSkills}
      />
    </View>
  )
}`,
  },
  radio: {
    name: 'Radio',
    slug: 'radio',
    description: 'Animated radio button with card-style variant, descriptions, horizontal layout, sizes, error state, disabled options, and haptic feedback.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add radio',
    accessibility: [
      { feature: 'Role', detail: 'accessibilityRole="radio" on each item.' },
      { feature: 'State', detail: 'accessibilityState={{ checked: selected, disabled }}.' },
      { feature: 'Label', detail: 'accessibilityLabel defaults to the label prop.' },
    ],
    props: [
      { name: 'selected', type: 'boolean', description: 'Whether this radio is selected.' },
      { name: 'onSelect', type: '() => void', description: 'Called when this radio is pressed.' },
      { name: 'label', type: 'string', description: 'Option label.' },
      { name: 'description', type: 'string', description: 'Helper text below the label.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Outer circle size — 16/20/24px.' },
      { name: 'card', type: 'boolean', default: 'false', description: 'Renders as a full bordered card. Active card gets highlighted border + tinted background.' },
      { name: 'color', type: 'string', description: 'Custom accent color.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims and prevents selection.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Light haptic on select. Requires expo-haptics (optional).' },
    ],
    usageCode: `import { Radio, RadioGroup } from '~/components/ui/radio'

// Basic group
<RadioGroup
  label="Framework"
  options={[
    { label: 'React Native', value: 'rn', description: 'Cross-platform mobile' },
    { label: 'Flutter', value: 'flutter' },
    { label: 'SwiftUI', value: 'swiftui', disabled: true },
  ]}
  value={fw}
  onChange={setFw}
/>

// Card style (plan picker)
<RadioGroup
  card
  options={[
    { label: 'Free', value: 'free', description: '5 components' },
    { label: 'Pro', value: 'pro', description: 'Unlimited' },
  ]}
  value={plan}
  onChange={setPlan}
/>

// Horizontal
<RadioGroup options={directions} value={dir} onChange={setDir} horizontal />

// Error
<RadioGroup options={opts} value="" onChange={() => {}} error="Please select an option." />`,
    exampleCode: `import { RadioGroup } from '~/components/ui/radio'
import { View } from 'react-native'

export function RadioExamples() {
  const [plan, setPlan] = useState('pro')
  const [fw, setFw] = useState('rn')

  return (
    <View style={{ gap: 24, padding: 16 }}>
      <RadioGroup
        label="Framework"
        options={[
          { label: 'React Native', value: 'rn', description: 'Cross-platform mobile' },
          { label: 'Flutter', value: 'flutter', description: 'Google UI toolkit' },
        ]}
        value={fw}
        onChange={setFw}
      />
      <RadioGroup
        label="Plan"
        card
        options={[
          { label: 'Free', value: 'free', description: '5 components, community' },
          { label: 'Pro', value: 'pro', description: 'Unlimited + priority support' },
        ]}
        value={plan}
        onChange={setPlan}
      />
    </View>
  )
}`,
  },
  slider: {
    name: 'Slider',
    slug: 'slider',
    description: 'Single and range slider with value display, step marks, custom colors, disabled state, spring thumb animation, and haptic feedback at each step.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add slider',
    accessibility: [
      { feature: 'Role', detail: 'accessibilityRole="adjustable" on the track.' },
      { feature: 'Value', detail: 'accessibilityValue={{ min, max, now: value }} is set.' },
      { feature: 'Label', detail: 'Pass accessibilityLabel for screen reader announcement.' },
    ],
    props: [
      { name: 'value', type: 'number', description: 'Current value.' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
      { name: 'step', type: 'number', default: '1', description: 'Snap increment.' },
      { name: 'onChange', type: '(value: number) => void', description: 'Called continuously while dragging.' },
      { name: 'onChangeEnd', type: '(value: number) => void', description: 'Called once when the thumb is released.' },
      { name: 'showValue', type: 'boolean', default: 'false', description: 'Shows min, current, and max value labels above the track.' },
      { name: 'marks', type: 'boolean', default: 'false', description: 'Renders tick marks below the track at each step.' },
      { name: 'fillColor', type: 'string', description: 'Custom fill and thumb color.' },
      { name: 'trackColor', type: 'string', description: 'Custom unfilled track color.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims and prevents dragging.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Light haptic at each step. Requires expo-haptics (optional).' },
    ],
    usageCode: `import { Slider, RangeSlider } from '~/components/ui/slider'

// Basic
<Slider value={vol} onChange={setVol} />

// With value display
<Slider value={vol} onChange={setVol} showValue />

// Step + marks
<Slider value={rating} onChange={setRating} min={1} max={5} step={1} marks showValue />

// Custom color
<Slider value={bright} onChange={setBright} fillColor="#f59e0b" />

// Disabled
<Slider value={60} onChange={() => {}} disabled />

// Range slider
<RangeSlider
  low={low}
  high={high}
  min={0}
  max={1000}
  step={10}
  onChange={(l, h) => { setLow(l); setHigh(h) }}
  showValue
  fillColor="#10b981"
  marks
/>`,
    exampleCode: `import { Slider, RangeSlider } from '~/components/ui/slider'
import { View } from 'react-native'

export function SliderExamples() {
  const [vol, setVol] = useState(50)
  const [low, setLow] = useState(100)
  const [high, setHigh] = useState(500)

  return (
    <View style={{ gap: 24, padding: 16 }}>
      <Slider value={vol} onChange={setVol} showValue />
      <Slider value={vol} onChange={setVol} fillColor="#f59e0b" showValue />
      <RangeSlider
        low={low} high={high} min={0} max={1000} step={10}
        onChange={(l, h) => { setLow(l); setHigh(h) }}
        showValue fillColor="#10b981" marks
      />
    </View>
  )
}`,
  },
  select: {
    name: 'Select',
    slug: 'select',
    description: 'Bottom-sheet select with search, multi-select with chips, option groups, descriptions, clearable, required, error, disabled options, and animated chevron.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: ['sheet'],
    addCommand: 'npx native-mate add select',
    accessibility: [
      { feature: 'Role', detail: 'accessibilityRole="combobox" on the trigger.' },
      { feature: 'Expanded state', detail: 'accessibilityState={{ expanded: open }} is set.' },
      { feature: 'Option role', detail: 'accessibilityRole="option" and accessibilityState={{ selected }} on each row.' },
    ],
    props: [
      { name: 'options', type: 'SelectOption[]', description: 'Array of { label, value, description?, icon?, disabled? }.' },
      { name: 'groups', type: 'SelectGroup[]', description: 'Grouped options: [{ label, options[] }]. Use instead of options for sectioned lists.' },
      { name: 'value', type: 'string', description: 'Selected value.' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called when selection changes.' },
      { name: 'placeholder', type: 'string', default: '"Select..."', description: 'Placeholder text when nothing is selected.' },
      { name: 'label', type: 'string', description: 'Label shown above the trigger.' },
      { name: 'error', type: 'string', description: 'Error message below trigger.' },
      { name: 'hint', type: 'string', description: 'Helper text below trigger.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Shows red asterisk next to label.' },
      { name: 'clearable', type: 'boolean', default: 'false', description: 'Shows × button to clear selection.' },
      { name: 'searchable', type: 'boolean', default: 'false', description: 'Shows a search input at the top of the sheet.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims trigger and prevents opening.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Trigger height.' },
    ],
    usageCode: `import { Select, MultiSelect } from '~/components/ui/select'

// Basic
<Select label="Country" options={countries} value={val} onChange={setVal} />

// Searchable
<Select label="Country" options={countries} value={val} onChange={setVal} searchable />

// Clearable
<Select options={opts} value={val} onChange={setVal} clearable />

// Option groups
<Select
  label="Stack"
  options={[]}
  groups={[
    { label: 'Frontend', options: [{ label: 'React', value: 'react' }] },
    { label: 'Mobile', options: [{ label: 'React Native', value: 'rn' }] },
  ]}
  value={val}
  onChange={setVal}
/>

// Multi-select
<MultiSelect
  label="Skills"
  options={skills}
  value={selected}
  onChange={setSelected}
  searchable
  clearable
/>

// Multi-select with max
<MultiSelect options={opts} value={sel} onChange={setSel} maxSelections={3} />

// Error
<Select options={opts} value="" onChange={() => {}} error="Required" required />`,
    exampleCode: `import { Select, MultiSelect } from '~/components/ui/select'
import { View } from 'react-native'

export function SelectExamples() {
  const [country, setCountry] = useState('')
  const [skills, setSkills] = useState<string[]>([])

  return (
    <View style={{ gap: 16, padding: 16 }}>
      <Select label="Country" placeholder="Select country" options={COUNTRIES} value={country} onChange={setCountry} searchable clearable required />
      <MultiSelect label="Skills" placeholder="Select skills" options={SKILLS} value={skills} onChange={setSkills} searchable maxSelections={5} />
    </View>
  )
}`,
  },
  'otp-input': {
    name: 'OTP Input',
    slug: 'otp-input',
    description: '3 variants (box, underline, rounded), secure/masked mode, alphanumeric, blinking cursor animation, shake on error, success state, resend cooldown timer, and haptic feedback.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add otp-input',
    accessibility: [
      { feature: 'Label', detail: 'accessibilityLabel is set to "N-digit verification code".' },
      { feature: 'Auto-fill', detail: 'textContentType="oneTimeCode" and autoComplete="one-time-code" enable iOS/Android SMS auto-fill.' },
      { feature: 'Keyboard', detail: 'keyboardType="number-pad" for numeric, "default" for alphanumeric.' },
    ],
    props: [
      { name: 'length', type: 'number', default: '6', description: 'Number of cells.' },
      { name: 'value', type: 'string', description: 'Current value string.' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called on every keystroke.' },
      { name: 'onComplete', type: '(value: string) => void', description: 'Called when all cells are filled.' },
      { name: 'variant', type: '"box" | "underline" | "rounded"', default: '"box"', description: 'Visual style of each cell.' },
      { name: 'type', type: '"numeric" | "alphanumeric"', default: '"numeric"', description: 'Allowed characters.' },
      { name: 'secure', type: 'boolean', default: 'false', description: 'Shows ● instead of the digit.' },
      { name: 'error', type: 'boolean', default: 'false', description: 'Turns cells red and triggers shake animation.' },
      { name: 'errorMessage', type: 'string', description: 'Error text shown below the cells.' },
      { name: 'success', type: 'boolean', default: 'false', description: 'Turns cells green.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents input.' },
      { name: 'hint', type: 'string', description: 'Helper text below the cells.' },
      { name: 'resend', type: 'boolean', default: 'false', description: 'Shows "Resend" link with cooldown timer.' },
      { name: 'resendCooldown', type: 'number', default: '30', description: 'Seconds before resend is available again.' },
      { name: 'onResend', type: '() => void', description: 'Called when resend is pressed.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Error haptic on shake, success haptic on complete.' },
    ],
    usageCode: `import { OTPInput } from '~/components/ui/otp-input'

// Basic
<OTPInput value={val} onChange={setVal} onComplete={verify} length={6} />

// 4-digit PIN
<OTPInput value={pin} onChange={setPin} length={4} hint="Enter your PIN" />

// Secure
<OTPInput value={val} onChange={setVal} secure />

// Variants
<OTPInput value={val} onChange={setVal} variant="underline" />
<OTPInput value={val} onChange={setVal} variant="rounded" />

// Alphanumeric
<OTPInput value={val} onChange={setVal} type="alphanumeric" length={5} />

// Error
<OTPInput value={val} onChange={setVal} error errorMessage="Invalid code" />

// Success
<OTPInput value={val} onChange={setVal} success hint="Verified!" />

// With resend
<OTPInput
  value={val}
  onChange={setVal}
  resend
  resendCooldown={30}
  onResend={handleResend}
  hint="Code sent to +91 98765 43210"
/>`,
    exampleCode: `import { useState } from 'react'
import { OTPInput } from '~/components/ui/otp-input'
import { View } from 'react-native'

export function OTPExample() {
  const [val, setVal] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')

  const verify = (code: string) => {
    // Simulate API call
    if (code === '123456') setStatus('success')
    else setStatus('error')
  }

  return (
    <View style={{ padding: 16 }}>
      <OTPInput
        value={val}
        onChange={(v) => { setVal(v); setStatus('idle') }}
        onComplete={verify}
        length={6}
        error={status === 'error'}
        success={status === 'success'}
        errorMessage="Wrong code. Try again."
        hint={status === 'success' ? 'Verified!' : 'Enter the code sent to your email'}
        resend
        resendCooldown={30}
        onResend={() => {}}
      />
    </View>
  )
}`,
  },
  badge: {
    name: 'Badge',
    slug: 'badge',
    description: 'A compact inline label with 6 semantic variants, 3 sizes, dot indicator, count overflow, and a dismissible variant.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add badge',
    props: [
      { name: 'variant', type: '"default" | "secondary" | "outline" | "success" | "destructive" | "warning"', default: '"default"', description: 'Visual variant.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls padding and font size.' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Shows a coloured dot before the label.' },
      { name: 'count', type: 'number', description: 'Numeric count to display instead of children.' },
      { name: 'maxCount', type: 'number', default: '99', description: 'When count exceeds this, shows "{maxCount}+".' },
      { name: 'onDismiss', type: '() => void', description: 'When provided, shows a × button to dismiss the badge.' },
      { name: 'children', type: 'React.ReactNode', description: 'Badge label content.' },
    ],
    usageCode: `import { Badge } from '~/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="success" dot>Active</Badge>
<Badge variant="destructive" count={5} />
<Badge variant="secondary" onDismiss={() => {}} size="lg">Dismissible</Badge>`,
    exampleCode: `import { Badge } from '~/components/ui/badge'
import { View } from 'react-native'

export function BadgeExamples() {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success" dot>Active</Badge>
        <Badge variant="destructive" dot>Failed</Badge>
        <Badge variant="warning">Warning</Badge>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Badge variant="destructive" count={3} />
        <Badge variant="default" count={150} maxCount={99} />
      </View>
    </View>
  )
}`,
  },
  sheet: {
    name: 'Sheet',
    slug: 'sheet',
    description: 'A bottom sheet with configurable snap points, drag handle, backdrop dismiss, and smooth Reanimated spring animation.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add sheet',
    props: [
      { name: 'isOpen', type: 'boolean', description: 'Controls sheet visibility.' },
      { name: 'onClose', type: '() => void', description: 'Called when user dismisses the sheet.' },
      { name: 'snapPoints', type: 'Array<`${number}%`>', default: '["50%", "90%"]', description: 'Snap positions as viewport-height percentages.' },
      { name: 'children', type: 'React.ReactNode', description: 'Sheet content.' },
    ],
    usageCode: `import { Sheet } from '~/components/ui/sheet'

const [open, setOpen] = useState(false)

<Sheet isOpen={open} onClose={() => setOpen(false)} snapPoints={['40%', '80%']}>
  <View style={{ padding: 16 }}>
    <Text>Sheet content</Text>
  </View>
</Sheet>`,
    exampleCode: `import { useState } from 'react'
import { Sheet } from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function SheetExample() {
  const [open, setOpen] = useState(false)

  return (
    <View style={{ padding: 16 }}>
      <Button onPress={() => setOpen(true)}>Open Sheet</Button>
      <Sheet isOpen={open} onClose={() => setOpen(false)} snapPoints={['50%']}>
        <View style={{ padding: 24, gap: 16 }}>
          <Text size="lg" weight="semibold">Sheet title</Text>
          <Text color="muted">Some content inside the sheet.</Text>
          <Button onPress={() => setOpen(false)}>Close</Button>
        </View>
      </Sheet>
    </View>
  )
}`,
  },
  accordion: {
    name: 'Accordion',
    slug: 'accordion',
    description: 'An animated height-expanding disclosure component. Supports single or multiple open panels simultaneously with smooth spring transitions.',
    category: 'Layout',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add accordion',
    props: [
      { name: 'items', type: 'Array<{ title: string; content: React.ReactNode }>', description: 'Array of accordion panel definitions.' },
      { name: 'allowMultiple', type: 'boolean', default: 'false', description: 'When true, multiple panels can be open at once.' },
      { name: 'defaultOpen', type: 'number[]', default: '[]', description: 'Indices of panels that are open by default.' },
      { name: 'style', type: 'ViewStyle', description: 'Additional styles for the accordion container.' },
    ],
    usageCode: `import { Accordion } from '~/components/ui/accordion'

const items = [
  { title: 'What is native-mate?', content: <Text>A copy-paste component library for React Native.</Text> },
  { title: 'Is it free?', content: <Text>Yes, completely open source.</Text> },
  { title: 'Does it support Expo?', content: <Text>Yes, Expo and bare React Native are both supported.</Text> },
]

// Single open at a time (default)
<Accordion items={items} />

// Allow multiple open panels
<Accordion items={items} allowMultiple defaultOpen={[0]} />`,
    exampleCode: `import { Accordion } from '~/components/ui/accordion'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

const FAQS = [
  { title: 'Getting started', content: <Text>Run npx native-mate init to scaffold your project.</Text> },
  { title: 'Customisation', content: <Text>All components are plain source files — edit them freely.</Text> },
  { title: 'Dark mode', content: <Text>Tokens automatically adapt via the useColorScheme hook.</Text> },
]

export function AccordionExample() {
  return (
    <View style={{ padding: 16 }}>
      <Accordion items={FAQS} allowMultiple defaultOpen={[0]} />
    </View>
  )
}`,
  },
  tabs: {
    name: 'Tabs',
    slug: 'tabs',
    description: 'Horizontal tab navigation with a sliding animated indicator. Renders tab content lazily and supports controlled and uncontrolled modes.',
    category: 'Navigation',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add tabs',
    props: [
      { name: 'tabs', type: 'Array<{ key: string; label: string; content: React.ReactNode }>', description: 'Tab definitions including their content panels.' },
      { name: 'activeKey', type: 'string', description: 'Controlled active tab key.' },
      { name: 'defaultActiveKey', type: 'string', description: 'Uncontrolled initial active tab key.' },
      { name: 'onChange', type: '(key: string) => void', description: 'Called when the active tab changes.' },
      { name: 'style', type: 'ViewStyle', description: 'Additional styles for the outer container.' },
    ],
    usageCode: `import { Tabs } from '~/components/ui/tabs'

const tabs = [
  { key: 'overview', label: 'Overview', content: <OverviewPanel /> },
  { key: 'activity', label: 'Activity', content: <ActivityPanel /> },
  { key: 'settings', label: 'Settings', content: <SettingsPanel /> },
]

// Uncontrolled
<Tabs tabs={tabs} defaultActiveKey="overview" />

// Controlled
<Tabs tabs={tabs} activeKey={active} onChange={setActive} />`,
    exampleCode: `import { useState } from 'react'
import { Tabs } from '~/components/ui/tabs'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

export function TabsExample() {
  const [active, setActive] = useState('posts')

  const tabs = [
    { key: 'posts', label: 'Posts', content: <View style={{ padding: 16 }}><Text>Posts content</Text></View> },
    { key: 'likes', label: 'Likes', content: <View style={{ padding: 16 }}><Text>Likes content</Text></View> },
    { key: 'saved', label: 'Saved', content: <View style={{ padding: 16 }}><Text>Saved content</Text></View> },
  ]

  return (
    <View style={{ flex: 1 }}>
      <Tabs tabs={tabs} activeKey={active} onChange={setActive} />
    </View>
  )
}`,
  },
  avatar: {
    name: 'Avatar',
    slug: 'avatar',
    description: 'Displays a user image with auto-generated initials + color fallback. Supports status indicators, square shape, and an AvatarGroup stack.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add avatar',
    props: [
      { name: 'src', type: 'string', description: 'URI of the avatar image.' },
      { name: 'name', type: 'string', description: 'Full name used to auto-generate initials and a consistent background color.' },
      { name: 'fallback', type: 'string', description: 'Override initials text (max 2 chars).' },
      { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Controls the width, height, and font size.' },
      { name: 'status', type: '"online" | "offline" | "busy" | "away"', description: 'Shows a coloured status dot in the bottom-right corner.' },
      { name: 'shape', type: '"circle" | "square"', default: '"circle"', description: 'Circle or rounded-square shape.' },
      { name: 'color', type: 'string', description: 'Override the auto-generated background color.' },
    ],
    usageCode: `import { Avatar, AvatarGroup } from '~/components/ui/avatar'

// Auto-color from name
<Avatar name="Alice Smith" size="md" />

// With image + status
<Avatar src="https://example.com/alice.jpg" name="Alice" status="online" />

// Avatar group stack
<AvatarGroup avatars={[{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }]} max={3} />`,
    exampleCode: `import { Avatar, AvatarGroup } from '~/components/ui/avatar'
import { View } from 'react-native'

export function AvatarExamples() {
  return (
    <View style={{ gap: 20, padding: 16 }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Avatar size="xs" name="John Doe" />
        <Avatar size="sm" name="Jane Smith" status="online" />
        <Avatar size="md" src="https://i.pravatar.cc/100?img=1" name="Alice" status="busy" />
        <Avatar size="lg" name="Sam Lee" status="away" />
        <Avatar size="xl" name="Chris Park" />
      </View>
      <AvatarGroup
        avatars={[{ name: 'Alice B' }, { name: 'Bob C' }, { name: 'Carol D' }, { name: 'Dave E' }, { name: 'Eve F' }]}
        max={4}
      />
    </View>
  )
}`,
  },
  switch: {
    name: 'Switch',
    slug: 'switch',
    description: 'A toggle switch with label, description, 3 sizes, custom color, loading state, left/right label position, and haptic feedback.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add switch',
    props: [
      { name: 'value', type: 'boolean', description: 'The current on/off state.' },
      { name: 'onValueChange', type: '(value: boolean) => void', description: 'Callback fired when toggled.' },
      { name: 'label', type: 'string', description: 'Text label rendered beside the switch.' },
      { name: 'description', type: 'string', description: 'Secondary description text below the label.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls track and thumb dimensions.' },
      { name: 'color', type: 'string', description: 'Custom active track color. Defaults to theme primary.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner inside the thumb, prevents toggling.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Fires a light haptic when toggled (requires expo-haptics).' },
      { name: 'labelPosition', type: '"left" | "right"', default: '"right"', description: 'Which side the label appears on.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents toggling and reduces opacity.' },
    ],
    usageCode: `import { Switch } from '~/components/ui/switch'
import { useState } from 'react'

const [enabled, setEnabled] = useState(false)

<Switch
  label="Enable notifications"
  value={enabled}
  onValueChange={setEnabled}
/>`,
    exampleCode: `import { useState } from 'react'
import { Switch } from '~/components/ui/switch'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function SwitchExample() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  return (
    <View style={{ gap: 16, padding: 16 }}>
      <Switch label="Push notifications" value={notifications} onValueChange={setNotifications} />
      <Switch label="Dark mode" value={darkMode} onValueChange={setDarkMode} />
      <Switch label="Usage analytics" value={analytics} onValueChange={setAnalytics} disabled />
    </View>
  )
}`,
  },
  progress: {
    name: 'Progress',
    slug: 'progress',
    description: 'A progress indicator in linear or circular variants. Supports label, percentage display, indeterminate animation, custom colors, and 3 sizes.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add progress',
    props: [
      { name: 'value', type: 'number', description: 'Progress 0–100.' },
      { name: 'variant', type: '"linear" | "circular"', default: '"linear"', description: 'Bar or ring.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Track thickness / ring diameter.' },
      { name: 'color', type: 'string', description: 'Fill color. Defaults to theme primary.' },
      { name: 'trackColor', type: 'string', description: 'Background track color.' },
      { name: 'showValue', type: 'boolean', default: 'false', description: 'Renders percentage text (inside ring for circular).' },
      { name: 'label', type: 'string', description: 'Text label shown above the bar (linear only).' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows an animated shimmer instead of a fixed value.' },
      { name: 'animated', type: 'boolean', default: 'true', description: 'Animate value transitions.' },
    ],
    usageCode: `import { Progress } from '~/components/ui/progress'

// Linear with label
<Progress value={65} showValue label="Upload progress" />

// Circular
<Progress variant="circular" value={42} showValue size="lg" />

// Indeterminate
<Progress value={0} indeterminate />`,
    exampleCode: `import { Progress } from '~/components/ui/progress'
import { View } from 'react-native'

export function ProgressExample() {
  return (
    <View style={{ gap: 20, padding: 16 }}>
      <Progress value={72} showValue label="Storage used" color="#10b981" />
      <Progress value={45} showValue label="CPU" color="#f59e0b" size="sm" />
      <Progress value={0} indeterminate />
      <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
        <Progress variant="circular" value={72} showValue size="lg" />
        <Progress variant="circular" value={45} showValue size="md" color="#f59e0b" />
        <Progress variant="circular" value={90} showValue size="sm" color="#ef4444" />
      </View>
    </View>
  )
}`,
  },
  skeleton: {
    name: 'Skeleton',
    slug: 'skeleton',
    description: 'A shimmer placeholder that mimics content layout while data loads. Fully customisable width, height, and border radius.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add skeleton',
    props: [
      { name: 'width', type: 'number | string', description: 'Width of the skeleton element.' },
      { name: 'height', type: 'number', description: 'Height of the skeleton element.' },
      { name: 'borderRadius', type: 'number', default: '8', description: 'Corner radius.' },
      { name: 'style', type: 'ViewStyle', description: 'Additional styles forwarded to the animated container.' },
    ],
    usageCode: `import { Skeleton } from '~/components/ui/skeleton'

// Text line placeholder
<Skeleton width="80%" height={16} />

// Avatar placeholder
<Skeleton width={48} height={48} borderRadius={24} />

// Card placeholder
<Skeleton width="100%" height={120} borderRadius={12} />`,
    exampleCode: `import { Skeleton } from '~/components/ui/skeleton'
import { View } from 'react-native'

export function SkeletonExample() {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      {/* Profile card skeleton */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={{ gap: 6, flex: 1 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
      <Skeleton width="100%" height={140} borderRadius={12} />
      <Skeleton width="90%" height={14} />
      <Skeleton width="75%" height={14} />
    </View>
  )
}`,
  },
  toast: {
    name: 'Toast',
    slug: 'toast',
    description: 'An auto-dismissing notification with swipe-to-dismiss, action button, progress bar countdown, persistent mode, and a useToast hook.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add toast',
    props: [
      { name: 'message', type: 'string', description: 'Primary notification text.' },
      { name: 'description', type: 'string', description: 'Secondary text below the message.' },
      { name: 'variant', type: '"default" | "success" | "destructive" | "warning"', default: '"default"', description: 'Sets the icon and color scheme.' },
      { name: 'duration', type: 'number', default: '3000', description: 'Auto-dismiss delay in milliseconds.' },
      { name: 'position', type: '"top" | "bottom"', default: '"bottom"', description: 'Screen edge.' },
      { name: 'action', type: '{ label: string; onPress: () => void }', description: 'Optional action button shown in the toast.' },
      { name: 'showProgress', type: 'boolean', default: 'false', description: 'Shows a countdown progress bar at the bottom.' },
      { name: 'persistent', type: 'boolean', default: 'false', description: 'Disables auto-dismiss. Shows a close × button.' },
      { name: 'visible', type: 'boolean', description: 'Controls visibility.' },
      { name: 'onHide', type: '() => void', description: 'Called when dismissed.' },
    ],
    usageCode: `import { useToast, ToastProvider } from '~/components/ui/toast'

// Wrap your app
<ToastProvider>
  <App />
</ToastProvider>

// Inside any component
const { show } = useToast()

show({ message: 'Saved!', variant: 'success' })
show({ message: 'Deleted', action: { label: 'Undo', onPress: handleUndo } })
show({ message: 'No internet', variant: 'warning', persistent: true })`,
    exampleCode: `import { useToast } from '~/components/ui/toast'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function ToastExample() {
  const { show } = useToast()

  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Button onPress={() => show({ message: 'Changes saved', variant: 'success', showProgress: true })}>
        Success (with progress)
      </Button>
      <Button variant="destructive" onPress={() => show({ message: 'Upload failed', variant: 'destructive' })}>
        Error toast
      </Button>
      <Button variant="outline" onPress={() =>
        show({ message: 'Item deleted', action: { label: 'Undo', onPress: () => {} }, duration: 4000 })
      }>
        With undo action
      </Button>
      <Button variant="outline" onPress={() =>
        show({ message: 'No internet connection', variant: 'warning', persistent: true })
      }>
        Persistent
      </Button>
    </View>
  )
}`,
  },
  'action-sheet': {
    name: 'Action Sheet',
    slug: 'action-sheet',
    description: 'iOS-style bottom sheet with drag handle, title/message header, action list with icon support, destructive variant, lifecycle-safe spring animation, and separate cancel button.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add action-sheet',
    props: [
      { name: 'isOpen', type: 'boolean', description: 'Controls visibility of the action sheet.' },
      { name: 'onClose', type: '() => void', description: 'Called when the sheet is dismissed.' },
      { name: 'actions', type: 'Array<ActionSheetAction>', description: 'List of action items. Each action has label, onPress, optional variant ("destructive"), icon, and disabled.' },
      { name: 'title', type: 'string', description: 'Short title shown at the top of the sheet.' },
      { name: 'message', type: 'string', description: 'Secondary message shown below the title.' },
      { name: 'cancelLabel', type: 'string', default: '"Cancel"', description: 'Label for the cancel button.' },
    ],
    usageCode: `import { ActionSheet } from '~/components/ui/action-sheet'
import { useState } from 'react'

const [open, setOpen] = useState(false)

const actions = [
  { label: 'Edit post', onPress: handleEdit },
  { label: 'Share', onPress: handleShare },
  { label: 'Delete post', onPress: handleDelete, destructive: true },
]

<ActionSheet
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Post options"
  actions={actions}
/>`,
    exampleCode: `import { useState } from 'react'
import { ActionSheet } from '~/components/ui/action-sheet'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function ActionSheetExample() {
  const [open, setOpen] = useState(false)

  const actions = [
    { label: 'Take photo', onPress: () => { /* camera */ setOpen(false) } },
    { label: 'Choose from library', onPress: () => { /* picker */ setOpen(false) } },
    { label: 'Remove photo', onPress: () => { /* remove */ setOpen(false) }, destructive: true },
  ]

  return (
    <View style={{ padding: 16 }}>
      <Button variant="outline" onPress={() => setOpen(true)}>Change avatar</Button>
      <ActionSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Change profile photo"
        actions={actions}
      />
    </View>
  )
}`,
  },
  tag: {
    name: 'Tag',
    slug: 'tag',
    description: 'Selectable chip with animated color transitions, 5 semantic variants, icon slot, 3 sizes, removable mode, and TagGroup for single/multi-select filter groups.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add tag',
    props: [
      { name: 'label', type: 'string', description: 'Text content of the tag.' },
      { name: 'selected', type: 'boolean', default: 'false', description: 'Highlights the tag with the variant accent color.' },
      { name: 'onPress', type: '() => void', description: 'Makes the tag pressable with a spring scale animation and haptic.' },
      { name: 'onRemove', type: '() => void', description: 'Shows a close (×) button. When pressed, calls this handler.' },
      { name: 'variant', type: '"default" | "primary" | "success" | "warning" | "destructive" | "info"', default: '"default"', description: 'Color accent applied in selected state.' },
      { name: 'icon', type: 'React.ReactNode', description: 'Element rendered before the label (e.g. an Ionicon).' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls padding and font size.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and prevents interaction.' },
    ],
    usageCode: `import { Tag, TagGroup } from '~/components/ui/tag'
import { useState } from 'react'

// Static tag
<Tag label="React Native" />

// Dismissible
<Tag label="TypeScript" onRemove={() => removeTag('typescript')} />

// Selectable single tag
<Tag label="Design" selected={active} onPress={() => setActive(v => !v)} variant="primary" />

// Filter group (single select)
<TagGroup
  tags={[
    { label: 'All' },
    { label: 'Design', variant: 'primary' },
    { label: 'Engineering', variant: 'success' },
  ]}
  selected={filters}
  onChange={setFilters}
/>

// Filter group (multi select)
<TagGroup tags={categories} selected={selected} onChange={setSelected} multiSelect />`,
    exampleCode: `import { useState } from 'react'
import { Tag, TagGroup } from '~/components/ui/tag'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

const CATEGORIES = [
  { label: 'All', variant: 'default' as const },
  { label: 'Design', variant: 'primary' as const },
  { label: 'Engineering', variant: 'success' as const },
  { label: 'Marketing', variant: 'warning' as const },
  { label: 'Support', variant: 'info' as const },
]

export function TagExample() {
  const [filter, setFilter] = useState(['All'])
  const [skills, setSkills] = useState(['React Native', 'TypeScript'])

  return (
    <View style={{ gap: 20, padding: 16 }}>
      <Text variant="label">Category filter</Text>
      <TagGroup tags={CATEGORIES} selected={filter} onChange={setFilter} />

      <Text variant="label">Skills</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {skills.map(s => (
          <Tag key={s} label={s} onRemove={() => setSkills(prev => prev.filter(x => x !== s))} />
        ))}
      </View>
    </View>
  )
}`,
  },
  'empty-state': {
    name: 'Empty State',
    slug: 'empty-state',
    description: 'A centred layout for empty lists or zero-data screens. Combines an icon, title, description, and an optional call-to-action.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add empty-state',
    props: [
      { name: 'icon', type: 'React.ReactNode', description: 'Illustration or icon displayed at the top.' },
      { name: 'title', type: 'string', description: 'Primary heading text.' },
      { name: 'description', type: 'string', description: 'Secondary body text explaining the empty state.' },
      { name: 'action', type: '{ label: string; onPress: () => void }', description: 'Optional call-to-action button configuration.' },
    ],
    usageCode: `import { EmptyState } from '~/components/ui/empty-state'
import { InboxIcon } from 'lucide-react-native'

<EmptyState
  icon={<InboxIcon size={48} color="#71717a" />}
  title="No messages yet"
  description="When you receive messages they will appear here."
  action={{ label: 'Compose message', onPress: handleCompose }}
/>`,
    exampleCode: `import { EmptyState } from '~/components/ui/empty-state'
import { SearchX } from 'lucide-react-native'
import { View } from 'react-native'
import { useRouter } from 'expo-router'

export function EmptyStateExample() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 32 }}>
      <EmptyState
        icon={<SearchX size={56} color="#52525b" />}
        title="No results found"
        description="We couldn't find anything matching your search. Try adjusting your filters or search term."
        action={{ label: 'Clear filters', onPress: () => router.setParams({ q: '' }) }}
      />
    </View>
  )
}`,
  },
  alert: {
    name: 'Alert',
    slug: 'alert',
    description: 'Inline alert banner with 5 semantic variants (+ info), Ionicons auto-icon, dismissible mode, action button, and custom icon slot.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add alert',
    props: [
      { name: 'variant', type: '"default" | "info" | "success" | "warning" | "destructive"', default: '"default"', description: 'Determines the icon and color scheme.' },
      { name: 'title', type: 'string', description: 'Bold heading of the alert.' },
      { name: 'description', type: 'string', description: 'Secondary body text below the title.' },
      { name: 'icon', type: 'React.ReactNode', description: 'Custom icon overriding the automatic Ionicons variant icon.' },
      { name: 'onDismiss', type: '() => void', description: 'When provided, shows a close (×) button.' },
      { name: 'action', type: '{ label: string; onPress: () => void }', description: 'Optional action button rendered below the description.' },
    ],
    usageCode: `import { Alert } from '~/components/ui/alert'

// Default (primary)
<Alert title="Scheduled maintenance" description="Service unavailable Sunday at 2 AM UTC." />

// Info
<Alert variant="info" title="Pro tip" description="Drag to reorder items in your list." />

// Success
<Alert variant="success" title="Payment received" description="Your invoice has been paid." />

// Warning with dismiss
<Alert variant="warning" title="Trial ending soon" description="3 days left." onDismiss={handleClose} />

// Destructive with action
<Alert
  variant="destructive"
  title="Upload failed"
  description="The file exceeds the 10 MB limit."
  action={{ label: 'Try again', onPress: handleRetry }}
/>`,
    exampleCode: `import { useState } from 'react'
import { Alert } from '~/components/ui/alert'
import { View } from 'react-native'

export function AlertExamples() {
  const [showWarning, setShowWarning] = useState(true)

  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Alert variant="info" title="New version available" description="Update to v2.4 for the latest features." />
      <Alert variant="success" title="Account verified" description="Your email address has been confirmed." />
      {showWarning && (
        <Alert
          variant="warning"
          title="Low disk space"
          description="Less than 500 MB remaining."
          onDismiss={() => setShowWarning(false)}
        />
      )}
      <Alert
        variant="destructive"
        title="Sync failed"
        description="Check your internet connection."
        action={{ label: 'Retry', onPress: () => {} }}
      />
    </View>
  )
}`,
  },
  screen: {
    name: 'Screen',
    slug: 'screen',
    description: 'A SafeAreaView wrapper that handles safe area insets, keyboard avoidance, and optional scroll behaviour for full-screen layouts.',
    category: 'Layout',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add screen',
    props: [
      { name: 'children', type: 'React.ReactNode', description: 'Screen content.' },
      { name: 'scroll', type: 'boolean', default: 'false', description: 'Wraps content in a ScrollView for scrollable screens.' },
      { name: 'keyboardAware', type: 'boolean', default: 'true', description: 'Adjusts layout when the software keyboard appears.' },
      { name: 'style', type: 'ViewStyle', description: 'Additional styles applied to the inner content container.' },
      { name: 'edges', type: 'Array<"top" | "bottom" | "left" | "right">', default: '["top","bottom"]', description: 'Which safe area edges to apply insets for.' },
    ],
    usageCode: `import { Screen } from '~/components/ui/screen'

// Basic full-screen wrapper
<Screen>
  <YourContent />
</Screen>

// Scrollable screen
<Screen scroll>
  <LongFormContent />
</Screen>

// Custom edges (e.g. tab screen — no top inset)
<Screen edges={['bottom']} style={{ paddingHorizontal: 16 }}>
  <TabContent />
</Screen>`,
    exampleCode: `import { Screen } from '~/components/ui/screen'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

export function ProfileScreen() {
  return (
    <Screen scroll style={{ paddingHorizontal: 16 }}>
      <View style={{ paddingTop: 24, gap: 16 }}>
        <Text size="2xl" weight="bold">Profile</Text>
        <Text color="muted">Manage your account settings and preferences.</Text>
        {/* profile fields */}
      </View>
    </Screen>
  )
}`,
  },
'cart-item': {
  name: 'Cart Item',
  slug: 'cart-item',
  description: 'Shopping cart row with product image, animated price, an embedded quantity stepper, and swipe/tap-to-remove with haptic feedback.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: ['quantity-stepper'],
  addCommand: 'npx native-mate add cart-item',
  accessibility: [
    { feature: 'Summary role', detail: 'accessibilityRole="summary" with an accessibilityLabel combining title, quantity, and total price.' },
    { feature: 'Remove button', detail: 'The remove control sets accessibilityRole="button" and accessibilityLabel="Remove item".' },
  ],
  props: [
    { name: 'image', type: 'ImageSourcePropType', description: 'Product image source.' },
    { name: 'title', type: 'string', description: 'Product title.' },
    { name: 'variant', type: 'string', description: 'Variant info, e.g. "Size: M, Color: Blue".' },
    { name: 'price', type: 'number', description: 'Unit price of the item.' },
    { name: 'currency', type: 'string', default: '"$"', description: 'Currency symbol.' },
    { name: 'quantity', type: 'number', description: 'Current quantity.' },
    { name: 'onQuantityChange', type: '(quantity: number) => void', description: 'Called when the embedded stepper changes quantity.' },
    { name: 'onRemove', type: '() => void', description: 'Called when the item should be removed. Shows the remove button and delete background when provided.' },
    { name: 'maxQuantity', type: 'number', description: 'Maximum quantity allowed.' },
    { name: 'minQuantity', type: 'number', default: '1', description: 'Minimum quantity allowed.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables interactions.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable haptic feedback on remove and quantity changes.' },
  ],
  usageCode: `import { CartItem } from '~/components/ui/cart-item'

const [quantity, setQuantity] = useState(1)

// Basic
<CartItem
  image={{ uri: 'https://...' }}
  title="Classic Runner Sneaker"
  variant="Size: 9, Color: White"
  price={89.99}
  quantity={quantity}
  onQuantityChange={setQuantity}
/>

// Removable
<CartItem
  image={{ uri: 'https://...' }}
  title="Everyday Backpack"
  price={54.0}
  quantity={quantity}
  onQuantityChange={setQuantity}
  onRemove={() => removeFromCart(id)}
/>

// Bounded quantity
<CartItem
  image={{ uri: 'https://...' }}
  title="Wireless Earbuds Pro"
  price={129.5}
  quantity={quantity}
  onQuantityChange={setQuantity}
  minQuantity={1}
  maxQuantity={5}
/>

// Disabled
<CartItem
  image={{ uri: 'https://...' }}
  title="Out of stock item"
  price={40}
  quantity={1}
  disabled
/>`,
  exampleCode: `import { useState } from 'react'
import { CartItem } from '~/components/ui/cart-item'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

export function CartScreen() {
  const [items, setItems] = useState([
    { id: 1, title: 'Classic Runner Sneaker', variant: 'Size: 9, Color: White', price: 89.99, quantity: 1, image: { uri: 'https://...' } },
    { id: 2, title: 'Everyday Backpack', price: 54.0, quantity: 2, image: { uri: 'https://...' } },
  ])

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  return (
    <View style={{ gap: 12, padding: 16 }}>
      {items.map((item) => (
        <CartItem
          key={item.id}
          image={item.image}
          title={item.title}
          variant={item.variant}
          price={item.price}
          quantity={item.quantity}
          onQuantityChange={(q) =>
            setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, quantity: q } : it)))
          }
          onRemove={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
        />
      ))}
      <Text variant="h3">Total: \${total.toFixed(2)}</Text>
    </View>
  )
}`,
},

'payment-card': {
  name: 'Payment Card',
  slug: 'payment-card',
  description: 'Credit card display with gradient-free brand-colored surface, auto-detected card brand, and masked digits, or a fully validated input form for card number, expiry, CVC, and cardholder name.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add payment-card',
  accessibility: [
    { feature: 'Display summary', detail: 'accessibilityRole="summary" with an accessibilityLabel announcing the last 4 digits.' },
    { feature: 'Input form role', detail: 'accessibilityRole="form" on the input variant container, with per-field accessibilityLabel values (e.g. "Card number", "CVC security code").' },
  ],
  props: [
    { name: 'cardNumber', type: 'string', description: 'Card number (raw digits); auto-formatted and masked for display.' },
    { name: 'cardholderName', type: 'string', description: 'Cardholder name.' },
    { name: 'expiryDate', type: 'string', description: 'Expiry, e.g. "1228" formatted to "12/28".' },
    { name: 'cvc', type: 'string', description: 'CVC code (input variant only).' },
    { name: 'brand', type: '"visa"|"mastercard"|"amex"|"discover"|"generic"', description: 'Card brand override. Auto-detected from cardNumber when omitted.' },
    { name: 'variant', type: '"display"|"input"', default: '"display"', description: 'Renders a read-only visual card, or an editable form.' },
    { name: 'onCardNumberChange', type: '(value: string) => void', description: 'Called with cleaned digits when the card number input changes.' },
    { name: 'onExpiryChange', type: '(value: string) => void', description: 'Called with cleaned digits when the expiry input changes.' },
    { name: 'onCvcChange', type: '(value: string) => void', description: 'Called with cleaned digits when the CVC input changes.' },
    { name: 'onCardholderNameChange', type: '(value: string) => void', description: 'Called when the cardholder name input changes.' },
    { name: 'errors', type: '{ cardNumber?: string; expiryDate?: string; cvc?: string; cardholderName?: string }', description: 'Validation error messages shown under each input field.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables inputs.' },
  ],
  usageCode: `import { PaymentCard } from '~/components/ui/payment-card'

// Display — brand auto-detected from number
<PaymentCard cardNumber="4242424242424242" cardholderName="Jane Doe" expiryDate="12/28" />
<PaymentCard cardNumber="5500000000000004" cardholderName="Jane Doe" expiryDate="09/27" />

// Explicit brand
<PaymentCard brand="amex" cardNumber="340000000000009" cardholderName="Jane Doe" />

// Input form
const [cardNumber, setCardNumber] = useState('')
const [name, setName] = useState('')
const [expiry, setExpiry] = useState('')
const [cvc, setCvc] = useState('')

<PaymentCard
  variant="input"
  cardNumber={cardNumber}
  cardholderName={name}
  expiryDate={expiry}
  cvc={cvc}
  onCardNumberChange={setCardNumber}
  onCardholderNameChange={setName}
  onExpiryChange={setExpiry}
  onCvcChange={setCvc}
/>

// With validation errors
<PaymentCard
  variant="input"
  cardNumber="123"
  errors={{ cardNumber: 'Card number is incomplete' }}
/>`,
  exampleCode: `import { useState } from 'react'
import { PaymentCard } from '~/components/ui/payment-card'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function CheckoutPaymentStep() {
  const [cardNumber, setCardNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  return (
    <View style={{ gap: 20, padding: 16 }}>
      <PaymentCard cardNumber={cardNumber} cardholderName={name} expiryDate={expiry} variant="display" />

      <PaymentCard
        variant="input"
        cardNumber={cardNumber}
        cardholderName={name}
        expiryDate={expiry}
        cvc={cvc}
        onCardNumberChange={setCardNumber}
        onCardholderNameChange={setName}
        onExpiryChange={setExpiry}
        onCvcChange={setCvc}
      />

      <Button fullWidth onPress={() => {}}>Save card</Button>
    </View>
  )
}`,
},

'pricing-card': {
  name: 'Pricing Card',
  slug: 'pricing-card',
  description: 'Subscription plan card with price display, a checklist of included/excluded features, a "Most Popular" badge treatment, and a spring-animated CTA button.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add pricing-card',
  accessibility: [
    { feature: 'Summary role', detail: 'accessibilityRole="summary" with an accessibilityLabel announcing the plan title and price.' },
    { feature: 'CTA button', detail: 'The CTA is accessibilityRole="button" with accessibilityLabel set to ctaLabel and accessibilityState={{ disabled }}.' },
  ],
  props: [
    { name: 'title', type: 'string', description: 'Plan title, e.g. "Pro".' },
    { name: 'price', type: 'number', description: 'Price amount.' },
    { name: 'period', type: '"month"|"year"', default: '"month"', description: 'Billing period.' },
    { name: 'currency', type: 'string', default: '"$"', description: 'Currency symbol.' },
    { name: 'features', type: 'Array<{ text: string; included: boolean }>', default: '[]', description: 'List of features, each marked included or excluded.' },
    { name: 'popular', type: 'boolean', default: 'false', description: 'Highlights the card with a primary border, shadow, and "Most Popular" badge.' },
    { name: 'ctaLabel', type: 'string', default: '"Get Started"', description: 'CTA button label.' },
    { name: 'onPress', type: '() => void', description: 'Called when the CTA is pressed. The CTA only renders when provided.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables the CTA.' },
    { name: 'badge', type: 'string', description: 'Overrides the "Most Popular" badge text.' },
    { name: 'badgeColor', type: 'string', description: 'Overrides the badge background color.' },
    { name: 'description', type: 'string', description: 'Subtitle text under the plan title.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable haptic feedback on CTA press.' },
  ],
  usageCode: `import { PricingCard } from '~/components/ui/pricing-card'

// Basic plan
<PricingCard
  title="Starter"
  price={9}
  period="month"
  description="For individuals getting started"
  features={[
    { text: '1 project', included: true },
    { text: 'Community support', included: true },
    { text: 'Custom domain', included: false },
  ]}
  ctaLabel="Choose Starter"
  onPress={() => {}}
/>

// Popular plan
<PricingCard
  title="Pro"
  price={29}
  popular
  features={[
    { text: 'Unlimited projects', included: true },
    { text: 'Priority support', included: true },
  ]}
  onPress={() => {}}
/>

// Custom badge & color
<PricingCard
  title="Enterprise"
  price={99}
  period="year"
  badge="Best Value"
  badgeColor="#8b5cf6"
  ctaLabel="Contact Sales"
  onPress={() => {}}
/>

// Disabled
<PricingCard title="Legacy" price={19} disabled ctaLabel="Unavailable" />`,
  exampleCode: `import { PricingCard } from '~/components/ui/pricing-card'
import { View } from 'react-native'

export function PricingScreen() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 16 }}>
      <View style={{ flex: 1 }}>
        <PricingCard
          title="Free"
          price={0}
          features={[
            { text: '1 project', included: true },
            { text: 'Community support', included: true },
            { text: 'Custom domain', included: false },
          ]}
          ctaLabel="Current plan"
        />
      </View>
      <View style={{ flex: 1 }}>
        <PricingCard
          title="Pro"
          price={29}
          popular
          features={[
            { text: 'Unlimited projects', included: true },
            { text: 'Priority support', included: true },
            { text: 'Custom domain', included: true },
          ]}
          ctaLabel="Upgrade to Pro"
          onPress={() => {}}
        />
      </View>
    </View>
  )
}`,
},

'product-card': {
  name: 'Product Card',
  slug: 'product-card',
  description: 'E-commerce product card with cover image, sale badge, discount percentage, star rating, favorite toggle with spring animation, and an add-to-cart action with out-of-stock handling.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add product-card',
  accessibility: [
    { feature: 'Pressable card', detail: 'When onPress is set, the card is accessibilityRole="button" with a label combining title and price, plus accessibilityState={{ disabled }}.' },
    { feature: 'Favorite toggle', detail: 'accessibilityRole="button" with a dynamic label ("Add to favorites" / "Remove from favorites") and accessibilityState={{ selected: favorite }}.' },
    { feature: 'Add to cart', detail: 'accessibilityRole="button", accessibilityLabel="Add to cart", and accessibilityState={{ disabled }} when out of stock or disabled.' },
  ],
  props: [
    { name: 'image', type: 'ImageSourcePropType', description: 'Product image source.' },
    { name: 'title', type: 'string', description: 'Product title.' },
    { name: 'price', type: 'number', description: 'Current price.' },
    { name: 'originalPrice', type: 'number', description: 'Original price, shown struck through with a discount % when greater than price.' },
    { name: 'currency', type: 'string', default: '"$"', description: 'Currency symbol.' },
    { name: 'rating', type: 'number', description: 'Average rating out of 5, rendered as stars.' },
    { name: 'reviewCount', type: 'number', description: 'Number of reviews shown next to the rating.' },
    { name: 'onPress', type: '() => void', description: 'Makes the whole card pressable with a spring scale animation.' },
    { name: 'onAddToCart', type: '() => void', description: 'Shows an "Add" button that triggers this handler.' },
    { name: 'inStock', type: 'boolean', default: 'true', description: 'When false, shows an "Out of Stock" overlay and disables add-to-cart.' },
    { name: 'badge', type: 'string', description: 'Badge text, e.g. "Sale", "New".' },
    { name: 'badgeColor', type: 'string', description: 'Badge background color override.' },
    { name: 'favorite', type: 'boolean', default: 'false', description: 'Whether the product is favorited.' },
    { name: 'onFavoriteToggle', type: '() => void', description: 'Shows a heart button that triggers this handler with a bounce animation.' },
    { name: 'imageAspectRatio', type: 'number', default: '1', description: 'Aspect ratio applied to the product image.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables press interactions.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable haptic feedback on favorite toggle and add-to-cart.' },
  ],
  usageCode: `import { ProductCard } from '~/components/ui/product-card'

// Basic
<ProductCard
  image={{ uri: 'https://...' }}
  title="Classic Runner Sneaker"
  price={89.99}
  rating={4.5}
  reviewCount={128}
  onAddToCart={() => {}}
/>

// Sale badge + discount
<ProductCard
  image={{ uri: 'https://...' }}
  title="Wireless Earbuds Pro"
  price={79.99}
  originalPrice={129.99}
  badge="Sale"
  onAddToCart={() => {}}
/>

// Favorite toggle
const [favorite, setFavorite] = useState(false)

<ProductCard
  image={{ uri: 'https://...' }}
  title="Everyday Backpack"
  price={54.0}
  favorite={favorite}
  onFavoriteToggle={() => setFavorite(f => !f)}
/>

// Out of stock
<ProductCard image={{ uri: 'https://...' }} title="Limited Edition Jacket" price={199} inStock={false} />

// Pressable card (navigate to detail)
<ProductCard image={{ uri: 'https://...' }} title="Item" price={45} onPress={() => router.push('/product/1')} />`,
  exampleCode: `import { useState } from 'react'
import { ProductCard } from '~/components/ui/product-card'
import { View } from 'react-native'

export function ProductGrid() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 16 }}>
      <View style={{ flex: 1 }}>
        <ProductCard
          image={{ uri: 'https://...' }}
          title="Classic Runner Sneaker"
          price={89.99}
          originalPrice={109.99}
          badge="Sale"
          rating={4.5}
          reviewCount={128}
          favorite={!!favorites.sneaker}
          onFavoriteToggle={() => setFavorites((f) => ({ ...f, sneaker: !f.sneaker }))}
          onAddToCart={() => {}}
        />
      </View>
      <View style={{ flex: 1 }}>
        <ProductCard
          image={{ uri: 'https://...' }}
          title="Everyday Backpack"
          price={54.0}
          rating={4.0}
          reviewCount={42}
          favorite={!!favorites.backpack}
          onFavoriteToggle={() => setFavorites((f) => ({ ...f, backpack: !f.backpack }))}
          onAddToCart={() => {}}
        />
      </View>
    </View>
  )
}`,
},

'quantity-stepper': {
  name: 'Quantity Stepper',
  slug: 'quantity-stepper',
  description: 'Plus/minus quantity control with three sizes, min/max/step bounds, spring bounce animation on value change, and press-and-hold rapid increment/decrement.',
  category: 'Forms',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add quantity-stepper',
  accessibility: [
    { feature: 'Adjustable role', detail: 'The outer container sets accessibilityRole="adjustable" with accessibilityValue={{ min, max, now: value }} and a "Quantity: N" label.' },
    { feature: 'Button roles', detail: 'Each +/- button is accessibilityRole="button" with "Increase quantity" / "Decrease quantity" labels and accessibilityState={{ disabled }} at the bounds.' },
  ],
  props: [
    { name: 'value', type: 'number', description: 'Current value.' },
    { name: 'onChange', type: '(value: number) => void', description: 'Called when the value changes via tap or long-press.' },
    { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'max', type: 'number', description: 'Maximum value. Unbounded when omitted.' },
    { name: 'step', type: 'number', default: '1', description: 'Increment/decrement step.' },
    { name: 'size', type: '"sm"|"md"|"lg"', default: '"md"', description: 'Controls button size, font size, and icon size.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both buttons and reduces opacity.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable haptic feedback on each increment/decrement.' },
  ],
  usageCode: `import { QuantityStepper } from '~/components/ui/quantity-stepper'

const [quantity, setQuantity] = useState(1)

// Basic
<QuantityStepper value={quantity} onChange={setQuantity} />

// Sizes
<QuantityStepper value={quantity} onChange={setQuantity} size="sm" />
<QuantityStepper value={quantity} onChange={setQuantity} size="lg" />

// Bounded with step
<QuantityStepper value={quantity} onChange={setQuantity} min={1} max={10} step={1} />

// Custom step
<QuantityStepper value={quantity} onChange={setQuantity} step={5} min={0} max={50} />

// Disabled
<QuantityStepper value={2} onChange={() => {}} disabled />

// Without haptics
<QuantityStepper value={quantity} onChange={setQuantity} haptic={false} />`,
  exampleCode: `import { useState } from 'react'
import { QuantityStepper } from '~/components/ui/quantity-stepper'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

export function QuantitySelector() {
  const [quantity, setQuantity] = useState(1)

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
      <Text variant="body">Quantity</Text>
      <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={20} size="md" />
    </View>
  )
}`,
},

'review-card': {
  name: 'Review Card',
  slug: 'review-card',
  description: 'User review card with author avatar or initial fallback, star rating, verified purchaser badge, expandable "Read more" text, a review image strip, and helpful/report voting.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add review-card',
  accessibility: [
    { feature: 'Summary role', detail: 'accessibilityRole="summary" with an accessibilityLabel announcing the author and star rating.' },
    { feature: 'Author link', detail: 'When onAuthorPress is provided, the avatar/name become accessibilityRole="button" with a "View {author}\'s profile" label.' },
    { feature: 'Helpful voting', detail: 'The helpful button is accessibilityRole="button" with a vote-count label and accessibilityState={{ selected: isHelpful }}.' },
  ],
  props: [
    { name: 'author', type: 'string', description: 'Review author name.' },
    { name: 'avatar', type: 'ImageSourcePropType', description: 'Author avatar image. Falls back to a colored initial when omitted.' },
    { name: 'rating', type: 'number', description: 'Rating out of 5, rendered as full/half/outline stars.' },
    { name: 'date', type: 'string | Date', description: 'Review date. Formatted as a relative time ("2d ago") or full date beyond 30 days.' },
    { name: 'text', type: 'string', description: 'Review body text.' },
    { name: 'images', type: 'string[]', default: '[]', description: 'Review photo URIs. Shows the first 4 with a "+N" overflow tile.' },
    { name: 'helpful', type: 'number', default: '0', description: 'Helpful vote count.' },
    { name: 'onHelpful', type: '() => void', description: 'Shows the helpful button and is called when pressed.' },
    { name: 'isHelpful', type: 'boolean', default: 'false', description: 'Whether the current user already marked it helpful.' },
    { name: 'onReport', type: '() => void', description: 'Shows a report button and is called when pressed.' },
    { name: 'verified', type: 'boolean', default: 'false', description: 'Shows a "Verified" purchaser badge.' },
    { name: 'onAuthorPress', type: '() => void', description: 'Makes the author name/avatar pressable.' },
    { name: 'maxLines', type: 'number', default: '3', description: 'Lines shown before a "Read more" toggle appears.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable haptic feedback on helpful vote.' },
  ],
  usageCode: `import { ReviewCard } from '~/components/ui/review-card'

// Basic
<ReviewCard
  author="Jordan Lee"
  rating={5}
  date="2026-06-20"
  text="Absolutely love this product. Fast shipping and exactly as described!"
/>

// Verified purchaser with avatar
<ReviewCard
  author="Priya Nair"
  avatar={{ uri: 'https://...' }}
  rating={4}
  date={new Date()}
  text="Great quality overall."
  verified
/>

// With images and helpful voting
const [helpful, setHelpful] = useState(12)
const [isHelpful, setIsHelpful] = useState(false)

<ReviewCard
  author="Sam Rivera"
  rating={5}
  date="2026-04-11"
  text="Photos don't do it justice!"
  images={['https://.../1.jpg', 'https://.../2.jpg']}
  helpful={helpful}
  isHelpful={isHelpful}
  onHelpful={() => {
    setIsHelpful(h => !h)
    setHelpful(h => isHelpful ? h - 1 : h + 1)
  }}
  onReport={() => {}}
/>

// Long text truncation
<ReviewCard author="Marcus Webb" rating={3} date="2026-05-02" maxLines={2} text="A very long review..." />`,
  exampleCode: `import { useState } from 'react'
import { ReviewCard } from '~/components/ui/review-card'
import { View } from 'react-native'

export function ReviewsList() {
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Jordan Lee', rating: 5, date: '2026-06-20', text: 'Absolutely love this product!', helpful: 4, isHelpful: false },
    { id: 2, author: 'Priya Nair', rating: 4, date: '2026-06-10', text: 'Great quality, runs a bit small.', helpful: 12, isHelpful: false, verified: true },
  ])

  return (
    <View style={{ gap: 12, padding: 16 }}>
      {reviews.map((r) => (
        <ReviewCard
          key={r.id}
          author={r.author}
          rating={r.rating}
          date={r.date}
          text={r.text}
          verified={r.verified}
          helpful={r.helpful}
          isHelpful={r.isHelpful}
          onHelpful={() =>
            setReviews((prev) =>
              prev.map((x) => (x.id === r.id ? { ...x, isHelpful: !x.isHelpful, helpful: x.isHelpful ? x.helpful - 1 : x.helpful + 1 } : x)),
            )
          }
          onReport={() => {}}
        />
      ))}
    </View>
  )
}`,
},

'stat-card': {
  name: 'Stat Card',
  slug: 'stat-card',
  description: 'KPI metric card with an animated count-up value, currency/percent/number formatting, an auto-computed or explicit trend badge, an icon slot, and a built-in skeleton loading state.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: ['skeleton'],
  addCommand: 'npx native-mate add stat-card',
  accessibility: [
    { feature: 'Role', detail: 'accessibilityRole is "button" when onPress is provided, otherwise "text".' },
    { feature: 'Label', detail: 'accessibilityLabel combines the title, formatted value, and trend direction/percentage into one announcement.' },
  ],
  props: [
    { name: 'title', type: 'string', description: 'Stat label/title.' },
    { name: 'value', type: 'number', description: 'Current value, animated on mount when animated is true.' },
    { name: 'previousValue', type: 'number', description: 'Used to auto-calculate the % change when change is not provided.' },
    { name: 'change', type: 'number', description: 'Absolute % change; overrides the calculation from previousValue.' },
    { name: 'changeType', type: '"increase"|"decrease"|"neutral"', description: 'Trend direction. Auto-detected from the change sign when omitted.' },
    { name: 'icon', type: 'React.ReactNode', description: 'Icon rendered in a tinted rounded container at the top-right.' },
    { name: 'format', type: '"number"|"currency"|"percent"', default: '"number"', description: 'Number formatting applied to the value.' },
    { name: 'prefix', type: 'string', description: 'Prefix string. Defaults to "$" for currency format.' },
    { name: 'suffix', type: 'string', description: 'Suffix string. Defaults to "%" for percent format.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Renders an animated skeleton in place of content.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animates the value counting up on mount/change.' },
    { name: 'decimals', type: 'number', description: 'Decimal places. Defaults to 0 for number, 2 for currency, 1 for percent.' },
    { name: 'currency', type: 'string', default: '"USD"', description: 'Currency code for currency format (informational).' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable haptic feedback on press.' },
    { name: 'onPress', type: '() => void', description: 'Makes the card pressable with a spring scale animation.' },
  ],
  usageCode: `import { StatCard } from '~/components/ui/stat-card'
import { Ionicons } from '@expo/vector-icons'

// Basic, animated counter
<StatCard title="Total Users" value={12480} />

// Auto trend from previousValue
<StatCard
  title="Monthly Revenue"
  value={48250}
  previousValue={41200}
  format="currency"
  icon={<Ionicons name="cash-outline" size={18} color="#22c55e" />}
/>

// Explicit change
<StatCard title="Churn Rate" value={4.2} format="percent" change={-1.3} changeType="decrease" />

// Pressable
<StatCard title="Active Sessions" value={1204} onPress={() => {}} />

// Loading skeleton
<StatCard title="Total Users" value={0} loading />`,
  exampleCode: `import { StatCard } from '~/components/ui/stat-card'
import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'

export function DashboardStats() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 16 }}>
      <View style={{ flex: 1 }}>
        <StatCard
          title="Monthly Revenue"
          value={48250}
          previousValue={41200}
          format="currency"
          icon={<Ionicons name="cash-outline" size={18} color="#22c55e" />}
        />
      </View>
      <View style={{ flex: 1 }}>
        <StatCard title="Orders" value={342} change={12.4} changeType="increase" />
      </View>
      <View style={{ flex: 1 }}>
        <StatCard title="Refunds" value={8} change={-4.1} changeType="decrease" />
      </View>
    </View>
  )
}`,
},

'countdown': {
  name: 'Countdown',
  slug: 'countdown',
  description: 'Countdown timer to a target date with animated digit-flip transitions, three display formats (days/hours/min/sec, hours/min/sec, min/sec), and card, inline, or minimal visual variants.',
  category: 'Display',
  npmDeps: ['react-native-reanimated'],
  componentDeps: [],
  addCommand: 'npx native-mate add countdown',
  props: [
    { name: 'targetDate', type: 'Date', description: 'Target date/time to count down to.' },
    { name: 'onComplete', type: '() => void', description: 'Called once when the countdown reaches zero.' },
    { name: 'format', type: '"dhms"|"hms"|"ms"', default: '"dhms"', description: 'Which time units to display.' },
    { name: 'separator', type: 'string', default: '":"', description: 'Separator rendered between units.' },
    { name: 'size', type: '"sm"|"md"|"lg"', default: '"md"', description: 'Controls digit size and card padding.' },
    { name: 'variant', type: '"card"|"inline"|"minimal"', default: '"card"', description: 'Visual style: boxed unit cards, inline digits with separators, or a single compact line.' },
    { name: 'label', type: 'string', description: 'Optional label shown above the countdown.' },
    { name: 'digitColor', type: 'string', description: 'Digit text color override.' },
    { name: 'cardColor', type: 'string', description: 'Background color for card variant unit boxes.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Animates each digit with a roll/scale transition when its value changes.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Pauses the timer and reduces opacity.' },
  ],
  usageCode: `import { Countdown } from '~/components/ui/countdown'

// Card variant (default)
<Countdown targetDate={new Date('2026-08-01T00:00:00')} label="Sale ends in" />

// Sizes
<Countdown targetDate={target} size="sm" format="hms" />
<Countdown targetDate={target} size="lg" format="hms" />

// Inline variant
<Countdown targetDate={target} variant="inline" format="hms" label="Offer expires" />

// Minimal variant
<Countdown targetDate={target} variant="minimal" format="ms" />

// Custom colors & separator
<Countdown targetDate={target} digitColor="#f43f5e" cardColor="#1c1917" separator="·" />

// Completion callback
<Countdown targetDate={target} onComplete={() => showFlashSaleEndedModal()} />`,
  exampleCode: `import { Countdown } from '~/components/ui/countdown'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

export function FlashSaleBanner() {
  const target = new Date(Date.now() + 1000 * 60 * 60 * 26)

  return (
    <View style={{ alignItems: 'center', gap: 12, padding: 16 }}>
      <Text variant="h3">Flash Sale</Text>
      <Countdown
        targetDate={target}
        label="Ends in"
        digitColor="#f43f5e"
        onComplete={() => console.log('Sale ended')}
      />
    </View>
  )
}`,
},

'notification-card': {
  name: 'Notification Card',
  slug: 'notification-card',
  description: 'Notification list item with category-colored icon or avatar, unread indicator dot, relative timestamp, and swipe-to-dismiss backed by a native PanResponder gesture.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add notification-card',
  accessibility: [
    { feature: 'Button role', detail: 'accessibilityRole="button" with a label combining read state, title, message, and relative time.' },
    { feature: 'Unread state', detail: 'accessibilityState={{ selected: !read }} reflects the unread indicator.' },
  ],
  props: [
    { name: 'title', type: 'string', description: 'Notification title.' },
    { name: 'message', type: 'string', description: 'Notification body message.' },
    { name: 'timestamp', type: 'Date | string', description: 'Timestamp, rendered as relative time ("5m ago", "2d ago") or a locale date beyond 4 weeks.' },
    { name: 'icon', type: 'React.ReactNode', description: 'Custom icon, overriding the default category icon.' },
    { name: 'avatar', type: '{ uri: string } | number', description: 'Avatar image, overriding the icon entirely when provided.' },
    { name: 'read', type: 'boolean', default: 'false', description: 'Whether the notification has been read. Unread items show a left accent border and dot.' },
    { name: 'onPress', type: '() => void', description: 'Called when the card is pressed.' },
    { name: 'onDismiss', type: '() => void', description: 'Called after a successful swipe-to-dismiss gesture.' },
    { name: 'category', type: '"info"|"success"|"warning"|"error"|"social"|"system"', default: '"info"', description: 'Determines the accent color and default icon.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable haptic feedback on press.' },
    { name: 'swipeToDismiss', type: 'boolean', default: 'true', description: 'Enables the left-swipe-to-dismiss gesture (requires onDismiss).' },
  ],
  usageCode: `import { NotificationCard } from '~/components/ui/notification-card'

// Categories
<NotificationCard title="Payment received" message="Invoice #4821 was paid." timestamp={new Date()} category="success" />
<NotificationCard title="Storage almost full" message="92% of storage used." timestamp={new Date()} category="warning" />
<NotificationCard title="Payment failed" message="Your card was declined." timestamp={new Date()} category="error" />

// Unread vs read
<NotificationCard title="New comment" message="Priya replied to your post." timestamp={new Date()} category="social" read={false} />
<NotificationCard title="Weekly digest" message="Here's what happened this week." timestamp={new Date()} category="system" read />

// With avatar
<NotificationCard
  title="Jordan Lee"
  message="Liked your comment"
  timestamp={new Date()}
  avatar={{ uri: 'https://...' }}
  category="social"
  onPress={() => {}}
/>

// Swipeable, dismissible
<NotificationCard
  title="New order"
  message="Order #1092 was placed."
  timestamp={new Date()}
  category="info"
  onDismiss={() => removeNotification(id)}
  onPress={() => markAsRead(id)}
/>`,
  exampleCode: `import { useState } from 'react'
import { NotificationCard } from '~/components/ui/notification-card'
import { View } from 'react-native'

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New comment', message: 'Priya replied to your post.', category: 'social' as const, read: false, timestamp: new Date() },
    { id: 2, title: 'Payment received', message: 'Invoice #4821 was paid.', category: 'success' as const, read: false, timestamp: new Date() },
  ])

  return (
    <View style={{ gap: 10, padding: 16 }}>
      {notifications.map((n) => (
        <NotificationCard
          key={n.id}
          title={n.title}
          message={n.message}
          timestamp={n.timestamp}
          category={n.category}
          read={n.read}
          onPress={() =>
            setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
          }
          onDismiss={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
        />
      ))}
    </View>
  )
}`,
},

  chip: {
    name: 'Chip',
    slug: 'chip',
    description: 'Selectable chip with spring-animated fill/border transitions, icon or avatar support, closable mode, and a ChipGroup layout helper for filter bars and tag pickers.',
    category: 'Forms',
    npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
    componentDeps: [],
    addCommand: 'npx native-mate add chip',
    accessibility: [
      { feature: 'Role', detail: 'accessibilityRole="button" is set automatically, with accessibilityLabel derived from label.' },
      { feature: 'Selected / disabled state', detail: 'accessibilityState={{ selected, disabled }} is set automatically.' },
      { feature: 'Group role', detail: 'ChipGroup sets accessibilityRole="radiogroup" on its container.' },
      { feature: 'Close button label', detail: 'The remove button gets accessibilityLabel={`Remove ${label}`}.' },
    ],
    props: [
      { name: 'label', type: 'string', description: 'Text displayed inside the chip.' },
      { name: 'selected', type: 'boolean', default: 'false', description: 'Whether the chip is in the selected/active state.' },
      { name: 'onPress', type: '() => void', description: 'Called when the chip is pressed.' },
      { name: 'variant', type: '"filled" | "outlined"', default: '"outlined"', description: 'Visual style — filled background vs. outlined border.' },
      { name: 'size', type: '"sm" | "md"', default: '"md"', description: 'Controls height, padding, and font size.' },
      { name: 'icon', type: 'string', description: 'Ionicons icon name displayed before the label.' },
      { name: 'avatar', type: 'React.ReactNode', description: 'Avatar element displayed before the label, takes priority over icon.' },
      { name: 'closable', type: 'boolean', default: 'false', description: 'Shows a close/remove button at the end of the chip.' },
      { name: 'onClose', type: '() => void', description: 'Called when the close button is pressed.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables interaction.' },
      { name: 'color', type: 'string', description: 'Custom accent color used for the selected state.' },
      { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"light"', description: 'Haptic feedback intensity on press. Requires expo-haptics (optional).' },
    ],
    usageCode: `import { Chip, ChipGroup } from '~/components/ui/chip'

// Variants
<Chip label="Outlined" variant="outlined" />
<Chip label="Filled" variant="filled" selected />

// Sizes
<Chip label="Small" size="sm" />
<Chip label="Medium" size="md" />

// With icon or avatar
<Chip label="Favorites" icon="heart" selected color="#f43f5e" />
<Chip label="Jane Doe" avatar={<Avatar size="xs" />} />

// Closable
<Chip label="React Native" closable onClose={() => remove('rn')} />

// Selectable group (filter bar)
<ChipGroup>
  {options.map(opt => (
    <Chip
      key={opt}
      label={opt}
      selected={selected.includes(opt)}
      onPress={() => toggle(opt)}
    />
  ))}
</ChipGroup>

// Disabled
<Chip label="Unavailable" disabled />`,
    exampleCode: `import { useState } from 'react'
import { Chip, ChipGroup } from '~/components/ui/chip'
import { View } from 'react-native'

const CATEGORIES = ['Design', 'Engineering', 'Marketing', 'Sales', 'Support']

export function CategoryFilter() {
  const [selected, setSelected] = useState<string[]>(['Engineering'])

  const toggle = (label: string) =>
    setSelected(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <ChipGroup>
        {CATEGORIES.map(label => (
          <Chip
            key={label}
            label={label}
            variant="filled"
            selected={selected.includes(label)}
            onPress={() => toggle(label)}
          />
        ))}
      </ChipGroup>
    </View>
  )
}`,
  },

  'color-picker': {
    name: 'Color Picker',
    slug: 'color-picker',
    description: 'Color picker with preset swatches, HSL hue/saturation/lightness sliders, live hex input, and an accessible adjustable control for building theme or brand color selectors.',
    category: 'Forms',
    npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
    componentDeps: [],
    addCommand: 'npx native-mate add color-picker',
    accessibility: [
      { feature: 'Role', detail: 'accessibilityRole="adjustable" is set on the container, with accessibilityLabel="Color picker".' },
      { feature: 'Preset selection', detail: 'Each swatch is a button with accessibilityLabel={`Select color ${color}`} and accessibilityState={{ selected }}.' },
      { feature: 'Sliders', detail: 'Hue/Saturation/Lightness sliders set accessibilityRole="adjustable" and accessibilityValue={{ min, max, now }}.' },
      { feature: 'Hex input', detail: 'The hex TextInput sets accessibilityLabel="Hex color value".' },
    ],
    props: [
      { name: 'value', type: 'string', description: 'Current color value as a hex string, e.g. "#6366F1".' },
      { name: 'onChange', type: '(color: string) => void', description: 'Called with the new hex color whenever a preset, slider, or hex field changes.' },
      { name: 'presets', type: 'string[]', default: '18 built-in swatches', description: 'Preset color swatches rendered in a wrapping grid.' },
      { name: 'showCustom', type: 'boolean', default: 'true', description: 'Shows the HSL sliders and hex input below the preset grid.' },
      { name: 'format', type: '"hex" | "rgb" | "hsl"', default: '"hex"', description: 'Output color format (currently onChange always emits hex).' },
      { name: 'showAlpha', type: 'boolean', default: 'false', description: 'Reserved for showing an alpha/opacity slider.' },
      { name: 'size', type: 'number', default: '40', description: 'Width/height of each preset swatch in dp.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all interaction and dims the picker.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Triggers a light haptic tap when a preset is selected.' },
    ],
    usageCode: `import { ColorPicker } from '~/components/ui/color-picker'

const [color, setColor] = useState('#6366F1')

// Default — presets + HSL sliders + hex input
<ColorPicker value={color} onChange={setColor} />

// Presets only
<ColorPicker value={color} onChange={setColor} showCustom={false} />

// Custom preset palette, bigger swatches
<ColorPicker
  value={color}
  onChange={setColor}
  presets={['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF']}
  size={32}
/>

// Disabled
<ColorPicker value={color} onChange={setColor} disabled />`,
    exampleCode: `import { useState } from 'react'
import { ColorPicker } from '~/components/ui/color-picker'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function BrandColorPicker() {
  const [color, setColor] = useState('#6366F1')

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text variant="label">Accent color</Text>
      <ColorPicker value={color} onChange={setColor} />
      <View style={{ height: 56, borderRadius: 12, backgroundColor: color }} />
    </View>
  )
}`,
  },

  'date-picker': {
    name: 'Date Picker',
    slug: 'date-picker',
    description: 'Custom calendar with month navigation and day grid, plus a scroll-style hour/minute time spinner, supporting date, time, or combined datetime modes with min/max range limits.',
    category: 'Forms',
    npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
    componentDeps: ['sheet'],
    addCommand: 'npx native-mate add date-picker',
    accessibility: [
      { feature: 'Day cells', detail: 'Each day is a button with accessibilityLabel like "March 14, 2026, selected, today" and accessibilityState={{ selected, disabled }}.' },
      { feature: 'Navigation', detail: 'Previous/Next month buttons and hour/minute increment/decrement buttons all set accessibilityRole="button" with descriptive labels.' },
      { feature: 'Confirm button', detail: 'accessibilityLabel is set to the confirmLabel text when showConfirmButton is enabled.' },
    ],
    props: [
      { name: 'value', type: 'Date', description: 'Currently selected date.' },
      { name: 'onChange', type: '(date: Date) => void', description: 'Called when the date/time changes (or on confirm if showConfirmButton is true).' },
      { name: 'mode', type: '"date" | "time" | "datetime"', default: '"date"', description: 'Which picker surfaces to render — calendar, time spinner, or both.' },
      { name: 'minimumDate', type: 'Date', description: 'Earliest selectable date; days before it are disabled.' },
      { name: 'maximumDate', type: 'Date', description: 'Latest selectable date; days after it are disabled.' },
      { name: 'visible', type: 'boolean', default: 'false', description: 'Whether the picker is rendered (intended for bottom-sheet presentation).' },
      { name: 'onClose', type: '() => void', description: 'Called when the picker is dismissed (e.g. after confirming).' },
      { name: 'title', type: 'string', description: 'Title text shown above the calendar/time UI.' },
      { name: 'showConfirmButton', type: 'boolean', default: 'false', description: 'Requires an explicit confirm tap instead of committing changes immediately.' },
      { name: 'confirmLabel', type: 'string', default: '"Done"', description: 'Label for the confirm button.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Enables selection/impact haptics for navigation and day/time selection.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims and disables the entire picker.' },
      { name: 'sheetHeight', type: 'number', default: '420', description: 'Suggested height when presenting inside a bottom sheet.' },
    ],
    usageCode: `import { DatePicker } from '~/components/ui/date-picker'

const [date, setDate] = useState(new Date())

// Date mode — calendar grid
<DatePicker value={date} onChange={setDate} mode="date" title="Select date" />

// Time mode — hour/minute spinner
<DatePicker value={date} onChange={setDate} mode="time" title="Select time" />

// Datetime mode — calendar + time
<DatePicker value={date} onChange={setDate} mode="datetime" />

// With confirm button and a bounded range
<DatePicker
  value={date}
  onChange={setDate}
  showConfirmButton
  confirmLabel="Confirm date"
  minimumDate={new Date()}
  maximumDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)}
/>`,
    exampleCode: `import { useState } from 'react'
import { DatePicker } from '~/components/ui/date-picker'
import { Sheet } from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function BookingDatePicker() {
  const [visible, setVisible] = useState(false)
  const [date, setDate] = useState(new Date())

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Button variant="outline" onPress={() => setVisible(true)}>
        {date.toDateString()}
      </Button>

      <Sheet visible={visible} onClose={() => setVisible(false)}>
        <DatePicker
          value={date}
          onChange={setDate}
          mode="date"
          title="Choose check-in date"
          showConfirmButton
          minimumDate={new Date()}
          onClose={() => setVisible(false)}
        />
      </Sheet>
    </View>
  )
}`,
  },

  'mention-input': {
    name: 'Mention Input',
    slug: 'mention-input',
    description: 'Text input with @mention autocomplete — detects an in-progress @query as the user types, shows a filterable user dropdown above the field, and inserts the selected name at the cursor.',
    category: 'Forms',
    npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
    componentDeps: [],
    addCommand: 'npx native-mate add mention-input',
    accessibility: [
      { feature: 'Input label', detail: 'The underlying TextInput sets accessibilityLabel to the placeholder text.' },
      { feature: 'Mention items', detail: 'Each dropdown row is a button with accessibilityLabel={`Mention ${user.name}`}.' },
    ],
    props: [
      { name: 'value', type: 'string', description: 'Current text value.' },
      { name: 'onChangeText', type: '(text: string) => void', description: 'Called when the text changes.' },
      { name: 'mentions', type: 'MentionUser[]', default: '[]', description: 'Available users for mention autocomplete — { id, name, avatar? }.' },
      { name: 'onMentionSelect', type: '(user: MentionUser) => void', description: 'Called when a user is selected from the dropdown.' },
      { name: 'onQueryChange', type: '(query: string) => void', description: 'Called with the current @query text as the user types after "@".' },
      { name: 'placeholder', type: 'string', default: '"Type a message..."', description: 'Placeholder text for the input.' },
      { name: 'multiline', type: 'boolean', default: 'false', description: 'Allows the input to grow to multiple lines.' },
      { name: 'maxLines', type: 'number', default: '4', description: 'Maximum visible lines when multiline is true.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables editing.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Triggers a light haptic tap when a mention is selected.' },
    ],
    usageCode: `import { MentionInput } from '~/components/ui/mention-input'

const users = [
  { id: 'ada', name: 'Ada Lovelace' },
  { id: 'alan', name: 'Alan Turing' },
  { id: 'grace', name: 'Grace Hopper' },
]

const [text, setText] = useState('')

// Single line, mentions dropdown appears above the field while typing "@"
<MentionInput value={text} onChangeText={setText} mentions={users} />

// Multiline comment box
<MentionInput
  value={text}
  onChangeText={setText}
  mentions={users}
  multiline
  maxLines={4}
  placeholder="Write a comment..."
/>

// Track the raw query for server-side search
<MentionInput
  value={text}
  onChangeText={setText}
  mentions={filteredUsers}
  onQueryChange={(query) => searchUsers(query)}
/>

// Disabled
<MentionInput value="Locked message" onChangeText={() => {}} disabled />`,
    exampleCode: `import { useState } from 'react'
import { MentionInput } from '~/components/ui/mention-input'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

const TEAM = [
  { id: 'ada', name: 'Ada Lovelace' },
  { id: 'alan', name: 'Alan Turing' },
  { id: 'grace', name: 'Grace Hopper' },
]

export function CommentComposer() {
  const [text, setText] = useState('')

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <MentionInput
        value={text}
        onChangeText={setText}
        mentions={TEAM}
        multiline
        maxLines={4}
        placeholder="Mention a teammate with @..."
      />
      <Button onPress={() => console.log(text)} disabled={!text.trim()}>
        Post comment
      </Button>
    </View>
  )
}`,
  },

  'phone-input': {
    name: 'Phone Input',
    slug: 'phone-input',
    description: 'International phone number input with a searchable country picker sheet, flag and dial code display, and automatic per-country digit formatting (e.g. "(###) ###-####").',
    category: 'Forms',
    npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
    componentDeps: [],
    addCommand: 'npx native-mate add phone-input',
    accessibility: [
      { feature: 'Country selector', detail: 'accessibilityLabel is set to "Selected country: {name}. Tap to change."' },
      { feature: 'Input state', detail: 'accessibilityState={{ disabled }} is set on the text field, and accessibilityLabel falls back to the label or placeholder.' },
      { feature: 'Country list rows', detail: 'Each row in the picker sheet is a button with accessibilityLabel={`${name} ${dialCode}`}.' },
    ],
    props: [
      { name: 'value', type: 'string', description: 'Current phone number as digits only (no dial code).' },
      { name: 'onChangeText', type: '(value: string) => void', description: 'Called with the raw digit string when the number changes.' },
      { name: 'defaultCountry', type: 'string', default: '"US"', description: 'ISO 3166-1 alpha-2 code for the initially selected country.' },
      { name: 'onCountryChange', type: '(country: Country) => void', description: 'Called when the user selects a different country.' },
      { name: 'countries', type: 'Country[]', default: '20 built-in countries', description: 'Custom country list to use instead of the built-in one.' },
      { name: 'showFlag', type: 'boolean', default: 'true', description: 'Shows the country flag emoji in the selector button.' },
      { name: 'showDialCode', type: 'boolean', default: 'true', description: 'Shows the dial code (e.g. "+1") in the selector button.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input and country picker.' },
      { name: 'error', type: 'string', description: 'Error message rendered below the input; also colors the border red.' },
      { name: 'label', type: 'string', description: 'Label rendered above the input.' },
      { name: 'placeholder', type: 'string', default: '"Phone number"', description: 'Placeholder text for the number field.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Enables selection/impact haptics on country change and picker open.' },
    ],
    usageCode: `import { PhoneInput } from '~/components/ui/phone-input'

const [phone, setPhone] = useState('')

// Default — US, with flag and dial code
<PhoneInput value={phone} onChangeText={setPhone} label="Phone number" />

// Different default country
<PhoneInput value={phone} onChangeText={setPhone} defaultCountry="GB" label="Mobile number" />

// Error state
<PhoneInput
  value={phone}
  onChangeText={setPhone}
  label="Phone number"
  error="Enter a valid phone number"
/>

// Minimal — no flag or dial code shown
<PhoneInput value={phone} onChangeText={setPhone} showFlag={false} showDialCode={false} />

// Disabled
<PhoneInput value={phone} onChangeText={setPhone} disabled />`,
    exampleCode: `import { useState } from 'react'
import { PhoneInput, type Country } from '~/components/ui/phone-input'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function SignupPhoneStep() {
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState<Country | null>(null)
  const [error, setError] = useState<string | undefined>()

  const handleContinue = () => {
    if (phone.length < 7) {
      setError('Enter a valid phone number')
      return
    }
    setError(undefined)
    console.log(country?.dialCode, phone)
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <PhoneInput
        value={phone}
        onChangeText={setPhone}
        onCountryChange={setCountry}
        label="Phone number"
        error={error}
      />
      <Button fullWidth onPress={handleContinue}>Continue</Button>
    </View>
  )
}`,
  },

  'pin-lock': {
    name: 'PIN Lock',
    slug: 'pin-lock',
    description: 'Full-screen PIN entry with an animated dot fill, a number keypad with letter subtext, shake-on-error feedback, an optional biometric button, and a lockout countdown after too many attempts.',
    category: 'Forms',
    npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
    componentDeps: [],
    addCommand: 'npx native-mate add pin-lock',
    accessibility: [
      { feature: 'Role', detail: 'The container sets accessibilityRole="form" with accessibilityLabel={`PIN entry, ${length} digits`}.' },
      { feature: 'Keys', detail: 'Each keypad button sets accessibilityLabel like "2, ABC", and is disabled with disabled={locked}.' },
      { feature: 'Delete / biometric', detail: 'Delete and biometric buttons set accessibilityRole="button" with descriptive labels ("Delete", "Use biometric authentication").' },
    ],
    props: [
      { name: 'length', type: '4 | 6', default: '4', description: 'Number of PIN digits.' },
      { name: 'onComplete', type: '(pin: string) => void', description: 'Called once all digits have been entered.' },
      { name: 'onBiometric', type: '() => void', description: 'Called when the biometric button is pressed.' },
      { name: 'showBiometric', type: 'boolean', default: 'false', description: 'Shows a fingerprint/face-ID button in place of the empty key slot.' },
      { name: 'title', type: 'string', default: '"Enter PIN"', description: 'Title text above the dots.' },
      { name: 'subtitle', type: 'string', description: 'Subtitle text shown below the title when there is no error or lock message.' },
      { name: 'error', type: 'boolean', default: 'false', description: 'Triggers a shake animation and clears the PIN after a short delay.' },
      { name: 'errorMessage', type: 'string', description: 'Error text shown in place of the subtitle when error is true.' },
      { name: 'locked', type: 'boolean', default: 'false', description: 'Disables the keypad and shows a countdown timer instead of the subtitle.' },
      { name: 'lockDuration', type: 'number', default: '0', description: 'Lockout duration in seconds, counted down while locked is true.' },
      { name: 'maxAttempts', type: 'number', description: 'Maximum allowed attempts (informational — enforce logic in your app).' },
      { name: 'attemptsRemaining', type: 'number', description: 'Remaining attempts shown as a caption below the header when not locked.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Enables impact/notification haptics on key press, delete, and error.' },
    ],
    usageCode: `import { PinLock } from '~/components/ui/pin-lock'

// 4-digit PIN
<PinLock
  length={4}
  title="Enter PIN"
  subtitle="Enter your 4-digit passcode"
  onComplete={(pin) => verifyPin(pin)}
/>

// 6-digit with biometric unlock
<PinLock
  length={6}
  title="Welcome back"
  showBiometric
  onBiometric={() => authenticateWithFaceId()}
  onComplete={(pin) => verifyPin(pin)}
/>

// Error + attempts remaining
<PinLock
  length={4}
  error={wrongPin}
  errorMessage="Incorrect PIN"
  attemptsRemaining={2}
  onComplete={verifyPin}
/>

// Locked out
<PinLock length={4} title="Too many attempts" locked lockDuration={30} />`,
    exampleCode: `import { useState } from 'react'
import { PinLock } from '~/components/ui/pin-lock'

const CORRECT_PIN = '1234'

export function AppLockScreen() {
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(3)
  const [locked, setLocked] = useState(false)

  const handleComplete = (pin: string) => {
    if (pin === CORRECT_PIN) {
      setError(false)
      // unlock app
      return
    }
    const remaining = attempts - 1
    setAttempts(remaining)
    setError(true)
    if (remaining <= 0) setLocked(true)
  }

  return (
    <PinLock
      length={4}
      title="Enter PIN"
      subtitle="Enter your passcode to continue"
      error={error}
      errorMessage="Incorrect PIN"
      attemptsRemaining={attempts}
      locked={locked}
      lockDuration={30}
      showBiometric
      onBiometric={() => console.log('Face ID requested')}
      onComplete={handleComplete}
    />
  )
}`,
  },

  rating: {
    name: 'Rating',
    slug: 'rating',
    description: 'Interactive star rating with spring "pop" animation per star, optional half-star precision, custom icons and colors, a numeric value label, and a read-only display mode.',
    category: 'Forms',
    npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
    componentDeps: [],
    addCommand: 'npx native-mate add rating',
    accessibility: [
      { feature: 'Role', detail: 'accessibilityRole="adjustable" is set on the container, with accessibilityValue={{ min: 0, max: maxStars, now: value }}.' },
      { feature: 'Label', detail: 'Defaults to accessibilityLabel={`Rating: ${value} of ${maxStars} stars`}; pass accessibilityLabel to override.' },
    ],
    props: [
      { name: 'value', type: 'number', description: 'Current rating value (supports .5 increments when allowHalf is true).' },
      { name: 'onChange', type: '(value: number) => void', description: 'Called when the user taps a star to change the rating.' },
      { name: 'maxStars', type: 'number', default: '5', description: 'Total number of stars rendered.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Icon size and spacing preset.' },
      { name: 'readonly', type: 'boolean', default: 'false', description: 'Renders stars as non-interactive, for displaying an average rating.' },
      { name: 'allowHalf', type: 'boolean', default: 'false', description: 'Enables half-star values and tap zones.' },
      { name: 'icon', type: 'string', default: '"star"', description: 'Ionicons name used for a filled star.' },
      { name: 'emptyIcon', type: 'string', default: '"star-outline"', description: 'Ionicons name used for an empty star.' },
      { name: 'color', type: 'string', default: '"#f59e0b"', description: 'Color of filled stars.' },
      { name: 'emptyColor', type: 'string', description: 'Color of empty stars. Defaults to a dimmed muted theme color.' },
      { name: 'showValue', type: 'boolean', default: 'false', description: 'Shows the numeric value next to the stars.' },
      { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"light"', description: 'Haptic feedback intensity when a star is tapped.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the stars and disables interaction.' },
      { name: 'accessibilityLabel', type: 'string', description: 'Overrides the default accessible label.' },
    ],
    usageCode: `import { Rating } from '~/components/ui/rating'

const [value, setValue] = useState(3)

// Interactive
<Rating value={value} onChange={setValue} />

// Sizes
<Rating value={4} size="sm" readonly />
<Rating value={4} size="lg" readonly />

// Half-star precision with numeric label
<Rating value={value} onChange={setValue} allowHalf showValue />

// Custom color and star count
<Rating value={value} onChange={setValue} maxStars={10} color="#22C55E" showValue />

// Read-only average display
<Rating value={4.5} readonly allowHalf showValue />

// Disabled
<Rating value={2} disabled />`,
    exampleCode: `import { useState } from 'react'
import { Rating } from '~/components/ui/rating'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function ProductReviewForm() {
  const [rating, setRating] = useState(0)

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text variant="label">How would you rate this product?</Text>
      <Rating value={rating} onChange={setRating} size="lg" showValue />
      <Text variant="caption" muted>
        Average rating: <Rating value={4.5} readonly allowHalf size="sm" /> 4.5 (238 reviews)
      </Text>
    </View>
  )
}`,
  },

  'search-bar': {
    name: 'Search Bar',
    slug: 'search-bar',
    description: 'Animated search input with a spring-driven slide-in Cancel button, a suggestions dropdown, an inline loading spinner, and a clear button — modeled after iOS-style search UIs.',
    category: 'Forms',
    npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
    componentDeps: [],
    addCommand: 'npx native-mate add search-bar',
    accessibility: [
      { feature: 'Input role', detail: 'The TextInput sets accessibilityRole="search" with accessibilityLabel={placeholder}.' },
      { feature: 'Clear / Cancel', detail: 'The clear button sets accessibilityLabel="Clear search"; Cancel sets accessibilityLabel="Cancel search".' },
      { feature: 'Suggestions', detail: 'Each suggestion row is a button with accessibilityLabel set to the suggestion label.' },
    ],
    props: [
      { name: 'value', type: 'string', description: 'Current search text.' },
      { name: 'onChangeText', type: '(text: string) => void', description: 'Called when the text changes.' },
      { name: 'placeholder', type: 'string', default: '"Search..."', description: 'Placeholder text.' },
      { name: 'onFocus', type: '() => void', description: 'Called when the input gains focus.' },
      { name: 'onBlur', type: '() => void', description: 'Called when the input loses focus.' },
      { name: 'onCancel', type: '() => void', description: 'Called when the Cancel button is pressed (clears text and blurs).' },
      { name: 'showCancel', type: 'boolean', description: 'Forces the Cancel button visible/hidden. Defaults to showing on focus.' },
      { name: 'suggestions', type: 'SearchBarSuggestion[]', default: '[]', description: 'Suggestion items — { id, label, icon? } — shown in a dropdown while focused.' },
      { name: 'onSuggestionPress', type: '(suggestion: SearchBarSuggestion) => void', description: 'Called when a suggestion row is tapped.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Replaces the search icon with a spinner.' },
      { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Focuses the input automatically on mount.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input.' },
      { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"light"', description: 'Haptic feedback on clear, cancel, and suggestion tap.' },
    ],
    usageCode: `import { SearchBar } from '~/components/ui/search-bar'

const [text, setText] = useState('')

// Default
<SearchBar value={text} onChangeText={setText} placeholder="Search..." />

// With suggestions dropdown
<SearchBar
  value={text}
  onChangeText={setText}
  suggestions={[
    { id: '1', label: 'React Native', icon: 'logo-react' },
    { id: '2', label: 'Reanimated', icon: 'flash-outline' },
  ]}
  onSuggestionPress={(s) => setText(s.label)}
  showCancel
/>

// Loading state
<SearchBar value={text} onChangeText={setText} loading />

// Disabled
<SearchBar value="" onChangeText={() => {}} disabled />`,
    exampleCode: `import { useState } from 'react'
import { SearchBar } from '~/components/ui/search-bar'
import { View } from 'react-native'

const ALL_ITEMS = ['React Native', 'React Navigation', 'Reanimated', 'Redux Toolkit', 'React Query']

export function SearchScreen() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const suggestions = query
    ? ALL_ITEMS.filter(i => i.toLowerCase().includes(query.toLowerCase()))
        .map(label => ({ id: label, label, icon: 'search-outline' }))
    : []

  return (
    <View style={{ padding: 16 }}>
      <SearchBar
        value={query}
        onChangeText={(text) => {
          setQuery(text)
          setLoading(true)
          setTimeout(() => setLoading(false), 400)
        }}
        suggestions={suggestions}
        onSuggestionPress={(s) => setQuery(s.label)}
        loading={loading}
        placeholder="Search libraries..."
      />
    </View>
  )
}`,
  },

  'segmented-control': {
    name: 'Segmented Control',
    slug: 'segmented-control',
    description: 'iOS-style segmented toggle with a spring-animated sliding pill indicator that measures each segment via onLayout, supporting icons, three sizes, and custom colors.',
    category: 'Forms',
    npmDeps: ['react-native-reanimated'],
    componentDeps: [],
    addCommand: 'npx native-mate add segmented-control',
    accessibility: [
      { feature: 'Role', detail: 'The container sets accessibilityRole="tablist"; each segment sets accessibilityRole="tab".' },
      { feature: 'Selected / disabled state', detail: 'accessibilityState={{ selected, disabled }} is set on every segment, with accessibilityLabel set to the segment label.' },
    ],
    props: [
      { name: 'segments', type: 'Segment[]', description: 'Segments to render — { key, label, icon? }.' },
      { name: 'selectedKey', type: 'string', description: 'Key of the currently selected segment.' },
      { name: 'onChange', type: '(key: string) => void', description: 'Called when a segment is selected.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls height, padding, and font size.' },
      { name: 'fullWidth', type: 'boolean', default: 'true', description: 'Stretches the control to fill its container; when false, segments size to content.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all segments and dims the control.' },
      { name: 'haptic', type: 'boolean', default: 'true', description: 'Triggers a light haptic tap on selection.' },
      { name: 'backgroundColor', type: 'string', description: 'Background color of the outer track. Defaults to theme.colors.surface.' },
      { name: 'indicatorColor', type: 'string', description: 'Color of the sliding pill indicator. Defaults to theme.colors.surfaceRaised/background.' },
    ],
    usageCode: `import { SegmentedControl } from '~/components/ui/segmented-control'

const [period, setPeriod] = useState('week')

// Default
<SegmentedControl
  segments={[
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ]}
  selectedKey={period}
  onChange={setPeriod}
/>

// Sizes
<SegmentedControl segments={segments} selectedKey={period} onChange={setPeriod} size="sm" />
<SegmentedControl segments={segments} selectedKey={period} onChange={setPeriod} size="lg" />

// Content-sized, not full width
<SegmentedControl segments={viewSegments} selectedKey={view} onChange={setView} fullWidth={false} />

// Custom colors
<SegmentedControl
  segments={onOffSegments}
  selectedKey={state}
  onChange={setState}
  backgroundColor="#1e1b4b"
  indicatorColor="#6366f1"
/>

// Disabled
<SegmentedControl segments={segments} selectedKey="a" onChange={() => {}} disabled />`,
    exampleCode: `import { useState } from 'react'
import { SegmentedControl } from '~/components/ui/segmented-control'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function AnalyticsPeriodToggle() {
  const [period, setPeriod] = useState('week')

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text variant="label">Time range</Text>
      <SegmentedControl
        segments={[
          { key: 'day', label: 'Day' },
          { key: 'week', label: 'Week' },
          { key: 'month', label: 'Month' },
          { key: 'year', label: 'Year' },
        ]}
        selectedKey={period}
        onChange={setPeriod}
      />
    </View>
  )
}`,
  },

'social-login-button': {
  name: 'Social Login Button',
  slug: 'social-login-button',
  description: 'Branded authentication buttons for Google, Apple, GitHub, Facebook, Twitter/X, and Discord with filled/outlined variants, loading state, and spring press animation.',
  category: 'Forms',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add social-login-button',
  accessibility: [
    { feature: 'Role', detail: 'accessibilityRole="button" is set automatically.' },
    { feature: 'Label', detail: 'accessibilityLabel is auto-derived as "Continue with {Provider}", or overridden via the label prop.' },
    { feature: 'Busy / disabled state', detail: 'accessibilityState={{ disabled, busy: loading }} is set based on the disabled and loading props.' },
  ],
  props: [
    { name: 'provider', type: '"google" | "apple" | "github" | "facebook" | "twitter" | "discord"', description: 'Social provider — determines icon, brand color, and default label.' },
    { name: 'onPress', type: '() => void', description: 'Press handler.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows an ActivityIndicator in place of icon + label and disables press.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables press.' },
    { name: 'variant', type: '"filled" | "outlined"', default: '"filled"', description: 'Filled uses the brand color as background; outlined is transparent with a border.' },
    { name: 'size', type: '"md" | "lg"', default: '"md"', description: 'Controls height (48/56dp), font size, and icon size.' },
    { name: 'label', type: 'string', description: 'Custom label text. Defaults to "Continue with {Provider}".' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Triggers a light haptic impact on press (requires expo-haptics, optional).' },
  ],
  usageCode: `import { SocialLoginButton } from '~/components/ui/social-login-button'

// Providers
<SocialLoginButton provider="google" onPress={handleGoogleLogin} />
<SocialLoginButton provider="apple" onPress={handleAppleLogin} />
<SocialLoginButton provider="github" onPress={handleGithubLogin} />
<SocialLoginButton provider="facebook" onPress={handleFacebookLogin} />
<SocialLoginButton provider="twitter" onPress={handleTwitterLogin} />
<SocialLoginButton provider="discord" onPress={handleDiscordLogin} />

// Outlined variant
<SocialLoginButton provider="google" variant="outlined" onPress={handleGoogleLogin} />

// Sizes
<SocialLoginButton provider="apple" size="lg" onPress={handleAppleLogin} />

// Custom label
<SocialLoginButton provider="apple" label="Sign in with Apple ID" onPress={handleAppleLogin} />

// Loading & disabled
<SocialLoginButton provider="google" loading onPress={handleGoogleLogin} />
<SocialLoginButton provider="facebook" disabled onPress={handleFacebookLogin} />

// No haptic
<SocialLoginButton provider="discord" haptic={false} onPress={handleDiscordLogin} />`,
  exampleCode: `import { useState } from 'react'
import { SocialLoginButton } from '~/components/ui/social-login-button'
import { Separator } from '~/components/ui/separator'
import { View } from 'react-native'

export function LoginScreen() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleLogin = async (provider: string) => {
    setLoadingProvider(provider)
    await fakeSignIn(provider)
    setLoadingProvider(null)
  }

  return (
    <View style={{ gap: 12, padding: 24 }}>
      <SocialLoginButton
        provider="apple"
        loading={loadingProvider === 'apple'}
        onPress={() => handleLogin('apple')}
      />
      <SocialLoginButton
        provider="google"
        variant="outlined"
        loading={loadingProvider === 'google'}
        onPress={() => handleLogin('google')}
      />
      <SocialLoginButton
        provider="github"
        variant="outlined"
        loading={loadingProvider === 'github'}
        onPress={() => handleLogin('github')}
      />
      <Separator label="or" />
    </View>
  )
}`,
},

'toggle-group': {
  name: 'Toggle Group',
  slug: 'toggle-group',
  description: 'Segmented multi-option toggle with an animated sliding indicator for single selection, plus a checkbox-style highlight mode for multiple selection, with optional icons per item.',
  category: 'Forms',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add toggle-group',
  accessibility: [
    { feature: 'Role', detail: 'The container has accessibilityRole="radiogroup"; each item has accessibilityRole="radio".' },
    { feature: 'Checked state', detail: 'accessibilityState={{ checked, disabled }} reflects each item\'s selection and disabled state.' },
    { feature: 'Label', detail: 'accessibilityLabel is set to the item\'s label text.' },
  ],
  props: [
    { name: 'items', type: 'Array<{ key: string; label: string; icon?: string; disabled?: boolean }>', description: 'Options to render. icon is an Ionicons name.' },
    { name: 'type', type: '"single" | "multiple"', default: '"single"', description: 'Selection mode. Determines whether value/onChange or values/onChangeMultiple are used.' },
    { name: 'value', type: 'string', description: 'Selected key (type="single" only).' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the new selected key (type="single" only).' },
    { name: 'values', type: 'string[]', description: 'Selected keys (type="multiple" only).' },
    { name: 'onChangeMultiple', type: '(values: string[]) => void', description: 'Called with the new selected keys (type="multiple" only).' },
    { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls item height, padding, and font size.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the group to fill its container, with items sharing width equally.' },
    { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"light"', description: 'Haptic feedback intensity on item press.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire group.' },
  ],
  usageCode: `import { ToggleGroup } from '~/components/ui/toggle-group'

// Single selection (animated sliding indicator)
const [period, setPeriod] = useState('week')

<ToggleGroup
  items={[
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ]}
  type="single"
  value={period}
  onChange={setPeriod}
/>

// With icons
<ToggleGroup
  items={[
    { key: 'left', label: 'Left', icon: 'menu-outline' },
    { key: 'center', label: 'Center', icon: 'reorder-two-outline' },
  ]}
  type="single"
  value={align}
  onChange={setAlign}
/>

// Multiple selection
const [filters, setFilters] = useState(['new'])

<ToggleGroup
  items={[
    { key: 'new', label: 'New' },
    { key: 'sale', label: 'Sale' },
    { key: 'featured', label: 'Featured' },
  ]}
  type="multiple"
  values={filters}
  onChangeMultiple={setFilters}
/>

// Sizes
<ToggleGroup items={items} type="single" value={size} onChange={setSize} size="sm" />
<ToggleGroup items={items} type="single" value={size} onChange={setSize} size="lg" />

// Full width, disabled item
<ToggleGroup
  items={[
    { key: 'all', label: 'All' },
    { key: 'archived', label: 'Archived', disabled: true },
  ]}
  type="single"
  value="all"
  onChange={() => {}}
  fullWidth
/>`,
  exampleCode: `import { useState } from 'react'
import { ToggleGroup } from '~/components/ui/toggle-group'
import { Text } from '~/components/ui/text'
import { View } from 'react-native'

export function AnalyticsFilters() {
  const [range, setRange] = useState('week')
  const [metrics, setMetrics] = useState(['visitors'])

  return (
    <View style={{ gap: 16, padding: 16 }}>
      <Text variant="label" muted>Time range</Text>
      <ToggleGroup
        items={[
          { key: 'day', label: 'Day' },
          { key: 'week', label: 'Week' },
          { key: 'month', label: 'Month' },
          { key: 'year', label: 'Year' },
        ]}
        type="single"
        value={range}
        onChange={setRange}
        fullWidth
      />

      <Text variant="label" muted>Metrics</Text>
      <ToggleGroup
        items={[
          { key: 'visitors', label: 'Visitors', icon: 'people-outline' },
          { key: 'revenue', label: 'Revenue', icon: 'cash-outline' },
          { key: 'conversion', label: 'Conversion', icon: 'trending-up-outline' },
        ]}
        type="multiple"
        values={metrics}
        onChangeMultiple={setMetrics}
      />
    </View>
  )
}`,
},

'stepper': {
  name: 'Stepper',
  slug: 'stepper',
  description: 'Multi-step progress indicator with numbered, icon, or dot node variants, animated fill-in connecting lines, horizontal or vertical orientation, and a pulsing active step.',
  category: 'Forms',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add stepper',
  accessibility: [
    { feature: 'Role', detail: 'Each step node has accessibilityRole="button".' },
    { feature: 'Label', detail: 'accessibilityLabel reads "Step N: {label}, completed/current/upcoming".' },
    { feature: 'Disabled state', detail: 'accessibilityState={{ disabled }} is true unless the step is completed and onStepPress is provided.' },
  ],
  props: [
    { name: 'steps', type: 'Array<{ label: string; description?: string; icon?: React.ReactNode }>', description: 'Step definitions in order.' },
    { name: 'currentStep', type: 'number', description: 'Zero-based index of the active step.' },
    { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout direction.' },
    { name: 'variant', type: '"numbered" | "icon" | "dot"', default: '"numbered"', description: 'Node content style. "icon" uses each step\'s icon prop; completed steps always show a checkmark.' },
    { name: 'onStepPress', type: '(index: number) => void', description: 'Called when a completed step is pressed. Steps only become pressable when this is provided.' },
    { name: 'completedColor', type: 'string', description: 'Color for completed steps and filled connecting lines. Defaults to theme.colors.primary.' },
    { name: 'activeColor', type: 'string', description: 'Color for the active step. Defaults to theme.colors.primary.' },
    { name: 'upcomingColor', type: 'string', description: 'Color for upcoming steps and unfilled lines. Defaults to theme.colors.muted.' },
    { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls node diameter, font sizes, and line thickness.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Triggers a light haptic impact when a step is pressed.' },
  ],
  usageCode: `import { Stepper } from '~/components/ui/stepper'

// Numbered horizontal (default)
<Stepper
  steps={[
    { label: 'Cart' },
    { label: 'Shipping' },
    { label: 'Payment' },
    { label: 'Review' },
  ]}
  currentStep={1}
/>

// With descriptions
<Stepper
  steps={[
    { label: 'Account', description: 'Create your login' },
    { label: 'Profile', description: 'Add your details' },
    { label: 'Done', description: 'All set' },
  ]}
  currentStep={2}
/>

// Dot variant
<Stepper
  steps={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]}
  currentStep={1}
  variant="dot"
/>

// Vertical orientation (great for order tracking)
<Stepper
  steps={[
    { label: 'Order placed', description: 'Jul 8, 10:04 AM' },
    { label: 'Shipped', description: 'Jul 9, 9:00 AM' },
    { label: 'Delivered' },
  ]}
  currentStep={1}
  orientation="vertical"
/>

// Interactive — tap a completed step to go back
<Stepper steps={steps} currentStep={step} onStepPress={setStep} />

// Custom colors & size
<Stepper steps={steps} currentStep={1} size="sm" />
<Stepper steps={steps} currentStep={1} completedColor="#10b981" activeColor="#f59e0b" />`,
  exampleCode: `import { useState } from 'react'
import { Stepper } from '~/components/ui/stepper'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function CheckoutFlow() {
  const [step, setStep] = useState(0)
  const steps = [
    { label: 'Cart' },
    { label: 'Shipping' },
    { label: 'Payment' },
    { label: 'Review' },
  ]

  return (
    <View style={{ gap: 24, padding: 16 }}>
      <Stepper steps={steps} currentStep={step} onStepPress={setStep} />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button
          variant="outline"
          style={{ flex: 1 }}
          disabled={step === 0}
          onPress={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </Button>
        <Button
          style={{ flex: 1 }}
          disabled={step === steps.length - 1}
          onPress={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        >
          Continue
        </Button>
      </View>
    </View>
  )
}`,
},

'file-upload': {
  name: 'File Upload',
  slug: 'file-upload',
  description: 'File/image picker with dropzone, button, and compact trigger variants, plus a built-in file list with thumbnails, per-file progress bars, and error states.',
  category: 'Forms',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add file-upload',
  accessibility: [
    { feature: 'Role', detail: 'The trigger (dropzone/button/compact) has accessibilityRole="button".' },
    { feature: 'Label', detail: 'accessibilityLabel defaults to the placeholder text or "Upload files".' },
    { feature: 'Remove button', detail: 'Each file\'s remove control has accessibilityRole="button" and accessibilityLabel="Remove {file.name}".' },
  ],
  props: [
    { name: 'onFilesSelected', type: '(files: UploadFile[]) => void', description: 'Called after the picker resolves with the selected files.' },
    { name: 'maxFiles', type: 'number', description: 'Maximum number of files allowed. Shown in the dropzone helper text.' },
    { name: 'maxSize', type: 'number', description: 'Maximum file size in bytes. Shown in the dropzone helper text.' },
    { name: 'accept', type: 'string[]', description: 'Accepted MIME types, e.g. ["image/png", "image/jpeg"].' },
    { name: 'multiple', type: 'boolean', default: 'true', description: 'Allow selecting more than one file.' },
    { name: 'variant', type: '"dropzone" | "button" | "compact"', default: '"dropzone"', description: 'Visual style of the trigger.' },
    { name: 'showPreview', type: 'boolean', default: 'true', description: 'Renders the file list (thumbnails, name, size, progress, errors) below the trigger.' },
    { name: 'files', type: 'UploadFile[]', default: '[]', description: 'Controlled list of files to render in the preview list.' },
    { name: 'onRemoveFile', type: '(fileId: string) => void', description: 'Called when a file\'s remove button is pressed. Omit to hide the remove control.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger.' },
    { name: 'placeholder', type: 'string', description: 'Custom trigger text, e.g. "Upload document".' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Triggers a light haptic impact on press.' },
  ],
  usageCode: `import { FileUpload } from '~/components/ui/file-upload'
import type { UploadFile } from '~/components/ui/file-upload'

// Dropzone variant with constraints
<FileUpload
  variant="dropzone"
  accept={['image/png', 'image/jpeg']}
  maxSize={5 * 1024 * 1024}
  maxFiles={3}
  onFilesSelected={(files) => setFiles(files)}
/>

// Button variant
<FileUpload variant="button" placeholder="Upload document" onFilesSelected={setFiles} />

// Compact inline trigger
<FileUpload variant="compact" placeholder="Attach receipt" onFilesSelected={setFiles} />

// Controlled file list with previews & removal
const [files, setFiles] = useState<UploadFile[]>([])

<FileUpload
  variant="compact"
  files={files}
  onFilesSelected={(picked) => setFiles((prev) => [...prev, ...picked])}
  onRemoveFile={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
/>

// Disabled
<FileUpload variant="dropzone" disabled placeholder="Uploads paused" onFilesSelected={() => {}} />`,
  exampleCode: `import { useState } from 'react'
import { FileUpload } from '~/components/ui/file-upload'
import type { UploadFile } from '~/components/ui/file-upload'
import { View } from 'react-native'

export function DocumentUploadForm() {
  const [files, setFiles] = useState<UploadFile[]>([])

  return (
    <View style={{ gap: 12, padding: 16 }}>
      <FileUpload
        variant="dropzone"
        accept={['application/pdf', 'image/png', 'image/jpeg']}
        maxSize={10 * 1024 * 1024}
        maxFiles={5}
        files={files}
        placeholder="Drop supporting documents here"
        onFilesSelected={(picked) => setFiles((prev) => [...prev, ...picked])}
        onRemoveFile={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
      />
    </View>
  )
}`,
},

'draggable-list': {
  name: 'Draggable List',
  slug: 'draggable-list',
  description: 'Reorderable list built on PanResponder with a long-press drag handle, shadow lift while dragging, and spring-animated item repositioning at 60fps.',
  category: 'Interaction',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add draggable-list',
  accessibility: [
    { feature: 'Role', detail: 'The list container has accessibilityRole="list".' },
    { feature: 'Hint', detail: 'Each item has accessibilityHint="Long press and drag to reorder".' },
  ],
  props: [
    { name: 'data', type: 'T[]', description: 'Array of items to render, in order.' },
    { name: 'renderItem', type: '(info: { item: T; index: number; isDragging: boolean }) => React.ReactNode', description: 'Render function for each row. isDragging is true for the item currently being moved.' },
    { name: 'onReorder', type: '(data: T[]) => void', description: 'Called with the full reordered array once a drag gesture ends.' },
    { name: 'keyExtractor', type: '(item: T, index: number) => string', description: 'Returns a stable unique key per item.' },
    { name: 'dragHandlePosition', type: '"left" | "right"', default: '"right"', description: 'Side the drag handle icon renders on.' },
    { name: 'hapticOnDrag', type: 'boolean', default: 'true', description: 'Triggers haptic feedback on drag start and whenever the item crosses another row.' },
    { name: 'itemHeight', type: 'number', default: '60', description: 'Fixed row height in dp, used to calculate reorder thresholds during drag.' },
    { name: 'showSeparator', type: 'boolean', default: 'true', description: 'Renders a Separator between rows.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the list and disables dragging.' },
  ],
  usageCode: `import { DraggableList } from '~/components/ui/draggable-list'

const [tracks, setTracks] = useState(initialTracks)

// Basic reorderable list
<DraggableList
  data={tracks}
  keyExtractor={(item) => item.id}
  onReorder={setTracks}
  renderItem={({ item }) => (
    <View style={{ padding: 12 }}>
      <Text weight="semibold">{item.title}</Text>
      <Text variant="caption" muted>{item.artist}</Text>
    </View>
  )}
/>

// Drag handle on the left
<DraggableList
  data={tasks}
  keyExtractor={(item) => item}
  onReorder={setTasks}
  dragHandlePosition="left"
  renderItem={({ item }) => <Text>{item}</Text>}
/>

// Without separators, custom row height
<DraggableList
  data={tracks}
  keyExtractor={(item) => item.id}
  onReorder={setTracks}
  showSeparator={false}
  itemHeight={52}
  renderItem={({ item }) => <Text>{item.title}</Text>}
/>

// Disabled
<DraggableList data={tracks} keyExtractor={(item) => item.id} onReorder={setTracks} disabled renderItem={...} />`,
  exampleCode: `import { useState } from 'react'
import { DraggableList } from '~/components/ui/draggable-list'
import { Text } from '~/components/ui/text'
import { Icon } from '~/components/ui/icon'
import { View } from 'react-native'

interface Track {
  id: string
  title: string
  artist: string
}

export function PlaylistEditor() {
  const [tracks, setTracks] = useState<Track[]>([
    { id: '1', title: 'Midnight City', artist: 'M83' },
    { id: '2', title: 'Instant Crush', artist: 'Daft Punk' },
    { id: '3', title: 'Nightcall', artist: 'Kavinsky' },
  ])

  return (
    <View style={{ padding: 16 }}>
      <Text variant="h3" style={{ marginBottom: 12 }}>Your Playlist</Text>
      <DraggableList
        data={tracks}
        keyExtractor={(item) => item.id}
        onReorder={setTracks}
        renderItem={({ item, isDragging }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, opacity: isDragging ? 0.9 : 1 }}>
            <Icon name="musical-note" color="primary" />
            <View>
              <Text weight="semibold">{item.title}</Text>
              <Text variant="caption" muted>{item.artist}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}`,
},

'swipeable-row': {
  name: 'Swipeable Row',
  slug: 'swipeable-row',
  description: 'Swipe-to-reveal actions row built on PanResponder with spring physics, rubber-banding past the action area, and an optional destructive full-swipe gesture.',
  category: 'Interaction',
  npmDeps: ['react-native-reanimated'],
  componentDeps: [],
  addCommand: 'npx native-mate add swipeable-row',
  accessibility: [
    { feature: 'Role', detail: 'The row container has accessibilityRole="none"; each action button has accessibilityRole="button".' },
    { feature: 'Label', detail: 'Each action\'s accessibilityLabel is set to its label text.' },
  ],
  props: [
    { name: 'children', type: 'React.ReactNode', description: 'The row content that sits above the revealed actions.' },
    { name: 'leftActions', type: 'SwipeAction[]', description: 'Actions revealed when swiping right (appear on the left side). SwipeAction: { label, icon?, color, onPress, textColor? }.' },
    { name: 'rightActions', type: 'SwipeAction[]', description: 'Actions revealed when swiping left (appear on the right side).' },
    { name: 'swipeThreshold', type: 'number', default: '80', description: 'Distance in px before the row snaps open instead of springing back.' },
    { name: 'onSwipeLeft', type: '() => void', description: 'Called after a full swipe to the left completes.' },
    { name: 'onSwipeRight', type: '() => void', description: 'Called after a full swipe to the right completes.' },
    { name: 'friction', type: 'number', default: '0.8', description: 'Multiplier applied to raw gesture delta — lower values feel heavier.' },
    { name: 'actionWidth', type: 'number', default: '80', description: 'Width in px of each action button.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Triggers a medium haptic impact once the swipe passes the threshold.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the row and disables the swipe gesture.' },
    { name: 'fullSwipeEnabled', type: 'boolean', default: 'true', description: 'When true, swiping past 60% of the row width auto-triggers the last action on that side.' },
  ],
  usageCode: `import { SwipeableRow } from '~/components/ui/swipeable-row'

// Right swipe reveals a delete action
<SwipeableRow
  rightActions={[
    { label: 'Delete', color: '#ef4444', onPress: () => remove(id) },
  ]}
>
  <View style={{ padding: 16 }}>
    <Text weight="semibold">Priya Sharma</Text>
    <Text muted>Q3 roadmap review</Text>
  </View>
</SwipeableRow>

// Actions on both sides
<SwipeableRow
  leftActions={[{ label: 'Read', color: '#3b82f6', onPress: markRead }]}
  rightActions={[
    { label: 'Archive', color: '#f59e0b', onPress: archive },
    { label: 'Delete', color: '#ef4444', onPress: remove },
  ]}
>
  <EmailRow email={email} />
</SwipeableRow>

// Full swipe auto-completes the destructive action
<SwipeableRow
  rightActions={[{ label: 'Delete', color: '#ef4444', onPress: () => remove(email.id) }]}
  onSwipeLeft={() => remove(email.id)}
>
  <EmailRow email={email} />
</SwipeableRow>

// Disabled row
<SwipeableRow disabled rightActions={[{ label: 'Delete', color: '#ef4444', onPress: remove }]}>
  <EmailRow email={email} />
</SwipeableRow>`,
  exampleCode: `import { useState } from 'react'
import { SwipeableRow } from '~/components/ui/swipeable-row'
import { Text } from '~/components/ui/text'
import { Separator } from '~/components/ui/separator'
import { View } from 'react-native'

interface Email {
  id: string
  from: string
  subject: string
}

export function Inbox() {
  const [emails, setEmails] = useState<Email[]>([
    { id: '1', from: 'Priya Sharma', subject: 'Q3 roadmap review' },
    { id: '2', from: 'Design Team', subject: 'New component specs ready' },
    { id: '3', from: 'GitHub', subject: 'Your PR was merged' },
  ])

  const remove = (id: string) => setEmails((prev) => prev.filter((e) => e.id !== id))

  return (
    <View>
      {emails.map((email, i) => (
        <React.Fragment key={email.id}>
          <SwipeableRow
            rightActions={[{ label: 'Delete', color: '#ef4444', onPress: () => remove(email.id) }]}
            onSwipeLeft={() => remove(email.id)}
          >
            <View style={{ padding: 16 }}>
              <Text weight="semibold">{email.from}</Text>
              <Text muted numberOfLines={1}>{email.subject}</Text>
            </View>
          </SwipeableRow>
          {i < emails.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </View>
  )
}`,
},

'fab': {
  name: 'FAB',
  slug: 'fab',
  description: 'Floating action button with default/secondary/destructive variants, an extended label mode, built-in speed-dial fan-out actions, spring press animation, and haptic feedback.',
  category: 'Navigation',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add fab',
  accessibility: [
    { feature: 'Role', detail: 'accessibilityRole="button" is set automatically.' },
    { feature: 'Label', detail: 'accessibilityLabel defaults to the label prop, or "Floating action button".' },
    { feature: 'Expanded / disabled state', detail: 'accessibilityState={{ disabled, expanded }} is set — expanded reflects whether speed-dial actions are showing.' },
  ],
  props: [
    { name: 'icon', type: 'string', description: 'Ionicons icon name shown on the main button.' },
    { name: 'onPress', type: '() => void', description: 'Press handler. Ignored when actions is set — press instead toggles the speed dial.' },
    { name: 'position', type: '"bottom-right" | "bottom-left" | "bottom-center"', default: '"bottom-right"', description: 'Absolute position on screen.' },
    { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Button diameter (40/56/68dp) and icon size.' },
    { name: 'variant', type: '"default" | "secondary" | "destructive"', default: '"default"', description: 'Background color preset.' },
    { name: 'label', type: 'string', description: 'Renders an extended FAB with this text next to the icon.' },
    { name: 'actions', type: 'FabAction[]', description: 'When set, pressing the FAB fans out these mini actions instead of firing onPress. FabAction: { icon, label?, onPress, color? }.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables press.' },
    { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"medium"', description: 'Haptic feedback intensity on press.' },
    { name: 'color', type: 'string', description: 'Custom background color override.' },
    { name: 'bottomOffset', type: 'number', default: '24', description: 'Distance from the bottom edge in dp.' },
    { name: 'sideOffset', type: 'number', default: '16', description: 'Distance from the side edge in dp.' },
  ],
  usageCode: `import { Fab } from '~/components/ui/fab'

// Variants
<Fab icon="add" variant="default" onPress={handleCreate} />
<Fab icon="pencil" variant="secondary" onPress={handleEdit} />
<Fab icon="trash" variant="destructive" onPress={handleDelete} />

// Sizes
<Fab icon="add" size="sm" onPress={handleCreate} />
<Fab icon="add" size="lg" onPress={handleCreate} />

// Extended with a label
<Fab icon="create-outline" label="Compose" onPress={handleCompose} />

// Speed dial — fans out mini actions on press
<Fab
  icon="add"
  actions={[
    { icon: 'image-outline', label: 'Photo', onPress: pickPhoto },
    { icon: 'document-text-outline', label: 'Document', onPress: pickDocument },
    { icon: 'location-outline', label: 'Location', onPress: shareLocation },
  ]}
/>

// Custom color & positions
<Fab icon="heart" color="#ec4899" position="bottom-left" onPress={handleLike} />
<Fab icon="chatbubble" position="bottom-center" onPress={openChat} />

// Disabled
<Fab icon="add" disabled onPress={handleCreate} />`,
  exampleCode: `import { Fab } from '~/components/ui/fab'
import { View } from 'react-native'

export function InboxScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* ...list content... */}

      <Fab
        icon="add"
        actions={[
          { icon: 'create-outline', label: 'New message', onPress: () => {} },
          { icon: 'people-outline', label: 'New group', onPress: () => {} },
        ]}
      />
    </View>
  )
}`,
},

'speed-dial': {
  name: 'Speed Dial',
  slug: 'speed-dial',
  description: 'Standalone FAB speed dial with a rotating trigger icon, staggered spring-animated action items with labels, a dismiss backdrop, and up/left expansion directions.',
  category: 'Navigation',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add speed-dial',
  accessibility: [
    { feature: 'Role', detail: 'The main trigger and each action, plus the backdrop dismiss area, all have accessibilityRole="button".' },
    { feature: 'Label', detail: 'The trigger\'s accessibilityLabel toggles between "Open menu" and "Close menu"; each action\'s label is its accessibilityLabel; the backdrop is labeled "Close speed dial".' },
    { feature: 'Expanded state', detail: 'accessibilityState={{ expanded: isOpen }} is set on the main trigger.' },
  ],
  props: [
    { name: 'icon', type: 'string', default: '"add"', description: 'Ionicons name for the main trigger button.' },
    { name: 'actions', type: 'SpeedDialAction[]', description: 'Action items to fan out. SpeedDialAction: { icon, label, onPress, color?, iconColor? }.' },
    { name: 'open', type: 'boolean', description: 'Controlled open state. Omit to let the component manage its own state.' },
    { name: 'onToggle', type: '(open: boolean) => void', description: 'Called whenever the open state changes (trigger press, action press, or backdrop dismiss).' },
    { name: 'position', type: '"bottom-right" | "bottom-left" | "bottom-center"', default: '"bottom-right"', description: 'Absolute position on screen.' },
    { name: 'direction', type: '"up" | "left"', default: '"up"', description: 'Direction the action items expand in.' },
    { name: 'color', type: 'string', description: 'Main FAB background color. Defaults to theme.colors.primary.' },
    { name: 'iconColor', type: 'string', description: 'Main FAB icon color. Defaults to theme.colors.onPrimary.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Triggers haptic feedback on toggle (medium) and per-action press (light).' },
  ],
  usageCode: `import { SpeedDial } from '~/components/ui/speed-dial'

// Default — expands upward
<SpeedDial
  actions={[
    { icon: 'image-outline', label: 'Upload photo', onPress: pickPhoto },
    { icon: 'camera-outline', label: 'Take photo', onPress: takePhoto },
    { icon: 'document-outline', label: 'Upload file', onPress: pickFile },
  ]}
/>

// Expands to the left
<SpeedDial
  direction="left"
  actions={[
    { icon: 'share-outline', label: 'Share', onPress: share },
    { icon: 'star-outline', label: 'Favorite', onPress: favorite },
  ]}
/>

// Bottom-left position
<SpeedDial
  position="bottom-left"
  actions={[
    { icon: 'add-circle-outline', label: 'New task', onPress: createTask },
    { icon: 'folder-outline', label: 'New folder', onPress: createFolder },
  ]}
/>

// Custom icon & per-action colors
<SpeedDial
  icon="ellipsis-horizontal"
  color="#8b5cf6"
  actions={[
    { icon: 'checkmark-circle-outline', label: 'Mark done', color: '#10b981', onPress: markDone },
    { icon: 'trash-outline', label: 'Delete', color: '#ef4444', onPress: deleteItem },
  ]}
/>

// Controlled open state
const [open, setOpen] = useState(false)

<SpeedDial
  open={open}
  onToggle={setOpen}
  actions={[
    { icon: 'mail-outline', label: 'Message', onPress: openMessage },
    { icon: 'call-outline', label: 'Call', onPress: startCall },
  ]}
/>`,
  exampleCode: `import { SpeedDial } from '~/components/ui/speed-dial'
import { View } from 'react-native'

export function ContactProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* ...profile content... */}

      <SpeedDial
        icon="ellipsis-horizontal"
        direction="left"
        actions={[
          { icon: 'call-outline', label: 'Call', onPress: () => {} },
          { icon: 'mail-outline', label: 'Message', onPress: () => {} },
          { icon: 'videocam-outline', label: 'Video', color: '#10b981', onPress: () => {} },
        ]}
      />
    </View>
  )
}`,
},

'audio-player': {
  name: 'Audio Player',
  slug: 'audio-player',
  description: 'Audio player with play/pause, animated progress bar, track info, artwork, previous/next controls, and a compact single-row mode.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add audio-player',
  accessibility: [
    { feature: 'Summary role', detail: 'The player container sets accessibilityRole="summary" with an accessibilityLabel announcing the current track and artist.' },
    { feature: 'Control labels', detail: 'Play/pause, previous, and next buttons each set accessibilityRole="button" with a descriptive accessibilityLabel ("Play", "Pause", "Previous track", "Next track").' },
  ],
  props: [
    { name: 'title', type: 'string', description: 'Track title. Required.' },
    { name: 'artist', type: 'string', description: 'Artist name shown below the title.' },
    { name: 'artwork', type: 'ImageSourcePropType', description: 'Album artwork image source. Falls back to a music-note placeholder icon.' },
    { name: 'source', type: '{ uri: string }', description: 'Audio source URI (playback wiring is left to the consumer).' },
    { name: 'isPlaying', type: 'boolean', default: 'false', description: 'Controlled playback state.' },
    { name: 'currentTime', type: 'number', default: '0', description: 'Current playback position in seconds.' },
    { name: 'duration', type: 'number', default: '0', description: 'Total track duration in seconds.' },
    { name: 'showProgress', type: 'boolean', default: 'true', description: 'Show the progress bar and elapsed/total time labels.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Show previous/play-pause/next controls.' },
    { name: 'compact', type: 'boolean', default: 'false', description: 'Renders a single-row layout with a small artwork thumbnail and thin bottom progress bar.' },
    { name: 'onPlay', type: '() => void', description: 'Called when the play button is pressed.' },
    { name: 'onPause', type: '() => void', description: 'Called when the pause button is pressed.' },
    { name: 'onNext', type: '() => void', description: 'Called when next is pressed. Button is hidden if omitted.' },
    { name: 'onPrevious', type: '() => void', description: 'Called when previous is pressed. Button is hidden if omitted.' },
    { name: 'onSeek', type: '(position: number) => void', description: 'Called when the user seeks to a new position.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enables light haptic feedback on control presses (requires optional expo-haptics).' },
  ],
  usageCode: `import { AudioPlayer } from '~/components/ui/audio-player'
import { useState } from 'react'

// Full layout
const [isPlaying, setIsPlaying] = useState(false)

<AudioPlayer
  title="Weightless"
  artist="Marconi Union"
  artwork={{ uri: 'https://...' }}
  isPlaying={isPlaying}
  currentTime={68}
  duration={300}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
  onNext={() => {}}
  onPrevious={() => {}}
/>

// Compact single-row mode
<AudioPlayer
  title="Clair de Lune"
  artist="Debussy"
  compact
  isPlaying={isPlaying}
  currentTime={45}
  duration={280}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
/>

// Minimal — no progress or controls
<AudioPlayer title="Ambient Loop" artist="Field Recording" showProgress={false} showControls={false} />`,
  exampleCode: `import { useState } from 'react'
import { AudioPlayer } from '~/components/ui/audio-player'
import { View } from 'react-native'

export function NowPlayingScreen() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(68)

  return (
    <View style={{ padding: 16, alignItems: 'center' }}>
      <AudioPlayer
        title="Weightless"
        artist="Marconi Union"
        artwork={{ uri: 'https://picsum.photos/seed/album/400' }}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={300}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onNext={() => setCurrentTime(0)}
        onPrevious={() => setCurrentTime(0)}
      />
    </View>
  )
}`,
},

banner: {
  name: 'Banner',
  slug: 'banner',
  description: 'Slide-in/out app banner with four semantic variants (info, warning, success, error), optional action button, dismiss control, and auto-dismiss timer.',
  category: 'Feedback',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add banner',
  accessibility: [
    { feature: 'Alert role', detail: 'accessibilityRole="alert" and accessibilityLiveRegion="polite" are set automatically so screen readers announce the banner as it appears.' },
    { feature: 'Action & dismiss labels', detail: 'The action button uses the action.label as its accessibilityLabel; the dismiss button sets accessibilityLabel="Dismiss".' },
  ],
  props: [
    { name: 'message', type: 'string', description: 'Primary banner message. Required.' },
    { name: 'description', type: 'string', description: 'Secondary supporting text shown below the message.' },
    { name: 'variant', type: '"info"|"warning"|"success"|"error"', default: '"info"', description: 'Semantic color and default icon.' },
    { name: 'position', type: '"top"|"bottom"', default: '"top"', description: 'Controls slide-in direction and which border edge is drawn.' },
    { name: 'icon', type: 'string', description: 'Custom Ionicons name; overrides the variant\'s default icon.' },
    { name: 'action', type: '{ label: string; onPress: () => void }', description: 'Optional action button rendered below the message.' },
    { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a close button.' },
    { name: 'onDismiss', type: '() => void', description: 'Called when the close button is pressed or autoDismiss elapses.' },
    { name: 'visible', type: 'boolean', default: 'true', description: 'Controlled visibility — animates in/out on change.' },
    { name: 'autoDismiss', type: 'number', default: '0', description: 'Milliseconds before onDismiss is auto-invoked. 0 disables auto-dismiss.' },
    { name: 'haptic', type: '"light"|"medium"|"heavy"|"none"', default: '"light"', description: 'Haptic feedback intensity on dismiss/action press.' },
  ],
  usageCode: `import { Banner } from '~/components/ui/banner'

// Variants
<Banner variant="info" message="A new version is available." />
<Banner variant="success" message="Payment received successfully." />
<Banner variant="warning" message="Your trial ends in 3 days." />
<Banner variant="error" message="Failed to sync your changes." />

// With description and action
<Banner
  variant="warning"
  message="Storage almost full"
  description="You've used 92% of your available storage."
  action={{ label: 'Upgrade', onPress: () => {} }}
/>

// Dismissible, controlled
const [visible, setVisible] = useState(true)

<Banner
  variant="info"
  message="We use cookies to improve your experience."
  dismissible
  visible={visible}
  onDismiss={() => setVisible(false)}
/>

// Auto-dismiss after 4s
<Banner variant="success" message="Changes saved." autoDismiss={4000} onDismiss={() => setVisible(false)} />

// Custom icon
<Banner variant="info" icon="rocket-outline" message="Your app was deployed successfully." />`,
  exampleCode: `import { useState } from 'react'
import { Banner } from '~/components/ui/banner'
import { View } from 'react-native'

export function DeployStatusScreen() {
  const [visible, setVisible] = useState(true)

  return (
    <View style={{ flex: 1 }}>
      <Banner
        variant="success"
        message="Deployment complete"
        description="Your app was pushed to production 2 minutes ago."
        dismissible
        visible={visible}
        onDismiss={() => setVisible(false)}
        autoDismiss={5000}
        action={{ label: 'View logs', onPress: () => {} }}
      />
    </View>
  )
}`,
},

carousel: {
  name: 'Carousel',
  slug: 'carousel',
  description: 'Horizontal snap carousel with animated expanding pagination dots, auto-play with pause-on-drag, loop mode, and configurable item width and gap.',
  category: 'Display',
  npmDeps: ['react-native-reanimated'],
  componentDeps: [],
  addCommand: 'npx native-mate add carousel',
  accessibility: [
    { feature: 'Adjustable role', detail: 'The scroll container sets accessibilityRole="adjustable" with an accessibilityLabel like "Carousel, item 2 of 5" that updates as the user scrolls.' },
  ],
  props: [
    { name: 'data', type: 'T[]', description: 'Array of items to render. Required.' },
    { name: 'renderItem', type: '(item: T, index: number) => React.ReactNode', description: 'Renders each slide. Required.' },
    { name: 'itemWidth', type: 'number', description: 'Width of each item. Defaults to screen width minus 2× contentInset.' },
    { name: 'gap', type: 'number', default: '12', description: 'Gap between items.' },
    { name: 'showPagination', type: 'boolean', default: 'true', description: 'Shows animated pagination dots (hidden when data has 1 item).' },
    { name: 'paginationPosition', type: '"bottom"|"top"', default: '"bottom"', description: 'Where the pagination dots are rendered relative to the scroll view.' },
    { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Automatically advances slides on an interval; pauses when the user starts dragging.' },
    { name: 'autoPlayInterval', type: 'number', default: '3000', description: 'Milliseconds between auto-play advances.' },
    { name: 'loop', type: 'boolean', default: 'false', description: 'Whether auto-play wraps back to the first slide (both loop and non-loop currently reset to index 0 at the end).' },
    { name: 'onIndexChange', type: '(index: number) => void', description: 'Called when the active/snapped index changes.' },
    { name: 'initialIndex', type: 'number', default: '0', description: 'Initial active index.' },
    { name: 'contentInset', type: 'number', default: '24', description: 'Horizontal padding applied to both edges of the scroll content.' },
  ],
  usageCode: `import { Carousel } from '~/components/ui/carousel'
import { View } from 'react-native'

const slides = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

// Basic
<Carousel
  data={slides}
  itemWidth={240}
  renderItem={(color) => <View style={{ height: 140, borderRadius: 12, backgroundColor: color }} />}
/>

// Pagination on top
<Carousel data={slides} itemWidth={240} paginationPosition="top" renderItem={(c) => <Slide color={c} />} />

// Auto-play with loop
<Carousel data={slides} itemWidth={240} autoPlay autoPlayInterval={2500} loop renderItem={(c) => <Slide color={c} />} />

// Track the active index
const [activeIndex, setActiveIndex] = useState(0)
<Carousel data={slides} itemWidth={240} onIndexChange={setActiveIndex} renderItem={(c) => <Slide color={c} />} />`,
  exampleCode: `import { useState } from 'react'
import { Carousel } from '~/components/ui/carousel'
import { Text } from '@native-mate/core'
import { View, Image } from 'react-native'

const banners = [
  { id: '1', image: 'https://picsum.photos/seed/1/800/400', title: 'Summer Sale' },
  { id: '2', image: 'https://picsum.photos/seed/2/800/400', title: 'New Arrivals' },
  { id: '3', image: 'https://picsum.photos/seed/3/800/400', title: 'Free Shipping' },
]

export function PromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <View style={{ padding: 16 }}>
      <Carousel
        data={banners}
        itemWidth={280}
        autoPlay
        autoPlayInterval={4000}
        loop
        onIndexChange={setActiveIndex}
        renderItem={(banner) => (
          <View style={{ borderRadius: 16, overflow: 'hidden', height: 140 }}>
            <Image source={{ uri: banner.image }} style={{ width: '100%', height: '100%' }} />
            <Text style={{ position: 'absolute', bottom: 12, left: 12, color: '#fff', fontWeight: '700' }}>
              {banner.title}
            </Text>
          </View>
        )}
      />
    </View>
  )
}`,
},

'chat-bubble': {
  name: 'Chat Bubble',
  slug: 'chat-bubble',
  description: 'Chat message bubble with self/other alignment, delivery status ticks, avatar, sender name, image messages, and system message style.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add chat-bubble',
  accessibility: [
    { feature: 'Text role', detail: 'Bubbles set accessibilityRole="text" with an accessibilityLabel combining the sender, message, and timestamp (e.g. "You: Yep, 10am works for me. 9:41 AM").' },
  ],
  props: [
    { name: 'message', type: 'string', description: 'Message text content. Required.' },
    { name: 'timestamp', type: 'Date | string', description: 'Message timestamp. Required.' },
    { name: 'sender', type: '"self"|"other"', default: '"other"', description: 'Determines bubble alignment, color, and tail rounding.' },
    { name: 'status', type: '"sending"|"sent"|"delivered"|"read"', default: '"sent"', description: 'Delivery status icon shown for self messages only.' },
    { name: 'avatar', type: '{ uri: string } | number', description: 'Avatar image source, shown for other\'s messages by default.' },
    { name: 'showAvatar', type: 'boolean', description: 'Overrides the default (true for "other", false for "self").' },
    { name: 'showTimestamp', type: 'boolean', default: 'false', description: 'Shows a formatted time below the bubble.' },
    { name: 'type', type: '"text"|"image"|"system"', default: '"text"', description: '"system" renders a centered pill message; "image" renders an image with optional caption.' },
    { name: 'imageSource', type: '{ uri: string } | number', description: 'Image source when type is "image".' },
    { name: 'imageWidth', type: 'number', default: '220', description: 'Image width in dp.' },
    { name: 'imageHeight', type: 'number', default: '160', description: 'Image height in dp.' },
    { name: 'senderName', type: 'string', description: 'Shown above other\'s messages (not shown for self).' },
    { name: 'selfColor', type: 'string', description: 'Custom bubble background for self messages.' },
    { name: 'otherColor', type: 'string', description: 'Custom bubble background for other\'s messages.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enables haptic feedback on long-press (requires optional expo-haptics).' },
    { name: 'onLongPress', type: '() => void', description: 'Called on bubble long-press, e.g. to show a reaction/context menu.' },
  ],
  usageCode: `import { ChatBubble } from '~/components/ui/chat-bubble'

// Conversation
<ChatBubble sender="other" message="Hey! Are we still on for tomorrow?" timestamp={new Date()} />
<ChatBubble sender="self" message="Yep, 10am works for me." timestamp={new Date()} status="read" />

// Delivery statuses
<ChatBubble sender="self" message="Sending…" timestamp={new Date()} status="sending" />
<ChatBubble sender="self" message="Delivered" timestamp={new Date()} status="delivered" />

// With avatar + sender name
<ChatBubble
  sender="other"
  senderName="Priya Shah"
  message="Sounds good, I'll send the files over."
  timestamp={new Date()}
  showTimestamp
  avatar={{ uri: 'https://...' }}
/>

// System message
<ChatBubble type="system" message="Priya joined the chat" timestamp={new Date()} sender="other" />

// Image message
<ChatBubble
  sender="self"
  type="image"
  imageSource={{ uri: 'https://...' }}
  message="Check this out"
  timestamp={new Date()}
/>`,
  exampleCode: `import { ChatBubble } from '~/components/ui/chat-bubble'
import { ScrollView } from 'react-native'

const messages = [
  { id: '1', sender: 'other' as const, message: 'Hey! Are we still on for tomorrow?', timestamp: new Date() },
  { id: '2', sender: 'self' as const, message: 'Yep, 10am works for me.', timestamp: new Date(), status: 'read' as const },
  { id: '3', sender: 'other' as const, message: "Perfect, see you then.", timestamp: new Date() },
]

export function ChatScreen() {
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
      {messages.map((m) => (
        <ChatBubble key={m.id} {...m} />
      ))}
    </ScrollView>
  )
}`,
},

comment: {
  name: 'Comment',
  slug: 'comment',
  description: 'Threaded comment with nested replies and a connecting thread line, like/reply actions with a spring-animated heart, relative timestamps, and author interaction.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add comment',
  accessibility: [
    { feature: 'Summary role', detail: 'The outer container sets accessibilityRole="summary" with accessibilityLabel="Comment by {author}".' },
    { feature: 'Like state', detail: 'The like button sets accessibilityState={{ selected: liked }} and an accessibilityLabel like "Like, 12 likes".' },
    { feature: 'Reply / show-replies labels', detail: 'Reply and "show replies" buttons set accessibilityRole="button" with descriptive labels (e.g. "Show 3 replies").' },
  ],
  props: [
    { name: 'author', type: 'string', description: 'Comment author name. Required.' },
    { name: 'avatar', type: 'ImageSourcePropType', description: 'Author avatar. Falls back to a colored initial badge.' },
    { name: 'content', type: 'string', description: 'Comment text content. Required.' },
    { name: 'timestamp', type: 'string | Date', description: 'Comment timestamp, rendered as a relative time ("now", "5m", "2h", "3d"). Required.' },
    { name: 'likes', type: 'number', default: '0', description: 'Like count shown next to the heart icon.' },
    { name: 'liked', type: 'boolean', default: 'false', description: 'Whether the current user has liked this comment.' },
    { name: 'onLike', type: '() => void', description: 'Called when the like button is pressed. Omitting it hides the like action.' },
    { name: 'onReply', type: '() => void', description: 'Called when reply is pressed. Hidden past maxDepth.' },
    { name: 'replies', type: 'CommentData[]', description: 'Nested reply comments, recursively rendered with a connecting thread line.' },
    { name: 'depth', type: 'number', default: '0', description: 'Current nesting depth (used internally for recursion).' },
    { name: 'maxDepth', type: 'number', default: '3', description: 'Maximum nesting depth before reply is hidden and further nesting stops.' },
    { name: 'onAuthorPress', type: '(author: string) => void', description: 'Called when the author name or avatar is pressed.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enables haptic feedback on like/reply presses (requires optional expo-haptics).' },
  ],
  usageCode: `import { Comment } from '~/components/ui/comment'

// Basic comment
<Comment
  author="Jordan Lee"
  content="This is exactly the pattern I was looking for, thanks!"
  timestamp={new Date(Date.now() - 1000 * 60 * 12)}
  likes={12}
  onLike={() => {}}
  onReply={() => {}}
/>

// With nested replies
<Comment
  author="Alex Rivera"
  content="Does this support pagination for large threads?"
  timestamp={new Date(Date.now() - 1000 * 60 * 60 * 2)}
  likes={4}
  onLike={() => {}}
  onReply={() => {}}
  replies={[
    {
      id: '1',
      author: 'Sam Okafor',
      content: 'Not yet, but it handles a few hundred comments fine.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 2,
    },
  ]}
/>

// With avatar
<Comment
  author="Maya Chen"
  avatar={{ uri: 'https://...' }}
  content="Great write-up on the animation timing."
  timestamp={new Date()}
  onAuthorPress={(author) => console.log(author)}
/>`,
  exampleCode: `import { useState } from 'react'
import { Comment } from '~/components/ui/comment'
import { ScrollView } from 'react-native'

export function CommentThread() {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(12)

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Comment
        author="Jordan Lee"
        content="This is exactly the pattern I was looking for, thanks!"
        timestamp={new Date(Date.now() - 1000 * 60 * 12)}
        likes={likes}
        liked={liked}
        onLike={() => { setLiked((l) => !l); setLikes((n) => (liked ? n - 1 : n + 1)) }}
        onReply={() => {}}
        replies={[
          {
            id: '1',
            author: 'Sam Okafor',
            content: 'Agreed, saved me a lot of time.',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            likes: 2,
          },
        ]}
      />
    </ScrollView>
  )
}`,
},

'data-table': {
  name: 'Data Table',
  slug: 'data-table',
  description: 'Data table with sortable columns, independent horizontal/vertical scrolling, sticky header, striped and bordered styles, row press, and animated loading skeleton rows.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add data-table',
  accessibility: [
    { feature: 'Grid role', detail: 'The table container sets accessibilityRole="grid" with accessibilityLabel="Data table".' },
    { feature: 'Sort & row labels', detail: 'Sortable header cells set accessibilityLabel="Sort by {title}"; pressable rows set accessibilityLabel="Row {n}".' },
  ],
  props: [
    { name: 'columns', type: 'DataTableColumn<T>[]', description: 'Column definitions: key, title, width/flex, sortable, align, render. Required.' },
    { name: 'data', type: 'T[]', description: 'Row data array. Required.' },
    { name: 'sortBy', type: 'string', description: 'Currently sorted column key (controlled).' },
    { name: 'sortDirection', type: '"asc"|"desc"', description: 'Current sort direction (controlled).' },
    { name: 'onSort', type: '(key: string, direction: "asc"|"desc") => void', description: 'Called when a sortable header is pressed. Toggles asc/desc when the same column is pressed again.' },
    { name: 'onRowPress', type: '(row: T, index: number) => void', description: 'Makes rows pressable with a highlight style.' },
    { name: 'stickyHeader', type: 'boolean', default: 'true', description: 'Keeps the header fixed above the vertically-scrolling body.' },
    { name: 'striped', type: 'boolean', default: 'false', description: 'Alternates row background colors.' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'Adds vertical borders between cells.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Renders animated skeleton rows instead of data.' },
    { name: 'loadingRows', type: 'number', default: '5', description: 'Number of skeleton rows to render while loading.' },
    { name: 'emptyMessage', type: 'string', default: '"No data available"', description: 'Message shown when data is empty and not loading.' },
    { name: 'keyExtractor', type: '(row: T, index: number) => string', description: 'Produces a unique key per row; defaults to the row index.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enables haptic feedback on sort/row press (requires optional expo-haptics).' },
  ],
  usageCode: `import { DataTable } from '~/components/ui/data-table'

const columns = [
  { key: 'name', title: 'Name', flex: 2, sortable: true },
  { key: 'role', title: 'Role', flex: 1, sortable: true },
  { key: 'status', title: 'Status', flex: 1 },
]

const data = [
  { id: '1', name: 'Ava Thompson', role: 'Designer', status: 'Active' },
  { id: '2', name: 'Liam Chen', role: 'Engineer', status: 'Active' },
]

// Basic
<DataTable columns={columns} data={data} keyExtractor={(row) => row.id} />

// Sortable, controlled
const [sortBy, setSortBy] = useState()
const [sortDirection, setSortDirection] = useState('asc')

<DataTable
  columns={columns}
  data={data}
  sortBy={sortBy}
  sortDirection={sortDirection}
  onSort={(key, direction) => { setSortBy(key); setSortDirection(direction) }}
/>

// Styling
<DataTable columns={columns} data={data} striped bordered />

// Row press
<DataTable columns={columns} data={data} onRowPress={(row) => console.log(row.name)} />

// Loading & empty states
<DataTable columns={columns} data={[]} loading loadingRows={4} />
<DataTable columns={columns} data={[]} emptyMessage="No team members yet" />`,
  exampleCode: `import { useState } from 'react'
import { DataTable } from '~/components/ui/data-table'
import { View } from 'react-native'

const columns = [
  { key: 'name', title: 'Name', flex: 2, sortable: true },
  { key: 'role', title: 'Role', flex: 1, sortable: true },
  { key: 'status', title: 'Status', flex: 1 },
]

export function TeamTable({ members }) {
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const sorted = [...members].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1
    return String(a[sortBy]).localeCompare(String(b[sortBy])) * dir
  })

  return (
    <View style={{ padding: 16 }}>
      <DataTable
        columns={columns}
        data={sorted}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={(key, direction) => { setSortBy(key); setSortDirection(direction) }}
        striped
        onRowPress={(row) => console.log('Open', row.name)}
        keyExtractor={(row) => row.id}
      />
    </View>
  )
}`,
},

image: {
  name: 'Image',
  slug: 'image',
  description: 'Enhanced image component with a fade-in on load, shimmer/blur/color placeholders, automatic fallback source on error, and an error state with icon.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add image',
  accessibility: [
    { feature: 'Image role', detail: 'The underlying image sets accessibilityRole="image" with accessibilityLabel bound to the alt prop.' },
  ],
  props: [
    { name: 'source', type: 'ImageSourcePropType', description: 'Primary image source. Required.' },
    { name: 'fallbackSource', type: 'ImageSourcePropType', description: 'Used automatically if the primary source fails to load.' },
    { name: 'placeholder', type: '"blur"|"shimmer"|"color"', default: '"shimmer"', description: 'Placeholder style shown while loading.' },
    { name: 'placeholderColor', type: 'string', description: 'Background color for the placeholder / "color" mode. Defaults to theme.colors.surface.' },
    { name: 'aspectRatio', type: 'number', description: 'Aspect ratio (e.g. 16/9) applied to the container.' },
    { name: 'borderRadius', type: 'number', default: '0', description: 'Corner radius applied to both the container and the image.' },
    { name: 'resizeMode', type: 'ImageResizeMode', default: '"cover"', description: 'Standard React Native image resize mode.' },
    { name: 'onLoad', type: '() => void', description: 'Called when the image finishes loading.' },
    { name: 'onError', type: '() => void', description: 'Called when loading fails and no (further) fallback is available.' },
    { name: 'showLoadingIndicator', type: 'boolean', default: 'false', description: 'Shows an ActivityIndicator over the placeholder while loading.' },
    { name: 'alt', type: 'string', description: 'Accessible alt text, read by screen readers.' },
    { name: 'width', type: 'number | string', description: 'Fixed width.' },
    { name: 'height', type: 'number | string', description: 'Fixed height.' },
  ],
  usageCode: `import { Image } from '~/components/ui/image'

// Basic, shimmer placeholder
<Image source={{ uri: 'https://...' }} width={220} height={140} borderRadius={12} />

// Aspect ratio
<Image source={{ uri: 'https://...' }} aspectRatio={16 / 9} borderRadius={12} width={280} />

// Blur placeholder + loading indicator
<Image
  source={{ uri: 'https://...' }}
  placeholder="blur"
  showLoadingIndicator
  width={160}
  height={160}
  borderRadius={80}
/>

// Fallback source on error
<Image
  source={{ uri: 'https://broken-url.invalid/x.jpg' }}
  fallbackSource={{ uri: 'https://fallback-image.com/default.jpg' }}
  width={220}
  height={140}
/>`,
  exampleCode: `import { Image } from '~/components/ui/image'
import { View } from 'react-native'

export function ProductThumbnail({ uri }: { uri: string }) {
  return (
    <View style={{ padding: 16 }}>
      <Image
        source={{ uri }}
        fallbackSource={{ uri: 'https://placehold.co/400x300?text=No+Image' }}
        aspectRatio={4 / 3}
        borderRadius={16}
        placeholder="shimmer"
        alt="Product photo"
      />
    </View>
  )
}`,
},

'list-item': {
  name: 'List Item',
  slug: 'list-item',
  description: 'Universal list row with leading/trailing slots, press-in scale animation, destructive and compact variants, auto chevron, and an optional bottom divider.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add list-item',
  accessibility: [
    { feature: 'Button role', detail: 'When onPress or onLongPress is set, the row wraps in a Pressable with accessibilityRole="button" and accessibilityLabel bound to the title.' },
    { feature: 'Disabled state', detail: 'accessibilityState={{ disabled }} is applied automatically when disabled is true.' },
  ],
  props: [
    { name: 'title', type: 'string', description: 'Primary text. Required.' },
    { name: 'subtitle', type: 'string', description: 'Secondary text below the title.' },
    { name: 'description', type: 'string', description: 'Tertiary description text, truncated to 2 lines.' },
    { name: 'leading', type: 'React.ReactNode', description: 'Element on the left — icon, avatar, image, or custom node.' },
    { name: 'trailing', type: 'React.ReactNode', description: 'Element on the right — chevron, badge, switch, text, or custom node.' },
    { name: 'onPress', type: '() => void', description: 'Makes the row pressable with a spring scale + background highlight.' },
    { name: 'onLongPress', type: '() => void', description: 'Long-press handler.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Reduces opacity and disables press.' },
    { name: 'destructive', type: 'boolean', default: 'false', description: 'Renders title/subtitle in the destructive color.' },
    { name: 'divider', type: 'boolean', default: 'false', description: 'Shows a bottom divider line, inset to align with the content.' },
    { name: 'compact', type: 'boolean', default: 'false', description: 'Reduces padding and font sizes for denser lists.' },
    { name: 'haptic', type: '"light"|"medium"|"heavy"|"none"', default: '"light"', description: 'Haptic feedback intensity on press-in.' },
    { name: 'showChevron', type: 'boolean', description: 'Overrides the default chevron behavior (shown automatically when onPress is set and no trailing element is provided).' },
  ],
  usageCode: `import { ListItem } from '~/components/ui/list-item'
import { Ionicons } from '@expo/vector-icons'

// Basic list
<ListItem title="Notifications" subtitle="Push, email, SMS" onPress={() => {}} divider />
<ListItem title="Appearance" subtitle="Theme and display" onPress={() => {}} />

// Leading icon (auto chevron since no trailing)
<ListItem
  title="Account"
  subtitle="jordan@example.com"
  leading={<Ionicons name="person-circle-outline" size={28} color="#6366f1" />}
  onPress={() => {}}
/>

// Custom trailing content (suppresses auto chevron)
<ListItem
  title="Wi-Fi"
  subtitle="Connected — HomeNetwork"
  leading={<Ionicons name="wifi-outline" size={22} color="#10b981" />}
  trailing={<Ionicons name="checkmark-circle" size={20} color="#10b981" />}
/>

// Destructive
<ListItem
  title="Delete account"
  destructive
  leading={<Ionicons name="trash-outline" size={20} color="#ef4444" />}
  onPress={() => {}}
/>

// Disabled & compact
<ListItem title="Restore purchase" disabled onPress={() => {}} />
<ListItem title="Two-factor authentication" description="Add an extra layer of security." compact onPress={() => {}} />`,
  exampleCode: `import { ListItem } from '~/components/ui/list-item'
import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'

export function SettingsScreen() {
  return (
    <View>
      <ListItem
        title="Account"
        subtitle="jordan@example.com"
        leading={<Ionicons name="person-circle-outline" size={28} color="#6366f1" />}
        onPress={() => {}}
        divider
      />
      <ListItem
        title="Notifications"
        leading={<Ionicons name="notifications-outline" size={24} color="#6366f1" />}
        onPress={() => {}}
        divider
      />
      <ListItem
        title="Delete account"
        destructive
        leading={<Ionicons name="trash-outline" size={20} color="#ef4444" />}
        onPress={() => {}}
      />
    </View>
  )
}`,
},

markdown: {
  name: 'Markdown',
  slug: 'markdown',
  description: 'Lightweight markdown renderer supporting headings, bold/italic/inline code, links, ordered/unordered lists, blockquotes, fenced code blocks, images, and horizontal rules — with per-element style overrides.',
  category: 'Display',
  npmDeps: [],
  componentDeps: [],
  addCommand: 'npx native-mate add markdown',
  accessibility: [
    { feature: 'Heading role', detail: 'Headings (#, ##, …) set accessibilityRole="header" so screen readers can navigate by heading.' },
    { feature: 'Link role', detail: 'Inline [text](url) links set accessibilityRole="link" with accessibilityLabel set to the link text.' },
    { feature: 'Code block label', detail: 'Fenced code blocks set accessibilityLabel="Code block, {lang}" (or just "Code block" if no language is specified).' },
  ],
  props: [
    { name: 'content', type: 'string', description: 'Markdown source string. Required.' },
    { name: 'markdownStyle', type: 'MarkdownStyles', description: 'Style overrides per element: h1–h6, paragraph, bold, italic, code, codeBlock, codeBlockText, link, blockquote, blockquoteText, listItem, listItemText, image, hr.' },
    { name: 'linkHandler', type: '(url: string) => void', description: 'Called when a [text](url) link is pressed — wire this to Linking.openURL or in-app navigation.' },
    { name: 'codeTheme', type: '"light"|"dark"', default: '"light"', description: 'Code block color scheme. Also switches automatically when theme.colorScheme is "dark".' },
  ],
  usageCode: `import { Markdown } from '~/components/ui/markdown'
import { Linking } from 'react-native'

const content = \`# Release Notes

## v2.1.0

We shipped **big** improvements this release, with a focus on *performance*.

- Faster cold start times
- New \\\`useTheme\\\` hook
- Fixed carousel snapping on Android

> Upgrade as soon as possible — this release contains a security fix.

Read the [full changelog](https://example.com/changelog) for details.

\\\`\\\`\\\`ts
const value = compute(a, b)
\\\`\\\`\\\`
\`

// Basic
<Markdown content={content} linkHandler={(url) => Linking.openURL(url)} />

// Dark code blocks
<Markdown content={content} codeTheme="dark" />

// Custom style overrides
<Markdown
  content={content}
  markdownStyle={{ h1: { color: '#6366f1' }, paragraph: { fontStyle: 'italic' } }}
/>`,
  exampleCode: `import { Markdown } from '~/components/ui/markdown'
import { Linking, ScrollView } from 'react-native'

const releaseNotes = \`# What's new in 2.1

We improved **startup performance** by 40% and fixed several *carousel* bugs.

- Faster cold starts
- New theming API
- Bug fixes

> Please update as soon as possible.

See the [full changelog](https://example.com/changelog).\`

export function ReleaseNotesScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Markdown content={releaseNotes} linkHandler={(url) => Linking.openURL(url)} />
    </ScrollView>
  )
}`,
},

timeline: {
  name: 'Timeline',
  slug: 'timeline',
  description: 'Vertical timeline with animated stagger entrance, status-based nodes (completed/active/upcoming/error), connecting lines, and optional per-item press handling.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add timeline',
  accessibility: [
    { feature: 'Role', detail: 'The list wrapper sets accessibilityRole="list".' },
    { feature: 'Item labels', detail: 'Each item row gets an accessibilityLabel that appends the status (e.g. ", completed", ", current", ", error") for screen readers.' },
    { feature: 'Pressable rows', detail: 'When onItemPress is provided, rows get accessibilityRole="button"; otherwise "text".' },
  ],
  props: [
    { name: 'items', type: 'TimelineItem[]', description: 'Array of { key, title, description?, timestamp?, icon?, status?, content? } entries.' },
    { name: 'animated', type: 'boolean', default: 'true', description: 'Staggered fade + slide-up entrance animation for each item.' },
    { name: 'staggerDelay', type: 'number', default: '100', description: 'Delay in ms between each item\'s entrance animation.' },
    { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls node size, line width, and text sizes.' },
    { name: 'completedColor', type: 'string', description: 'Node/line color for completed items. Defaults to theme primary.' },
    { name: 'activeColor', type: 'string', description: 'Node/line color for the active item, including its pulse ring. Defaults to theme primary.' },
    { name: 'errorColor', type: 'string', description: 'Node/line color for error items. Defaults to theme destructive.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Light haptic feedback when a node/row is pressed.' },
    { name: 'onItemPress', type: '(key: string) => void', description: 'Called with the item key when a row is pressed. Makes rows pressable.' },
  ],
  usageCode: `import { Timeline } from '~/components/ui/timeline'

const items = [
  { key: '1', title: 'Order placed', timestamp: '9:02 AM', status: 'completed' },
  { key: '2', title: 'Payment confirmed', timestamp: '9:03 AM', status: 'completed' },
  { key: '3', title: 'Preparing shipment', description: 'Packing your items now', status: 'active' },
  { key: '4', title: 'Out for delivery', status: 'upcoming' },
  { key: '5', title: 'Delivered', status: 'upcoming' },
]

// Basic
<Timeline items={items} />

// Sizes
<Timeline items={items} size="sm" />
<Timeline items={items} size="lg" />

// Custom colors
<Timeline items={items} completedColor="#10b981" activeColor="#6366f1" />

// Error state
<Timeline items={[
  { key: '1', title: 'Build started', status: 'completed' },
  { key: '2', title: 'Deploy failed', description: 'Container failed to start', status: 'error' },
]} />

// Interactive rows
<Timeline items={items} onItemPress={(key) => console.log(key)} />

// No stagger animation
<Timeline items={items} animated={false} />`,
  exampleCode: `import { useState } from 'react'
import { Timeline } from '~/components/ui/timeline'
import type { TimelineItem } from '~/components/ui/timeline'
import { View } from 'react-native'

const STEPS: TimelineItem[] = [
  { key: '1', title: 'Order placed', timestamp: '9:02 AM', status: 'completed' },
  { key: '2', title: 'Payment confirmed', timestamp: '9:03 AM', status: 'completed' },
  { key: '3', title: 'Preparing shipment', description: 'Packing your items now', status: 'active' },
  { key: '4', title: 'Out for delivery', status: 'upcoming' },
  { key: '5', title: 'Delivered', status: 'upcoming' },
]

export function OrderTrackingScreen() {
  const [steps, setSteps] = useState(STEPS)

  const advance = (key: string) => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.key === key)
      return prev.map((s, i) => ({
        ...s,
        status: i < idx ? 'completed' : i === idx ? 'active' : 'upcoming',
      }))
    })
  }

  return (
    <View style={{ padding: 16 }}>
      <Timeline items={steps} onItemPress={advance} />
    </View>
  )
}`,
},

'video-player': {
  name: 'Video Player',
  slug: 'video-player',
  description: 'Inline video player shell with poster/placeholder state, animated play/pause controls, progress bar, time display, mute toggle, and auto-hiding control overlay.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add video-player',
  accessibility: [
    { feature: 'Container label', detail: 'accessibilityLabel reflects playing/paused state (e.g. "Video player, playing").' },
    { feature: 'Control labels', detail: 'Play/pause, mute/unmute, and fullscreen buttons all set accessibilityRole="button" with a descriptive accessibilityLabel.' },
  ],
  props: [
    { name: 'source', type: '{ uri: string }', description: 'Video source URI.' },
    { name: 'poster', type: 'string', description: 'Poster image URI shown before playback starts.' },
    { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Auto-play on mount.' },
    { name: 'loop', type: 'boolean', default: 'false', description: 'Loop playback when it ends.' },
    { name: 'muted', type: 'boolean', default: 'false', description: 'Start muted.' },
    { name: 'controls', type: 'boolean', default: 'true', description: 'Show the play/pause, progress, time, and mute controls overlay.' },
    { name: 'onPlay', type: '() => void', description: 'Called when playback starts.' },
    { name: 'onPause', type: '() => void', description: 'Called when playback pauses.' },
    { name: 'onEnd', type: '() => void', description: 'Called when playback ends.' },
    { name: 'onProgress', type: '(progress: { currentTime: number; duration: number }) => void', description: 'Called with playback progress updates.' },
    { name: 'aspectRatio', type: 'number', default: '16 / 9', description: 'Video container aspect ratio.' },
    { name: 'borderRadius', type: 'number', default: '0', description: 'Corner radius of the player container.' },
  ],
  usageCode: `import { VideoPlayer } from '~/components/ui/video-player'

// Basic with poster
<VideoPlayer
  source={{ uri: 'https://cdn.example.com/clip.mp4' }}
  poster="https://cdn.example.com/poster.jpg"
/>

// No poster — shows a tap-to-play placeholder
<VideoPlayer source={{ uri: 'https://cdn.example.com/clip.mp4' }} />

// Square, rounded corners
<VideoPlayer
  source={{ uri: 'https://cdn.example.com/clip.mp4' }}
  poster="https://cdn.example.com/poster.jpg"
  aspectRatio={1}
  borderRadius={20}
/>

// Controls hidden (custom UI on top)
<VideoPlayer
  source={{ uri: 'https://cdn.example.com/clip.mp4' }}
  controls={false}
/>

// Progress tracking
<VideoPlayer
  source={{ uri: 'https://cdn.example.com/clip.mp4' }}
  onProgress={({ currentTime, duration }) => setPct(currentTime / duration)}
/>`,
  exampleCode: `import { VideoPlayer } from '~/components/ui/video-player'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function ClipDetailScreen() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <VideoPlayer
        source={{ uri: 'https://cdn.example.com/product-demo.mp4' }}
        poster="https://cdn.example.com/product-demo-poster.jpg"
        aspectRatio={16 / 9}
        borderRadius={12}
        onEnd={() => console.log('finished')}
      />
      <Text variant="h3">Product walkthrough</Text>
      <Text muted>A 90 second tour of the new dashboard layout.</Text>
    </View>
  )
}`,
},

'reaction-bar': {
  name: 'Reaction Bar',
  slug: 'reaction-bar',
  description: 'Row of emoji reaction pills with per-reaction counts, a highlighted "reacted" state, spring bounce on press, overflow count, and an optional add-reaction button.',
  category: 'Display',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add reaction-bar',
  accessibility: [
    { feature: 'Toolbar role', detail: 'The container sets accessibilityRole="toolbar" with accessibilityLabel="Reactions".' },
    { feature: 'Pill labels', detail: 'Each pill\'s accessibilityLabel reads "{emoji} {count} reactions" and appends ", you reacted" when applicable.' },
    { feature: 'Selected state', detail: 'accessibilityState={{ selected }} reflects whether the current user has reacted.' },
  ],
  props: [
    { name: 'reactions', type: 'Reaction[]', description: 'Array of { emoji, count, reacted } entries.' },
    { name: 'onReact', type: '(emoji: string) => void', description: 'Called when a reaction pill is pressed (toggle).' },
    { name: 'onLongPress', type: '() => void', description: 'Called when the add-reaction button is pressed (e.g. to open a full emoji picker). Omit to hide the button.' },
    { name: 'maxVisible', type: 'number', default: '8', description: 'Maximum reaction pills shown before collapsing the rest into a "+N" pill.' },
    { name: 'size', type: '"sm" | "md"', default: '"md"', description: 'Pill height and font sizes.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Light haptic feedback on press.' },
  ],
  usageCode: `import { ReactionBar } from '~/components/ui/reaction-bar'
import { useState } from 'react'

const [reactions, setReactions] = useState([
  { emoji: '❤️', count: 24, reacted: true },
  { emoji: '🔥', count: 8, reacted: false },
  { emoji: '😂', count: 3, reacted: false },
])

function toggle(emoji: string) {
  setReactions(prev => prev.map(r =>
    r.emoji === emoji ? { ...r, reacted: !r.reacted, count: r.reacted ? r.count - 1 : r.count + 1 } : r
  ))
}

// Basic
<ReactionBar reactions={reactions} onReact={toggle} />

// Sizes
<ReactionBar reactions={reactions} size="sm" onReact={toggle} />

// With add-reaction button
<ReactionBar reactions={reactions} onReact={toggle} onLongPress={() => openEmojiPicker()} />

// Overflow — only show first 4, rest collapse to "+N"
<ReactionBar reactions={manyReactions} maxVisible={4} onReact={toggle} />`,
  exampleCode: `import { useState } from 'react'
import { ReactionBar } from '~/components/ui/reaction-bar'
import type { Reaction } from '~/components/ui/reaction-bar'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

const INITIAL: Reaction[] = [
  { emoji: '❤️', count: 24, reacted: true },
  { emoji: '🔥', count: 8, reacted: false },
  { emoji: '😂', count: 3, reacted: false },
]

export function PostFooter() {
  const [reactions, setReactions] = useState(INITIAL)

  const toggle = (emoji: string) => {
    setReactions(prev => prev.map(r =>
      r.emoji === emoji ? { ...r, reacted: !r.reacted, count: r.reacted ? r.count - 1 : r.count + 1 } : r
    ))
  }

  return (
    <View style={{ padding: 16 }}>
      <Text variant="body">Great trip to the mountains this weekend!</Text>
      <View style={{ marginTop: 12 }}>
        <ReactionBar
          reactions={reactions}
          onReact={toggle}
          onLongPress={() => console.log('open picker')}
        />
      </View>
    </View>
  )
}`,
},

'divider-label': {
  name: 'Divider Label',
  slug: 'divider-label',
  description: 'A horizontal divider with a centered (or left/right) text label, solid or dashed line style, and theme-aware colors — e.g. "or continue with".',
  category: 'Layout',
  npmDeps: [],
  componentDeps: [],
  addCommand: 'npx native-mate add divider-label',
  accessibility: [
    { feature: 'Role', detail: 'accessibilityRole="separator" is always set on the container.' },
  ],
  props: [
    { name: 'label', type: 'string', description: 'Text label rendered within the divider line.' },
    { name: 'position', type: '"center" | "left" | "right"', default: '"center"', description: 'Position of the label along the divider.' },
    { name: 'variant', type: '"line" | "dashed"', default: '"line"', description: 'Solid or dashed line style.' },
    { name: 'color', type: 'string', description: 'Line color override. Defaults to theme.colors.border.' },
    { name: 'textColor', type: 'string', description: 'Label text color override. Defaults to theme.colors.muted.' },
    { name: 'thickness', type: 'number', default: '1', description: 'Line thickness in dp.' },
    { name: 'spacing', type: 'number', default: '16', description: 'Vertical margin above and below the divider.' },
  ],
  usageCode: `import { DividerLabel } from '~/components/ui/divider-label'

// Center label (default)
<DividerLabel label="or" />

// Positioned label
<DividerLabel label="continue with" position="left" />
<DividerLabel label="more options" position="right" />

// Dashed variant
<DividerLabel label="or" variant="dashed" />

// Custom colors
<DividerLabel label="premium" color="#6366f1" textColor="#6366f1" />

// Custom thickness + spacing
<DividerLabel label="section" thickness={2} spacing={24} />`,
  exampleCode: `import { DividerLabel } from '~/components/ui/divider-label'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function SignInScreen() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Button fullWidth>Sign in with email</Button>
      <DividerLabel label="or continue with" />
      <Button fullWidth variant="outline">Continue with Google</Button>
      <Button fullWidth variant="outline">Continue with Apple</Button>
    </View>
  )
}`,
},

'biometric-prompt': {
  name: 'Biometric Prompt',
  slug: 'biometric-prompt',
  description: 'Full-screen biometric authentication modal with a pulsing icon animation, Face ID / fingerprint icon selection, success/error states, an optional passcode fallback, and spring entrance/exit animation.',
  category: 'Overlay',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add biometric-prompt',
  accessibility: [
    { feature: 'Button labels', detail: 'Authenticate, fallback, and cancel actions each set accessibilityRole="button" with a descriptive accessibilityLabel.' },
  ],
  props: [
    { name: 'visible', type: 'boolean', description: 'Whether the prompt is shown.' },
    { name: 'onAuthenticate', type: '() => void', description: 'Called when the user taps "Authenticate" — trigger your real biometric auth call here.' },
    { name: 'onCancel', type: '() => void', description: 'Called when the user cancels or dismisses the prompt.' },
    { name: 'title', type: 'string', default: '"Authenticate"', description: 'Heading text.' },
    { name: 'subtitle', type: 'string', default: '"Use biometrics to verify your identity"', description: 'Supporting description text.' },
    { name: 'type', type: '"fingerprint" | "faceId" | "auto"', default: '"auto"', description: 'Which biometric icon to show. "auto" picks Face ID on iOS, fingerprint on Android.' },
    { name: 'fallbackLabel', type: 'string', default: '"Use Passcode"', description: 'Label for the optional fallback button.' },
    { name: 'onFallback', type: '() => void', description: 'Called when the fallback button is pressed. Omit to hide the button.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Haptic feedback on authenticate/cancel.' },
  ],
  usageCode: `import { BiometricPrompt } from '~/components/ui/biometric-prompt'
import { useState } from 'react'

const [open, setOpen] = useState(false)

// Face ID
<BiometricPrompt
  visible={open}
  type="faceId"
  title="Authenticate"
  subtitle="Use Face ID to verify your identity"
  onAuthenticate={() => runRealAuth()}
  onCancel={() => setOpen(false)}
/>

// Fingerprint with passcode fallback
<BiometricPrompt
  visible={open}
  type="fingerprint"
  title="Unlock App"
  subtitle="Use your fingerprint to continue"
  fallbackLabel="Use Passcode"
  onAuthenticate={handleAuth}
  onFallback={() => usePasscodeInstead()}
  onCancel={() => setOpen(false)}
/>

// Auto-detect platform biometric
<BiometricPrompt visible={open} type="auto" onCancel={() => setOpen(false)} />`,
  exampleCode: `import { useState } from 'react'
import { BiometricPrompt } from '~/components/ui/biometric-prompt'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'

export function UnlockScreen() {
  const [open, setOpen] = useState(false)

  const handleAuthenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync()
    if (result.success) setOpen(false)
  }

  return (
    <View style={{ padding: 16 }}>
      <Button onPress={() => setOpen(true)}>Unlock with biometrics</Button>
      <BiometricPrompt
        visible={open}
        type="auto"
        title="Unlock App"
        subtitle="Use your device biometrics to continue"
        fallbackLabel="Use Passcode"
        onAuthenticate={handleAuthenticate}
        onFallback={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </View>
  )
}`,
},

'bottom-sheet-list': {
  name: 'Bottom Sheet List',
  slug: 'bottom-sheet-list',
  description: 'A modal bottom sheet showing a searchable, single- or multi-select list of items with spring animation, keyboard-avoidance, selection checkmarks, and an optional confirm button.',
  category: 'Overlay',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add bottom-sheet-list',
  accessibility: [
    { feature: 'Item roles', detail: 'Rows set accessibilityRole="checkbox" in multi-select mode, or "button" for single-select.' },
    { feature: 'Selection state', detail: 'accessibilityState reports checked (multi-select), selected (single-select), and disabled as appropriate.' },
    { feature: 'Search input', detail: 'The search field has accessibilityLabel="Search list items".' },
  ],
  props: [
    { name: 'visible', type: 'boolean', description: 'Whether the sheet is shown.' },
    { name: 'onClose', type: '() => void', description: 'Called when the sheet should close (backdrop tap, back button, or after a selection in single-select mode).' },
    { name: 'items', type: 'BottomSheetListItem[]', description: 'Array of { label, value, icon?, description?, disabled? } entries.' },
    { name: 'onSelect', type: '(value: string) => void', description: 'Called with the selected value. In multi-select mode, called for every toggled item on confirm.' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'Shows a search input that filters by label/description.' },
    { name: 'searchPlaceholder', type: 'string', default: '"Search..."', description: 'Placeholder text for the search input.' },
    { name: 'title', type: 'string', description: 'Optional title shown at the top of the sheet.' },
    { name: 'multiSelect', type: 'boolean', default: 'false', description: 'Allow selecting multiple items with a confirm button.' },
    { name: 'selectedValues', type: 'string[]', default: '[]', description: 'Currently selected value(s).' },
    { name: 'emptyMessage', type: 'string', default: '"No results found"', description: 'Message shown when the search filters out all items.' },
    { name: 'height', type: 'number', default: '460', description: 'Fixed height of the sheet in dp.' },
    { name: 'showConfirmButton', type: 'boolean', default: 'true', description: 'Show the confirm button in multi-select mode.' },
    { name: 'confirmLabel', type: 'string', default: '"Done"', description: 'Label for the confirm button.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Haptic feedback (selectionAsync) on item press.' },
  ],
  usageCode: `import { BottomSheetList } from '~/components/ui/bottom-sheet-list'
import { useState } from 'react'

const countries = [
  { label: 'United States', value: 'us', description: 'North America' },
  { label: 'Germany', value: 'de', description: 'Europe' },
  { label: 'Japan', value: 'jp', description: 'Asia' },
]

const [open, setOpen] = useState(false)
const [country, setCountry] = useState('us')

// Single select
<BottomSheetList
  visible={open}
  onClose={() => setOpen(false)}
  title="Select country"
  items={countries}
  selectedValues={[country]}
  onSelect={(value) => { setCountry(value); setOpen(false) }}
/>

// Searchable
<BottomSheetList
  visible={open}
  onClose={() => setOpen(false)}
  items={countries}
  searchable
  searchPlaceholder="Search countries..."
  onSelect={(value) => setCountry(value)}
/>

// Multi-select with confirm
const [selected, setSelected] = useState<string[]>(['us'])

<BottomSheetList
  visible={open}
  onClose={() => setOpen(false)}
  title="Select regions"
  items={countries}
  multiSelect
  selectedValues={selected}
  confirmLabel="Apply"
  onSelect={(value) =>
    setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }
/>`,
  exampleCode: `import { useState } from 'react'
import { BottomSheetList } from '~/components/ui/bottom-sheet-list'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

const COUNTRIES = [
  { label: 'United States', value: 'us', description: 'North America' },
  { label: 'United Kingdom', value: 'uk', description: 'Europe' },
  { label: 'Germany', value: 'de', description: 'Europe' },
  { label: 'Japan', value: 'jp', description: 'Asia' },
]

export function CountryPickerScreen() {
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState('us')

  return (
    <View style={{ padding: 16 }}>
      <Button variant="outline" onPress={() => setOpen(true)}>
        {COUNTRIES.find(c => c.value === country)?.label}
      </Button>
      <BottomSheetList
        visible={open}
        onClose={() => setOpen(false)}
        title="Select country"
        items={COUNTRIES}
        searchable
        selectedValues={[country]}
        onSelect={(value) => { setCountry(value); setOpen(false) }}
      />
    </View>
  )
}`,
},

dialog: {
  name: 'Dialog',
  slug: 'dialog',
  description: 'A centered confirm/cancel dialog with scale + fade spring animation, a destructive variant, an optional icon, and configurable backdrop dismiss behavior.',
  category: 'Overlay',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add dialog',
  accessibility: [
    { feature: 'Role', detail: 'The dialog card sets accessibilityRole="alert".' },
    { feature: 'Action labels', detail: 'The confirm and cancel buttons set accessibilityRole="button" with accessibilityLabel equal to their visible label.' },
  ],
  props: [
    { name: 'visible', type: 'boolean', description: 'Whether the dialog is shown.' },
    { name: 'onClose', type: '() => void', description: 'Called when the dialog should close (backdrop tap if dismissible, or after confirm/cancel).' },
    { name: 'title', type: 'string', description: 'Dialog heading text.' },
    { name: 'description', type: 'string', description: 'Secondary supporting text below the title.' },
    { name: 'confirmLabel', type: 'string', default: '"Confirm"', description: 'Label for the confirm button.' },
    { name: 'cancelLabel', type: 'string', default: '"Cancel"', description: 'Label for the cancel button.' },
    { name: 'onConfirm', type: '() => void', description: 'Called when the confirm button is pressed (before onClose).' },
    { name: 'onCancel', type: '() => void', description: 'Called when the cancel button is pressed (before onClose).' },
    { name: 'variant', type: '"default" | "destructive"', default: '"default"', description: 'Destructive variant tints the icon and confirm label with the destructive color.' },
    { name: 'icon', type: 'string', description: 'Ionicons icon name shown above the title. Defaults to "information-circle" or "alert-circle" (destructive) when set to any truthy/empty value.' },
    { name: 'dismissible', type: 'boolean', default: 'true', description: 'Allow closing by tapping the backdrop.' },
    { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"medium"', description: 'Haptic feedback intensity on confirm/cancel.' },
  ],
  usageCode: `import { Dialog } from '~/components/ui/dialog'
import { useState } from 'react'

const [open, setOpen] = useState(false)

// Default confirm dialog
<Dialog
  visible={open}
  onClose={() => setOpen(false)}
  title="Save changes?"
  description="Your changes will be saved to this document."
  confirmLabel="Save"
  cancelLabel="Discard"
  onConfirm={handleSave}
/>

// Destructive variant with icon
<Dialog
  visible={open}
  onClose={() => setOpen(false)}
  variant="destructive"
  icon="trash"
  title="Delete project?"
  description="This action cannot be undone. All data will be permanently removed."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
/>

// Non-dismissible — must pick an action
<Dialog
  visible={open}
  onClose={() => setOpen(false)}
  dismissible={false}
  title="Session expiring"
  description="Your session will expire in 60 seconds."
  confirmLabel="Stay signed in"
  cancelLabel="Sign out"
/>`,
  exampleCode: `import { useState } from 'react'
import { Dialog } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function DeleteAccountScreen() {
  const [open, setOpen] = useState(false)

  return (
    <View style={{ padding: 16 }}>
      <Button variant="destructive" onPress={() => setOpen(true)}>
        Delete account
      </Button>
      <Dialog
        visible={open}
        onClose={() => setOpen(false)}
        variant="destructive"
        icon="warning"
        title="Are you sure?"
        description="This will permanently delete your account and all associated data."
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        onConfirm={() => console.log('deleted')}
      />
    </View>
  )
}`,
},

'dropdown-menu': {
  name: 'Dropdown Menu',
  slug: 'dropdown-menu',
  description: 'A context menu anchored to a trigger element, measured and positioned via the trigger\'s on-screen layout, with scale + fade animation, icons, destructive items, dividers, and disabled states.',
  category: 'Overlay',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add dropdown-menu',
  accessibility: [
    { feature: 'Trigger state', detail: 'The trigger sets accessibilityRole="button" and accessibilityState={{ expanded: isOpen }}.' },
    { feature: 'Menu role', detail: 'The menu surface sets accessibilityRole="menu"; each row sets accessibilityRole="menuitem".' },
    { feature: 'Item state', detail: 'Disabled items set accessibilityState={{ disabled: true }} and are excluded from press handling.' },
  ],
  props: [
    { name: 'trigger', type: 'React.ReactElement', description: 'The element that opens the menu when pressed.' },
    { name: 'items', type: 'DropdownMenuItem[]', description: 'Array of { key, label, icon?, onPress, destructive?, disabled?, divider? } entries.' },
    { name: 'open', type: 'boolean', description: 'Controlled open state. Omit for uncontrolled (internal) state.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the menu opens or closes.' },
    { name: 'align', type: '"left" | "right"', default: '"right"', description: 'Horizontal anchor alignment relative to the trigger.' },
    { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"light"', description: 'Haptic feedback intensity when opening the menu and when an item is pressed.' },
  ],
  usageCode: `import { DropdownMenu } from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'

// Basic
<DropdownMenu
  trigger={<Button variant="ghost" iconOnly iconLeft={<MoreIcon />} />}
  items={[
    { key: 'edit', label: 'Edit', icon: 'pencil', onPress: () => {} },
    { key: 'duplicate', label: 'Duplicate', icon: 'copy', onPress: () => {} },
    { key: 'share', label: 'Share', icon: 'share-outline', onPress: () => {} },
  ]}
/>

// Destructive item + divider before it
<DropdownMenu
  trigger={<Button variant="ghost" iconOnly iconLeft={<MoreIcon />} />}
  items={[
    { key: 'rename', label: 'Rename', icon: 'create-outline', onPress: () => {} },
    { key: 'archive', label: 'Archive', icon: 'archive-outline', onPress: () => {}, divider: true },
    { key: 'delete', label: 'Delete', icon: 'trash-outline', destructive: true, onPress: () => {} },
  ]}
/>

// Left-aligned, controlled
const [open, setOpen] = useState(false)

<DropdownMenu
  trigger={<Button variant="outline">Actions</Button>}
  align="left"
  open={open}
  onOpenChange={setOpen}
  items={[
    { key: 'export', label: 'Export data', icon: 'download-outline', onPress: () => {} },
    { key: 'sync', label: 'Force sync', icon: 'sync-outline', disabled: true, onPress: () => {} },
  ]}
/>`,
  exampleCode: `import { DropdownMenu } from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function FileRow({ name }: { name: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
      <Text>{name}</Text>
      <DropdownMenu
        trigger={<Button variant="ghost" iconOnly iconLeft={<Icon name="ellipsis-horizontal" />} />}
        items={[
          { key: 'rename', label: 'Rename', icon: 'create-outline', onPress: () => {} },
          { key: 'move', label: 'Move to folder', icon: 'folder-outline', onPress: () => {}, divider: true },
          { key: 'delete', label: 'Delete', icon: 'trash-outline', destructive: true, onPress: () => {} },
        ]}
      />
    </View>
  )
}`,
},

popover: {
  name: 'Popover',
  slug: 'popover',
  description: 'A rich, anchored popover with an optional pointing arrow, auto-flip positioning near screen edges, scale + fade animation, and interactive scrollable content.',
  category: 'Overlay',
  npmDeps: ['react-native-reanimated'],
  componentDeps: [],
  addCommand: 'npx native-mate add popover',
  accessibility: [
    { feature: 'Trigger state', detail: 'The trigger sets accessibilityRole="button" and accessibilityState={{ expanded: isOpen }}.' },
  ],
  props: [
    { name: 'trigger', type: 'React.ReactElement', description: 'The element that opens the popover when pressed.' },
    { name: 'content', type: 'React.ReactNode', description: 'Content rendered inside the popover bubble (wrapped in a ScrollView).' },
    { name: 'position', type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: 'Preferred anchor position. Automatically flips to the opposite side if there isn\'t enough screen space.' },
    { name: 'visible', type: 'boolean', description: 'Controlled visibility. Omit for uncontrolled (internal) state.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the popover opens or closes.' },
    { name: 'showArrow', type: 'boolean', default: 'true', description: 'Show the small arrow pointing at the trigger.' },
    { name: 'closeOnOutsidePress', type: 'boolean', default: 'true', description: 'Close the popover when tapping outside its bounds.' },
    { name: 'maxWidth', type: 'number', default: '280', description: 'Maximum width of the popover bubble.' },
    { name: 'maxHeight', type: 'number', default: '360', description: 'Maximum height of the scrollable content area.' },
  ],
  usageCode: `import { Popover } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import { Text } from '@native-mate/core'

// Basic, bottom-anchored with arrow
<Popover
  trigger={<Button>Storage</Button>}
  content={
    <View style={{ padding: 14, width: 220 }}>
      <Text weight="semibold">Storage usage</Text>
      <Text muted>You've used 4.2 GB of your 10 GB plan.</Text>
    </View>
  }
  position="bottom"
/>

// Positions — auto-flips near screen edges
<Popover trigger={<Button>Top</Button>} content={<InfoContent />} position="top" />
<Popover trigger={<Button>Left</Button>} content={<InfoContent />} position="left" />
<Popover trigger={<Button>Right</Button>} content={<InfoContent />} position="right" />

// No arrow, no outside-press dismiss
<Popover
  trigger={<Button>Help</Button>}
  content={<InfoContent />}
  showArrow={false}
  closeOnOutsidePress={false}
/>

// Controlled
const [open, setOpen] = useState(false)

<Popover
  trigger={<Button>Menu</Button>}
  content={<InfoContent />}
  visible={open}
  onOpenChange={setOpen}
/>`,
  exampleCode: `import { Popover } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

function StorageInfo() {
  return (
    <View style={{ padding: 14, gap: 6, width: 220 }}>
      <Text weight="semibold">Storage usage</Text>
      <Text muted style={{ fontSize: 13, lineHeight: 18 }}>
        You've used 4.2 GB of your 10 GB plan. Upgrade for more space.
      </Text>
    </View>
  )
}

export function AccountHeader() {
  return (
    <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'flex-end' }}>
      <Popover
        trigger={<Button variant="outline" size="sm">Storage</Button>}
        content={<StorageInfo />}
        position="bottom"
      />
    </View>
  )
}`,
},

'bottom-bar': {
  name: 'Bottom Bar',
  slug: 'bottom-bar',
  description: 'Animated bottom tab navigation bar with a sliding pill indicator, per-tab badges (with pulse animation), haptic feedback, and safe-area-aware bottom inset.',
  category: 'Navigation',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add bottom-bar',
  accessibility: [
    { feature: 'Role', detail: 'The container sets accessibilityRole="tablist" and each tab sets accessibilityRole="tab".' },
    { feature: 'Selected state', detail: 'accessibilityState={{ selected, disabled }} is set on every tab to reflect the active item.' },
    { feature: 'Label', detail: 'accessibilityLabel is derived from each item\'s label.' },
  ],
  props: [
    { name: 'items', type: 'BottomBarItem[]', description: 'Tab definitions: { key, label, icon, activeIcon?, badge?, disabled? }.' },
    { name: 'activeKey', type: 'string', description: 'Key of the currently active tab.' },
    { name: 'onChange', type: '(key: string) => void', description: 'Called when a tab is pressed.' },
    { name: 'showLabels', type: 'boolean', default: 'true', description: 'Show text labels under each icon.' },
    { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"light"', description: 'Haptic feedback style on tab press. Requires expo-haptics (optional).' },
    { name: 'bottomInset', type: 'number', description: 'Override the bottom safe-area padding (auto-detected per platform by default).' },
    { name: 'showIndicator', type: 'boolean', default: 'true', description: 'Show the animated sliding pill behind the active tab.' },
    { name: 'style', type: 'StyleProp<ViewStyle>', description: 'Style override for the outer container.' },
  ],
  usageCode: `import { BottomBar } from '~/components/ui/bottom-bar'

const items = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
  { key: 'cart', label: 'Cart', icon: 'cart-outline', activeIcon: 'cart', badge: { value: 3 } },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
]

const [active, setActive] = useState('home')

// Basic
<BottomBar items={items} activeKey={active} onChange={setActive} />

// Badge with pulse animation
<BottomBar
  items={[
    ...items,
    { key: 'alerts', label: 'Alerts', icon: 'notifications-outline', badge: { pulse: true, color: '#f59e0b' } },
  ]}
  activeKey={active}
  onChange={setActive}
/>

// No labels, no sliding indicator
<BottomBar items={items} activeKey={active} onChange={setActive} showLabels={false} showIndicator={false} />

// Disabled tab
<BottomBar
  items={[...items, { key: 'settings', label: 'Settings', icon: 'settings-outline', disabled: true }]}
  activeKey={active}
  onChange={setActive}
/>

// Haptic control
<BottomBar items={items} activeKey={active} onChange={setActive} haptic="none" />`,
  exampleCode: `import { useState } from 'react'
import { BottomBar } from '~/components/ui/bottom-bar'
import { View } from 'react-native'

const TABS = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
  { key: 'cart', label: 'Cart', icon: 'cart-outline', activeIcon: 'cart', badge: { value: 3, pulse: true } },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState('home')

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
      <BottomBar items={TABS} activeKey={active} onChange={setActive} />
    </View>
  )
}`,
},

breadcrumb: {
  name: 'Breadcrumb',
  slug: 'breadcrumb',
  description: 'Navigation breadcrumb trail with chevron/slash/dot or custom separators, optional leading icons, middle-item truncation via maxItems, and haptic feedback on press.',
  category: 'Navigation',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add breadcrumb',
  accessibility: [
    { feature: 'Role', detail: 'The container sets accessibilityRole="navigation" with accessibilityLabel="Breadcrumb". Pressable items use accessibilityRole="link".' },
  ],
  props: [
    { name: 'items', type: 'BreadcrumbItem[]', description: 'Ordered path items: { label, onPress?, icon? }. The last item (or one without onPress) renders as plain, non-pressable text.' },
    { name: 'separator', type: '"chevron" | "slash" | "dot" | string', default: '"chevron"', description: 'Built-in separator style, or any custom string rendered between items.' },
    { name: 'maxItems', type: 'number', description: 'When the item count exceeds this, collapses the middle into an "..." ellipsis, keeping the first and last items.' },
    { name: 'size', type: '"sm" | "md"', default: '"md"', description: 'Controls font size, icon size, gap, and vertical padding.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable a light haptic tap when a pressable item is pressed.' },
    { name: 'style', type: 'StyleProp<ViewStyle>', description: 'Style override for the outer row container.' },
  ],
  usageCode: `import { Breadcrumb } from '~/components/ui/breadcrumb'

// Basic
<Breadcrumb
  items={[
    { label: 'Home', onPress: () => router.push('/') },
    { label: 'Settings', onPress: () => router.push('/settings') },
    { label: 'Billing' },
  ]}
/>

// Separators
<Breadcrumb separator="slash" items={items} />
<Breadcrumb separator="dot" items={items} />
<Breadcrumb separator="—" items={items} />

// With icons
<Breadcrumb
  items={[
    { label: 'Home', icon: 'home-outline', onPress: () => {} },
    { label: 'Settings', onPress: () => {} },
    { label: 'Invoices' },
  ]}
/>

// Truncated middle for deep paths
<Breadcrumb
  maxItems={3}
  items={[
    { label: 'Home', onPress: () => {} },
    { label: 'Projects', onPress: () => {} },
    { label: 'Acme Corp', onPress: () => {} },
    { label: 'Website Redesign', onPress: () => {} },
    { label: 'Assets' },
  ]}
/>

// Small size
<Breadcrumb size="sm" items={items} />`,
  exampleCode: `import { Breadcrumb } from '~/components/ui/breadcrumb'
import { Header } from '~/components/ui/header'
import { View } from 'react-native'
import { useRouter } from 'expo-router'

export function FileDetailScreen() {
  const router = useRouter()

  return (
    <View style={{ flex: 1 }}>
      <Header title="Invoice_2026_Q1.pdf" onLeftPress={() => router.back()} />
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Breadcrumb
          maxItems={4}
          items={[
            { label: 'Home', icon: 'home-outline', onPress: () => router.push('/') },
            { label: 'Documents', onPress: () => router.push('/documents') },
            { label: 'Finance', onPress: () => router.push('/documents/finance') },
            { label: '2026', onPress: () => router.push('/documents/finance/2026') },
            { label: 'Invoice_2026_Q1.pdf' },
          ]}
        />
      </View>
    </View>
  )
}`,
},

header: {
  name: 'Header',
  slug: 'header',
  description: 'Custom navigation header with an animated large-title mode that collapses into the inline title on scroll, transparent/custom background modes, safe-area-aware top inset, and up to several right-side icon actions.',
  category: 'Navigation',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add header',
  accessibility: [
    { feature: 'Role', detail: 'Left back button and every right action set accessibilityRole="button".' },
    { feature: 'Label', detail: 'The left button defaults to accessibilityLabel="Go back"; each right action accepts its own accessibilityLabel.' },
  ],
  props: [
    { name: 'title', type: 'string', description: 'Primary title, shown inline and (if largeTitle) as a large heading below the bar.' },
    { name: 'subtitle', type: 'string', description: 'Secondary line under the inline title (hidden in large-title mode).' },
    { name: 'leftIcon', type: 'string', default: '"chevron-back"', description: 'Ionicons name for the left button.' },
    { name: 'onLeftPress', type: '() => void', description: 'Handler for the left button, typically router.back().' },
    { name: 'hideLeft', type: 'boolean', default: 'false', description: 'Hide the left button entirely (keeps its layout width reserved).' },
    { name: 'rightActions', type: 'HeaderAction[]', default: '[]', description: 'Right-side icon buttons: { icon, onPress, accessibilityLabel? }.' },
    { name: 'transparent', type: 'boolean', default: 'false', description: 'Transparent background — useful floating over images or maps.' },
    { name: 'largeTitle', type: 'boolean', default: 'false', description: 'Renders an additional large title area beneath the bar that collapses as scrollY increases.' },
    { name: 'scrollY', type: '{ value: number }', description: 'A Reanimated shared value from the scroll container, used to drive the large-title collapse animation.' },
    { name: 'haptic', type: '"light" | "medium" | "heavy" | "none"', default: '"light"', description: 'Haptic feedback style for icon button presses.' },
    { name: 'backgroundColor', type: 'string', description: 'Background color override (ignored if transparent is true).' },
    { name: 'titleColor', type: 'string', description: 'Title/subtitle/icon color override.' },
    { name: 'topInset', type: 'number', description: 'Override the top safe-area inset (auto-detected per platform by default).' },
    { name: 'style', type: 'StyleProp<ViewStyle>', description: 'Style override for the outer container.' },
  ],
  usageCode: `import { Header } from '~/components/ui/header'
import { useSharedValue } from 'react-native-reanimated'

// Basic
<Header title="Settings" onLeftPress={() => router.back()} />

// With subtitle and right actions
<Header
  title="Acme Corp"
  subtitle="12 members"
  onLeftPress={() => router.back()}
  rightActions={[
    { icon: 'search-outline', onPress: () => {}, accessibilityLabel: 'Search' },
    { icon: 'ellipsis-horizontal', onPress: () => {}, accessibilityLabel: 'More' },
  ]}
/>

// Large title that collapses on scroll
const scrollY = useSharedValue(0)

<Header title="Messages" largeTitle hideLeft scrollY={scrollY} />
<Animated.ScrollView onScroll={(e) => { scrollY.value = e.nativeEvent.contentOffset.y }}>
  {/* content */}
</Animated.ScrollView>

// Transparent, over an image/map
<Header title="Trip to Tokyo" transparent titleColor="#fff" onLeftPress={() => router.back()} />

// Custom background
<Header
  title="Checkout"
  hideLeft
  backgroundColor="#0f172a"
  titleColor="#fff"
  rightActions={[{ icon: 'close', onPress: () => router.back(), accessibilityLabel: 'Close' }]}
/>`,
  exampleCode: `import { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'
import { Header } from '~/components/ui/header'
import { Text } from '@native-mate/core'

export function InboxScreen() {
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y
  })

  return (
    <>
      <Header
        title="Inbox"
        largeTitle
        hideLeft
        scrollY={scrollY}
        rightActions={[{ icon: 'create-outline', onPress: () => {}, accessibilityLabel: 'Compose' }]}
      />
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        {Array.from({ length: 30 }).map((_, i) => (
          <Text key={i} style={{ padding: 16 }}>Message #{i + 1}</Text>
        ))}
      </Animated.ScrollView>
    </>
  )
}`,
},

collapsible: {
  name: 'Collapsible',
  slug: 'collapsible',
  description: 'Expand/collapse section with an animated height transition, rotating chevron indicator, controlled or uncontrolled open state, and haptic feedback on toggle.',
  category: 'Layout',
  npmDeps: ['react-native-reanimated', '@expo/vector-icons'],
  componentDeps: [],
  addCommand: 'npx native-mate add collapsible',
  accessibility: [
    { feature: 'Role', detail: 'The header sets accessibilityRole="button".' },
    { feature: 'Expanded state', detail: 'accessibilityState={{ expanded, disabled }} tracks the open state.' },
    { feature: 'Label', detail: 'accessibilityLabel is auto-derived, e.g. "Section title, expanded" / "collapsed".' },
  ],
  props: [
    { name: 'title', type: 'string | React.ReactNode', description: 'Header title — plain string gets default styling, or pass a custom node.' },
    { name: 'children', type: 'React.ReactNode', description: 'Collapsible content, measured automatically to animate to its natural height.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state for uncontrolled usage.' },
    { name: 'open', type: 'boolean', description: 'Controlled open state — overrides internal state when provided.' },
    { name: 'onToggle', type: '(open: boolean) => void', description: 'Called with the new open state whenever the header is pressed.' },
    { name: 'icon', type: 'React.ReactNode', description: 'Custom icon replacing the default rotating chevron.' },
    { name: 'headerStyle', type: 'StyleProp<ViewStyle>', description: 'Style override for the header row.' },
    { name: 'titleStyle', type: 'StyleProp<TextStyle>', description: 'Style override for the title text (only applies when title is a string).' },
    { name: 'animationDuration', type: 'number', default: '250', description: 'Duration in ms for the height/opacity/chevron animation.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable a light haptic tap when toggled.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables toggling and dims the section to 50% opacity.' },
    { name: 'style', type: 'StyleProp<ViewStyle>', description: 'Style override for the outer container.' },
  ],
  usageCode: `import { Collapsible } from '~/components/ui/collapsible'
import { Text } from '@native-mate/core'

// Basic
<Collapsible title="What is native-mate?">
  <Text muted>A shadcn-style component library for React Native.</Text>
</Collapsible>

// Default open
<Collapsible title="Shipping details" defaultOpen>
  <Text muted>Ships within 2-3 business days.</Text>
</Collapsible>

// Controlled
const [open, setOpen] = useState(false)

<Collapsible title="Advanced settings" open={open} onToggle={setOpen}>
  <Text muted>Controlled from outside.</Text>
</Collapsible>

// Disabled
<Collapsible title="Locked section" disabled>
  <Text muted>This content is unavailable.</Text>
</Collapsible>

// Custom icon and faster animation
<Collapsible title="Custom" icon={<Icon name="add-circle-outline" />} animationDuration={150}>
  <Text muted>Uses a plus icon instead of the chevron.</Text>
</Collapsible>`,
  exampleCode: `import { Collapsible } from '~/components/ui/collapsible'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function FaqSection() {
  return (
    <View style={{ padding: 16, gap: 4 }}>
      <Collapsible title="Can I customize the styles?">
        <Text muted>Yes — every component ships as editable source in your project.</Text>
      </Collapsible>
      <Collapsible title="Does it work with Expo?">
        <Text muted>Yes, fully compatible with Expo and bare React Native.</Text>
      </Collapsible>
      <Collapsible title="Is it free?" defaultOpen>
        <Text muted>Yes, native-mate is fully open source under the MIT license.</Text>
      </Collapsible>
    </View>
  )
}`,
},

'onboarding-screen': {
  name: 'Onboarding Screen',
  slug: 'onboarding-screen',
  description: 'Full-screen onboarding slide with an image or custom illustration, title/description, animated dot pagination, and Skip / Next / Get Started navigation controls — designed to be swapped per step in a PagerView or FlatList.',
  category: 'Layout',
  npmDeps: ['react-native-reanimated'],
  componentDeps: [],
  addCommand: 'npx native-mate add onboarding-screen',
  accessibility: [
    { feature: 'Role', detail: 'The root container sets accessibilityRole="summary" with a label like "Onboarding step 2 of 3: Themeable by default".' },
    { feature: 'Buttons', detail: 'Skip and Next/Finish both set accessibilityRole="button" with descriptive accessibilityLabel values.' },
  ],
  props: [
    { name: 'image', type: 'ImageSourcePropType | React.ReactNode', description: 'An Image source, or any custom illustration ReactNode rendered as-is.' },
    { name: 'title', type: 'string', description: 'Slide title (required).' },
    { name: 'description', type: 'string', description: 'Slide description text below the title.' },
    { name: 'backgroundColor', type: 'string', description: 'Background color override for the slide.' },
    { name: 'textColor', type: 'string', description: 'Title/description/skip text color override.' },
    { name: 'index', type: 'number', description: 'Current slide index (0-based), required for dots and last-slide detection.' },
    { name: 'total', type: 'number', description: 'Total number of slides.' },
    { name: 'onNext', type: '() => void', description: 'Called when Next is pressed (not on the last slide).' },
    { name: 'onSkip', type: '() => void', description: 'Called when Skip is pressed.' },
    { name: 'onFinish', type: '() => void', description: 'Called when the button is pressed on the last slide.' },
    { name: 'showSkip', type: 'boolean', default: 'true', description: 'Show the Skip button (hidden automatically on the last slide).' },
    { name: 'showDots', type: 'boolean', default: 'true', description: 'Show the animated dot pagination indicator.' },
    { name: 'nextLabel', type: 'string', default: '"Next"', description: 'Label for the primary button on non-final slides.' },
    { name: 'finishLabel', type: 'string', default: '"Get Started"', description: 'Label for the primary button on the final slide.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Enable haptic feedback on Next/Finish press.' },
    { name: 'style', type: 'StyleProp<ViewStyle>', description: 'Style override for the outer container.' },
  ],
  usageCode: `import { OnboardingScreen } from '~/components/ui/onboarding-screen'

const slides = [
  { title: 'Copy, not install', description: 'Component source lives in your project.' },
  { title: 'Themeable by default', description: 'Every component reads from your theme tokens.' },
  { title: 'Built for React Native', description: 'Native gestures and Reanimated animations baked in.' },
]

const [index, setIndex] = useState(0)

<OnboardingScreen
  image={require('../../assets/onboarding-1.png')}
  title={slides[index].title}
  description={slides[index].description}
  index={index}
  total={slides.length}
  onNext={() => setIndex((i) => Math.min(i + 1, slides.length - 1))}
  onSkip={() => setIndex(slides.length - 1)}
  onFinish={() => router.replace('/home')}
/>

// Last slide, no skip button
<OnboardingScreen
  image={<RocketIllustration />}
  title="You're all set"
  description="Start adding components to your project."
  index={2}
  total={3}
  showSkip={false}
  finishLabel="Get Started"
  onFinish={() => router.replace('/home')}
/>

// No dots, custom colors
<OnboardingScreen
  image={<MoonIllustration />}
  title="Dark by design"
  description="A carefully tuned dark theme out of the box."
  index={0}
  total={1}
  showDots={false}
  showSkip={false}
  backgroundColor="#0f0f11"
  textColor="#fafafa"
  nextLabel="Continue"
/>`,
  exampleCode: `import { useState, useRef } from 'react'
import { FlatList, View, Dimensions } from 'react-native'
import { OnboardingScreen } from '~/components/ui/onboarding-screen'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

const SLIDES = [
  { image: require('../../assets/step-1.png'), title: 'Copy, not install', description: 'Own every line of source.' },
  { image: require('../../assets/step-2.png'), title: 'Themeable by default', description: 'Reads your theme tokens automatically.' },
  { image: require('../../assets/step-3.png'), title: 'Built for React Native', description: 'Native gestures and animations included.' },
]

export function OnboardingFlow() {
  const router = useRouter()
  const listRef = useRef<FlatList>(null)
  const [index, setIndex] = useState(0)

  const goTo = (i: number) => {
    setIndex(i)
    listRef.current?.scrollToIndex({ index: i, animated: true })
  }

  return (
    <FlatList
      ref={listRef}
      data={SLIDES}
      horizontal
      pagingEnabled
      scrollEnabled={false}
      keyExtractor={(_, i) => String(i)}
      renderItem={({ item, index: i }) => (
        <View style={{ width }}>
          <OnboardingScreen
            image={item.image}
            title={item.title}
            description={item.description}
            index={i}
            total={SLIDES.length}
            onNext={() => goTo(Math.min(i + 1, SLIDES.length - 1))}
            onSkip={() => goTo(SLIDES.length - 1)}
            onFinish={() => router.replace('/home')}
          />
        </View>
      )}
    />
  )
}`,
},

'infinite-scroll': {
  name: 'Infinite Scroll',
  slug: 'infinite-scroll',
  description: 'FlatList wrapper that triggers onLoadMore both via a scroll-distance threshold and FlatList\'s onEndReached, with a built-in loading footer, end-of-list message, default empty state, and grid support via numColumns.',
  category: 'Layout',
  npmDeps: ['react-native-reanimated'],
  componentDeps: [],
  addCommand: 'npx native-mate add infinite-scroll',
  accessibility: [
    { feature: 'Role', detail: 'The underlying FlatList sets accessibilityRole="list".' },
  ],
  props: [
    { name: 'data', type: 'T[]', description: 'Array of items to render.' },
    { name: 'renderItem', type: '(info: { item: T; index: number }) => React.ReactNode', description: 'Render function for each item.' },
    { name: 'onLoadMore', type: '() => void | Promise<void>', description: 'Called when the user scrolls within threshold of the bottom, or FlatList reaches its end. Guarded against duplicate calls while loading.' },
    { name: 'hasMore', type: 'boolean', description: 'Whether more items are available to load.' },
    { name: 'loading', type: 'boolean', description: 'Whether a load-more request is currently in progress — shows the footer spinner.' },
    { name: 'keyExtractor', type: '(item: T, index: number) => string', description: 'Extracts a unique key per item. Defaults to the string index.' },
    { name: 'ListHeaderComponent', type: 'React.ReactNode', description: 'Rendered above the list content.' },
    { name: 'ListEmptyComponent', type: 'React.ReactNode', description: 'Rendered instead of the built-in "No items yet" state when data is empty and not loading.' },
    { name: 'ItemSeparatorComponent', type: 'React.ReactNode', description: 'Rendered between each item.' },
    { name: 'threshold', type: 'number', default: '200', description: 'Distance from the bottom (px) that triggers onLoadMore.' },
    { name: 'loadingIndicator', type: 'React.ReactNode', description: 'Custom footer content shown instead of the default spinner + "Loading more..." text.' },
    { name: 'endMessage', type: 'string', description: 'Message shown in the footer once hasMore becomes false.' },
    { name: 'haptic', type: 'boolean', default: 'false', description: 'Enable a light haptic tap when a load-more is triggered.' },
    { name: 'numColumns', type: 'number', default: '1', description: 'Number of columns for a grid layout.' },
    { name: 'style', type: 'StyleProp<ViewStyle>', description: 'Style override for the outer container.' },
    { name: 'contentContainerStyle', type: 'StyleProp<ViewStyle>', description: 'Style override for the FlatList content container.' },
  ],
  usageCode: `import { InfiniteScroll } from '~/components/ui/infinite-scroll'

const [data, setData] = useState(initialItems)
const [loading, setLoading] = useState(false)
const [hasMore, setHasMore] = useState(true)

const loadMore = () => {
  if (loading || !hasMore) return
  setLoading(true)
  fetchNextPage().then((page) => {
    setData((prev) => [...prev, ...page])
    setHasMore(page.length > 0)
    setLoading(false)
  })
}

// Basic list
<InfiniteScroll
  data={data}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <ListRow title={item.title} />}
  onLoadMore={loadMore}
  hasMore={hasMore}
  loading={loading}
  endMessage="You've reached the end"
/>

// Grid layout
<InfiniteScroll
  data={products}
  numColumns={2}
  renderItem={({ item }) => <ProductCard product={item} />}
  onLoadMore={loadMore}
  hasMore={hasMore}
  loading={loading}
/>

// Custom empty state
<InfiniteScroll
  data={[]}
  renderItem={({ item }) => <ListRow title={item.title} />}
  onLoadMore={loadMore}
  hasMore={false}
  loading={false}
  ListEmptyComponent={<EmptyState title="No results" />}
/>`,
  exampleCode: `import { useState, useCallback } from 'react'
import { InfiniteScroll } from '~/components/ui/infinite-scroll'
import { Card, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { View } from 'react-native'

interface Post { id: number; title: string; subtitle: string }

function fetchPage(page: number): Promise<Post[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(
      Array.from({ length: 10 }, (_, i) => ({
        id: page * 10 + i,
        title: \`Post #\${page * 10 + i + 1}\`,
        subtitle: 'Tap to read more',
      }))
    ), 800)
  )
}

export function FeedScreen() {
  const [data, setData] = useState<Post[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextPage = await fetchPage(page)
    setData((prev) => [...prev, ...nextPage])
    setPage((p) => p + 1)
    setHasMore(page < 4)
    setLoading(false)
  }, [loading, hasMore, page])

  return (
    <InfiniteScroll
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
          <Card variant="outline">
            <CardHeader title={item.title} subtitle={item.subtitle} />
          </Card>
        </View>
      )}
      ItemSeparatorComponent={<Separator />}
      onLoadMore={loadMore}
      hasMore={hasMore}
      loading={loading}
      endMessage="You've reached the end"
    />
  )
}`,
},

'pull-to-refresh': {
  name: 'Pull to Refresh',
  slug: 'pull-to-refresh',
  description: 'Custom pull-to-refresh wrapper built on PanResponder with a rubber-band pull gesture, animated progress-arc indicator that morphs into a spinner while refreshing, and haptic feedback at the trigger threshold.',
  category: 'Feedback',
  npmDeps: ['react-native-reanimated'],
  componentDeps: [],
  addCommand: 'npx native-mate add pull-to-refresh',
  props: [
    { name: 'onRefresh', type: '() => void | Promise<void>', description: 'Called once the user pulls past pullDistance.' },
    { name: 'refreshing', type: 'boolean', description: 'Whether a refresh is currently in progress — holds the indicator at 70% of pullDistance and spins it.' },
    { name: 'children', type: 'React.ReactNode', description: 'The scrollable content, rendered inside an internal ScrollView.' },
    { name: 'indicatorColor', type: 'string', description: 'Color of the pull indicator. Defaults to theme.colors.primary.' },
    { name: 'indicatorSize', type: 'number', default: '28', description: 'Diameter in dp of the progress arc / spinner.' },
    { name: 'pullDistance', type: 'number', default: '80', description: 'Distance in px the user must pull before onRefresh fires. Pulling further applies a rubber-band effect up to a 150px cap.' },
    { name: 'renderIndicator', type: '(info: { progress: number; refreshing: boolean }) => React.ReactNode', description: 'Custom indicator renderer, replacing the default progress-arc/spinner.' },
    { name: 'haptic', type: 'boolean', default: 'true', description: 'Trigger a medium haptic impact when the refresh threshold is crossed.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the pull gesture entirely.' },
    { name: 'style', type: 'StyleProp<ViewStyle>', description: 'Style override for the outer container.' },
  ],
  usageCode: `import { PullToRefresh } from '~/components/ui/pull-to-refresh'

const [refreshing, setRefreshing] = useState(false)

const onRefresh = async () => {
  setRefreshing(true)
  await fetchLatest()
  setRefreshing(false)
}

// Basic
<PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
  <View style={{ padding: 16 }}>
    <Text>Pull down from the top to refresh</Text>
  </View>
</PullToRefresh>

// Custom color and longer pull distance
<PullToRefresh
  onRefresh={onRefresh}
  refreshing={refreshing}
  indicatorColor="#10b981"
  pullDistance={100}
  indicatorSize={32}
>
  <FeedList />
</PullToRefresh>

// Disabled
<PullToRefresh onRefresh={onRefresh} refreshing={false} disabled>
  <StaticContent />
</PullToRefresh>

// Custom indicator renderer
<PullToRefresh
  onRefresh={onRefresh}
  refreshing={refreshing}
  renderIndicator={({ progress, refreshing }) => (
    <MyCustomSpinner progress={progress} spinning={refreshing} />
  )}
>
  <FeedList />
</PullToRefresh>`,
  exampleCode: `import { useState, useCallback } from 'react'
import { PullToRefresh } from '~/components/ui/pull-to-refresh'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

export function FeedScreen() {
  const [items, setItems] = useState(() => Array.from({ length: 8 }, (_, i) => \`Item #\${i + 1}\`))
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setItems((prev) => [\`New item at \${new Date().toLocaleTimeString()}\`, ...prev])
      setRefreshing(false)
    }, 1200)
  }, [])

  return (
    <PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
      <View style={{ padding: 16, gap: 12 }}>
        {items.map((item, i) => (
          <Text key={i}>{item}</Text>
        ))}
      </View>
    </PullToRefresh>
  )
}`,
},

tooltip: {
  name: 'Tooltip',
  slug: 'tooltip',
  description: 'Contextual tooltip shown on hover (web) or long-press (native), with an arrow, automatic edge-aware repositioning (flips top/bottom/left/right when there isn\'t enough space), fade + scale animation, rich ReactNode content, and controlled visibility.',
  category: 'Overlay',
  npmDeps: ['react-native-reanimated'],
  componentDeps: [],
  addCommand: 'npx native-mate add tooltip',
  accessibility: [
    { feature: 'Native hint', detail: 'On native platforms the trigger sets accessibilityRole="button" and accessibilityHint="Long press to show tooltip".' },
  ],
  props: [
    { name: 'content', type: 'string | React.ReactNode', description: 'Tooltip body — plain string gets default styling, or pass any custom node.' },
    { name: 'children', type: 'React.ReactElement', description: 'The single trigger element the tooltip is anchored to.' },
    { name: 'position', type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: 'Preferred placement. Auto-flips to the opposite side on native when there isn\'t enough room near a screen edge.' },
    { name: 'delay', type: 'number', default: '300 (web) / 500 (native)', description: 'Milliseconds before showing — hover delay on web, long-press delay on native.' },
    { name: 'visible', type: 'boolean', description: 'Controlled visibility — overrides internal open state when provided.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the tooltip opens or closes.' },
    { name: 'maxWidth', type: 'number', default: '220', description: 'Maximum width in dp of the tooltip bubble.' },
    { name: 'style', type: 'StyleProp<ViewStyle>', description: 'Style override applied to the trigger wrapper.' },
  ],
  usageCode: `import { Tooltip } from '~/components/ui/tooltip'

// Positions
<Tooltip content="Saves your progress automatically" position="top">
  <Button>Auto-save</Button>
</Tooltip>

<Tooltip content="Cannot undo this action" position="bottom">
  <Button variant="destructive">Delete</Button>
</Tooltip>

<Tooltip content="Copy to clipboard" position="right">
  <Button variant="outline">Copy</Button>
</Tooltip>

// Custom delay (web: hover ms, native: long-press ms)
<Tooltip content="Hold to reveal" delay={800} position="top">
  <Button variant="outline">Slow reveal</Button>
</Tooltip>

<Tooltip content="Appears instantly" delay={0} position="bottom">
  <Button>Instant</Button>
</Tooltip>

// Rich content + custom max width
<Tooltip
  position="top"
  maxWidth={260}
  content={
    <View>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Pro tip</Text>
      <Text style={{ color: '#fff', fontSize: 11, opacity: 0.85 }}>
        Long-press any row to reveal quick actions.
      </Text>
    </View>
  }
>
  <Button variant="outline">Info</Button>
</Tooltip>

// Controlled visibility
const [visible, setVisible] = useState(false)

<Tooltip content="I'm controlled from outside" position="top" visible={visible} onOpenChange={setVisible}>
  <Button onPress={() => setVisible((v) => !v)}>Toggle tooltip</Button>
</Tooltip>`,
  exampleCode: `import { Tooltip } from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function ToolbarWithHints() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 16 }}>
      <Tooltip content="Undo last change" position="bottom">
        <Button iconOnly variant="ghost" iconLeft={<Icon name="arrow-undo-outline" />} />
      </Tooltip>
      <Tooltip content="Redo" position="bottom">
        <Button iconOnly variant="ghost" iconLeft={<Icon name="arrow-redo-outline" />} />
      </Tooltip>
      <Tooltip content="Delete this document" position="bottom" delay={400}>
        <Button iconOnly variant="ghost" iconLeft={<Icon name="trash-outline" color="destructive" />} />
      </Tooltip>
    </View>
  )
}`,
},
}

// Generate static params for known components
export function generateStaticParams() {
  return [
    { slug: 'button' },
    { slug: 'card' },
    { slug: 'input' },
    { slug: 'badge' },
    { slug: 'sheet' },
    { slug: 'accordion' },
    { slug: 'tabs' },
    { slug: 'avatar' },
    { slug: 'checkbox' },
    { slug: 'switch' },
    { slug: 'slider' },
    { slug: 'select' },
    { slug: 'textarea' },
    { slug: 'progress' },
    { slug: 'skeleton' },
    { slug: 'toast' },
    { slug: 'dialog' },
    { slug: 'radio' },
    { slug: 'otp-input' },
    { slug: 'action-sheet' },
    { slug: 'tag' },
    { slug: 'empty-state' },
    { slug: 'alert' },
    { slug: 'screen' },
      { slug: 'cart-item' },
    { slug: 'payment-card' },
    { slug: 'pricing-card' },
    { slug: 'product-card' },
    { slug: 'quantity-stepper' },
    { slug: 'review-card' },
    { slug: 'stat-card' },
    { slug: 'countdown' },
    { slug: 'notification-card' },
    { slug: 'chip' },
    { slug: 'color-picker' },
    { slug: 'date-picker' },
    { slug: 'mention-input' },
    { slug: 'phone-input' },
    { slug: 'pin-lock' },
    { slug: 'rating' },
    { slug: 'search-bar' },
    { slug: 'segmented-control' },
    { slug: 'social-login-button' },
    { slug: 'toggle-group' },
    { slug: 'stepper' },
    { slug: 'file-upload' },
    { slug: 'draggable-list' },
    { slug: 'swipeable-row' },
    { slug: 'fab' },
    { slug: 'speed-dial' },
    { slug: 'audio-player' },
    { slug: 'banner' },
    { slug: 'carousel' },
    { slug: 'chat-bubble' },
    { slug: 'comment' },
    { slug: 'data-table' },
    { slug: 'image' },
    { slug: 'list-item' },
    { slug: 'markdown' },
    { slug: 'timeline' },
    { slug: 'video-player' },
    { slug: 'reaction-bar' },
    { slug: 'divider-label' },
    { slug: 'biometric-prompt' },
    { slug: 'bottom-sheet-list' },
    { slug: 'dropdown-menu' },
    { slug: 'popover' },
    { slug: 'bottom-bar' },
    { slug: 'breadcrumb' },
    { slug: 'header' },
    { slug: 'collapsible' },
    { slug: 'onboarding-screen' },
    { slug: 'infinite-scroll' },
    { slug: 'pull-to-refresh' },
    { slug: 'tooltip' },
  ]
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = COMPONENT_DOCS[slug]
  if (!doc) notFound()

  const currentIdx = ALL_COMPONENT_SLUGS.indexOf(slug)
  const prevSlug = currentIdx > 0 ? ALL_COMPONENT_SLUGS[currentIdx - 1] : null
  const nextSlug = currentIdx < ALL_COMPONENT_SLUGS.length - 1 ? ALL_COMPONENT_SLUGS[currentIdx + 1] : null
  const prevDoc = prevSlug ? COMPONENT_DOCS[prevSlug] : null
  const nextDoc = nextSlug ? COMPONENT_DOCS[nextSlug] : null
  const githubUrl = `${GITHUB_BASE_URL}/tree/main/packages/registry/components/${slug}`

  const tocItems = [
    { id: 'installation', label: 'Installation' },
    { id: 'examples', label: 'Examples' },
    { id: 'usage', label: 'Usage' },
    { id: 'props', label: 'Props' },
    ...(doc.exampleCode ? [{ id: 'example', label: 'Example' }] : []),
    ...(doc.accessibility?.length ? [{ id: 'accessibility', label: 'Accessibility' }] : []),
  ]

  return (
    <>
      {/* Main content */}
      <main className="min-w-0 flex-1 px-4 sm:px-6 py-8 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-3xl">

            {/* Header bar */}
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{doc.name}</h1>
                  <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">{doc.category}</span>
                </div>
                <p className="text-sm text-zinc-400">{doc.description}</p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-shrink-0 items-center gap-1.5">
                <CopyPageButton
                  componentName={doc.name}
                  slug={slug}
                  description={doc.description}
                  installCommand={doc.addCommand}
                  usageCode={doc.usageCode}
                />
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                {prevDoc && (
                  <Link
                    href={`/components/${prevSlug}`}
                    title={`Previous: ${prevDoc.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-800/80 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                )}
                {nextDoc && (
                  <Link
                    href={`/components/${nextSlug}`}
                    title={`Next: ${nextDoc.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-800/80 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            {/* Install */}
            <section id="installation" className="mb-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Installation</h2>
              <CodeBlock language="bash" code={doc.addCommand} />
              {(doc.npmDeps.length > 0 || doc.componentDeps.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                  {doc.npmDeps.length > 0 && <span>npm deps: {doc.npmDeps.join(', ')}</span>}
                  {doc.componentDeps.length > 0 && <span>component deps: {doc.componentDeps.join(', ')}</span>}
                </div>
              )}
            </section>

            {/* Examples preview */}
            <section id="examples" className="mb-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Examples</h2>
              <ThemeCustomizerProvider>
                <ThemeCustomizerPanel />
                <ComponentPreview slug={doc.slug} />
              </ThemeCustomizerProvider>
            </section>

            {/* Usage */}
            <section id="usage" className="mb-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Usage</h2>
              <CodeBlock language="tsx" code={doc.usageCode} />
            </section>

            {/* Props */}
            <section id="props" className="mb-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Props</h2>
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <table className="w-full text-sm">
                  <thead className="border-b border-zinc-800 bg-zinc-900">
                    <tr>
                      {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {doc.props.map((prop, i) => (
                      <tr key={prop.name} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                        <td className="px-4 py-3 font-mono text-xs text-blue-400">{prop.name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-amber-400">{prop.type}</td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{prop.default ?? '—'}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400">{prop.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Example code */}
            {doc.exampleCode && (
              <section id="example" className="mb-10">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Example</h2>
                <CodeBlock language="tsx" code={doc.exampleCode} />
              </section>
            )}

            {/* Accessibility */}
            {doc.accessibility && doc.accessibility.length > 0 && (
              <section id="accessibility" className="mb-10">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Accessibility</h2>
                <div className="overflow-hidden rounded-xl border border-zinc-800">
                  <table className="w-full text-sm">
                    <thead className="border-b border-zinc-800 bg-zinc-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Feature</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doc.accessibility.map((item, i) => (
                        <tr key={item.feature} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                          <td className="px-4 py-3 font-mono text-xs text-blue-400">{item.feature}</td>
                          <td className="px-4 py-3 text-xs text-zinc-400">{item.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Prev / Next navigation */}
            <div className="mt-12 flex items-center justify-between border-t border-zinc-800 pt-8">
              {prevDoc ? (
                <Link
                  href={`/components/${prevSlug}`}
                  className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="text-xs text-zinc-600">Previous</div>
                    <div>{prevDoc.name}</div>
                  </div>
                </Link>
              ) : <div />}
              {nextDoc ? (
                <Link
                  href={`/components/${nextSlug}`}
                  className="flex items-center gap-2 text-right text-sm text-zinc-400 transition-colors hover:text-zinc-200"
                >
                  <div>
                    <div className="text-xs text-zinc-600">Next</div>
                    <div>{nextDoc.name}</div>
                  </div>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : <div />}
            </div>

          </div>
      </main>

      {/* Right sidebar — table of contents */}
      <TableOfContents items={tocItems} />
    </>
  )
}
