import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { Avatar } from '../../../packages/registry/components/avatar/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Display/Avatar',
  component: Avatar,
  args: { initials: 'AB', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    status: { control: 'select', options: [undefined, 'online', 'offline', 'busy'] },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const WithInitials: Story = {}

export const WithStatus: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar initials="AB" status="online" />
      <Avatar initials="CD" status="offline" />
      <Avatar initials="EF" status="busy" />
    </View>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar initials="AB" size="sm" />
      <Avatar initials="AB" size="md" />
      <Avatar initials="AB" size="lg" />
      <Avatar initials="AB" size="xl" />
    </View>
  ),
}
