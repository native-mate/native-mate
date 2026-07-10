'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Timeline } from '../../../../packages/registry/components/timeline/timeline'
import type { TimelineItem } from '../../../../packages/registry/components/timeline/timeline.types'

const ORDER_ITEMS: TimelineItem[] = [
  { key: '1', title: 'Order placed', description: 'We received your order', timestamp: '9:02 AM', status: 'completed' },
  { key: '2', title: 'Payment confirmed', timestamp: '9:03 AM', status: 'completed' },
  { key: '3', title: 'Preparing shipment', description: 'Packing your items now', timestamp: '10:45 AM', status: 'active' },
  { key: '4', title: 'Out for delivery', status: 'upcoming' },
  { key: '5', title: 'Delivered', status: 'upcoming' },
]

const ERROR_ITEMS: TimelineItem[] = [
  { key: '1', title: 'Build started', status: 'completed' },
  { key: '2', title: 'Running tests', status: 'completed' },
  { key: '3', title: 'Deploy failed', description: 'Container failed to start', status: 'error' },
  { key: '4', title: 'Rollback', status: 'upcoming' },
]

export default function TimelinePreview() {
  const [items, setItems] = useState<TimelineItem[]>(ORDER_ITEMS)

  const advance = (key: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.key === key)
      if (idx === -1) return prev
      return prev.map((item, i) => {
        if (i < idx) return { ...item, status: 'completed' }
        if (i === idx) return { ...item, status: 'active' }
        return { ...item, status: 'upcoming' }
      })
    })
  }

  return (
    <div className="space-y-10">
      <Preview title="Order tracking" code={`import { Timeline } from '~/components/ui/timeline'

const items = [
  { key: '1', title: 'Order placed', timestamp: '9:02 AM', status: 'completed' },
  { key: '2', title: 'Payment confirmed', timestamp: '9:03 AM', status: 'completed' },
  { key: '3', title: 'Preparing shipment', description: 'Packing your items now', status: 'active' },
  { key: '4', title: 'Out for delivery', status: 'upcoming' },
  { key: '5', title: 'Delivered', status: 'upcoming' },
]

<Timeline items={items} />`}>
        <View style={{ width: 320 }}>
          <Timeline items={ORDER_ITEMS} />
        </View>
      </Preview>

      <Preview title="Error state" code={`<Timeline
  items={[
    { key: '1', title: 'Build started', status: 'completed' },
    { key: '2', title: 'Running tests', status: 'completed' },
    { key: '3', title: 'Deploy failed', description: 'Container failed to start', status: 'error' },
    { key: '4', title: 'Rollback', status: 'upcoming' },
  ]}
/>`}>
        <View style={{ width: 320 }}>
          <Timeline items={ERROR_ITEMS} animated={false} />
        </View>
      </Preview>

      <Preview title="Sizes" code={`<Timeline items={items} size="sm" />
<Timeline items={items} size="md" />
<Timeline items={items} size="lg" />`}>
        <View style={{ flexDirection: 'row', gap: 24 }}>
          <View style={{ width: 140 }}>
            <Timeline items={ORDER_ITEMS.slice(0, 3)} size="sm" animated={false} />
          </View>
          <View style={{ width: 140 }}>
            <Timeline items={ORDER_ITEMS.slice(0, 3)} size="lg" animated={false} />
          </View>
        </View>
      </Preview>

      <Preview title="Interactive — tap a step to advance" code={`const [items, setItems] = useState(orderItems)

<Timeline
  items={items}
  onItemPress={(key) => advanceTo(key)}
/>`}>
        <View style={{ width: 320 }}>
          <Timeline items={items} animated={false} onItemPress={advance} />
        </View>
      </Preview>
    </div>
  )
}
