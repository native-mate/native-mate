import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Text } from '../../../packages/core/src/components/Text/Text'
import { Checkbox, CheckboxGroup } from '../../../packages/registry/components/checkbox/checkbox'

const meta: Meta = { title: 'Forms/Checkbox' }
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <View style={{ padding: 16 }}>
        <Checkbox checked={checked} onChange={setChecked} label="Accept terms & conditions" />
      </View>
    )
  },
}

export const WithDescription: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <View style={{ padding: 16 }}>
        <Checkbox checked={checked} onChange={setChecked} label="Subscribe to newsletter" description="Get weekly updates about new components." />
      </View>
    )
  },
}

export const Indeterminate: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 12 }}>
      <Checkbox checked={false} indeterminate onChange={() => {}} label="Select all (partial)" description="3 of 10 selected" />
    </View>
  ),
}

export const Sizes: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 12 }}>
      <Checkbox checked size="sm" onChange={() => {}} label="Small" />
      <Checkbox checked size="md" onChange={() => {}} label="Medium (default)" />
      <Checkbox checked size="lg" onChange={() => {}} label="Large" />
    </View>
  ),
}

export const CustomColors: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 12 }}>
      <Checkbox checked onChange={() => {}} label="Emerald" color="#10b981" />
      <Checkbox checked onChange={() => {}} label="Rose" color="#f43f5e" />
      <Checkbox checked onChange={() => {}} label="Violet" color="#8b5cf6" />
    </View>
  ),
}

export const LabelLeft: Story = {
  render: () => {
    const [v, setV] = useState(true)
    return (
      <View style={{ padding: 16 }}>
        <Checkbox checked={v} onChange={setV} label="Dark mode" labelPosition="left" />
      </View>
    )
  },
}

export const WithError: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Checkbox checked={false} onChange={() => {}} label="Accept terms" error="You must accept the terms to continue." />
    </View>
  ),
}

export const DisabledStates: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 12 }}>
      <Checkbox checked={false} onChange={() => {}} label="Disabled unchecked" disabled />
      <Checkbox checked onChange={() => {}} label="Disabled checked" disabled />
    </View>
  ),
}

export const Group: Story = {
  render: () => {
    const [value, setValue] = useState(['ts'])
    return (
      <View style={{ padding: 16, gap: 8 }}>
        <CheckboxGroup
          label="Technologies"
          options={[
            { label: 'TypeScript', value: 'ts', description: 'Typed JavaScript' },
            { label: 'React Native', value: 'rn' },
            { label: 'Expo', value: 'expo' },
            { label: 'GraphQL', value: 'gql', disabled: true },
          ]}
          value={value}
          onChange={setValue}
        />
        <Text variant="caption" muted>Selected: {value.join(', ')}</Text>
      </View>
    )
  },
}

export const HorizontalGroup: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <View style={{ padding: 16 }}>
        <CheckboxGroup
          label="Days"
          options={[
            { label: 'Mon', value: 'mon' },
            { label: 'Tue', value: 'tue' },
            { label: 'Wed', value: 'wed' },
            { label: 'Thu', value: 'thu' },
            { label: 'Fri', value: 'fri' },
          ]}
          value={value}
          onChange={setValue}
          horizontal
        />
      </View>
    )
  },
}
