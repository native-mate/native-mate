import React from 'react'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { CodeBlock } from '@/components/CodeBlock'
import Link from 'next/link'
import { ComponentPreview } from './ComponentPreview'

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
  accessibility?: Array<{ feature: string; detail: string }>
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
    description: 'Surface container with CardHeader, CardContent, CardFooter sub-components, built-in loading skeleton, cover image, 3 variants (elevated/outline/flat), and pressable mode.',
    category: 'Layout',
    npmDeps: [],
    componentDeps: ['skeleton'],
    addCommand: 'npx native-mate add card',
    props: [
      { name: 'variant', type: '"elevated" | "outline" | "flat"', default: '"elevated"', description: 'Card surface style. Elevated has a shadow, outline has a border, flat is minimal.' },
      { name: 'padding', type: '"none" | "sm" | "md" | "lg"', default: '"none"', description: 'Padding applied to the card container. Set to "none" when using CardHeader/CardContent/CardFooter.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Replaces children with an animated skeleton placeholder. Great for loading states.' },
      { name: 'onPress', type: '() => void', description: 'Makes the card pressable. Adds ripple on Android and opacity feedback on iOS.' },
      { name: 'image', type: 'ImageSourcePropType', description: 'Cover image rendered edge-to-edge at the top of the card.' },
      { name: 'imageHeight', type: 'number', default: '180', description: 'Height of the cover image in pixels.' },
      { name: 'children', type: 'React.ReactNode', description: 'Card content. Use CardHeader, CardContent, CardFooter for structured layouts.' },
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
      <Textarea label="Message" submitOnEnter onSubmit={(t) => console.log(t)} minRows={1} maxRows={4} />
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
        onResend={() => console.log('Resend tapped')}
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
  tooltip: {
    name: 'Tooltip',
    slug: 'tooltip',
    description: 'Contextual text bubble that appears near a trigger on press-and-hold. 4 placement positions, animated arrow indicator, delay, and Modal-based screen-level positioning.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add tooltip',
    props: [
      { name: 'content', type: 'string', description: 'Text shown inside the tooltip bubble.' },
      { name: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: 'Preferred side relative to the trigger. Arrow points toward the trigger.' },
      { name: 'children', type: 'React.ReactElement', description: 'The trigger element. Tooltip shows on press-and-hold or long press.' },
      { name: 'delay', type: 'number', default: '300', description: 'Milliseconds before the tooltip appears after press-in.' },
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
  popover: {
    name: 'Popover',
    slug: 'popover',
    description: 'Interactive content bubble anchored to any trigger element. Supports 4 placements, arrow indicator, scrollable content, backdrop dismiss, and both controlled and uncontrolled modes.',
    category: 'Overlay',
    npmDeps: [],
    componentDeps: [],
    addCommand: 'npx native-mate add popover',
    props: [
      { name: 'children', type: 'React.ReactElement', description: 'The trigger element. Tapping opens/closes the popover.' },
      { name: 'content', type: 'React.ReactNode', description: 'Any content rendered inside the popover bubble. Can include buttons, lists, inputs, etc.' },
      { name: 'placement', type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: 'Preferred side relative to the trigger. Arrow points toward the trigger.' },
      { name: 'maxWidth', type: 'number', default: '260', description: 'Maximum width of the popover bubble in pixels.' },
      { name: 'dismissible', type: 'boolean', default: 'true', description: 'Whether tapping outside the popover closes it.' },
      { name: 'open', type: 'boolean', description: 'Controlled open state. Use with onOpenChange for full control.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the popover opens or closes.' },
    ],
    usageCode: `import { Popover } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import { View } from 'react-native'
import { Text } from '@native-mate/core'

// Simple text popover
<Popover content={<Text style={{ padding: 12 }}>More info here</Text>} placement="top">
  <Button variant="outline">Info</Button>
</Popover>

// Popover menu
<Popover
  placement="bottom"
  content={
    <View style={{ paddingVertical: 4 }}>
      {['Edit', 'Duplicate', 'Delete'].map(item => (
        <Pressable key={item} style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
          <Text>{item}</Text>
        </Pressable>
      ))}
    </View>
  }
>
  <Button variant="ghost" iconOnly>
    <Ionicons name="ellipsis-horizontal" size={20} />
  </Button>
</Popover>

// Controlled
<Popover open={open} onOpenChange={setOpen} content={<DatePicker />}>
  <Button>Pick date</Button>
</Popover>`,
    exampleCode: `import { useState } from 'react'
import { Popover } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import { View, Pressable } from 'react-native'
import { Text } from '@native-mate/core'
import { Ionicons } from '@expo/vector-icons'

const MENU = [
  { label: 'Edit', icon: 'create-outline' },
  { label: 'Duplicate', icon: 'copy-outline' },
  { label: 'Move to folder', icon: 'folder-outline' },
  { label: 'Delete', icon: 'trash-outline', destructive: true },
] as const

export function PopoverExample() {
  const [open, setOpen] = useState(false)

  return (
    <View style={{ padding: 32, alignItems: 'center' }}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        placement="bottom"
        content={
          <View style={{ paddingVertical: 4 }}>
            {MENU.map(item => (
              <Pressable
                key={item.label}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 16 }}
                onPress={() => setOpen(false)}
              >
                <Ionicons name={item.icon} size={17} color={item.destructive ? '#ef4444' : '#a1a1aa'} />
                <Text style={{ color: item.destructive ? '#ef4444' : undefined }}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        }
      >
        <Button variant="outline" iconOnly>
          <Ionicons name="ellipsis-horizontal" size={18} />
        </Button>
      </Popover>
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
    { slug: 'popover' },
    { slug: 'screen' },
  ]
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = COMPONENT_DOCS[slug]
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

        {/* First preview (default/simplest variant) */}
        <section className="mb-10">
          <ComponentPreview slug={doc.slug} part="first" />
        </section>

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

        {/* Rest of previews (all variants) */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Examples</h2>
          <ComponentPreview slug={doc.slug} part="rest" />
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

        {/* Accessibility */}
        {doc.accessibility && doc.accessibility.length > 0 && (
          <section className="mb-10">
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
      </main>
    </div>
  )
}
