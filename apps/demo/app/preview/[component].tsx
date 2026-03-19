import React, { useState } from 'react'
import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text } from '@native-mate/core'

// Components
import { Button, ButtonGroup } from '../../../../packages/registry/components/button/button'
import { Text as NMText } from '../../../../packages/registry/components/text/text'
import { Icon } from '../../../../packages/registry/components/icon/icon'
import { Spinner } from '../../../../packages/registry/components/spinner/spinner'
import { Separator } from '../../../../packages/registry/components/separator/separator'
import { Input } from '../../../../packages/registry/components/input/input'
import { CheckboxGroup } from '../../../../packages/registry/components/checkbox/checkbox'
import { MultiSelect } from '../../../../packages/registry/components/select/select'
import { RangeSlider } from '../../../../packages/registry/components/slider/slider'
import { Textarea } from '../../../../packages/registry/components/textarea/textarea'
import { Checkbox } from '../../../../packages/registry/components/checkbox/checkbox'
import { Radio, RadioGroup } from '../../../../packages/registry/components/radio/radio'
import { Switch } from '../../../../packages/registry/components/switch/switch'
import { Slider } from '../../../../packages/registry/components/slider/slider'
import { Badge } from '../../../../packages/registry/components/badge/badge'
import { Avatar, AvatarGroup } from '../../../../packages/registry/components/avatar/avatar'
import { Tag, TagGroup } from '../../../../packages/registry/components/tag/tag'
import { Progress } from '../../../../packages/registry/components/progress/progress'
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from '../../../../packages/registry/components/skeleton/skeleton'
import { Alert } from '../../../../packages/registry/components/alert/alert'
import { Card, CardHeader, CardContent, CardFooter, CardMedia } from '../../../../packages/registry/components/card/card'
import { Tabs } from '../../../../packages/registry/components/tabs/tabs'
import { Accordion } from '../../../../packages/registry/components/accordion/accordion'
import { EmptyState } from '../../../../packages/registry/components/empty-state/empty-state'
import { Sheet } from '../../../../packages/registry/components/sheet/sheet'
import { Modal } from '../../../../packages/registry/components/modal/modal'
import { ActionSheet } from '../../../../packages/registry/components/action-sheet/action-sheet'
import { Toast } from '../../../../packages/registry/components/toast/toast'
import { Tooltip } from '../../../../packages/registry/components/tooltip/tooltip'
import { OTPInput } from '../../../../packages/registry/components/otp-input/otp-input'
import { Select } from '../../../../packages/registry/components/select/select'
import { Popover } from '../../../../packages/registry/components/popover/popover'

const labels: Record<string, string> = {
  text: 'Text', icon: 'Icon', spinner: 'Spinner', separator: 'Separator',
  button: 'Button', input: 'Input', textarea: 'Textarea', checkbox: 'Checkbox',
  radio: 'Radio', switch: 'Switch', slider: 'Slider', badge: 'Badge',
  avatar: 'Avatar', tag: 'Tag', progress: 'Progress', skeleton: 'Skeleton',
  alert: 'Alert', card: 'Card', tabs: 'Tabs', accordion: 'Accordion',
  'empty-state': 'Empty State', sheet: 'Sheet', modal: 'Modal',
  'action-sheet': 'Action Sheet', toast: 'Toast', tooltip: 'Tooltip',
  'otp-input': 'OTP Input', select: 'Select', popover: 'Popover',
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
          <Button rounded variant="destructive">Rounded Destructive</Button>
        </View>
      </Section>
      <Section title="Icon Only">
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button iconOnly iconLeft={<Ionicons name="add" size={20} color="#000" />} />
          <Button iconOnly variant="outline" iconLeft={<Ionicons name="close" size={18} color="#fafafa" />} />
          <Button iconOnly rounded iconLeft={<Ionicons name="heart" size={18} color="#000" />} />
          <Button iconOnly rounded variant="destructive" iconLeft={<Ionicons name="heart" size={18} color="#fff" />} />
        </View>
      </Section>
      <Section title="With Icons">
        <View style={{ gap: 12, alignItems: 'flex-start' }}>
          <Button iconLeft={<Ionicons name="add" size={18} color="#000" />}>Add Item</Button>
          <Button variant="outline" iconRight={<Ionicons name="arrow-forward" size={16} color="#fafafa" />}>Next</Button>
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
          <ButtonGroup fullWidth>
            <Button>Left</Button>
            <Button>Center</Button>
            <Button>Right</Button>
          </ButtonGroup>
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
  const [pw, setPw] = useState('')
  const [bio, setBio] = useState('')
  const [search, setSearch] = useState('')
  const [amount, setAmount] = useState('')
  const [url, setUrl] = useState('')
  const [floatVal, setFloatVal] = useState('')
  return (
    <>
      <Section title="Default">
        <Input label="Email" placeholder="you@example.com" value={val} onChangeText={setVal} />
      </Section>
      <Section title="Sizes">
        <View style={{ gap: 12 }}>
          <Input size="sm" placeholder="Small input" />
          <Input size="md" placeholder="Medium input (default)" />
          <Input size="lg" placeholder="Large input" />
        </View>
      </Section>
      <Section title="Required">
        <Input label="Full Name" placeholder="John Doe" required />
      </Section>
      <Section title="Prefix & Suffix Text">
        <View style={{ gap: 12 }}>
          <Input label="Price" placeholder="0.00" prefixText="$" suffixText="USD" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
          <Input label="Website" placeholder="example.com" prefixText="https://" value={url} onChangeText={setUrl} />
        </View>
      </Section>
      <Section title="Prefix & Suffix Icons">
        <View style={{ gap: 12 }}>
          <Input
            placeholder="Search..."
            prefix={<Ionicons name="search" size={16} color="#71717a" />}
            clearable
            value={search}
            onChangeText={setSearch}
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            suffix={<Text style={{ color: '#4ade80', fontSize: 14 }}>✓</Text>}
          />
        </View>
      </Section>
      <Section title="Clearable">
        <Input label="Search" placeholder="Type to search..." clearable value={search} onChangeText={setSearch} />
      </Section>
      <Section title="Password with Toggle">
        <Input label="Password" placeholder="••••••••" secureTextEntry showPasswordToggle value={pw} onChangeText={setPw} />
      </Section>
      <Section title="Character Count">
        <Input label="Bio" placeholder="Write something..." showCount maxLength={100} value={bio} onChangeText={setBio} />
      </Section>
      <Section title="Floating Label">
        <View style={{ gap: 12 }}>
          <Input floatingLabel label="Email Address" placeholder="you@example.com" value={floatVal} onChangeText={setFloatVal} />
          <Input floatingLabel label="Required Field" placeholder="..." required />
        </View>
      </Section>
      <Section title="Error with Shake">
        <Input label="Username" placeholder="johndoe" error="Username is already taken" />
      </Section>
      <Section title="With Hint">
        <Input label="Username" placeholder="johndoe" hint="Must be at least 3 characters" />
      </Section>
      <Section title="Haptic on Focus">
        <Input label="Tap me" placeholder="Feel the tap..." hapticOnFocus />
      </Section>
      <Section title="Disabled">
        <Input label="Company" value="Acme Inc." disabled />
      </Section>
    </>
  )
}

