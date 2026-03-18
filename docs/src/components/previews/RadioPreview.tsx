'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Radio, RadioGroup } from '../../../../../packages/registry/components/radio/radio'

export default function RadioPreview() {
  const [fw, setFw] = useState('rn')
  const [plan, setPlan] = useState('pro')
  const [size, setSize] = useState('md')

  return (
    <div className="space-y-10">
      <Preview title="Default" code={`import { RadioGroup } from '~/components/ui/radio'

const [value, setValue] = useState('rn')

<RadioGroup
  value={value}
  onChange={setValue}
  options={[
    { label: 'React Native', value: 'rn' },
    { label: 'Flutter', value: 'flutter' },
    { label: 'Swift', value: 'swift' },
  ]}
/>`}>
        <RadioGroup
          value={fw}
          onChange={setFw}
          options={[
            { label: 'React Native', value: 'rn' },
            { label: 'Flutter', value: 'flutter' },
            { label: 'Swift', value: 'swift' },
          ]}
        />
      </Preview>

      <Preview title="With description" code={`<RadioGroup
  label="Plan"
  value={plan}
  onChange={setPlan}
  options={[
    { label: 'Starter', value: 'starter', description: 'Up to 3 projects, 1 member' },
    { label: 'Pro', value: 'pro', description: 'Unlimited projects, 10 members' },
    { label: 'Enterprise', value: 'enterprise', description: 'Unlimited everything' },
  ]}
/>`}>
        <RadioGroup
          label="Plan"
          value={plan}
          onChange={setPlan}
          options={[
            { label: 'Starter', value: 'starter', description: 'Up to 3 projects, 1 member' },
            { label: 'Pro', value: 'pro', description: 'Unlimited projects, 10 members' },
            { label: 'Enterprise', value: 'enterprise', description: 'Unlimited everything' },
          ]}
        />
      </Preview>

      <Preview title="Sizes" code={`<RadioGroup
  value={size}
  onChange={setSize}
  options={[
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ]}
  size={size as 'sm' | 'md' | 'lg'}
/>`}>
        <View style={{ gap: 20 }}>
          <RadioGroup
            value="sm"
            onChange={() => {}}
            options={[{ label: 'Small size', value: 'sm' }]}
            size="sm"
          />
          <RadioGroup
            value="md"
            onChange={() => {}}
            options={[{ label: 'Medium size (default)', value: 'md' }]}
            size="md"
          />
          <RadioGroup
            value="lg"
            onChange={() => {}}
            options={[{ label: 'Large size', value: 'lg' }]}
            size="lg"
          />
        </View>
      </Preview>

      <Preview title="Horizontal layout" code={`<RadioGroup
  value={dir}
  onChange={setDir}
  options={[
    { label: 'LTR', value: 'ltr' },
    { label: 'RTL', value: 'rtl' },
    { label: 'Auto', value: 'auto' },
  ]}
  horizontal
/>`}>
        <RadioGroup
          value="ltr"
          onChange={() => {}}
          options={[
            { label: 'LTR', value: 'ltr' },
            { label: 'RTL', value: 'rtl' },
            { label: 'Auto', value: 'auto' },
          ]}
          horizontal
        />
      </Preview>

      <Preview title="With error & disabled" code={`<RadioGroup
  label="Subscription"
  value=""
  onChange={() => {}}
  options={[...]}
  error="Please select a plan"
/>
<Radio label="Unavailable option" value="x" disabled />`}>
        <View style={{ gap: 16 }}>
          <RadioGroup
            label="Subscription"
            value=""
            onChange={() => {}}
            options={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Yearly', value: 'yearly' },
            ]}
            error="Please select a billing cycle"
          />
          <Radio label="Unavailable option" value="x" disabled checked={false} onChange={() => {}} />
        </View>
      </Preview>
    </div>
  )
}
