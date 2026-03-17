import type { Meta, StoryObj } from '@storybook/react-native'
import { View, Text } from 'react-native'
import { Button } from '../../../packages/registry/components/button/button'

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  args: {
    children: 'Click me',
    variant: 'default',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'destructive', 'secondary', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ gap: 12, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = { args: { variant: 'outline' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Destructive: Story = { args: { variant: 'destructive' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Link: Story = { args: { variant: 'link' } }

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="link">Link</Button>
    </View>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </View>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <View style={{ gap: 10, width: '100%' }}>
      <Button fullWidth>Full Width</Button>
      <Button fullWidth variant="outline">Full Width Outline</Button>
    </View>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      <Button iconLeft={<Text style={{ color: '#fff', fontSize: 14 }}>+</Text>}>Add Item</Button>
      <Button variant="outline" iconRight={<Text style={{ color: '#fafafa', fontSize: 14 }}>→</Text>}>Next</Button>
    </View>
  ),
}

export const Loading: Story = { args: { loading: true, children: 'Saving…' } }
export const Disabled: Story = { args: { disabled: true } }