function TextareaPreview() {
  const [bio, setBio] = useState('')
  const [msg, setMsg] = useState('')
  const [notes, setNotes] = useState('')
  const [mention, setMention] = useState('')
  const [chat, setChat] = useState('')
  const [chatMessages, setChatMessages] = useState<string[]>([])
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [voiceRecording, setVoiceRecording] = useState(false)
  return (
    <>
      <Section title="Default">
        <Textarea label="Bio" placeholder="Tell us about yourself..." value={bio} onChangeText={setBio} />
      </Section>
      <Section title="Required">
        <Textarea label="Description" placeholder="Write a short description..." required />
      </Section>
      <Section title="Min & Max Rows">
        <Textarea label="Message" placeholder="Grows from 2 to 6 rows..." minRows={2} maxRows={6} value={msg} onChangeText={setMsg} />
      </Section>
      <Section title="Character Count (warning at 80%)">
        <Textarea label="Tweet" placeholder="What's on your mind?" showCount maxLength={100} countWarnAt={0.8} />
      </Section>
      <Section title="Floating Label">
        <Textarea floatingLabel label="Notes" placeholder="Add notes..." value={notes} onChangeText={setNotes} />
      </Section>
      <Section title="Submit on Enter (Slack-style)">
        <Textarea
          label="Send a message"
          placeholder="Press Enter to send..."
          submitOnEnter
          onSubmit={(val) => {
            if (val.trim()) {
              setChatMessages(p => [...p, val])
              setChat('')
            }
          }}
          value={chat}
          onChangeText={setChat}
          minRows={1}
          maxRows={4}
        />
        {chatMessages.length > 0 && (
          <View style={{ marginTop: 8, gap: 4 }}>
            {chatMessages.slice(-3).map((m, i) => (
              <Text key={i} variant="caption" style={{ color: '#a1a1aa', paddingVertical: 2 }}>→ {m}</Text>
            ))}
          </View>
        )}
      </Section>
      <Section title="Mention Detection (@)">
        <Textarea
          label="Comment"
          placeholder="Type @ to mention someone..."
          onMention={(q) => setMention(q)}
          minRows={2}
        />
        {mention !== '' && <Text variant="caption" muted>Mention query: @{mention}</Text>}
      </Section>
      <Section title="Voice Input">
        <Textarea
          label="Voice note"
          placeholder="Tap microphone icon to dictate..."
          voiceInput
          value={voiceTranscript}
          onChangeText={setVoiceTranscript}
          hint={voiceRecording ? '🔴 Recording… (simulated)' : 'Tap mic — wire to expo-av or expo-speech for real STT'}
          onVoicePress={() => {
            // Demo: simulate recording toggle + fake transcript
            if (voiceRecording) {
              setVoiceRecording(false)
              setVoiceTranscript((v) => v + (v ? ' ' : '') + 'Hello from voice input')
            } else {
              setVoiceRecording(true)
              setTimeout(() => {
                setVoiceRecording(false)
                setVoiceTranscript((v) => v + (v ? ' ' : '') + 'Hello from voice input')
              }, 2000)
            }
          }}
        />
      </Section>
      <Section title="Read-only">
        <Textarea label="Terms" value={"By using native-mate you agree to the terms of service and privacy policy. This component library is open source under the MIT license."} readOnly />
      </Section>
      <Section title="Error with Shake">
        <Textarea label="Review" error="Review cannot be empty" />
      </Section>
      <Section title="Disabled">
        <Textarea label="System Notes" value="Auto-generated by system." disabled />
      </Section>
    </>
  )
}

function CheckboxPreview() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [groupVal, setGroupVal] = useState(['ts'])
  const [leftVal, setLeftVal] = useState(false)
  return (
    <>
      <Section title="Default">
        <View style={s.gap}>
          <Checkbox checked={a} onChange={setA} label="Accept terms & conditions" />
          <Checkbox checked={b} onChange={setB} label="Subscribe to newsletter" description="Get weekly updates about new components." />
          <Checkbox checked={false} onChange={() => {}} label="Disabled option" disabled />
          <Checkbox checked={true} onChange={() => {}} label="Disabled checked" disabled />
        </View>
      </Section>
      <Section title="Indeterminate">
        <Checkbox
          checked={false}
          indeterminate={true}
          onChange={() => {}}
          label="Select all (partial)"
          description="Some items are selected"
        />
      </Section>
      <Section title="Sizes">
        <View style={s.gap}>
          <Checkbox checked={true} onChange={() => {}} label="Small" size="sm" />
          <Checkbox checked={true} onChange={() => {}} label="Medium (default)" size="md" />
          <Checkbox checked={true} onChange={() => {}} label="Large" size="lg" />
        </View>
      </Section>
      <Section title="Custom Color">
        <View style={s.gap}>
          <Checkbox checked={true} onChange={() => {}} label="Emerald" color="#10b981" />
          <Checkbox checked={true} onChange={() => {}} label="Rose" color="#f43f5e" />
          <Checkbox checked={true} onChange={() => {}} label="Violet" color="#8b5cf6" />
        </View>
      </Section>
      <Section title="Label on Left">
        <Checkbox checked={leftVal} onChange={setLeftVal} label="Dark mode" labelPosition="left" />
      </Section>
      <Section title="Error State">
        <Checkbox checked={false} onChange={() => {}} label="Accept terms" error="You must accept the terms to continue." />
      </Section>
      <Section title="CheckboxGroup">
        <CheckboxGroup
          label="Technologies"
          options={[
            { label: 'TypeScript', value: 'ts', description: 'Typed superset of JavaScript' },
            { label: 'React Native', value: 'rn' },
            { label: 'Expo', value: 'expo' },
            { label: 'GraphQL', value: 'gql', disabled: true },
          ]}
          value={groupVal}
          onChange={setGroupVal}
        />
        <Text variant="caption" muted style={{ marginTop: 8 }}>Selected: {groupVal.join(', ') || 'none'}</Text>
      </Section>
      <Section title="Horizontal Group">
        <CheckboxGroup
          options={[
            { label: 'Mon', value: 'mon' },
            { label: 'Tue', value: 'tue' },
            { label: 'Wed', value: 'wed' },
            { label: 'Thu', value: 'thu' },
            { label: 'Fri', value: 'fri' },
          ]}
          value={groupVal}
          onChange={setGroupVal}
          horizontal
        />
      </Section>
    </>
  )
}

