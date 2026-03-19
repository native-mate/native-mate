'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Text } from '@native-mate/core'
import { Preview } from './shared/Preview'
import { Tabs } from '../../../../packages/registry/components/tabs/tabs'
import { Ionicons } from '@expo/vector-icons'

export default function TabsPreview() {
  const [t1, setT1] = useState('overview')
  const [t2, setT2] = useState('overview')
  const [t3, setT3] = useState('overview')
  const [t4, setT4] = useState('all')

  const basicItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'features', label: 'Features' },
    { key: 'pricing', label: 'Pricing' },
  ]

  return (
    <div className="space-y-10">
      <Preview title="Underline (default)" code={`<Tabs
  items={[
    { key: 'overview', label: 'Overview' },
    { key: 'features', label: 'Features' },
    { key: 'pricing', label: 'Pricing' },
  ]}
  activeKey={activeKey}
  onChange={setActiveKey}
/>`}>
        <View style={{ gap: 12 }}>
          <Tabs items={basicItems} activeKey={t1} onChange={setT1} />
          <Text style={{ color: '#71717a', fontSize: 13 }}>Active: {t1}</Text>
        </View>
      </Preview>

      <Preview title="Pill" code={`<Tabs items={items} activeKey={activeKey} onChange={setActiveKey} variant="pill" />`}>
        <Tabs items={basicItems} activeKey={t2} onChange={setT2} variant="pill" />
      </Preview>

      <Preview title="Card / Segmented" code={`<Tabs items={items} activeKey={activeKey} onChange={setActiveKey} variant="card" />`}>
        <Tabs items={basicItems} activeKey={t3} onChange={setT3} variant="card" />
      </Preview>

      <Preview title="Icons + badge + disabled" code={`<Tabs
  items={[
    { key: 'all', label: 'All', icon: <Ionicons name="apps-outline" size={14} /> },
    { key: 'unread', label: 'Unread', badge: 12 },
    { key: 'starred', label: 'Starred', icon: <Ionicons name="star-outline" size={14} /> },
    { key: 'archived', label: 'Archived', disabled: true },
  ]}
  activeKey={activeKey}
  onChange={setActiveKey}
/>`}>
        <Tabs
          items={[
            { key: 'all', label: 'All', icon: <Ionicons name="apps-outline" size={14} color={t4 === 'all' ? '#6366f1' : '#71717a'} /> },
            { key: 'unread', label: 'Unread', badge: 12 },
            { key: 'starred', label: 'Starred', icon: <Ionicons name="star-outline" size={14} color={t4 === 'starred' ? '#6366f1' : '#71717a'} /> },
            { key: 'archived', label: 'Archived', disabled: true },
          ]}
          activeKey={t4}
          onChange={setT4}
        />
      </Preview>

      <Preview title="Sizes" code={`<Tabs items={items} size="sm" />
<Tabs items={items} size="md" />
<Tabs items={items} size="lg" />`}>
        <View style={{ gap: 16 }}>
          {(['sm', 'md', 'lg'] as const).map(size => (
            <View key={size}>
              <Text style={{ color: '#71717a', fontSize: 11, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{size}</Text>
              <Tabs items={basicItems} activeKey="overview" onChange={() => {}} size={size} variant="pill" />
            </View>
          ))}
        </View>
      </Preview>
    </div>
  )
}
