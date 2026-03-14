import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { Card } from '../../../packages/registry/components/card/card'
import { Text } from '@native-mate/core'

const meta: Meta<typeof Card> = {
  title: 'Layout/Card',
  component: Card,
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
  args: { padding: 'md' },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Text weight="semibold" size="lg">Card Title</Text>
      <Text color="muted" style={{ marginTop: 4 }}>Some description content here.</Text>
    </Card>
  ),
}

export const NoPadding: Story = {
  render: () => (
    <Card padding="none">
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#27272a' }}>
        <Text weight="semibold">Header</Text>
      </View>
      <View style={{ padding: 16 }}>
        <Text color="muted">Content area</Text>
      </View>
    </Card>
  ),
}
