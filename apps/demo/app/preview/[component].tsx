import React, { useState } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { useTheme, Text } from '@native-mate/core'

// Components
import { Button, ButtonGroup } from '../../../../packages/registry/components/button/button'
import { Input } from '../../../../packages/registry/components/input/input'
import { Textarea } from '../../../../packages/registry/components/textarea/textarea'
import { Checkbox } from '../../../../packages/registry/components/checkbox/checkbox'
import { Radio, RadioGroup } from '../../../../packages/registry/components/radio/radio'
import { Switch } from '../../../../packages/registry/components/switch/switch'
import { Slider } from '../../../../packages/registry/components/slider/slider'
import { Badge } from '../../../../packages/registry/components/badge/badge'
import { Avatar } from '../../../../packages/registry/components/avatar/avatar'
import { Tag } from '../../../../packages/registry/components/tag/tag'
import { Progress } from '../../../../packages/registry/components/progress/progress'
import { Skeleton } from '../../../../packages/registry/components/skeleton/skeleton'
import { Alert } from '../../../../packages/registry/components/alert/alert'
import { Card } from '../../../../packages/registry/components/card/card'
import { Tabs } from '../../../../packages/registry/components/tabs/tabs'
import { Accordion } from '../../../../packages/registry/components/accordion/accordion'
import { EmptyState } from '../../../../packages/registry/components/empty-state/empty-state'
import { Sheet } from '../../../../packages/registry/components/sheet/sheet'
import { Modal } from '../../../../packages/registry/components/modal/modal'
import { ActionSheet } from '../../../../packages/registry/components/action-sheet/action-sheet'
import { Toast } from '../../../../packages/registry/components/toast/toast'
import { Tooltip } from '../../../../packages/registry/components/tooltip/tooltip'
import { OtpInput } from '../../../../packages/registry/components/otp-input/otp-input'
import { Select } from '../../../../packages/registry/components/select/select'

