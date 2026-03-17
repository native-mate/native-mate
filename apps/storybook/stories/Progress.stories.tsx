import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Progress } from '../../../packages/registry/components/progress/progress'
import { Button } from '../../../packages/registry/components/button/button'

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  args: { value: 60, variant: 'linear', size: 'md' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 5 } },
    variant: { control: 'select', options: ['linear', 'circular'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Linear: Story = { args: { variant: 'linear' } }
export const Circular: Story = { args: { variant: 'circular', showValue: true } }

export const LinearWithLabel: Story = {
  render: () => {
    const [v, setV] = useState(65)
    return (
      <View style={{ gap: 16 }}>
        <Progress value={v} animated showValue label="Upload progress" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button size="sm" variant="outline" onPress={() => setV((x) => Math.max(0, x - 10))}>-10</Button>
          <Button size="sm" variant="outline" onPress={() => setV((x) => Math.min(100, x + 10))}>+10</Button>
        </View>
      </View>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Progress value={65} size="sm" showValue label="Small" />
      <Progress value={65} size="md" showValue label="Medium" />
      <Progress value={65} size="lg" showValue label="Large" />
    </View>
  ),
}

export const CustomColors: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Progress value={80} color="#10b981" showValue label="Storage" />
      <Progress value={45} color="#f59e0b" showValue label="CPU" />
      <Progress value={92} color="#ef4444" showValue label="Memory" />
    </View>
  ),
}

export const Indeterminate: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Progress value={0} indeterminate color="#6366f1" />
      <Progress value={0} indeterminate color="#10b981" size="lg" />
    </View>
  ),
}

export const CircularGroup: Story = {
  render: () => {
    const [v, setV] = useState(70)
    return (
      <View style={{ gap: 20 }}>
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
          <Progress value={v} variant="circular" size="sm" showValue />
          <Progress value={v} variant="circular" size="md" showValue />
          <Progress value={v} variant="circular" size="lg" showValue />
          <Progress value={v} variant="circular" size="lg" color="#10b981" showValue />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button size="sm" variant="outline" onPress={() => setV((x) => Math.max(0, x - 10))}>-10</Button>
          <Button size="sm" variant="outline" onPress={() => setV((x) => Math.min(100, x + 10))}>+10</Button>
        </View>
      </View>
    )
  },
}
