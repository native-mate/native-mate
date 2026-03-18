import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Radio, RadioGroup } from '../../../packages/registry/components/radio/radio'

const meta: Meta = { title: 'Forms/Radio' }
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <RadioGroup
          label="Framework"
          options={[
            { label: 'React Native', value: 'rn', description: 'Cross-platform mobile' },
            { label: 'Flutter', value: 'flutter', description: 'Google UI toolkit' },
            { label: 'SwiftUI', value: 'swiftui', description: 'iOS & macOS only', disabled: true },
          ]}
          value={val}
          onChange={setVal}
        />
      </View>
    )
  },
}

export const CardStyle: Story = {
  render: () => {
    const [plan, setPlan] = useState('pro')
    return (
      <View style={{ padding: 16 }}>
        <RadioGroup
          label="Choose a plan"
          card
          options={[
            { label: 'Free', value: 'free', description: '5 components, community support' },
            { label: 'Pro', value: 'pro', description: 'Unlimited components, priority support' },
            { label: 'Team', value: 'team', description: 'Everything in Pro + team management' },
          ]}
          value={plan}
          onChange={setPlan}
        />
      </View>
    )
  },
}

export const Horizontal: Story = {
  render: () => {
    const [val, setVal] = useState('ltr')
    return (
      <View style={{ padding: 16 }}>
        <RadioGroup
          label="Direction"
          options={[
            { label: 'LTR', value: 'ltr' },
            { label: 'RTL', value: 'rtl' },
            { label: 'Auto', value: 'auto' },
          ]}
          value={val}
          onChange={setVal}
          horizontal
        />
      </View>
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [val, setVal] = useState('md')
    return (
      <View style={{ padding: 16 }}>
        <RadioGroup
          options={[
            { label: 'Small', value: 'sm' },
            { label: 'Medium (default)', value: 'md' },
            { label: 'Large', value: 'lg' },
          ]}
          value={val}
          onChange={setVal}
          size={val as any}
        />
      </View>
    )
  },
}

export const WithError: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <RadioGroup
        label="Preferred contact"
        options={[
          { label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' },
        ]}
        value=""
        onChange={() => {}}
        error="Please select a contact method."
      />
    </View>
  ),
}

export const Disabled: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <RadioGroup
        options={[
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ]}
        value="a"
        onChange={() => {}}
        disabled
      />
    </View>
  ),
}
