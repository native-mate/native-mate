'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Text } from '@native-mate/core'
import { Preview } from './shared/Preview'
import { Select, MultiSelect } from '../../../../packages/registry/components/select/select'

const COUNTRIES = [
  { label: 'India', value: 'in', description: 'South Asia' },
  { label: 'United States', value: 'us', description: 'North America' },
  { label: 'United Kingdom', value: 'uk', description: 'Europe' },
  { label: 'Germany', value: 'de', description: 'Europe' },
  { label: 'Japan', value: 'jp', description: 'East Asia' },
  { label: 'Canada', value: 'ca', description: 'North America' },
  { label: 'Australia', value: 'au', description: 'Oceania' },
]

const GROUPED_OPTIONS = [
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

export default function SelectPreview() {
  const [country, setCountry] = useState('')
  const [searchable, setSearchable] = useState('')
  const [clearable, setClearable] = useState('us')
  const [grouped, setGrouped] = useState('')
  const [multi, setMulti] = useState<string[]>([])
  const [multiCapped, setMultiCapped] = useState<string[]>([])

  return (
    <div className="space-y-10">
      <Preview title="Default" code={`import { Select } from '~/components/ui/select'

<Select
  label="Country"
  placeholder="Select country"
  options={COUNTRIES}
  value={country}
  onChange={setCountry}
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Select label="Country" placeholder="Select country" options={COUNTRIES} value={country} onChange={setCountry} required />
        </View>
      </Preview>

      <Preview title="Searchable" code={`<Select
  label="Search countries"
  options={COUNTRIES}
  searchable
  searchPlaceholder="Type to search..."
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Select
            label="Search countries"
            placeholder="Select country"
            options={COUNTRIES}
            value={searchable}
            onChange={setSearchable}
            searchable
            searchPlaceholder="Type to search..."
          />
        </View>
      </Preview>

      <Preview title="Clearable" code={`<Select
  label="Region"
  options={COUNTRIES}
  value={clearable}
  onChange={setClearable}
  clearable
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Select label="Region" options={COUNTRIES} value={clearable} onChange={setClearable} clearable />
        </View>
      </Preview>

      <Preview title="Grouped options" code={`<Select
  label="Tech stack"
  placeholder="Choose technology"
  options={[]}
  groups={GROUPED_OPTIONS}
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Select
            label="Tech stack"
            placeholder="Choose technology"
            options={[]}
            groups={GROUPED_OPTIONS}
            value={grouped}
            onChange={setGrouped}
          />
        </View>
      </Preview>

      <Preview title="Multi-select" code={`import { MultiSelect } from '~/components/ui/select'

<MultiSelect
  label="Skills"
  placeholder="Select skills"
  options={skills}
  value={multi}
  onChange={setMulti}
  searchable
  clearable
/>`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 8 }}>
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
            value={multi}
            onChange={setMulti}
            searchable
            clearable
          />
          <Text style={{ fontSize: 12, color: '#71717a' }}>Selected: {multi.join(', ') || 'none'}</Text>
        </View>
      </Preview>

      <Preview title="Multi-select (max 3)" code={`<MultiSelect
  label="Hobbies (max 3)"
  placeholder="Select up to 3"
  options={hobbies}
  value={selected}
  onChange={setSelected}
  maxSelections={3}
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
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
            value={multiCapped}
            onChange={setMultiCapped}
            maxSelections={3}
          />
        </View>
      </Preview>

      <Preview title="Error & disabled" code={`<Select
  label="Country"
  options={COUNTRIES}
  value=""
  onChange={() => {}}
  error="Please select a country"
  required
/>
<Select
  label="Region (locked)"
  options={COUNTRIES}
  value="in"
  onChange={() => {}}
  disabled
/>`}>
        <View style={{ gap: 16, width: '100%', maxWidth: 340 }}>
          <Select
            label="Country"
            placeholder="Select country"
            options={COUNTRIES}
            value=""
            onChange={() => {}}
            error="Please select a country to continue."
            required
          />
          <Select label="Region (locked)" options={COUNTRIES} value="in" onChange={() => {}} disabled />
        </View>
      </Preview>
    </div>
  )
}
