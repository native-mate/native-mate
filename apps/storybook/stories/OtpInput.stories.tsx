import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { OTPInput } from '../../../packages/registry/components/otp-input/otp-input'

const meta: Meta = {
  title: 'Input/OtpInput',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput length={6} value={value} onChange={setValue} />
      </View>
    )
  },
}

export const FourDigit: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput length={4} value={value} onChange={setValue} />
      </View>
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('123')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput length={6} value={value} onChange={setValue} error />
      </View>
    )
  },
}

export const Prefilled: Story = {
  render: () => {
    const [value, setValue] = useState('4829')
    return (
      <View style={{ padding: 16 }}>
        <OTPInput length={6} value={value} onChange={setValue} />
      </View>
    )
  },
}
