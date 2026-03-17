import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { Avatar, AvatarGroup } from '../../../packages/registry/components/avatar/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Display/Avatar',
  component: Avatar,
  args: { name: 'John Doe', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    status: { control: 'select', options: [undefined, 'online', 'offline', 'busy', 'away'] },
    shape: { control: 'select', options: ['circle', 'square'] },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const WithName: Story = {}

export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/100?img=1', name: 'Alice B' },
}

export const AllSizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar size="xs" name="John Doe" />
      <Avatar size="sm" name="Jane Smith" />
      <Avatar size="md" name="Alex Ray" />
      <Avatar size="lg" name="Sam Lee" />
      <Avatar size="xl" name="Chris Park" />
    </View>
  ),
}

export const StatusIndicators: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Avatar size="md" name="Online" status="online" />
      <Avatar size="md" name="Busy" status="busy" />
      <Avatar size="md" name="Away" status="away" />
      <Avatar size="md" name="Offline" status="offline" />
    </View>
  ),
}

export const SquareShape: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar size="md" name="A B" shape="square" />
      <Avatar size="md" src="https://i.pravatar.cc/100?img=3" shape="square" />
      <Avatar size="lg" name="C D" shape="square" status="online" />
    </View>
  ),
}

export const ImageFallback: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar size="lg" src="https://i.pravatar.cc/100?img=5" name="Valid Image" />
      <Avatar size="lg" src="https://broken-url.xyz/img.jpg" name="Broken Image" />
      <Avatar size="lg" name="No Image" />
    </View>
  ),
}

export const Group: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <AvatarGroup
        size="md"
        max={4}
        avatars={[
          { name: 'Alice B' },
          { name: 'Bob C' },
          { name: 'Carol D' },
          { src: 'https://i.pravatar.cc/100?img=4', name: 'Dave E' },
          { name: 'Eve F' },
          { name: 'Frank G' },
        ]}
      />
      <AvatarGroup
        size="sm"
        max={3}
        avatars={[
          { name: 'User One' },
          { name: 'User Two' },
          { name: 'User Three' },
          { name: 'User Four' },
          { name: 'User Five' },
        ]}
      />
    </View>
  ),
}
