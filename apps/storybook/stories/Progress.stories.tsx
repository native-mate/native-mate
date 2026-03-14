import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { Progress } from '../../../packages/registry/components/progress/progress'

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  args: { value: 60 },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 5 } },
    variant: { control: 'select', options: ['linear', 'circular'] },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Linear: Story = { args: { variant: 'linear' } }
export const Circular: Story = { args: { variant: 'circular' } }

export const LinearValues: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Progress value={25} variant="linear" />
      <Progress value={50} variant="linear" />
      <Progress value={75} variant="linear" />
      <Progress value={100} variant="linear" />
    </View>
  ),
}
