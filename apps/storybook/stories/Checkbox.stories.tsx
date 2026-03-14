import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Checkbox } from '../../../packages/registry/components/checkbox/checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
}

export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <Checkbox checked={checked} onCheckedChange={setChecked} label="Accept terms" />
  },
}

export const AllStates: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Checkbox checked={false} onCheckedChange={() => {}} label="Unchecked" />
      <Checkbox checked={true} onCheckedChange={() => {}} label="Checked" />
      <Checkbox checked={false} onCheckedChange={() => {}} label="Disabled" disabled />
    </View>
  ),
}
