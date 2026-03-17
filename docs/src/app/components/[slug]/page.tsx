import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { CodeBlock } from '@/components/CodeBlock'
import Link from 'next/link'

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
  exampleCode: string
}

const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  button: {
    name: 'Button',
    slug: 'button',
    description: 'Feature-rich button with 6 variants, icon-only mode, button groups, rounded pill shape, custom colors, haptic feedback, and spring animation.',
    category: 'Primitives',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add button',
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
    description: 'A surface container with optional header, content, and footer slots. Supports shadows via the platform utility.',
    category: 'Layout',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add card',
    props: [
      { name: 'children', type: 'React.ReactNode', description: 'Card content. Use CardHeader, CardContent, CardFooter sub-components.' },
      { name: 'style', type: 'ViewStyle', description: 'Additional styles for the card container.' },
    ],
    usageCode: `import { Card, CardHeader, CardContent, CardFooter } from '~/components/ui/card'
import { Text } from '@native-mate/core'

<Card>
  <CardHeader>
    <Text weight="semibold" size="lg">Card Title</Text>
    <Text color="muted">Card subtitle</Text>
  </CardHeader>
  <CardContent>
    <Text>Your content here.</Text>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>`,
    exampleCode: `import { Card, CardHeader, CardContent, CardFooter } from '~/components/ui/card'

export function CardExample() {
  return (
    <Card style={{ margin: 16 }}>
      <CardHeader>
        <Text weight="semibold" size="lg">Invitation</Text>
        <Text color="muted">You have been invited to join Acme Corp</Text>
      </CardHeader>
      <CardContent>
        <Text>Accept the invitation to start collaborating with your team.</Text>
      </CardContent>
      <CardFooter>
        <Button variant="outline" style={{ flex: 1 }}>Decline</Button>
        <Button style={{ flex: 1 }}>Accept</Button>
      </CardFooter>
    </Card>
  )
}`,
  },
  input: {
    name: 'Input',
    slug: 'input',
    description: 'A text input with label, error message, prefix/suffix slots, and animated focus ring.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add input',
    props: [
      { name: 'label', type: 'string', description: 'Label shown above the input.' },
      { name: 'error', type: 'string', description: 'Error message shown below. Turns border red.' },
      { name: 'hint', type: 'string', description: 'Helper text shown below the input.' },
      { name: 'prefix', type: 'React.ReactNode', description: 'Element rendered before the text field.' },
      { name: 'suffix', type: 'React.ReactNode', description: 'Element rendered after the text field.' },
      { name: '...TextInputProps', type: 'TextInputProps', description: 'All standard RN TextInput props are forwarded.' },
    ],
    usageCode: `import { Input } from '~/components/ui/input'

// Basic
<Input label="Email" placeholder="you@example.com" />

// With error
<Input
  label="Password"
  secureTextEntry
  error="Password must be at least 8 characters"
/>

// With hint
<Input
  label="Username"
  hint="Only letters, numbers, and underscores"
  autoCapitalize="none"
/>`,
    exampleCode: `import { Input } from '~/components/ui/input'
import { View } from 'react-native'

export function InputExamples() {
  return (
    <View style={{ gap: 16, padding: 16 }}>
      <Input label="Email" placeholder="you@example.com" keyboardType="email-address" />
      <Input label="Password" secureTextEntry placeholder="••••••••" />
      <Input label="Bio" hint="Up to 160 characters" multiline />
      <Input label="Username" error="This username is taken" />
    </View>
  )
}`,
  },
  badge: {
    name: 'Badge',
    slug: 'badge',
    description: 'A compact inline label with semantic variants and an optional dot indicator.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add badge',
    props: [
      { name: 'variant', type: '"default" | "secondary" | "outline" | "success" | "destructive"', default: '"default"', description: 'Visual variant.' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Shows a coloured dot before the label.' },
      { name: 'children', type: 'string', description: 'Badge label text.' },
    ],
    usageCode: `import { Badge } from '~/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success" dot>Active</Badge>
<Badge variant="destructive">Error</Badge>`,
    exampleCode: `import { Badge } from '~/components/ui/badge'
import { View } from 'react-native'

export function BadgeExamples() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success" dot>Active</Badge>
      <Badge variant="destructive" dot>Failed</Badge>
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
    description: 'Displays a user image with an initials fallback. Supports multiple size presets and an optional status indicator dot.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add avatar',
    props: [
      { name: 'src', type: 'string', description: 'URI of the avatar image.' },
      { name: 'name', type: 'string', description: 'Full name used to generate initials when no image is available.' },
      { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Controls the width, height, and font size.' },
      { name: 'status', type: '"online" | "offline" | "busy" | "away"', description: 'Shows a coloured dot in the bottom-right corner.' },
      { name: 'style', type: 'ViewStyle', description: 'Additional styles for the avatar container.' },
    ],
    usageCode: `import { Avatar } from '~/components/ui/avatar'

// Image avatar
<Avatar src="https://example.com/alice.jpg" name="Alice Smith" size="md" />

// Initials fallback
<Avatar name="Bob Jones" size="lg" />

// With status dot
<Avatar src="https://example.com/carol.jpg" name="Carol" status="online" />`,
    exampleCode: `import { Avatar } from '~/components/ui/avatar'
import { View } from 'react-native'

export function AvatarExamples() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 16, alignItems: 'center' }}>
      <Avatar size="xs" name="XS" />
      <Avatar size="sm" name="Small" />
      <Avatar size="md" name="Medium" status="online" />
      <Avatar size="lg" src="https://i.pravatar.cc/150?img=5" name="Large" status="busy" />
      <Avatar size="xl" name="Extra" status="offline" />
    </View>
  )
}`,
  },
  checkbox: {
    name: 'Checkbox',
    slug: 'checkbox',
    description: 'An animated checkbox with a label, indeterminate state, and spring-driven check mark animation.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add checkbox',
    props: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the checkbox is checked.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the user toggles the checkbox.' },
      { name: 'label', type: 'string', description: 'Text label rendered beside the checkbox.' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows a dash instead of a tick — useful for "select all" states.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and reduces opacity.' },
    ],
    usageCode: `import { Checkbox } from '~/components/ui/checkbox'
