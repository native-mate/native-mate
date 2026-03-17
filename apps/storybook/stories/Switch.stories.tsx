import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Switch } from '../../../packages/registry/components/switch/switch'

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
  args: { value: false, size: 'md', labelPosition: 'right' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    labelPosition: { control: 'select', options: ['left', 'right'] },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: () => {
    const [on, setOn] = useState(false)
    return <Switch value={on} onValueChange={setOn} label={on ? 'Enabled' : 'Disabled'} />
  },
}

export const WithLabelAndDescription: Story = {
  render: () => {
    const [on, setOn] = useState(true)
    return (
      <Switch
        value={on}
        onValueChange={setOn}
        label="Push notifications"
        description="Receive alerts when something important happens"
      />
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <Switch value={true} onValueChange={() => {}} size="sm" label="Small" />
      <Switch value={true} onValueChange={() => {}} size="md" label="Medium" />
      <Switch value={true} onValueChange={() => {}} size="lg" label="Large" />
    </View>
  ),
}

export const CustomColor: Story = {
  render: () => {
    const [a, setA] = useState(true)
    const [b, setB] = useState(false)
    return (
      <View style={{ gap: 16 }}>
        <Switch value={a} onValueChange={setA} label="Success green" color="#10b981" />
        <Switch value={b} onValueChange={setB} label="Amber warning" color="#f59e0b" />
        <Switch value={true} onValueChange={() => {}} label="Rose" color="#f43f5e" />
      </View>
    )
  },
}

export const LabelLeft: Story = {
  render: () => {
    const [on, setOn] = useState(false)
    return (
      <Switch
        value={on}
        onValueChange={setOn}
        label="Dark mode"
        description="Toggles the color scheme"
        labelPosition="left"
      />
    )
  },
}

export const Loading: Story = {
  render: () => {
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(false)
    return (
      <Switch
        value={value}
        onValueChange={(v) => {
          setLoading(true)
          setTimeout(() => { setLoading(false); setValue(v) }, 1500)
        }}
        label={loading ? 'Saving…' : 'Auto-save'}
        loading={loading}
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Switch value={false} onValueChange={() => {}} label="Disabled off" disabled />
      <Switch value={true} onValueChange={() => {}} label="Disabled on" disabled />
    </View>
  ),
}