function RadioPreview() {
  const [fw, setFw] = useState('rn')
  const [plan, setPlan] = useState('pro')
  const [size, setSize] = useState('md')
  const [dir, setDir] = useState('ltr')
  return (
    <>
      <Section title="Default">
        <RadioGroup
          label="Framework"
          options={[
            { label: 'React Native', value: 'rn', description: 'Cross-platform mobile' },
            { label: 'Flutter', value: 'flutter', description: 'Google UI toolkit' },
            { label: 'SwiftUI', value: 'swiftui', description: 'iOS & macOS only', disabled: true },
          ]}
          value={fw}
          onChange={setFw}
        />
      </Section>
      <Section title="Card Style">
        <RadioGroup
          label="Choose a plan"
          card
          options={[
            { label: 'Free', value: 'free', description: '5 components, community support' },
            { label: 'Pro', value: 'pro', description: 'Unlimited components, priority support' },
            { label: 'Team', value: 'team', description: 'Everything in Pro + team management' },
          ]}
          value={plan}
          onChange={setPlan}
        />
        <Text variant="caption" muted style={{ marginTop: 8 }}>Selected: {plan}</Text>
      </Section>
      <Section title="Sizes">
        <RadioGroup
          options={[
            { label: 'Small', value: 'sm' },
            { label: 'Medium (default)', value: 'md' },
            { label: 'Large', value: 'lg' },
          ]}
          value={size}
          onChange={setSize}
          size={size as any}
        />
      </Section>
      <Section title="Horizontal">
        <RadioGroup
          options={[
            { label: 'LTR', value: 'ltr' },
            { label: 'RTL', value: 'rtl' },
            { label: 'Auto', value: 'auto' },
          ]}
          value={dir}
          onChange={setDir}
          horizontal
        />
      </Section>
      <Section title="Error State">
        <RadioGroup
          label="Preferred contact"
          options={[
            { label: 'Email', value: 'email' },
            { label: 'SMS', value: 'sms' },
          ]}
          value=""
          onChange={() => {}}
          error="Please select a contact method."
        />
      </Section>
      <Section title="Disabled Group">
        <RadioGroup
          options={[
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ]}
          value="a"
          onChange={() => {}}
          disabled
        />
      </Section>
    </>
  )
}

function SwitchPreview() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifs, setNotifs] = useState(false)
  const [email, setEmail] = useState(true)
  const [marketing, setMarketing] = useState(true)
  const [sizeSm, setSizeSm] = useState(true)
  const [sizeMd, setSizeMd] = useState(true)
  const [sizeLg, setSizeLg] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingValue, setLoadingValue] = useState(false)
  return (
    <>
      <Section title="With Label & Description">
        <View style={s.gap}>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            label="Dark mode"
            description="Switch between light and dark themes"
          />
          <Switch
            value={notifs}
            onValueChange={setNotifs}
            label="Push notifications"
            description="Receive alerts on your device"
          />
        </View>
      </Section>
      <Section title="Sizes">
        <View style={s.gap}>
          <Switch value={sizeSm} onValueChange={setSizeSm} size="sm" label="Small" />
          <Switch value={sizeMd} onValueChange={setSizeMd} size="md" label="Medium" />
          <Switch value={sizeLg} onValueChange={setSizeLg} size="lg" label="Large" />
        </View>
      </Section>
      <Section title="Custom Color">
        <View style={s.gap}>
          <Switch value={email} onValueChange={setEmail} label="Email alerts" color="#10b981" />
          <Switch value={marketing} onValueChange={setMarketing} label="Marketing" color="#f59e0b" />
        </View>
      </Section>
      <Section title="Label Left">
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          label="Dark mode"
          labelPosition="left"
        />
      </Section>
      <Section title="Loading & Disabled">
        <View style={s.gap}>
          <Switch
            value={loadingValue}
            onValueChange={(v) => { setLoading(true); setTimeout(() => { setLoading(false); setLoadingValue(v) }, 1500) }}
            label={loading ? 'Saving to server…' : 'Auto-save'}
            description="Tap to see loading state"
            loading={loading}
          />
          <Switch value={false} onValueChange={() => {}} label="Disabled toggle" disabled />
        </View>
      </Section>
    </>
  )
}

function SliderPreview() {
  const [vol, setVol] = useState(40)
  const [bright, setBright] = useState(70)
  const [stepped, setStepped] = useState(3)
  const [rangeLow, setRangeLow] = useState(20)
  const [rangeHigh, setRangeHigh] = useState(75)
  const [price, setPriceLow] = useState(100)
  const [priceHigh, setPriceHigh] = useState(500)
  return (
    <>
      <Section title="Default (with value)">
        <Slider value={vol} onChange={setVol} min={0} max={100} showValue />
      </Section>
      <Section title="Custom Color">
        <Slider value={bright} onChange={setBright} min={0} max={100} showValue fillColor="#f59e0b" />
      </Section>
      <Section title="Step + Marks">
        <Slider value={stepped} onChange={setStepped} min={1} max={10} step={1} marks showValue />
      </Section>
      <Section title="Disabled">
        <Slider value={60} onChange={() => {}} min={0} max={100} disabled showValue />
      </Section>
      <Section title="Range Slider">
        <RangeSlider
          low={rangeLow}
          high={rangeHigh}
          min={0}
          max={100}
          onChange={(l, h) => { setRangeLow(l); setRangeHigh(h) }}
          showValue
        />
      </Section>
      <Section title="Range Slider (Price Filter)">
        <RangeSlider
          low={price}
          high={priceHigh}
          min={0}
          max={1000}
          step={10}
          onChange={(l, h) => { setPriceLow(l); setPriceHigh(h) }}
          showValue
          fillColor="#10b981"
          marks
        />
      </Section>
    </>
  )
}