import { useState } from 'react'

const [accepted, setAccepted] = useState(false)

<Checkbox
  label="I agree to the terms and conditions"
  checked={accepted}
  onCheckedChange={setAccepted}
/>

// Indeterminate (e.g. select-all row)
<Checkbox label="Select all" indeterminate checked={false} onCheckedChange={handleSelectAll} />`,
    exampleCode: `import { useState } from 'react'
import { Checkbox } from '~/components/ui/checkbox'
import { View } from 'react-native'

export function CheckboxExample() {
  const [items, setItems] = useState([
    { id: 1, label: 'Milk', checked: false },
    { id: 2, label: 'Eggs', checked: true },
    { id: 3, label: 'Bread', checked: false },
  ])

  const toggle = (id: number) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))

  return (
    <View style={{ gap: 12, padding: 16 }}>
      {items.map(item => (
        <Checkbox key={item.id} label={item.label} checked={item.checked} onCheckedChange={() => toggle(item.id)} />
      ))}
    </View>
  )
}`,
  },
  switch: {
    name: 'Switch',
    slug: 'switch',
    description: 'A toggle switch that animates the thumb between on and off positions using a spring animation.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add switch',
    props: [
      { name: 'value', type: 'boolean', default: 'false', description: 'The current on/off state of the switch.' },
      { name: 'onValueChange', type: '(value: boolean) => void', description: 'Callback fired when the user toggles the switch.' },
      { name: 'label', type: 'string', description: 'Optional text label rendered beside the switch.' },
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
  slider: {
    name: 'Slider',
    slug: 'slider',
    description: 'A range slider with a draggable thumb. Supports min, max, step, and controlled value with a smooth Reanimated gesture.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add slider',
    props: [
      { name: 'value', type: 'number', description: 'Controlled current value.' },
      { name: 'onValueChange', type: '(value: number) => void', description: 'Called continuously as the thumb is dragged.' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum value of the range.' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value of the range.' },
      { name: 'step', type: 'number', default: '1', description: 'Snap increment between selectable values.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents dragging and reduces opacity.' },
    ],
    usageCode: `import { Slider } from '~/components/ui/slider'
