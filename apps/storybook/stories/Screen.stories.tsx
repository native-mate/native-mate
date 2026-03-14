import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { Screen } from '../../../packages/registry/components/screen/screen'

const meta: Meta = {
  title: 'Layout/Screen',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Screen>
      <View style={{ flex: 1, padding: 16 }} />
    </Screen>
  ),
}

export const CustomBackground: Story = {
  render: () => (
    <Screen backgroundColor="#f0f4ff">
      <View style={{ flex: 1, padding: 16 }} />
    </Screen>
  ),
}
