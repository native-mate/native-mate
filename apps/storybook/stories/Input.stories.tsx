import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { Input } from '../../../packages/registry/components/input/input'

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: 'Please enter a valid email' } }
export const WithHint: Story = { args: { hint: 'We will never share your email.' } }
export const Disabled: Story = { args: { editable: false } }

export const AllStates: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Input label="Default" placeholder="Placeholder" />
      <Input label="With value" placeholder="Placeholder" value="hello@example.com" />
      <Input label="With error" placeholder="Placeholder" error="This field is required" />
      <Input label="With hint" placeholder="Placeholder" hint="Must be at least 8 chars" />
      <Input label="Disabled" placeholder="Placeholder" editable={false} />
    </View>
  ),
}