import { useState } from 'react'

const [volume, setVolume] = useState(50)

<Slider
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
  step={5}
/>`,
    exampleCode: `import { useState } from 'react'
import { Slider } from '~/components/ui/slider'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

export function SliderExample() {
  const [brightness, setBrightness] = useState(70)
  const [fontSize, setFontSize] = useState(16)

  return (
    <View style={{ gap: 24, padding: 16 }}>
      <View style={{ gap: 8 }}>
        <Text weight="medium">Brightness: {brightness}%</Text>
        <Slider value={brightness} onValueChange={setBrightness} min={0} max={100} />
      </View>
      <View style={{ gap: 8 }}>
        <Text weight="medium">Font size: {fontSize}px</Text>
        <Slider value={fontSize} onValueChange={setFontSize} min={12} max={24} step={2} />
      </View>
    </View>
  )
}`,
  },
  select: {
    name: 'Select',
    slug: 'select',
    description: 'A bottom-sheet select picker with optional search filtering. Opens a Sheet containing a scrollable option list.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: ['sheet'],
    addCommand: 'npx native-mate add select',
    props: [
      { name: 'options', type: 'Array<{ label: string; value: string }>', description: 'List of selectable options.' },
      { name: 'value', type: 'string', description: 'Currently selected value.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the user picks an option.' },
      { name: 'placeholder', type: 'string', default: '"Select…"', description: 'Placeholder text shown when no value is selected.' },
      { name: 'searchable', type: 'boolean', default: 'false', description: 'Adds a search input at the top of the picker sheet.' },
      { name: 'label', type: 'string', description: 'Label rendered above the trigger.' },
    ],
    usageCode: `import { Select } from '~/components/ui/select'
import { useState } from 'react'

const [country, setCountry] = useState('')

const options = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'gb' },
  { label: 'Canada', value: 'ca' },
]

<Select
  label="Country"
  options={options}
  value={country}
  onValueChange={setCountry}
  searchable
  placeholder="Pick a country"
/>`,
    exampleCode: `import { useState } from 'react'
import { Select } from '~/components/ui/select'
import { View } from 'react-native'

const CURRENCIES = [
  { label: 'US Dollar (USD)', value: 'usd' },
  { label: 'Euro (EUR)', value: 'eur' },
  { label: 'British Pound (GBP)', value: 'gbp' },
  { label: 'Japanese Yen (JPY)', value: 'jpy' },
  { label: 'Indian Rupee (INR)', value: 'inr' },
]

export function SelectExample() {
  const [currency, setCurrency] = useState('')

  return (
    <View style={{ padding: 16 }}>
      <Select
        label="Currency"
        options={CURRENCIES}
        value={currency}
        onValueChange={setCurrency}
        searchable
        placeholder="Select currency"
      />
    </View>
  )
}`,
  },
  textarea: {
    name: 'Textarea',
    slug: 'textarea',
    description: 'A multi-line text input that grows automatically with its content up to a configurable maximum height.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add textarea',
    props: [
      { name: 'label', type: 'string', description: 'Label rendered above the textarea.' },
      { name: 'error', type: 'string', description: 'Error message rendered below. Turns the border red.' },
      { name: 'hint', type: 'string', description: 'Helper text shown below the textarea.' },
      { name: 'minRows', type: 'number', default: '3', description: 'Minimum number of visible rows.' },
      { name: 'maxRows', type: 'number', default: '8', description: 'Maximum rows before the textarea scrolls internally.' },
      { name: '...TextInputProps', type: 'TextInputProps', description: 'All standard RN TextInput props are forwarded.' },
    ],
    usageCode: `import { Textarea } from '~/components/ui/textarea'
