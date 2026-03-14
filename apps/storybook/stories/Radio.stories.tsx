import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Radio, RadioGroup } from '../../../packages/registry/components/radio/radio'

const meta: Meta = {
  title: 'Input/Radio',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState(false)
    return (
      <View style={{ padding: 16 }}>
        <Radio selected={selected} onSelect={() => setSelected(!selected)} label="Option A" />
      </View>
    )
  },
}

export const Selected: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Radio selected onSelect={() => {}} label="Selected option" />
    </View>
  ),
}

export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 12, padding: 16 }}>
      <Radio selected={false} onSelect={() => {}} label="Disabled unselected" disabled />
      <Radio selected onSelect={() => {}} label="Disabled selected" disabled />
    </View>
  ),
}

export const Group: Story = {
  render: () => {
    const [value, setValue] = useState('b')
    return (
      <View style={{ padding: 16 }}>
        <RadioGroup
          options={[
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
            { label: 'Option C', value: 'c' },
          ]}
          value={value}
          onChange={setValue}
        />
      </View>
    )
  },
}

export const GroupDisabled: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <RadioGroup
        options={[
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
          { label: 'Option C', value: 'c' },
        ]}
        value="a"
        onChange={() => {}}
        disabled
      />
    </View>
  ),
}
