import type { Meta, StoryObj } from '@storybook/react-native'
import { View, Text } from 'react-native'
import { EmptyState } from '../../../packages/registry/components/empty-state/empty-state'

const meta: Meta = {
  title: 'Display/EmptyState',
}

export default meta
type Story = StoryObj<typeof meta>

export const WithAction: Story = {
  render: () => (
    <EmptyState
      icon={<Text style={{ fontSize: 28 }}>📭</Text>}
      title="No notifications yet"
      description="When you get notifications, they'll show up here."
      action={{ label: 'Go to settings', onPress: () => {} }}
    />
  ),
}

export const Simple: Story = {
  render: () => (
    <EmptyState
      icon={<Text style={{ fontSize: 28 }}>🔍</Text>}
      title="No results found"
      description="Try adjusting your search or filters."
    />
  ),
}
