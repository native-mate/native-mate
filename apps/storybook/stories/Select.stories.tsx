import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Select } from '../../../packages/registry/components/select/select'

const meta: Meta = {
  title: 'Input/Select',
}

export default meta
type Story = StoryObj<typeof meta>

const FRUIT_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Mango', value: 'mango' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <Select options={FRUIT_OPTIONS} value={value} onChange={setValue} placeholder="Select a fruit" />
      </View>
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <Select options={FRUIT_OPTIONS} value={value} onChange={setValue} placeholder="Select a fruit" label="Favourite fruit" />
      </View>
    )
  },
}

export const Prefilled: Story = {
  render: () => {
    const [value, setValue] = useState('banana')
    return (
      <View style={{ padding: 16 }}>
        <Select options={FRUIT_OPTIONS} value={value} onChange={setValue} label="Favourite fruit" />
      </View>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Select options={FRUIT_OPTIONS} value="apple" onChange={() => {}} label="Favourite fruit" disabled />
    </View>
  ),
}
