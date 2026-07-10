'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { ToggleGroup } from '../../../../packages/registry/components/toggle-group/toggle-group'

export default function ToggleGroupPreview() {
  const [period, setPeriod] = useState('week')
  const [align, setAlign] = useState('left')
  const [filters, setFilters] = useState<string[]>(['new'])
  const [size, setSize] = useState('sm')

  return (
    <div className="space-y-10">
      <Preview title="Single selection" code={`import { ToggleGroup } from '~/components/ui/toggle-group'

const [period, setPeriod] = useState('week')

<ToggleGroup
  items={[
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ]}
  type="single"
  value={period}
  onChange={setPeriod}
/>`}>
        <ToggleGroup
          items={[
            { key: 'day', label: 'Day' },
            { key: 'week', label: 'Week' },
            { key: 'month', label: 'Month' },
          ]}
          type="single"
          value={period}
          onChange={setPeriod}
        />
      </Preview>

      <Preview title="With icons" code={`const [align, setAlign] = useState('left')

<ToggleGroup
  items={[
    { key: 'left', label: 'Left', icon: 'menu-outline' },
    { key: 'center', label: 'Center', icon: 'reorder-two-outline' },
    { key: 'right', label: 'Right', icon: 'menu-outline' },
  ]}
  type="single"
  value={align}
  onChange={setAlign}
/>`}>
        <ToggleGroup
          items={[
            { key: 'left', label: 'Left', icon: 'menu-outline' },
            { key: 'center', label: 'Center', icon: 'reorder-two-outline' },
            { key: 'right', label: 'Right', icon: 'menu-outline' },
          ]}
          type="single"
          value={align}
          onChange={setAlign}
        />
      </Preview>

      <Preview title="Multiple selection" code={`const [filters, setFilters] = useState(['new'])

<ToggleGroup
  items={[
    { key: 'new', label: 'New' },
    { key: 'sale', label: 'Sale' },
    { key: 'featured', label: 'Featured' },
  ]}
  type="multiple"
  values={filters}
  onChangeMultiple={setFilters}
/>`}>
        <ToggleGroup
          items={[
            { key: 'new', label: 'New' },
            { key: 'sale', label: 'Sale' },
            { key: 'featured', label: 'Featured' },
          ]}
          type="multiple"
          values={filters}
          onChangeMultiple={setFilters}
        />
      </Preview>

      <Preview title="Sizes" code={`<ToggleGroup items={items} type="single" value={size} onChange={setSize} size="sm" />
<ToggleGroup items={items} type="single" value={size} onChange={setSize} size="md" />
<ToggleGroup items={items} type="single" value={size} onChange={setSize} size="lg" />`}>
        <View style={{ gap: 12 }}>
          <ToggleGroup
            items={[{ key: 'sm', label: 'Small' }, { key: 'md', label: 'Medium' }, { key: 'lg', label: 'Large' }]}
            type="single"
            value={size}
            onChange={setSize}
            size="sm"
          />
          <ToggleGroup
            items={[{ key: 'sm', label: 'Small' }, { key: 'md', label: 'Medium' }, { key: 'lg', label: 'Large' }]}
            type="single"
            value={size}
            onChange={setSize}
            size="md"
          />
          <ToggleGroup
            items={[{ key: 'sm', label: 'Small' }, { key: 'md', label: 'Medium' }, { key: 'lg', label: 'Large' }]}
            type="single"
            value={size}
            onChange={setSize}
            size="lg"
          />
        </View>
      </Preview>

      <Preview title="Full width & disabled item" code={`<ToggleGroup
  items={[
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'archived', label: 'Archived', disabled: true },
  ]}
  type="single"
  value="all"
  onChange={() => {}}
  fullWidth
/>`}>
        <View style={{ width: 320 }}>
          <ToggleGroup
            items={[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'archived', label: 'Archived', disabled: true },
            ]}
            type="single"
            value="all"
            onChange={() => {}}
            fullWidth
          />
        </View>
      </Preview>
    </div>
  )
}
