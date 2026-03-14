import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Textarea } from '../../../packages/registry/components/textarea/textarea'

const meta: Meta = {
  title: 'Input/Textarea',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <Textarea value={value} onChangeText={setValue} placeholder="Enter your message..." />
      </View>
    )
  },
}

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <Textarea label="Message" value={value} onChangeText={setValue} placeholder="Write something..." hint="Max 500 characters" />
      </View>
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('Bad input')
    return (
      <View style={{ padding: 16 }}>
        <Textarea label="Bio" value={value} onChangeText={setValue} error="This field contains invalid content." />
      </View>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Textarea label="Notes" value="Read-only content here." onChangeText={() => {}} disabled />
    </View>
  ),
}

export const TallRows: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <Textarea label="Description" value={value} onChangeText={setValue} placeholder="Detailed description..." rows={8} />
      </View>
    )
  },
}
