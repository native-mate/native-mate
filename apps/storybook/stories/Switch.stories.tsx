import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Switch } from '../../../packages/registry/components/switch/switch'
import { Text } from '@native-mate/core'

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
}

export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: () => {
    const [on, setOn] = useState(false)
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Switch value={on} onValueChange={setOn} />
        <Text>{on ? 'On' : 'Off'}</Text>
      </View>
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Switch value={false} onValueChange={() => {}} />
        <Text color="muted">Off</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Switch value={true} onValueChange={() => {}} />
        <Text color="muted">On</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Switch value={false} onValueChange={() => {}} disabled />
        <Text color="muted">Disabled</Text>
      </View>
    </View>
  ),
}