const labels: Record<string, string> = {
  button: 'Button', input: 'Input', textarea: 'Textarea', checkbox: 'Checkbox',
  radio: 'Radio', switch: 'Switch', slider: 'Slider', badge: 'Badge',
  avatar: 'Avatar', tag: 'Tag', progress: 'Progress', skeleton: 'Skeleton',
  alert: 'Alert', card: 'Card', tabs: 'Tabs', accordion: 'Accordion',
  'empty-state': 'Empty State', sheet: 'Sheet', modal: 'Modal',
  'action-sheet': 'Action Sheet', toast: 'Toast', tooltip: 'Tooltip',
  'otp-input': 'OTP Input', select: 'Select',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text variant="caption" muted style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

function ButtonPreview() {
  return (
    <>
      <Section title="Variants">
        <View style={{ gap: 12 }}>
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="link">Link</Button>
        </View>
      </Section>
      <Section title="Sizes">
        <View style={{ gap: 12, alignItems: 'flex-start' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </View>
      </Section>
      <Section title="Rounded Pill">
        <View style={{ gap: 12, alignItems: 'flex-start' }}>
          <Button rounded>Rounded Default</Button>
          <Button rounded variant="outline">Rounded Outline</Button>
          <Button rounded variant="gradient" gradientColors={['#6366f1', '#a855f7']}>Rounded Gradient</Button>
        </View>
      </Section>
      <Section title="Icon Only">
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button iconOnly iconLeft={<Text style={{ color: '#000', fontSize: 20, fontWeight: '700' }}>+</Text>} />
          <Button iconOnly variant="outline" iconLeft={<Text style={{ color: '#fafafa', fontSize: 18 }}>✕</Text>} />
          <Button iconOnly rounded iconLeft={<Text style={{ color: '#000', fontSize: 18 }}>♥</Text>} />
          <Button iconOnly rounded variant="destructive" iconLeft={<Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>×</Text>} />
        </View>
      </Section>
      <Section title="With Icons">
        <View style={{ gap: 12, alignItems: 'flex-start' }}>
          <Button iconLeft={<Text style={{ color: '#000', fontSize: 18, fontWeight: '700' }}>+</Text>}>Add Item</Button>
          <Button variant="outline" iconRight={<Text style={{ color: '#fafafa', fontSize: 16 }}>→</Text>}>Next</Button>
        </View>
      </Section>
      <Section title="Custom Colors">
        <View style={{ gap: 12, alignItems: 'flex-start' }}>
          <Button color="#6366f1">Indigo</Button>
          <Button color="#10b981">Emerald</Button>
          <Button color="#f59e0b" variant="outline">Amber Outline</Button>
        </View>
      </Section>
      <Section title="Button Group">
        <View style={{ gap: 16 }}>
          <ButtonGroup>
            <Button>Left</Button>
            <Button>Center</Button>
            <Button>Right</Button>
          </ButtonGroup>
          <ButtonGroup variant="outline">
            <Button>Day</Button>
            <Button>Week</Button>
            <Button>Month</Button>
            <Button>Year</Button>
          </ButtonGroup>
          <ButtonGroup fullWidth>
            <Button>Cancel</Button>
            <Button variant="default">Confirm</Button>
          </ButtonGroup>
        </View>
      </Section>
      <Section title="Full Width">
        <View style={{ gap: 12 }}>
          <Button fullWidth>Full Width Button</Button>
          <Button fullWidth variant="outline">Full Width Outline</Button>
        </View>
      </Section>
      <Section title="Haptic Feedback">
        <View style={{ gap: 12 }}>
          <Button haptic="light">Light Haptic</Button>
          <Button haptic="medium" variant="outline">Medium Haptic</Button>
          <Button haptic="heavy" variant="secondary">Heavy Haptic</Button>
          <Button haptic="none" variant="ghost">No Haptic</Button>
        </View>
      </Section>
      <Section title="States">
        <View style={{ gap: 12 }}>
          <Button loading>Saving...</Button>
          <Button disabled>Disabled</Button>
        </View>
      </Section>
    </>
  )
}

function InputPreview() {
  const [val, setVal] = useState('')
  return (
    <>
      <Section title="Default">
        <Input label="Email" placeholder="you@example.com" value={val} onChangeText={setVal} />
      </Section>
      <Section title="With hint">
        <Input label="Username" placeholder="johndoe" hint="Must be at least 3 characters" />
      </Section>
      <Section title="Error state">
        <Input label="Password" placeholder="••••••••" error="Password is too short" secureTextEntry />
      </Section>
      <Section title="Disabled">
        <Input label="Company" value="Acme Inc." disabled />
      </Section>
    </>
  )
}

function TextareaPreview() {
  return (
    <>
      <Section title="Default">
        <Textarea label="Bio" placeholder="Tell us about yourself..." />
      </Section>
      <Section title="Error">
        <Textarea label="Description" error="Required field" />
      </Section>
    </>
  )
}

function CheckboxPreview() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [c, setC] = useState(false)
  return (
    <Section title="Options">
      <View style={s.gap}>
        <Checkbox checked={a} onChange={setA} label="Accept terms" />
        <Checkbox checked={b} onChange={setB} label="Subscribe to newsletter" />
        <Checkbox checked={c} onChange={setC} label="Disabled option" disabled />
      </View>
    </Section>
  )
}

function RadioPreview() {
  const [val, setVal] = useState('react-native')
  return (
    <Section title="Framework">
      <RadioGroup
        options={[
          { label: 'React Native', value: 'react-native' },
          { label: 'Flutter', value: 'flutter' },
          { label: 'SwiftUI', value: 'swiftui' },
        ]}
        value={val}
        onChange={setVal}
      />
    </Section>
  )
}

function SwitchPreview() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  return (
    <Section title="Toggles">
      <View style={s.gap}>
        <View style={s.switchRow}>
          <Text variant="body">Dark mode</Text>
          <Switch value={a} onValueChange={setA} />
        </View>
        <View style={s.switchRow}>
          <Text variant="body">Notifications</Text>
          <Switch value={b} onValueChange={setB} />
        </View>
        <View style={s.switchRow}>
          <Text variant="body" muted>Disabled</Text>
          <Switch value={false} onValueChange={() => {}} disabled />
        </View>
      </View>
    </Section>
  )
}

function SliderPreview() {
  const [val, setVal] = useState(40)
  return (
    <Section title="Volume">
      <Slider value={val} onChange={setVal} min={0} max={100} step={1} />
      <Text variant="caption" muted style={{ marginTop: 8 }}>Value: {Math.round(val)}</Text>
    </Section>
  )
}

function BadgePreview() {
  return (
    <Section title="Variants">
      <View style={s.row}>
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Error</Badge>
      </View>
      <View style={[s.row, { marginTop: 10 }]}>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success">Success</Badge>
      </View>
    </Section>
  )
}

function AvatarPreview() {
  return (
    <Section title="Sizes & Fallbacks">
      <View style={s.row}>
        <Avatar size="sm" fallback="SM" />
        <Avatar size="md" fallback="MD" />
        <Avatar size="lg" fallback="LG" />
        <Avatar size="xl" fallback="XL" />
      </View>
      <View style={[s.row, { marginTop: 12 }]}>
        <Avatar size="lg" src="https://i.pravatar.cc/100?img=1" />
        <Avatar size="lg" src="https://i.pravatar.cc/100?img=2" />
        <Avatar size="lg" src="https://i.pravatar.cc/100?img=3" />
      </View>
    </Section>
  )
}

function TagPreview() {
  const [tags, setTags] = useState(['React Native', 'TypeScript', 'Expo', 'Reanimated'])
  return (
    <Section title="Dismissible tags">
      <View style={s.row}>
        {tags.map((t) => (
          <Tag key={t} label={t} onRemove={() => setTags((p) => p.filter((x) => x !== t))} />
        ))}
      </View>
    </Section>
  )
}

function ProgressPreview() {
  const [val, setVal] = useState(65)
  return (
    <Section title="Progress bar">
      <Progress value={val} animated />
      <Text variant="caption" muted style={{ marginTop: 8 }}>{val}%</Text>
      <View style={[s.row, { marginTop: 12 }]}>
        <Button size="sm" variant="outline" onPress={() => setVal((v) => Math.max(0, v - 10))}>-10</Button>
        <Button size="sm" variant="outline" onPress={() => setVal((v) => Math.min(100, v + 10))}>+10</Button>
      </View>
    </Section>
  )
}

function SkeletonPreview() {
  return (
    <Section title="Loading placeholders">
      <View style={s.gap}>
        <View style={s.row}>
          <Skeleton width={48} height={48} borderRadius={24} />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="40%" height={12} />
          </View>
        </View>
        <Skeleton width="100%" height={120} borderRadius={10} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="60%" height={16} />
      </View>
    </Section>
  )
}

function AlertPreview() {
  return (
    <Section title="Variants">
      <View style={s.gap}>
        <Alert title="Info" description="This is an informational alert." />
        <Alert variant="success" title="Success" description="Your changes have been saved." />
        <Alert variant="warning" title="Warning" description="This action cannot be undone easily." />
        <Alert variant="destructive" title="Error" description="Something went wrong. Please try again." />
      </View>
    </Section>
  )
}

function CardPreview() {
  return (
    <Section title="Cards">
      <View style={s.gap}>
        <Card>
          <Text variant="label">Default Card</Text>
          <Text variant="body" muted>Some content inside a card.</Text>
        </Card>
        <Card padding="lg">
          <Text variant="label">Large Padding</Text>
          <Text variant="body" muted>More spacious card layout.</Text>
        </Card>
      </View>
    </Section>
  )
}

function TabsPreview() {
  const [tab, setTab] = useState('overview')
  return (
    <Section title="Navigation">
      <Tabs
        items={[
          { key: 'overview', label: 'Overview' },
          { key: 'features', label: 'Features' },
          { key: 'pricing', label: 'Pricing' },
        ]}
        activeKey={tab}
        onChange={setTab}
      />
      <Text variant="body" muted style={{ marginTop: 12 }}>Active: {tab}</Text>
    </Section>
  )
}

function AccordionPreview() {
  return (
    <Section title="FAQ">
      <Accordion
        items={[
          { title: 'What is native-mate?', content: 'A copy-paste React Native component library with a CLI.' },
          { title: 'Is it free?', content: 'Yes, fully open source.' },
          { title: 'Does it support dark mode?', content: 'Yes, with built-in light and dark token sets.' },
        ]}
      />
    </Section>
  )
}

function EmptyStatePreview() {
  return (
    <Section title="No content">
      <EmptyState
        title="No results found"
        description="Try adjusting your search or filters."
        action={{ label: 'Clear filters', onPress: () => {} }}
      />
    </Section>
  )
}

function SheetPreview() {
  const [open, setOpen] = useState(false)
  return (
    <Section title="Bottom sheet">
      <Button onPress={() => setOpen(true)}>Open Sheet</Button>
      <Sheet visible={open} onClose={() => setOpen(false)} title="Settings">
        <View style={{ padding: 20, gap: 16 }}>
          <Text variant="body">Sheet content goes here.</Text>
          <Button variant="outline" onPress={() => setOpen(false)}>Close</Button>
        </View>
      </Sheet>
    </Section>
  )
}

function ModalPreview() {
  const [open, setOpen] = useState(false)
  return (
    <Section title="Dialog">
      <Button onPress={() => setOpen(true)}>Open Modal</Button>
      <Modal visible={open} onClose={() => setOpen(false)} title="Confirm action">
        <View style={{ padding: 20, gap: 16 }}>
          <Text variant="body">Are you sure you want to proceed?</Text>
          <View style={s.row}>
            <Button variant="outline" onPress={() => setOpen(false)}>Cancel</Button>
            <Button onPress={() => setOpen(false)}>Confirm</Button>
          </View>
        </View>
      </Modal>
    </Section>
  )
}

function ActionSheetPreview() {
  const [open, setOpen] = useState(false)
  return (
    <Section title="Action sheet">
      <Button onPress={() => setOpen(true)}>Show Actions</Button>
      <ActionSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Photo Options"
        actions={[
          { label: 'Take Photo', onPress: () => setOpen(false) },
          { label: 'Choose from Library', onPress: () => setOpen(false) },
          { label: 'Delete Photo', onPress: () => setOpen(false), variant: 'destructive' },
        ]}
      />
    </Section>
  )
}

function ToastPreview() {
  const [show, setShow] = useState(false)
  const [variant, setVariant] = useState<'default' | 'success' | 'destructive' | 'warning'>('success')
  return (
    <Section title="Notifications">
      <View style={s.row}>
        <Button size="sm" onPress={() => { setVariant('success'); setShow(true) }}>Success</Button>
        <Button size="sm" variant="destructive" onPress={() => { setVariant('destructive'); setShow(true) }}>Error</Button>
        <Button size="sm" variant="outline" onPress={() => { setVariant('warning'); setShow(true) }}>Warning</Button>
      </View>
      <Toast
        visible={show}
        onHide={() => setShow(false)}
        message={variant === 'success' ? 'Saved!' : variant === 'destructive' ? 'Failed!' : 'Careful!'}
        variant={variant}
        duration={2000}
      />
    </Section>
  )
}

function TooltipPreview() {
  return (
    <Section title="Tooltips">
      <View style={s.row}>
        <Tooltip content="Top tooltip" placement="top">
          <Button size="sm" variant="outline">Top</Button>
        </Tooltip>
        <Tooltip content="Bottom tooltip" placement="bottom">
          <Button size="sm" variant="outline">Bottom</Button>
        </Tooltip>
      </View>
    </Section>
  )
}

function OtpInputPreview() {
  const [val, setVal] = useState('')
  return (
    <Section title="Verification code">
      <OtpInput value={val} onChange={setVal} length={6} />
      <Text variant="caption" muted style={{ marginTop: 8 }}>Entered: {val || '—'}</Text>
    </Section>
  )
}

function SelectPreview() {
  const [val, setVal] = useState<string | undefined>()
  return (
    <Section title="Dropdown">
      <Select
        label="Country"
        placeholder="Select country"
        options={[
          { label: 'India', value: 'in' },
          { label: 'United States', value: 'us' },
          { label: 'United Kingdom', value: 'uk' },
          { label: 'Germany', value: 'de' },
        ]}
        value={val}
        onChange={setVal}
      />
    </Section>
  )
}

const previews: Record<string, React.FC> = {
  button: ButtonPreview,
  input: InputPreview,
  textarea: TextareaPreview,
  checkbox: CheckboxPreview,
  radio: RadioPreview,
  switch: SwitchPreview,
  slider: SliderPreview,
  badge: BadgePreview,
  avatar: AvatarPreview,
  tag: TagPreview,
  progress: ProgressPreview,
  skeleton: SkeletonPreview,
  alert: AlertPreview,
  card: CardPreview,
  tabs: TabsPreview,
  accordion: AccordionPreview,
  'empty-state': EmptyStatePreview,
  sheet: SheetPreview,
  modal: ModalPreview,
  'action-sheet': ActionSheetPreview,
  toast: ToastPreview,
  tooltip: TooltipPreview,
  'otp-input': OtpInputPreview,
  select: SelectPreview,
}

export default function PreviewScreen() {
  const { component } = useLocalSearchParams<{ component: string }>()
  const Preview = previews[component]
  const title = labels[component] || component

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView style={s.container} contentContainerStyle={s.content}>
        {Preview ? <Preview /> : <Text variant="body" muted>No preview for "{component}"</Text>}
      </ScrollView>
    </>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 20, paddingBottom: 60 },
  section: { marginBottom: 28 },
  sectionTitle: { textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontSize: 11 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  gap: { gap: 14 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
})
