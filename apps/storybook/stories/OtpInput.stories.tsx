import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { OTPInput } from '../../../packages/registry/components/otp-input/otp-input'

const meta: Meta = { title: 'Forms/OTPInput' }
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput value={val} onChange={setVal} length={6} hint="Enter the 6-digit code sent to your email" resend onResend={() => {}} />
      </View>
    )
  },
}

export const FourDigit: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput value={val} onChange={setVal} length={4} hint="Enter your PIN" />
      </View>
    )
  },
}

export const Secure: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput value={val} onChange={setVal} length={6} secure hint="Digits are masked as you type" />
      </View>
    )
  },
}

export const Underline: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput value={val} onChange={setVal} length={6} variant="underline" />
      </View>
    )
  },
}

export const Rounded: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput value={val} onChange={setVal} length={6} variant="rounded" />
      </View>
    )
  },
}

export const Alphanumeric: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput value={val} onChange={setVal} length={5} type="alphanumeric" hint="Letters and numbers" />
      </View>
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [val, setVal] = useState('12345')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput value={val} onChange={setVal} length={6} error errorMessage="Invalid code. Please try again." />
      </View>
    )
  },
}

export const Success: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <OTPInput value="123456" onChange={() => {}} length={6} success hint="Code verified!" />
    </View>
  ),
}

export const Disabled: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <OTPInput value="1234" onChange={() => {}} length={6} disabled />
    </View>
  ),
}