import { useState } from 'react'

const [bio, setBio] = useState('')

<Textarea
  label="Bio"
  placeholder="Tell us about yourself…"
  value={bio}
  onChangeText={setBio}
  hint="Up to 300 characters"
  maxRows={6}
/>`,
    exampleCode: `import { useState } from 'react'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function TextareaExample() {
  const [message, setMessage] = useState('')

  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Textarea
        label="Message"
        placeholder="Write your message here…"
        value={message}
        onChangeText={setMessage}
        minRows={4}
        maxRows={10}
        hint={\`\${message.length} / 500\`}
      />
      <Button disabled={message.trim().length === 0}>Send</Button>
    </View>
  )
}`,
  },
  progress: {
    name: 'Progress',
    slug: 'progress',
    description: 'A progress indicator available in linear (bar) and circular (ring) variants. Animates smoothly when the value changes.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add progress',
    props: [
      { name: 'value', type: 'number', description: 'Current progress value between 0 and 100.' },
      { name: 'variant', type: '"linear" | "circular"', default: '"linear"', description: 'Display style — a bar or a ring.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Controls track thickness and (for circular) diameter.' },
      { name: 'showLabel', type: 'boolean', default: 'false', description: 'Renders the percentage value inside the circular variant.' },
      { name: 'color', type: 'string', description: 'Custom fill colour. Defaults to the theme primary.' },
    ],
    usageCode: `import { Progress } from '~/components/ui/progress'

// Linear bar
<Progress value={65} />

// Circular ring with label
<Progress variant="circular" value={42} showLabel size="lg" />

// Custom colour
<Progress value={80} color="#22c55e" />`,
    exampleCode: `import { Progress } from '~/components/ui/progress'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

export function ProgressExample() {
  return (
    <View style={{ gap: 20, padding: 16 }}>
      <View style={{ gap: 6 }}>
        <Text size="sm" color="muted">Upload progress</Text>
        <Progress value={72} />
      </View>
      <View style={{ gap: 6 }}>
        <Text size="sm" color="muted">Profile completion</Text>
        <Progress value={45} size="sm" color="#f59e0b" />
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Progress variant="circular" value={72} showLabel size="lg" />
        <Progress variant="circular" value={45} showLabel size="md" color="#f59e0b" />
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
    description: 'An auto-dismissing notification that slides in from the top or bottom of the screen. Supports multiple variants and a manual dismiss action.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add toast',
    props: [
      { name: 'message', type: 'string', description: 'The notification message text.' },
      { name: 'variant', type: '"default" | "success" | "error" | "warning"', default: '"default"', description: 'Sets the icon and colour scheme.' },
      { name: 'duration', type: 'number', default: '3000', description: 'Time in milliseconds before the toast auto-dismisses.' },
      { name: 'position', type: '"top" | "bottom"', default: '"bottom"', description: 'Edge of the screen where the toast appears.' },
      { name: 'onDismiss', type: '() => void', description: 'Called when the toast is dismissed (auto or manual).' },
    ],
    usageCode: `import { useToast } from '~/components/ui/toast'

const { show } = useToast()

// Basic
show({ message: 'Saved successfully' })

// Variants
show({ message: 'Profile updated', variant: 'success' })
show({ message: 'Failed to connect', variant: 'error', duration: 5000 })
show({ message: 'Low storage space', variant: 'warning', position: 'top' })`,
    exampleCode: `import { useToast } from '~/components/ui/toast'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function ToastExample() {
  const { show } = useToast()

  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Button onPress={() => show({ message: 'Changes saved', variant: 'success' })}>
        Success toast
      </Button>
      <Button variant="destructive" onPress={() => show({ message: 'Action failed', variant: 'error' })}>
        Error toast
      </Button>
      <Button variant="outline" onPress={() => show({ message: 'Update available', variant: 'warning', position: 'top' })}>
        Warning toast (top)
      </Button>
    </View>
  )
}`,
  },
  dialog: {
    name: 'Dialog',
    slug: 'dialog',
    description: 'A modal dialog with title, description, and action buttons. Internally maps to the modal component with a centred card presentation.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add dialog',
    props: [
      { name: 'isOpen', type: 'boolean', description: 'Controls dialog visibility.' },
      { name: 'onClose', type: '() => void', description: 'Called when the backdrop is tapped or the dialog is dismissed.' },
      { name: 'title', type: 'string', description: 'Bold heading at the top of the dialog.' },
      { name: 'description', type: 'string', description: 'Secondary text below the title.' },
      { name: 'children', type: 'React.ReactNode', description: 'Custom content rendered in the dialog body.' },
    ],
    usageCode: `import { Dialog } from '~/components/ui/dialog'
import { useState } from 'react'

const [open, setOpen] = useState(false)

<Dialog
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Delete account"
  description="This action cannot be undone. All your data will be permanently removed."
>
  <Button variant="destructive" onPress={handleDelete}>Delete</Button>
  <Button variant="outline" onPress={() => setOpen(false)}>Cancel</Button>
</Dialog>`,
    exampleCode: `import { useState } from 'react'
import { Dialog } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function DialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <View style={{ padding: 16 }}>
      <Button variant="destructive" onPress={() => setOpen(true)}>Delete account</Button>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Are you sure?"
        description="This will permanently delete your account and all associated data."
      >
        <View style={{ gap: 8, marginTop: 8 }}>
          <Button variant="destructive" onPress={() => setOpen(false)}>Yes, delete</Button>
          <Button variant="outline" onPress={() => setOpen(false)}>Cancel</Button>
        </View>
      </Dialog>
    </View>
  )
}`,
  },
  radio: {
    name: 'Radio',
    slug: 'radio',
    description: 'A radio group that renders a list of mutually exclusive options. Selection is indicated by an animated filled circle.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add radio',
    props: [
      { name: 'options', type: 'Array<{ label: string; value: string; description?: string }>', description: 'Array of radio option definitions.' },
      { name: 'value', type: 'string', description: 'Currently selected value.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the user selects a different option.' },
      { name: 'label', type: 'string', description: 'Group label rendered above the options.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire group.' },
    ],
    usageCode: `import { Radio } from '~/components/ui/radio'
