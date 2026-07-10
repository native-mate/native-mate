'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { NotificationCard } from '../../../../packages/registry/components/notification-card/notification-card'

export default function NotificationCardPreview() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New comment', message: 'Priya replied to your post: "This is exactly what I needed, thanks!"', category: 'social' as const, read: false, timestamp: new Date(Date.now() - 1000 * 60 * 4) },
    { id: 2, title: 'Payment received', message: 'Your invoice #4821 was paid successfully.', category: 'success' as const, read: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
    { id: 3, title: 'Storage almost full', message: 'You are using 92% of your available storage.', category: 'warning' as const, read: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  ])

  return (
    <div className="space-y-10">
      <Preview title="Categories" code={`import { NotificationCard } from '~/components/ui/notification-card'

<NotificationCard title="New message" message="You have a new message from support." timestamp={new Date()} category="info" />
<NotificationCard title="Payment received" message="Invoice #4821 was paid." timestamp={new Date()} category="success" />
<NotificationCard title="Storage almost full" message="92% of storage used." timestamp={new Date()} category="warning" />
<NotificationCard title="Payment failed" message="Your card was declined." timestamp={new Date()} category="error" />
<NotificationCard title="New follower" message="Jordan started following you." timestamp={new Date()} category="social" />
<NotificationCard title="System update" message="A new version is available." timestamp={new Date()} category="system" />`}>
        <View style={{ width: '100%', maxWidth: 420, gap: 10 }}>
          <NotificationCard title="New message" message="You have a new message from support." timestamp={new Date()} category="info" />
          <NotificationCard title="Payment received" message="Invoice #4821 was paid." timestamp={new Date()} category="success" />
          <NotificationCard title="Storage almost full" message="92% of storage used." timestamp={new Date()} category="warning" />
        </View>
      </Preview>

      <Preview title="Unread vs read" code={`<NotificationCard title="New comment" message="Priya replied to your post." timestamp={new Date()} category="social" read={false} />
<NotificationCard title="Weekly digest" message="Here's what happened this week." timestamp={new Date()} category="system" read />`}>
        <View style={{ width: '100%', maxWidth: 420, gap: 10 }}>
          <NotificationCard title="New comment" message="Priya replied to your post." timestamp={new Date()} category="social" read={false} />
          <NotificationCard title="Weekly digest" message="Here's what happened this week." timestamp={new Date()} category="system" read />
        </View>
      </Preview>

      <Preview title="With avatar instead of icon" code={`<NotificationCard
  title="Jordan Lee"
  message="Liked your comment on 'Design systems at scale'"
  timestamp={new Date()}
  avatar={{ uri: 'https://...' }}
  category="social"
  onPress={() => {}}
/>`}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <NotificationCard
            title="Jordan Lee"
            message="Liked your comment on 'Design systems at scale'"
            timestamp={new Date()}
            avatar={{ uri: 'https://picsum.photos/seed/jordan/100/100' }}
            category="social"
            onPress={() => {}}
          />
        </View>
      </Preview>

      <Preview title="Swipe-to-dismiss list" code={`const [notifications, setNotifications] = useState([...])

{notifications.map(n => (
  <NotificationCard
    key={n.id}
    title={n.title}
    message={n.message}
    timestamp={n.timestamp}
    category={n.category}
    read={n.read}
    onDismiss={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
    onPress={() => markAsRead(n.id)}
  />
))}`}>
        <View style={{ width: '100%', maxWidth: 420, gap: 10 }}>
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              title={n.title}
              message={n.message}
              timestamp={n.timestamp}
              category={n.category}
              read={n.read}
              onDismiss={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
              onPress={() =>
                setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
              }
            />
          ))}
          {notifications.length === 0 && (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <span style={{ color: '#71717a', fontSize: 13 }}>No notifications</span>
            </View>
          )}
        </View>
      </Preview>

      <Preview title="Swipe-to-dismiss disabled" code={`<NotificationCard
  title="System maintenance"
  message="Scheduled maintenance on Sunday 2AM UTC."
  timestamp={new Date()}
  category="system"
  swipeToDismiss={false}
/>`}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <NotificationCard
            title="System maintenance"
            message="Scheduled maintenance on Sunday 2AM UTC."
            timestamp={new Date()}
            category="system"
            swipeToDismiss={false}
          />
        </View>
      </Preview>
    </div>
  )
}
