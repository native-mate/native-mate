'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { SegmentedControl } from '../../../../packages/registry/components/segmented-control/segmented-control'

export default function SegmentedControlPreview() {
  const [period, setPeriod] = useState('week')
  const [size, setSize] = useState('md')
  const [view, setView] = useState('list')

  return (
    <div className="space-y-10">
      <Preview title="Default" code={`import { SegmentedControl } from '~/components/ui/segmented-control'

const [period, setPeriod] = useState('week')

<SegmentedControl
  segments={[
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ]}
  selectedKey={period}
  onChange={setPeriod}
/>`}>
        <View style={{ width: 320 }}>
          <SegmentedControl
            segments={[
              { key: 'day', label: 'Day' },
              { key: 'week', label: 'Week' },
              { key: 'month', label: 'Month' },
            ]}
            selectedKey={period}
            onChange={setPeriod}
          />
        </View>
      </Preview>

      <Preview title="Sizes" code={`<SegmentedControl segments={segs} selectedKey={size} onChange={setSize} size="sm" />
<SegmentedControl segments={segs} selectedKey={size} onChange={setSize} size="md" />
<SegmentedControl segments={segs} selectedKey={size} onChange={setSize} size="lg" />`}>
        <View style={{ width: 320, gap: 12 }}>
          <SegmentedControl
            segments={[{ key: 'sm', label: 'Small' }, { key: 'md', label: 'Medium' }]}
            selectedKey={size}
            onChange={setSize}
            size="sm"
          />
          <SegmentedControl
            segments={[{ key: 'sm', label: 'Small' }, { key: 'md', label: 'Medium' }]}
            selectedKey={size}
            onChange={setSize}
            size="md"
          />
          <SegmentedControl
            segments={[{ key: 'sm', label: 'Small' }, { key: 'md', label: 'Medium' }]}
            selectedKey={size}
            onChange={setSize}
            size="lg"
          />
        </View>
      </Preview>

      <Preview title="Not full width" code={`<SegmentedControl
  segments={[{ key: 'list', label: 'List' }, { key: 'grid', label: 'Grid' }]}
  selectedKey={view}
  onChange={setView}
  fullWidth={false}
/>`}>
        <View style={{ width: 320 }}>
          <SegmentedControl
            segments={[{ key: 'list', label: 'List' }, { key: 'grid', label: 'Grid' }]}
            selectedKey={view}
            onChange={setView}
            fullWidth={false}
          />
        </View>
      </Preview>

      <Preview title="Custom colors" code={`<SegmentedControl
  segments={[{ key: 'on', label: 'On' }, { key: 'off', label: 'Off' }]}
  selectedKey="on"
  onChange={() => {}}
  backgroundColor="#1e1b4b"
  indicatorColor="#6366f1"
/>`}>
        <View style={{ width: 320 }}>
          <SegmentedControl
            segments={[{ key: 'on', label: 'On' }, { key: 'off', label: 'Off' }]}
            selectedKey="on"
            onChange={() => {}}
            backgroundColor="#1e1b4b"
            indicatorColor="#6366f1"
          />
        </View>
      </Preview>

      <Preview title="Disabled" code={`<SegmentedControl
  segments={[{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }]}
  selectedKey="a"
  onChange={() => {}}
  disabled
/>`}>
        <View style={{ width: 320 }}>
          <SegmentedControl
            segments={[{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }]}
            selectedKey="a"
            onChange={() => {}}
            disabled
          />
        </View>
      </Preview>
    </div>
  )
}