import { useState } from 'react'

const [plan, setPlan] = useState('free')

const options = [
  { label: 'Free', value: 'free', description: 'Up to 3 projects' },
  { label: 'Pro', value: 'pro', description: 'Unlimited projects' },
  { label: 'Team', value: 'team', description: 'Collaboration features' },
]

<Radio label="Plan" options={options} value={plan} onValueChange={setPlan} />`,
    exampleCode: `import { useState } from 'react'
import { Radio } from '~/components/ui/radio'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

const SHIPPING = [
  { label: 'Standard', value: 'standard', description: '5–7 business days — free' },
  { label: 'Express', value: 'express', description: '2–3 business days — $9.99' },
  { label: 'Overnight', value: 'overnight', description: 'Next business day — $24.99' },
]

export function RadioExample() {
  const [shipping, setShipping] = useState('standard')

  return (
    <View style={{ gap: 16, padding: 16 }}>
      <Radio label="Shipping method" options={SHIPPING} value={shipping} onValueChange={setShipping} />
      <Button>Continue to payment</Button>
    </View>
  )
}`,
  },
  'otp-input': {
    name: 'OTP Input',
    slug: 'otp-input',
    description: 'A 4–6 digit one-time password input with individual cells, auto-advance on entry, and auto-submit when complete.',
    category: 'Forms',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add otp-input',
    props: [
      { name: 'length', type: 'number', default: '6', description: 'Number of OTP digit cells (4 or 6 recommended).' },
      { name: 'value', type: 'string', description: 'Controlled OTP string value.' },
      { name: 'onChangeText', type: '(value: string) => void', description: 'Called with the concatenated digit string on each change.' },
      { name: 'onComplete', type: '(value: string) => void', description: 'Called once all cells are filled.' },
      { name: 'autoFocus', type: 'boolean', default: 'true', description: 'Automatically focuses the first cell on mount.' },
      { name: 'error', type: 'string', description: 'Error message shown below the cells.' },
    ],
    usageCode: `import { OtpInput } from '~/components/ui/otp-input'