function BadgePreview() {
  const [dismissed, setDismissed] = useState(false)
  return (
    <>
      <Section title="Solid">
        <View style={s.row}>
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </View>
      </Section>
      <Section title="Soft">
        <View style={s.row}>
          <Badge variant="default" appearance="soft">Default</Badge>
          <Badge variant="success" appearance="soft">Success</Badge>
          <Badge variant="destructive" appearance="soft">Error</Badge>
          <Badge variant="warning" appearance="soft">Warning</Badge>
          <Badge variant="info" appearance="soft">Info</Badge>
        </View>
      </Section>
      <Section title="Outline">
        <View style={s.row}>
          <Badge variant="default" appearance="outline">Default</Badge>
          <Badge variant="success" appearance="outline">Success</Badge>
          <Badge variant="destructive" appearance="outline">Error</Badge>
          <Badge variant="warning" appearance="outline">Warning</Badge>
          <Badge variant="info" appearance="outline">Info</Badge>
        </View>
      </Section>
      <Section title="Sizes">
        <View style={s.row}>
          <Badge variant="default" size="sm">Small</Badge>
          <Badge variant="default" size="md">Medium</Badge>
          <Badge variant="default" size="lg">Large</Badge>
        </View>
      </Section>
      <Section title="Live indicator (pulse)">
        <View style={s.row}>
          <Badge variant="success" appearance="soft" pulse>Live</Badge>
          <Badge variant="destructive" appearance="soft" pulse>Recording</Badge>
          <Badge variant="info" appearance="soft" dot>Online</Badge>
          <Badge variant="warning" appearance="soft" dot>Away</Badge>
        </View>
      </Section>
      <Section title="Count / Notification">
        <View style={s.row}>
          <Badge variant="destructive" count={3} />
          <Badge variant="default" count={12} />
          <Badge variant="secondary" count={150} maxCount={99} />
        </View>
      </Section>
      <Section title="Dismissible">
        <View style={s.row}>
          {!dismissed
            ? <Badge variant="info" appearance="soft" onDismiss={() => setDismissed(true)}>New Feature</Badge>
            : <Text variant="caption" muted>Dismissed</Text>}
          <Badge variant="success" appearance="soft" onDismiss={() => {}}>Beta</Badge>
        </View>
      </Section>
    </>
  )
}

// Professional headshots from randomuser.me
const PHOTOS = {
  sarah:   'https://randomuser.me/api/portraits/women/44.jpg',
  james:   'https://randomuser.me/api/portraits/men/32.jpg',
  priya:   'https://randomuser.me/api/portraits/women/68.jpg',
  marcus:  'https://randomuser.me/api/portraits/men/75.jpg',
  elena:   'https://randomuser.me/api/portraits/women/17.jpg',
  tom:     'https://randomuser.me/api/portraits/men/91.jpg',
}

function AvatarPreview() {
  return (
    <>
      <Section title="With image">
        <View style={s.row}>
          <Avatar size="lg" src={PHOTOS.sarah}  name="Sarah K" status="online" />
          <Avatar size="lg" src={PHOTOS.james}  name="James M" status="busy" />
          <Avatar size="lg" src={PHOTOS.priya}  name="Priya S" status="away" />
          <Avatar size="lg" src={PHOTOS.marcus} name="Marcus T" status="offline" />
        </View>
      </Section>
      <Section title="Sizes">
        <View style={[s.row, { alignItems: 'flex-end' }]}>
          <Avatar size="xs" src={PHOTOS.elena} name="Elena V" />
          <Avatar size="sm" src={PHOTOS.elena} name="Elena V" />
          <Avatar size="md" src={PHOTOS.elena} name="Elena V" />
          <Avatar size="lg" src={PHOTOS.elena} name="Elena V" />
          <Avatar size="xl" src={PHOTOS.elena} name="Elena V" />
        </View>
      </Section>
      <Section title="Initials fallback">
        <View style={s.row}>
          <Avatar size="md" name="Sarah Kim" />
          <Avatar size="md" name="Marcus T" />
          <Avatar size="md" name="Priya Singh" />
          <Avatar size="md" src="https://broken.xyz/img.jpg" name="Broken Image" />
        </View>
      </Section>
      <Section title="Square shape">
        <View style={s.row}>
          <Avatar size="md" src={PHOTOS.tom}   name="Tom R" shape="square" />
          <Avatar size="md" src={PHOTOS.priya} name="Priya S" shape="square" status="online" />
          <Avatar size="lg" name="Marcus T" shape="square" />
        </View>
      </Section>
      <Section title="Avatar group">
        <AvatarGroup
          size="md"
          max={4}
          avatars={[
            { src: PHOTOS.sarah,  name: 'Sarah K' },
            { src: PHOTOS.james,  name: 'James M' },
            { src: PHOTOS.priya,  name: 'Priya S' },
            { src: PHOTOS.marcus, name: 'Marcus T' },
            { src: PHOTOS.elena,  name: 'Elena V' },
            { src: PHOTOS.tom,    name: 'Tom R' },
          ]}
        />
      </Section>
    </>
  )
}

function TagPreview() {
  const [chips, setChips] = useState(['React Native', 'TypeScript', 'Expo', 'Reanimated', 'Redux'])
  const [filters, setFilters] = useState<string[]>(['Design'])
  const [topics, setTopics] = useState<string[]>([])

  return (
    <>
      <Section title="Filter chips (single select)">
        <TagGroup
          tags={[
            { label: 'All' },
            { label: 'Design' },
            { label: 'Engineering' },
            { label: 'Marketing' },
          ]}
          selected={filters}
          onChange={setFilters}
        />
      </Section>
      <Section title="Multi select">
        <TagGroup
          multiSelect
          tags={[
            { label: 'React Native', variant: 'primary' },
            { label: 'Swift', variant: 'info' },
            { label: 'Kotlin', variant: 'success' },
            { label: 'Flutter', variant: 'warning' },
            { label: 'Expo', variant: 'primary' },
          ]}
          selected={topics}
          onChange={setTopics}
        />
        {topics.length > 0 && (
          <Text variant="caption" muted style={{ marginTop: 8 }}>Selected: {topics.join(', ')}</Text>
        )}
      </Section>
      <Section title="Removable tags">
        <View style={s.row}>
          {chips.map((t) => (
            <Tag key={t} label={t} onRemove={() => setChips((p) => p.filter((x) => x !== t))} />
          ))}
        </View>
      </Section>
      <Section title="Variants">
        <View style={s.row}>
          <Tag label="Primary" variant="primary" selected />
          <Tag label="Success" variant="success" selected />
          <Tag label="Warning" variant="warning" selected />
          <Tag label="Error" variant="destructive" selected />
          <Tag label="Info" variant="info" selected />
        </View>
      </Section>
    </>
  )
}

function ProgressPreview() {
  const [val, setVal] = useState(65)
  return (
    <>
      <Section title="Linear (with label + value)">
        <Progress value={val} animated showValue label="Upload progress" />
        <View style={[s.row, { marginTop: 12 }]}>
          <Button size="sm" variant="outline" onPress={() => setVal((v) => Math.max(0, v - 10))}>-10%</Button>
          <Button size="sm" variant="outline" onPress={() => setVal((v) => Math.min(100, v + 10))}>+10%</Button>
        </View>
      </Section>
      <Section title="Sizes">
        <View style={s.gap}>
          <Progress value={val} size="sm" animated />
          <Progress value={val} size="md" animated />
          <Progress value={val} size="lg" animated />
        </View>
      </Section>
      <Section title="Custom Colors">
        <View style={s.gap}>
          <Progress value={80} color="#10b981" animated showValue label="Storage used" />
          <Progress value={45} color="#f59e0b" animated showValue label="CPU usage" />
          <Progress value={92} color="#ef4444" animated showValue label="Memory" />
        </View>
      </Section>
      <Section title="Indeterminate">
        <Progress value={0} indeterminate color="#6366f1" />
      </Section>
      <Section title="Circular">
        <View style={s.row}>
          <Progress value={val} variant="circular" size="sm" showValue />
          <Progress value={val} variant="circular" size="md" showValue />
          <Progress value={val} variant="circular" size="lg" showValue />
          <Progress value={val} variant="circular" size="lg" color="#10b981" showValue />
        </View>
      </Section>
    </>
  )
}

