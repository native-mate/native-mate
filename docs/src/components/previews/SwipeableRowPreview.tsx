'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { SwipeableRow } from '../../../../packages/registry/components/swipeable-row/swipeable-row'
import { Text } from '../../../../packages/registry/components/text/text'
import { Icon } from '../../../../packages/registry/components/icon/icon'
import { Separator } from '../../../../packages/registry/components/separator/separator'

export default function SwipeableRowPreview() {
  const [emails, setEmails] = useState([
    { id: '1', from: 'Priya Sharma', subject: 'Q3 roadmap review' },
    { id: '2', from: 'Design Team', subject: 'New component specs ready' },
    { id: '3', from: 'GitHub', subject: 'Your PR was merged' },
  ])

  const archive = (id: string) => setEmails((prev) => prev.filter((e) => e.id !== id))
  const del = (id: string) => setEmails((prev) => prev.filter((e) => e.id !== id))

  return (
    <div className="space-y-10">
      <Preview title="Right swipe actions (delete)" code={`import { SwipeableRow } from '~/components/ui/swipeable-row'

<SwipeableRow
  rightActions={[
    { label: 'Delete', color: '#ef4444', onPress: () => remove(id) },
  ]}
>
  <View style={{ padding: 16 }}>
    <Text weight="semibold">Priya Sharma</Text>
    <Text muted>Q3 roadmap review</Text>
  </View>
</SwipeableRow>`}>
        <View style={{ width: 320 }}>
          <SwipeableRow
            rightActions={[
              { label: 'Delete', color: '#ef4444', onPress: () => {} },
            ]}
          >
            <View style={{ padding: 16 }}>
              <Text weight="semibold">Priya Sharma</Text>
              <Text muted>Q3 roadmap review</Text>
            </View>
          </SwipeableRow>
        </View>
      </Preview>

      <Preview title="Left and right actions" code={`<SwipeableRow
  leftActions={[{ label: 'Read', color: '#3b82f6', onPress: () => {} }]}
  rightActions={[
    { label: 'Archive', color: '#f59e0b', onPress: () => {} },
    { label: 'Delete', color: '#ef4444', onPress: () => {} },
  ]}
>
  <View style={{ padding: 16 }}>
    <Text weight="semibold">Design Team</Text>
    <Text muted>New component specs ready</Text>
  </View>
</SwipeableRow>`}>
        <View style={{ width: 320 }}>
          <SwipeableRow
            leftActions={[{ label: 'Read', color: '#3b82f6', onPress: () => {} }]}
            rightActions={[
              { label: 'Archive', color: '#f59e0b', onPress: () => {} },
              { label: 'Delete', color: '#ef4444', onPress: () => {} },
            ]}
          >
            <View style={{ padding: 16 }}>
              <Text weight="semibold">Design Team</Text>
              <Text muted>New component specs ready</Text>
            </View>
          </SwipeableRow>
        </View>
      </Preview>

      <Preview title="Inbox list (full swipe to delete)" code={`const [emails, setEmails] = useState(initialEmails)

{emails.map((email) => (
  <SwipeableRow
    key={email.id}
    rightActions={[{ label: 'Delete', color: '#ef4444', onPress: () => remove(email.id) }]}
    onSwipeLeft={() => remove(email.id)}
  >
    <View style={{ padding: 16 }}>
      <Text weight="semibold">{email.from}</Text>
      <Text muted numberOfLines={1}>{email.subject}</Text>
    </View>
  </SwipeableRow>
))}`} minHeight={220}>
        <View style={{ width: 320 }}>
          {emails.map((email, i) => (
            <React.Fragment key={email.id}>
              <SwipeableRow
                rightActions={[{ label: 'Delete', color: '#ef4444', onPress: () => del(email.id) }]}
                onSwipeLeft={() => del(email.id)}
              >
                <View style={{ padding: 16 }}>
                  <Text weight="semibold">{email.from}</Text>
                  <Text muted numberOfLines={1}>{email.subject}</Text>
                </View>
              </SwipeableRow>
              {i < emails.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </View>
      </Preview>

      <Preview title="Disabled row" code={`<SwipeableRow disabled rightActions={[{ label: 'Delete', color: '#ef4444', onPress: () => {} }]}>
  <View style={{ padding: 16 }}>
    <Text weight="semibold">GitHub</Text>
    <Text muted>Your PR was merged</Text>
  </View>
</SwipeableRow>`}>
        <View style={{ width: 320 }}>
          <SwipeableRow disabled rightActions={[{ label: 'Delete', color: '#ef4444', onPress: () => {} }]}>
            <View style={{ padding: 16 }}>
              <Text weight="semibold">GitHub</Text>
              <Text muted>Your PR was merged</Text>
            </View>
          </SwipeableRow>
        </View>
      </Preview>
    </div>
  )
}