import { useState } from 'react'

const [code, setCode] = useState('')

<OtpInput
  length={6}
  value={code}
  onChangeText={setCode}
  onComplete={(val) => verifyCode(val)}
/>

// 4-digit PIN
<OtpInput length={4} onComplete={handlePin} />`,
    exampleCode: `import { useState } from 'react'
import { OtpInput } from '~/components/ui/otp-input'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

export function OtpInputExample() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')

  const handleComplete = async (val: string) => {
    setStatus('verifying')
    const ok = await verifyCode(val)
    setStatus(ok ? 'success' : 'error')
  }

  return (
    <View style={{ gap: 16, padding: 24, alignItems: 'center' }}>
      <Text size="lg" weight="semibold">Enter verification code</Text>
      <Text color="muted">We sent a 6-digit code to your email</Text>
      <OtpInput
        length={6}
        value={code}
        onChangeText={setCode}
        onComplete={handleComplete}
        error={status === 'error' ? 'Incorrect code. Try again.' : undefined}
      />
    </View>
  )
}`,
  },
  'action-sheet': {
    name: 'Action Sheet',
    slug: 'action-sheet',
    description: 'A bottom action sheet that presents a list of actions. Supports a destructive action, a cancel button, and an optional title.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add action-sheet',
    props: [
      { name: 'isOpen', type: 'boolean', description: 'Controls visibility of the action sheet.' },
      { name: 'onClose', type: '() => void', description: 'Called when the sheet is dismissed.' },
      { name: 'actions', type: 'Array<{ label: string; onPress: () => void; destructive?: boolean; disabled?: boolean }>', description: 'List of action items to display.' },
      { name: 'title', type: 'string', description: 'Optional descriptive title shown at the top of the sheet.' },
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
  tooltip: {
    name: 'Tooltip',
    slug: 'tooltip',
    description: 'A contextual bubble that appears near a trigger element after a long-press or focus. Supports four placement positions.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add tooltip',
    props: [
      { name: 'content', type: 'string', description: 'Text content shown inside the tooltip bubble.' },
      { name: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: 'Preferred side relative to the trigger.' },
      { name: 'children', type: 'React.ReactElement', description: 'The trigger element that activates the tooltip.' },
      { name: 'delay', type: 'number', default: '300', description: 'Milliseconds before the tooltip appears after activation.' },
    ],
    usageCode: `import { Tooltip } from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'

// Above the trigger
<Tooltip content="This action cannot be undone" placement="top">
  <Button variant="destructive">Delete</Button>
</Tooltip>

// Below an icon
<Tooltip content="Open settings" placement="bottom">
  <IconButton icon={<SettingsIcon />} />
</Tooltip>`,
    exampleCode: `import { Tooltip } from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'

export function TooltipExample() {
  return (
    <View style={{ gap: 32, padding: 40, alignItems: 'center' }}>
      <Tooltip content="Saves your progress automatically" placement="top">
        <Button>Auto-save</Button>
      </Tooltip>
      <Tooltip content="Cannot undo this action" placement="bottom">
        <Button variant="destructive">Delete all</Button>
      </Tooltip>
      <Tooltip content="Copy to clipboard" placement="right">
        <Button variant="outline">Copy</Button>
      </Tooltip>
    </View>
  )
}`,
  },
  tag: {
    name: 'Tag',
    slug: 'tag',
    description: 'A dismissible label chip for displaying categories, filters, or selected items. Renders an optional remove button.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add tag',
    props: [
      { name: 'label', type: 'string', description: 'Text content of the tag.' },
      { name: 'onRemove', type: '() => void', description: 'When provided, shows an × button that calls this handler.' },
      { name: 'variant', type: '"default" | "outline" | "solid"', default: '"default"', description: 'Visual style of the tag.' },
      { name: 'color', type: 'string', description: 'Custom background colour. Overrides the variant colour.' },
      { name: 'size', type: '"sm" | "md"', default: '"md"', description: 'Controls padding and font size.' },
    ],
    usageCode: `import { Tag } from '~/components/ui/tag'