function SkeletonPreview() {
  return (
    <>
      <Section title="Shimmer (default)">
        <View style={s.gap}>
          <SkeletonAvatar size={44} variant="shimmer" />
          <SkeletonAvatar size={44} variant="shimmer" />
          <SkeletonAvatar size={44} variant="shimmer" />
        </View>
      </Section>
      <Section title="Card skeleton">
        <SkeletonCard imageHeight={140} lines={3} variant="shimmer" />
      </Section>
      <Section title="Text lines">
        <SkeletonText lines={4} lastLineWidth="45%" variant="shimmer" />
      </Section>
      <Section title="Pulse variant">
        <View style={s.gap}>
          <SkeletonAvatar size={44} variant="pulse" />
          <SkeletonText lines={3} variant="pulse" />
        </View>
      </Section>
    </>
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
  const theme = useTheme()
  return (
    <>
      <Section title="Variants">
        <View style={s.gap}>
          {(['elevated', 'outline', 'flat'] as const).map(v => (
            <Card key={v} variant={v}>
              <CardHeader title={v.charAt(0).toUpperCase() + v.slice(1)} subtitle="variant prop" />
              <CardContent>
                <Text variant="body" muted>Card with {v} style.</Text>
              </CardContent>
            </Card>
          ))}
        </View>
      </Section>

      <Section title="With leading / trailing / description">
        <Card variant="outline">
          <CardHeader
            title="Team workspace"
            subtitle="Up to 10 members"
            description="Manage members, billing, and settings for your team."
            leading={
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: theme.colors.primary + '33', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>TW</Text>
              </View>
            }
            trailing={
              <View style={{ paddingVertical: 3, paddingHorizontal: 8, borderRadius: 99, backgroundColor: theme.colors.primary + '22' }}>
                <Text style={{ color: theme.colors.primary, fontSize: 11, fontWeight: '600' }}>Pro</Text>
              </View>
            }
          />
          <CardFooter separated align="apart">
            <Text variant="caption" muted>3 / 10 seats</Text>
            <View style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 7, backgroundColor: theme.colors.primary }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Invite</Text>
            </View>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Pressable + spring animation">
        <View style={s.gap}>
          <Card variant="outline" onPress={() => {}}>
            <CardHeader
              title="Open settings"
              subtitle="Tap to navigate"
              leading={<Ionicons name="settings-outline" size={22} color={theme.colors.primary} />}
              trailing={<Ionicons name="chevron-forward" size={16} color={theme.colors.mutedForeground} />}
            />
          </Card>
          <Card variant="elevated" onPress={() => {}}>
            <CardHeader
              title="Monthly Report"
              subtitle="March 2026"
              leading={<Ionicons name="bar-chart-outline" size={22} color={theme.colors.primary} />}
            />
            <CardContent>
              <Text variant="body" muted>Revenue grew 14% this month.</Text>
            </CardContent>
          </Card>
        </View>
      </Section>

      <Section title="Accent stripe">
        <View style={s.gap}>
          {[
            { title: 'Deployment ready', sub: 'main · 2 min ago', color: '#22c55e' },
            { title: 'Review required', sub: '2 approvals needed', color: '#f59e0b' },
            { title: 'Build failed', sub: 'Step 4/6 failed', color: '#ef4444' },
          ].map(item => (
            <Card key={item.title} variant="outline" accent={item.color}>
              <CardHeader
                title={item.title}
                subtitle={item.sub}
                leading={<Ionicons name="git-branch-outline" size={18} color={item.color} />}
              />
            </Card>
          ))}
        </View>
      </Section>

      <Section title="Loading skeleton">
        <Card loading />
      </Section>
    </>
  )
}

function TabsPreview() {
  const [tab1, setTab1] = useState('overview')
  const [tab2, setTab2] = useState('overview')
  const [tab3, setTab3] = useState('overview')
  const theme = useTheme()
  const items = [
    { key: 'overview', label: 'Overview', icon: <Ionicons name="home-outline" size={14} color={tab1 === 'overview' ? theme.colors.primary : theme.colors.muted} /> },
    { key: 'features', label: 'Features', badge: 3 },
    { key: 'pricing', label: 'Pricing' },
    { key: 'docs', label: 'Docs', disabled: true },
  ]
  return (
    <>
      <Section title="Underline (default)">
        <Tabs items={items} activeKey={tab1} onChange={setTab1} />
        <Text variant="body" muted style={{ marginTop: 12 }}>Active: {tab1}</Text>
      </Section>
      <Section title="Pill">
        <Tabs items={[
          { key: 'overview', label: 'Overview' },
          { key: 'features', label: 'Features' },
          { key: 'pricing', label: 'Pricing' },
        ]} activeKey={tab2} onChange={setTab2} variant="pill" />
      </Section>
      <Section title="Card / Segmented">
        <Tabs items={[
          { key: 'overview', label: 'Overview' },
          { key: 'features', label: 'Features' },
          { key: 'pricing', label: 'Pricing' },
        ]} activeKey={tab3} onChange={setTab3} variant="card" />
      </Section>
    </>
  )
}

function AccordionPreview() {
  const theme = useTheme()
  const items = [
    {
      key: 'q1', title: 'What is native-mate?',
      icon: <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />,
      content: <Text variant="body" muted>A copy-paste React Native component library with a CLI.</Text>,
    },
    {
      key: 'q2', title: 'Is it free?',
      icon: <Ionicons name="card-outline" size={16} color={theme.colors.primary} />,
      content: <Text variant="body" muted>Yes, fully open source under MIT license.</Text>,
    },
    {
      key: 'q3', title: 'Does it support dark mode?',
      icon: <Ionicons name="moon-outline" size={16} color={theme.colors.primary} />,
      content: <Text variant="body" muted>Yes, with built-in light and dark token sets.</Text>,
    },
    {
      key: 'q4', title: 'Disabled item', disabled: true,
      content: <Text variant="body" muted>You can't open this one.</Text>,
    },
  ]
  return (
    <>
      <Section title="Ghost (default)">
        <Accordion items={items} defaultOpen={['q1']} />
      </Section>
      <Section title="Bordered">
        <Accordion items={items} variant="bordered" />
      </Section>
      <Section title="Card">
        <Accordion items={items} variant="card" allowMultiple />
      </Section>
    </>
  )
}

