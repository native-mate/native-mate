import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Text } from '../../../packages/core/src/components/Text/Text'
import { Select, MultiSelect } from '../../../packages/registry/components/select/select'

const meta: Meta = { title: 'Forms/Select' }
export default meta
type Story = StoryObj<typeof meta>

const COUNTRIES = [
  { label: 'India', value: 'in', description: 'South Asia' },
  { label: 'United States', value: 'us', description: 'North America' },
  { label: 'United Kingdom', value: 'uk', description: 'Europe' },
  { label: 'Germany', value: 'de', description: 'Europe' },
  { label: 'Japan', value: 'jp', description: 'East Asia' },
  { label: 'Canada', value: 'ca', description: 'North America' },
  { label: 'Australia', value: 'au', description: 'Oceania' },
]

const GROUPED = [
  {
    label: 'Frontend',
    options: [
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Angular', value: 'angular' },
    ],
  },
  {
    label: 'Mobile',
    options: [
      { label: 'React Native', value: 'rn' },
      { label: 'Flutter', value: 'flutter' },
      { label: 'Swift', value: 'swift', disabled: true },
    ],
  },
]

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <Select label="Country" placeholder="Select country" options={COUNTRIES} value={val} onChange={setVal} required />
      </View>
    )
  },
}

export const Searchable: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <Select label="Country" placeholder="Select country" options={COUNTRIES} value={val} onChange={setVal} searchable searchPlaceholder="Type to search..." />
      </View>
    )
  },
}

export const Clearable: Story = {
  render: () => {
    const [val, setVal] = useState('us')
    return (
      <View style={{ padding: 16 }}>
        <Select label="Region" options={COUNTRIES} value={val} onChange={setVal} clearable />
      </View>
    )
  },
}

export const Grouped: Story = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <View style={{ padding: 16 }}>
        <Select label="Tech stack" placeholder="Choose technology" options={[]} groups={GROUPED} value={val} onChange={setVal} />
      </View>
    )
  },
}

export const WithError: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Select label="Country" placeholder="Select country" options={COUNTRIES} value="" onChange={() => {}} error="Please select a country." required />
    </View>
  ),
}

export const Disabled: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Select label="Country (locked)" options={COUNTRIES} value="in" onChange={() => {}} disabled />
    </View>
  ),
}

export const Multi: Story = {
  render: () => {
    const [val, setVal] = useState<string[]>([])
    return (
      <View style={{ padding: 16, gap: 8 }}>
        <MultiSelect
          label="Skills"
          placeholder="Select skills"
          options={[
            { label: 'TypeScript', value: 'ts' },
            { label: 'React Native', value: 'rn' },
            { label: 'GraphQL', value: 'gql' },
            { label: 'Node.js', value: 'node' },
            { label: 'Python', value: 'py' },
          ]}
          value={val}
          onChange={setVal}
          searchable
          clearable
        />
        <Text variant="caption" muted>Selected: {val.join(', ') || 'none'}</Text>
      </View>
    )
  },
}

export const MultiCapped: Story = {
  render: () => {
    const [val, setVal] = useState<string[]>([])
    return (
      <View style={{ padding: 16 }}>
        <MultiSelect
          label="Hobbies (max 3)"
          placeholder="Select up to 3"
          options={[
            { label: 'Reading', value: 'reading' },
            { label: 'Gaming', value: 'gaming' },
            { label: 'Cooking', value: 'cooking' },
            { label: 'Travel', value: 'travel' },
            { label: 'Music', value: 'music' },
          ]}
          value={val}
          onChange={setVal}
          maxSelections={3}
        />
      </View>
    )
  },
}
