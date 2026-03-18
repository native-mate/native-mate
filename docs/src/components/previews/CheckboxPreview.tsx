'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Text } from '@native-mate/core'
import { Preview } from './shared/Preview'
import { Checkbox, CheckboxGroup } from '../../../../packages/registry/components/checkbox/checkbox'

export default function CheckboxPreview() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [leftVal, setLeftVal] = useState(false)
  const [groupVal, setGroupVal] = useState(['ts'])

  return (
    <div className="space-y-10">
      <Preview title="Default" code={`import { Checkbox } from '~/components/ui/checkbox'

<Checkbox checked={checked} onChange={setChecked} label="Accept terms & conditions" />
<Checkbox checked={false} onChange={() => {}} label="Subscribe to newsletter"
  description="Get weekly updates about new components." />`}>
        <View style={{ gap: 14 }}>
          <Checkbox checked={a} onChange={setA} label="Accept terms & conditions" />
          <Checkbox checked={b} onChange={setB} label="Subscribe to newsletter" description="Get weekly updates about new components." />
          <Checkbox checked={false} onChange={() => {}} label="Disabled option" disabled />
          <Checkbox checked={true} onChange={() => {}} label="Disabled checked" disabled />
        </View>
      </Preview>

      <Preview title="Indeterminate" code={`<Checkbox
  checked={false}
  indeterminate
  onChange={() => {}}
  label="Select all (partial)"
  description="Some items are selected"
/>`}>
        <Checkbox
          checked={false}
          indeterminate
          onChange={() => {}}
          label="Select all (partial)"
          description="Some items are selected"
        />
      </Preview>

      <Preview title="Sizes" code={`<Checkbox checked size="sm" label="Small" />
<Checkbox checked size="md" label="Medium (default)" />
<Checkbox checked size="lg" label="Large" />`}>
        <View style={{ gap: 14 }}>
          <Checkbox checked={true} onChange={() => {}} label="Small" size="sm" />
          <Checkbox checked={true} onChange={() => {}} label="Medium (default)" size="md" />
          <Checkbox checked={true} onChange={() => {}} label="Large" size="lg" />
        </View>
      </Preview>

      <Preview title="Custom colors" code={`<Checkbox checked color="#10b981" label="Emerald" />
<Checkbox checked color="#f43f5e" label="Rose" />
<Checkbox checked color="#8b5cf6" label="Violet" />`}>
        <View style={{ gap: 14 }}>
          <Checkbox checked={true} onChange={() => {}} label="Emerald" color="#10b981" />
          <Checkbox checked={true} onChange={() => {}} label="Rose" color="#f43f5e" />
          <Checkbox checked={true} onChange={() => {}} label="Violet" color="#8b5cf6" />
        </View>
      </Preview>

      <Preview title="Label on left" code={`<Checkbox checked={val} onChange={setVal} label="Dark mode" labelPosition="left" />`}>
        <Checkbox checked={leftVal} onChange={setLeftVal} label="Dark mode" labelPosition="left" />
      </Preview>

      <Preview title="Error state" code={`<Checkbox checked={false} onChange={() => {}} label="Accept terms"
  error="You must accept the terms to continue." />`}>
        <Checkbox checked={false} onChange={() => {}} label="Accept terms" error="You must accept the terms to continue." />
      </Preview>

      <Preview title="CheckboxGroup" code={`import { CheckboxGroup } from '~/components/ui/checkbox'

<CheckboxGroup
  label="Technologies"
  options={[
    { label: 'TypeScript', value: 'ts', description: 'Typed superset of JS' },
    { label: 'React Native', value: 'rn' },
    { label: 'Expo', value: 'expo' },
    { label: 'GraphQL', value: 'gql', disabled: true },
  ]}
  value={selected}
  onChange={setSelected}
/>`}>
        <View style={{ gap: 8 }}>
          <CheckboxGroup
            label="Technologies"
            options={[
              { label: 'TypeScript', value: 'ts', description: 'Typed superset of JavaScript' },
              { label: 'React Native', value: 'rn' },
              { label: 'Expo', value: 'expo' },
              { label: 'GraphQL', value: 'gql', disabled: true },
            ]}
            value={groupVal}
            onChange={setGroupVal}
          />
          <Text style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>Selected: {groupVal.join(', ') || 'none'}</Text>
        </View>
      </Preview>

      <Preview title="Horizontal group" code={`<CheckboxGroup
  options={[
    { label: 'Mon', value: 'mon' },
    { label: 'Tue', value: 'tue' },
    { label: 'Wed', value: 'wed' },
  ]}
  value={selected}
  onChange={setSelected}
  horizontal
/>`}>
        <CheckboxGroup
          options={[
            { label: 'Mon', value: 'mon' },
            { label: 'Tue', value: 'tue' },
            { label: 'Wed', value: 'wed' },
            { label: 'Thu', value: 'thu' },
            { label: 'Fri', value: 'fri' },
          ]}
          value={groupVal}
          onChange={setGroupVal}
          horizontal
        />
      </Preview>
    </div>
  )
}