function EmptyStatePreview() {
  const theme = useTheme()
  return (
    <>
      <Section title="Default">
        <EmptyState
          icon={<Ionicons name="search-outline" size={24} color={theme.colors.muted} />}
          title="No results found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={{ label: 'Clear filters', onPress: () => {} }}
          secondaryAction={{ label: 'Browse all items', onPress: () => {} }}
        />
      </Section>
      <Section title="Compact">
        <EmptyState
          variant="compact"
          icon={<Ionicons name="mail-outline" size={20} color={theme.colors.muted} />}
          title="No messages"
          description="Your inbox is empty. Messages you receive will appear here."
          action={{ label: 'Compose', onPress: () => {}, variant: 'outline' }}
        />
      </Section>
      <Section title="Illustration">
        <EmptyState
          variant="illustration"
          icon={<Ionicons name="cloud-offline-outline" size={36} color={theme.colors.primary} />}
          title="You're offline"
          description="Check your connection and try again."
          action={{ label: 'Retry', onPress: () => {} }}
        />
      </Section>
    </>
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
  const [config, setConfig] = useState<any>(null)
  const [show, setShow] = useState(false)

  const fire = (cfg: any) => {
    setConfig(cfg)
    setShow(false)
    setTimeout(() => setShow(true), 50)
  }

  return (
    <>
      <Section title="Variants">
        <View style={s.row}>
          <Button size="sm" onPress={() => fire({ variant: 'success', message: 'Changes saved' })}>
            Success
          </Button>
          <Button size="sm" variant="destructive" onPress={() => fire({ variant: 'destructive', message: 'Something went wrong', description: 'Please try again.' })}>
            Error
          </Button>
          <Button size="sm" variant="outline" onPress={() => fire({ variant: 'warning', message: 'Unsaved changes' })}>
            Warning
          </Button>
          <Button size="sm" variant="secondary" onPress={() => fire({ variant: 'default', message: 'Update available' })}>
            Info
          </Button>
        </View>
      </Section>
      <Section title="Notification with avatar">
        <View style={s.gap}>
          <Button size="sm" variant="outline" onPress={() => fire({
            variant: 'default',
            message: 'Sarah liked your post',
            description: '"Building with native-mate is 🔥"',
            avatar: { uri: PHOTOS.sarah },
            actions: [{ label: 'View', onPress: () => setShow(false), variant: 'primary' }],
            duration: 5000,
          })}>
            Like notification
          </Button>
          <Button size="sm" variant="outline" onPress={() => fire({
            variant: 'default',
            message: 'James sent you a message',
            description: 'Hey! Are you free this weekend?',
            avatar: { uri: PHOTOS.james },
            actions: [
              { label: 'Reply', onPress: () => setShow(false), variant: 'primary' },
              { label: 'Dismiss', onPress: () => setShow(false) },
            ],
            duration: 6000,
          })}>
            Message notification
          </Button>
        </View>
      </Section>
      <Section title="With action + progress">
        <View style={s.row}>
          <Button size="sm" variant="outline" onPress={() => fire({
            variant: 'default', message: 'Email sent', showProgress: true,
            action: { label: 'Undo', onPress: () => setShow(false) },
          })}>
            Undo action
          </Button>
          <Button size="sm" variant="outline" onPress={() => fire({
            variant: 'success', message: 'File uploaded!', showProgress: true,
          })}>
            Progress bar
          </Button>
        </View>
      </Section>
      <Section title="Position">
        <View style={s.row}>
          <Button size="sm" variant="outline" onPress={() => fire({ variant: 'success', message: 'Appears at top', position: 'top' })}>Top</Button>
          <Button size="sm" variant="outline" onPress={() => fire({ variant: 'success', message: 'Appears at bottom' })}>Bottom</Button>
        </View>
      </Section>
      {config && (
        <Toast
          visible={show}
          onHide={() => setShow(false)}
          duration={config.duration ?? 3000}
          {...config}
        />
      )}
    </>
  )
}

function TooltipPreview() {
  return (
    <>
      <Section title="Placements">
        <View style={s.row}>
          <Tooltip content="Top tooltip" placement="top">
            <Button size="sm" variant="outline">Top</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" placement="bottom">
            <Button size="sm" variant="outline">Bottom</Button>
          </Tooltip>
          <Tooltip content="Left tooltip" placement="left">
            <Button size="sm" variant="outline">Left</Button>
          </Tooltip>
          <Tooltip content="Right tooltip" placement="right">
            <Button size="sm" variant="outline">Right</Button>
          </Tooltip>
        </View>
      </Section>
      <Section title="Custom delay">
        <View style={s.row}>
          <Tooltip content="Hold longer" delay={800} placement="top">
            <Button size="sm" variant="outline">Slow (800ms)</Button>
          </Tooltip>
          <Tooltip content="Instant!" delay={0} placement="bottom">
            <Button size="sm" variant="outline">Instant</Button>
          </Tooltip>
        </View>
      </Section>
    </>
  )
}

function PopoverPreview() {
  const MENU = [
    { label: 'Edit', destructive: false },
    { label: 'Duplicate', destructive: false },
    { label: 'Delete', destructive: true },
  ]
  return (
    <>
      <Section title="Context menu">
        <View style={s.row}>
          <Popover
            placement="bottom"
            content={
              <View style={{ paddingVertical: 4 }}>
                {MENU.map((item, i) => (
                  <View key={item.label}>
                    {i > 0 && <View style={{ height: 1, backgroundColor: '#27272a' }} />}
                    <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
                      <Text style={{ fontSize: 15, color: item.destructive ? '#ef4444' : '#fafafa' }}>{item.label}</Text>
                    </View>
                  </View>
                ))}
              </View>
            }
          >
            <Button size="sm" variant="outline">Options</Button>
          </Popover>
        </View>
      </Section>
      <Section title="Placements">
        <View style={s.row}>
          {(['top', 'bottom', 'left', 'right'] as const).map(p => (
            <Popover
              key={p}
              placement={p}
              content={<View style={{ padding: 12 }}><Text style={{ color: '#fafafa', fontSize: 13 }}>{p}</Text></View>}
            >
              <Button size="sm" variant="outline">{p.charAt(0).toUpperCase() + p.slice(1)}</Button>
            </Popover>
          ))}
        </View>
      </Section>
    </>
  )
}

function OtpInputPreview() {
  const [v6, setV6] = useState('')
  const [v4, setV4] = useState('')
  const [secure, setSecure] = useState('')
  const [under, setUnder] = useState('')
  const [round, setRound] = useState('')
  const [alpha, setAlpha] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  return (
    <>
      <Section title="Default (6-digit)">
        <OTPInput value={v6} onChange={setV6} onComplete={() => {}} length={6} hint="Enter the code sent to your email" resend onResend={() => {}} resendCooldown={30} />
      </Section>
      <Section title="4-digit PIN">
        <OTPInput value={v4} onChange={setV4} length={4} hint="Enter your 4-digit PIN" />
      </Section>
      <Section title="Secure (masked)">
        <OTPInput value={secure} onChange={setSecure} length={6} secure hint="Digits are hidden as you type" />
      </Section>
      <Section title="Underline variant">
        <OTPInput value={under} onChange={setUnder} length={6} variant="underline" />
      </Section>
      <Section title="Rounded variant">
        <OTPInput value={round} onChange={setRound} length={6} variant="rounded" />
      </Section>
      <Section title="Alphanumeric">
        <OTPInput value={alpha} onChange={setAlpha} length={5} type="alphanumeric" hint="Letters and numbers" />
      </Section>
      <Section title="Error state (shake)">
        <OTPInput value={err} onChange={setErr} length={6} error errorMessage="Invalid code. Please try again." />
      </Section>
      <Section title="Success state">
        <OTPInput value="123456" onChange={() => {}} length={6} success hint="Code verified successfully!" />
      </Section>
      <Section title="Disabled">
        <OTPInput value="1234" onChange={() => {}} length={6} disabled />
      </Section>
    </>
  )
}

const COUNTRIES = [
  { label: 'India', value: 'in', description: 'South Asia' },
  { label: 'United States', value: 'us', description: 'North America' },
  { label: 'United Kingdom', value: 'uk', description: 'Europe' },
  { label: 'Germany', value: 'de', description: 'Europe' },
  { label: 'Japan', value: 'jp', description: 'East Asia' },
  { label: 'Canada', value: 'ca', description: 'North America' },
  { label: 'Australia', value: 'au', description: 'Oceania' },
  { label: 'Brazil', value: 'br', description: 'South America' },
  { label: 'France', value: 'fr', description: 'Europe' },
  { label: 'South Korea', value: 'kr', description: 'East Asia' },
]

const GROUPED_OPTIONS = [
  {
    label: 'Frontend',
    options: [
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Angular', value: 'angular' },
    ],
  },
  {
    label: 'Mobile',
    options: [
      { label: 'React Native', value: 'rn' },
      { label: 'Flutter', value: 'flutter' },
      { label: 'Swift', value: 'swift', disabled: true },
    ],
  },
]

function SelectPreview() {
  const [country, setCountry] = useState('')
  const [searchable, setSearchable] = useState('')
  const [clearable, setClearable] = useState('us')
  const [grouped, setGrouped] = useState('')
  const [multi, setMulti] = useState<string[]>([])
  const [multiCapped, setMultiCapped] = useState<string[]>([])
  return (
    <>
      <Section title="Default">
        <Select
          label="Country"
          placeholder="Select country"
          options={COUNTRIES}
          value={country}
          onChange={setCountry}
          required
        />
      </Section>
      <Section title="Searchable">
        <Select
          label="Search countries"
          placeholder="Select country"
          options={COUNTRIES}
          value={searchable}
          onChange={setSearchable}
          searchable
          searchPlaceholder="Type to search..."
        />
      </Section>
      <Section title="Clearable">
        <Select
          label="Region"
          options={COUNTRIES}
          value={clearable}
          onChange={setClearable}
          clearable
        />
      </Section>
      <Section title="Option Descriptions">
        <Select
          label="Country"
          placeholder="Pick one"
          options={COUNTRIES}
          value={country}
          onChange={setCountry}
        />
      </Section>
      <Section title="Grouped Options">
        <Select
          label="Tech stack"
          placeholder="Choose technology"
          options={[]}
          groups={GROUPED_OPTIONS}
          value={grouped}
          onChange={setGrouped}
        />
      </Section>
      <Section title="Multi-select">
        <MultiSelect
          label="Skills"
          placeholder="Select skills"
          options={[
            { label: 'TypeScript', value: 'ts' },
            { label: 'React Native', value: 'rn' },
            { label: 'GraphQL', value: 'gql' },
            { label: 'Node.js', value: 'node' },
            { label: 'Python', value: 'py' },
          ]}
          value={multi}
          onChange={setMulti}
          searchable
          clearable
        />
        <Text variant="caption" muted style={{ marginTop: 6 }}>Selected: {multi.join(', ') || 'none'}</Text>
      </Section>
      <Section title="Multi-select (max 3)">
        <MultiSelect
          label="Hobbies (max 3)"
          placeholder="Select up to 3"
          options={[
            { label: 'Reading', value: 'reading' },
            { label: 'Gaming', value: 'gaming' },
            { label: 'Cooking', value: 'cooking' },
            { label: 'Travel', value: 'travel' },
            { label: 'Music', value: 'music' },
          ]}
          value={multiCapped}
          onChange={setMultiCapped}
          maxSelections={3}
        />
      </Section>
      <Section title="Error State">
        <Select
          label="Country"
          placeholder="Select country"
          options={COUNTRIES}
          value=""
          onChange={() => {}}
          error="Please select a country to continue."
          required
        />
      </Section>
      <Section title="Disabled">
        <Select
          label="Region (locked)"
          options={COUNTRIES}
          value="in"
          onChange={() => {}}
          disabled
        />
      </Section>
    </>
  )
}

// ─── Text preview ──────────────────────────────────────────────────────────────

function TextPreview() {
  return (
    <>
      <Section title="Variants">
        <View style={s.gap}>
          <NMText variant="h1">Heading 1</NMText>
          <NMText variant="h2">Heading 2</NMText>
          <NMText variant="h3">Heading 3</NMText>
          <NMText variant="h4">Heading 4</NMText>
          <NMText variant="h5">Heading 5</NMText>
          <NMText variant="h6">Heading 6</NMText>
          <NMText variant="bodyLarge">Body Large</NMText>
          <NMText variant="body">Body (default)</NMText>
          <NMText variant="bodySmall">Body Small</NMText>
          <NMText variant="label">Label</NMText>
          <NMText variant="caption">Caption</NMText>
          <NMText variant="overline">Overline</NMText>
          <NMText variant="code">{'const x = 42'}</NMText>
        </View>
      </Section>

      <Section title="Weights">
        <View style={s.gap}>
          {(['light','regular','medium','semibold','bold','extrabold'] as const).map(w => (
            <NMText key={w} weight={w} style={{ textTransform: 'capitalize' }}>{w}</NMText>
          ))}
        </View>
      </Section>

      <Section title="Colors">
        <View style={s.gap}>
          <NMText color="foreground">Foreground</NMText>
          <NMText color="muted">Muted</NMText>
          <NMText color="primary">Primary</NMText>
          <NMText color="success">Success</NMText>
          <NMText color="warning">Warning</NMText>
          <NMText color="destructive">Destructive</NMText>
          <NMText color="#a78bfa">Custom hex #a78bfa</NMText>
          <NMText muted>Muted shorthand prop</NMText>
        </View>
      </Section>

      <Section title="Alignment">
        <View style={s.gap}>
          <NMText align="left">Left aligned</NMText>
          <NMText align="center">Center aligned</NMText>
          <NMText align="right">Right aligned</NMText>
        </View>
      </Section>

      <Section title="Transform">
        <View style={s.gap}>
          <NMText transform="uppercase">uppercase text</NMText>
          <NMText transform="capitalize">capitalize each word</NMText>
          <NMText transform="lowercase">LOWERCASE TEXT</NMText>
        </View>
      </Section>

      <Section title="Truncation">
        <NMText numberOfLines={2}>
          This is a very long piece of text that will be clipped after two lines. Assistive technology will still read the full string.
        </NMText>
      </Section>
    </>
  )
}

// ─── Icon preview ──────────────────────────────────────────────────────────────

function IconPreview() {
  const icons = [
    'home','person','settings','search','notifications',
    'heart','star','bookmark','camera','mail',
    'call','chatbubble','share','cloud','trash',
  ]
  return (
    <>
      <Section title="Icon grid">
        <View style={[s.row, { justifyContent: 'flex-start' }]}>
          {icons.map(n => <Icon key={n} name={n as any} size="lg" />)}
        </View>
      </Section>

      <Section title="Sizes">
        <View style={[s.row, { alignItems: 'flex-end' }]}>
          {(['xs','sm','md','lg','xl','2xl'] as const).map(sz => (
            <Icon key={sz} name="star" size={sz} color="primary" />
          ))}
          <Icon name="star" size={52} color="primary" />
        </View>
      </Section>

      <Section title="Color tokens">
        <View style={s.row}>
          <Icon name="checkmark-circle"    color="success"     size="xl" />
          <Icon name="alert-circle"        color="warning"     size="xl" />
          <Icon name="close-circle"        color="destructive" size="xl" />
          <Icon name="information-circle"  color="primary"     size="xl" />
          <Icon name="person-circle"       color="foreground"  size="xl" />
          <Icon name="help-circle"         color="muted"       size="xl" />
        </View>
      </Section>

      <Section title="Custom color & opacity">
        <View style={s.row}>
          <Icon name="heart" size="xl" color="#f43f5e" />
          <Icon name="heart" size="xl" color="#f43f5e" opacity={0.5} />
          <Icon name="heart" size="xl" color="#f43f5e" opacity={0.2} />
        </View>
      </Section>

      <Section title="Filled vs Outline">
        <View style={s.row}>
          <Icon name="heart"            size="lg" color="primary" />
          <Icon name="heart-outline"    size="lg" color="primary" />
          <Icon name="star"             size="lg" color="warning" />
          <Icon name="star-outline"     size="lg" color="warning" />
          <Icon name="bookmark"         size="lg" />
          <Icon name="bookmark-outline" size="lg" />
        </View>
      </Section>
    </>
  )
}

// ─── Spinner preview ───────────────────────────────────────────────────────────

function SpinnerPreview() {
  return (
    <>
      <Section title="Variants">
        <View style={[s.row, { gap: 28 }]}>
          <Spinner variant="circle" />
          <Spinner variant="dots" />
          <Spinner variant="pulse" />
        </View>
      </Section>

      <Section title="Sizes">
        <View style={[s.row, { alignItems: 'center', gap: 24 }]}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size={52} />
        </View>
      </Section>

      <Section title="Colors">
        <View style={[s.row, { gap: 20 }]}>
          <Spinner color="primary" />
          <Spinner color="success" />
          <Spinner color="warning" />
          <Spinner color="destructive" />
          <Spinner color="foreground" />
          <Spinner color="muted" />
          <Spinner color="#a78bfa" />
        </View>
      </Section>

      <Section title="Speed">
        <View style={[s.row, { gap: 28 }]}>
          <Spinner speed="slow" />
          <Spinner speed="normal" />
          <Spinner speed="fast" />
        </View>
      </Section>

      <Section title="Dots — sizes">
        <View style={[s.row, { gap: 28, alignItems: 'center' }]}>
          <Spinner variant="dots" size="sm" color="muted" />
          <Spinner variant="dots" size="md" color="primary" />
          <Spinner variant="dots" size="lg" color="success" />
        </View>
      </Section>

      <Section title="Pulse — sizes">
        <View style={[s.row, { gap: 24, alignItems: 'center' }]}>
          <Spinner variant="pulse" size="sm" color="primary" />
          <Spinner variant="pulse" size="md" color="warning" />
          <Spinner variant="pulse" size="lg" color="destructive" />
        </View>
      </Section>
    </>
  )
}

// ─── Separator preview ─────────────────────────────────────────────────────────

function SeparatorPreview() {
  return (
    <>
      <Section title="Default">
        <Separator />
      </Section>

      <Section title="With label">
        <Separator label="or" />
        <Separator label="continue with email" />
        <Separator label="today" />
      </Section>

      <Section title="Dashed">
        <Separator dashed />
        <Separator dashed label="or" />
      </Section>

      <Section title="Thickness & color">
        <Separator thickness={1} />
        <Separator thickness={2} color="#6366f1" />
        <Separator thickness={4} color="#22c55e" />
      </Section>

      <Section title="Vertical (in toolbar row)">
        <View style={[s.row, { height: 44 }]}>
          <Button variant="ghost" size="sm">Cut</Button>
          <Separator orientation="vertical" spacing={4} />
          <Button variant="ghost" size="sm">Copy</Button>
          <Separator orientation="vertical" spacing={4} />
          <Button variant="ghost" size="sm">Paste</Button>
        </View>
      </Section>

      <Section title="Spacing">
        <Separator spacing={4}  label="tight (4dp)" />
        <Separator spacing={16} label="normal (16dp)" />
        <Separator spacing={24} label="loose (24dp)" />
      </Section>
    </>
  )
}

const previews: Record<string, React.FC> = {
  text: TextPreview,
  icon: IconPreview,
  spinner: SpinnerPreview,
  separator: SeparatorPreview,
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
  popover: PopoverPreview,
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <ScrollView
          style={s.container}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {Preview ? <Preview /> : <Text variant="body" muted>No preview for "{component}"</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 20, paddingBottom: 120 },
  section: { marginBottom: 28 },
  sectionTitle: { textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontSize: 11 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  gap: { gap: 14 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
})