// Static tag
<Tag label="React Native" />

// Dismissible tag
<Tag label="TypeScript" onRemove={() => removeTag('typescript')} />

// Coloured tag
<Tag label="Design" color="#8b5cf6" onRemove={handleRemove} />`,
    exampleCode: `import { useState } from 'react'
import { Tag } from '~/components/ui/tag'
import { View } from 'react-native'

const INITIAL_TAGS = ['React Native', 'TypeScript', 'Expo', 'Reanimated', 'Design System']

export function TagExample() {
  const [tags, setTags] = useState(INITIAL_TAGS)

  const remove = (tag: string) => setTags(prev => prev.filter(t => t !== tag))

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      {tags.map(tag => (
        <Tag key={tag} label={tag} onRemove={() => remove(tag)} />
      ))}
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
    description: 'An inline alert banner for displaying contextual feedback. Supports informational, success, warning, and error variants.',
    category: 'Display',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add alert',
    props: [
      { name: 'variant', type: '"info" | "success" | "warning" | "error"', default: '"info"', description: 'Determines the icon and colour scheme.' },
      { name: 'title', type: 'string', description: 'Bold heading of the alert.' },
      { name: 'description', type: 'string', description: 'Secondary message text below the title.' },
      { name: 'onClose', type: '() => void', description: 'When provided, renders a dismiss button.' },
    ],
    usageCode: `import { Alert } from '~/components/ui/alert'

// Info (default)
<Alert title="Scheduled maintenance" description="The service will be unavailable on Sunday at 2 AM UTC." />

// Success
<Alert variant="success" title="Payment received" description="Your invoice has been paid." />

// Warning
<Alert variant="warning" title="Trial ending soon" description="Your trial expires in 3 days." onClose={handleClose} />

// Error
<Alert variant="error" title="Upload failed" description="The file size exceeds the 10 MB limit." />`,
    exampleCode: `import { Alert } from '~/components/ui/alert'
import { View } from 'react-native'

export function AlertExamples() {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Alert variant="info" title="New version available" description="Update to v2.4 for the latest features." />
      <Alert variant="success" title="Account verified" description="Your email address has been confirmed." />
      <Alert variant="warning" title="Low disk space" description="You have less than 500 MB remaining." onClose={() => {}} />
      <Alert variant="error" title="Sync failed" description="Check your internet connection and try again." />
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
    { slug: 'tooltip' },
    { slug: 'tag' },
    { slug: 'empty-state' },
    { slug: 'alert' },
    { slug: 'screen' },
  ]
}

export default function ComponentPage({ params }: { params: { slug: string } }) {
  const doc = COMPONENT_DOCS[params.slug]
  if (!doc) notFound()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/components" className="hover:text-zinc-300">Components</Link>
          <span>/</span>
          <span className="text-zinc-300">{doc.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">{doc.name}</h1>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
              {doc.category}
            </span>
          </div>
          <p className="text-zinc-400">{doc.description}</p>
        </div>

        {/* Install */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Installation</h2>
          <CodeBlock language="bash" code={doc.addCommand} />
          {(doc.npmDeps.length > 0 || doc.componentDeps.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
              {doc.npmDeps.length > 0 && <span>npm deps: {doc.npmDeps.join(', ')}</span>}
              {doc.componentDeps.length > 0 && <span>component deps: {doc.componentDeps.join(', ')}</span>}
            </div>
          )}
        </section>

        {/* Usage */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Usage</h2>
          <CodeBlock language="tsx" code={doc.usageCode} />
        </section>

        {/* Props */}
        <section className="mb-10">
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

        {/* Example */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Example</h2>
          <CodeBlock language="tsx" code={doc.exampleCode} />
        </section>
      </main>
    </div>
  )
}
