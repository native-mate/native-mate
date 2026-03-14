import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { Alert } from '../../../packages/registry/components/alert/alert'

const meta: Meta = {
  title: 'Display/Alert',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View style={{ gap: 12, padding: 16 }}>
      <Alert variant="default" title="Heads up" description="You can change this in your settings." />
    </View>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" title="Error" description="Your session has expired. Please log in again." />
  ),
}

export const Success: Story = {
  render: () => (
    <Alert variant="success" title="Success" description="Your changes have been saved." />
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" title="Warning" description="Your account is about to expire." />
  ),
}

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 12, padding: 16 }}>
      <Alert variant="default" title="Default" description="This is a default alert." />
      <Alert variant="success" title="Success" description="This is a success alert." />
      <Alert variant="warning" title="Warning" description="This is a warning alert." />
      <Alert variant="destructive" title="Error" description="This is a destructive alert." />
    </View>
  ),
}
