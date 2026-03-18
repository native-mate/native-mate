import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Badge } from '../../../packages/registry/components/badge/badge'

const meta: Meta<typeof Badge> = {
  title: 'Display/Badge',
  component: Badge,
  args: { children: 'Badge', variant: 'default', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'outline', 'destructive', 'success', 'warning'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllVariants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="warning">Warning</Badge>
    </View>
  ),
}

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Badge variant="default" size="sm">Small</Badge>
      <Badge variant="default" size="md">Medium</Badge>
      <Badge variant="default" size="lg">Large</Badge>
    </View>
  ),
}

export const WithDot: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Badge variant="success" dot>Active</Badge>
      <Badge variant="destructive" dot>Error</Badge>
      <Badge variant="warning" dot>Pending</Badge>
      <Badge variant="secondary" dot>Inactive</Badge>
    </View>
  ),
}

export const CountBadge: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Badge variant="destructive" count={3} />
      <Badge variant="default" count={12} />
      <Badge variant="secondary" count={42} />
      <Badge variant="destructive" count={150} maxCount={99} />
    </View>
  ),
}

export const Dismissible: Story = {
  render: () => {
    const [tags, setTags] = useState(['React', 'TypeScript', 'Expo', 'Reanimated'])
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {tags.map((t) => (
          <Badge key={t} variant="secondary" onDismiss={() => setTags((prev) => prev.filter((x) => x !== t))}>
            {t}
          </Badge>
        ))}
      </View>
    )
  },
}
