import type { Meta, StoryObj } from '@storybook/react-native'
import { View, Text } from 'react-native'
import { Input } from '../../../packages/registry/components/input/input'

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </View>
  ),
}

export const Required: Story = {
  render: () => <Input label="Full Name" placeholder="John Doe" required />,
}

export const PrefixSuffix: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Input label="Price" placeholder="0.00" prefixText="$" suffixText="USD" keyboardType="decimal-pad" />
      <Input label="Website" placeholder="example.com" prefixText="https://" />
      <Input placeholder="Search..." prefix={<Text style={{ fontSize: 14 }}>🔎</Text>} />
    </View>
  ),
}

export const Clearable: Story = {
  render: () => <Input label="Search" placeholder="Type to search..." clearable />,
}

export const PasswordToggle: Story = {
  render: () => <Input label="Password" placeholder="••••••••" secureTextEntry showPasswordToggle />,
}

export const CharacterCount: Story = {
  render: () => <Input label="Bio" placeholder="Write something..." showCount maxLength={100} />,
}

export const FloatingLabel: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Input floatingLabel label="Email Address" placeholder="you@example.com" />
      <Input floatingLabel label="Required Field" required />
    </View>
  ),
}

export const WithError: Story = { args: { error: 'Please enter a valid email' } }
export const WithHint: Story = { args: { hint: 'We will never share your email.' } }
export const Disabled: Story = { args: { disabled: true, value: 'Acme Inc.' } }

export const AllStates: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Input label="Default" placeholder="Placeholder" />
      <Input label="Required" placeholder="Placeholder" required />
      <Input label="With error" placeholder="Placeholder" error="This field is required" />
      <Input label="With hint" placeholder="Placeholder" hint="Must be at least 8 chars" />
      <Input label="Disabled" placeholder="Placeholder" disabled />
    </View>
  ),
}
