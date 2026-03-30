import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { Icon } from '../components/ui/icon'
import { Separator } from '../components/ui/separator'
import { ChatBubble } from '../components/ui/chat-bubble'
import { NotificationCard } from '../components/ui/notification-card'
import { Timeline } from '../components/ui/timeline'
import { Comment } from '../components/ui/comment'
import { ReactionBar } from '../components/ui/reaction-bar'
import { MentionInput } from '../components/ui/mention-input'

const timelineItems = [
  {
    key: 'placed',
    title: 'Order Placed',
    description: 'Your order #1234 has been confirmed',
    status: 'completed' as const,
    timestamp: 'Mar 28, 10:00 AM',
  },
  {
    key: 'processing',
    title: 'Processing',
    description: 'Items are being prepared for shipment',
    status: 'completed' as const,
    timestamp: 'Mar 28, 2:30 PM',
  },
  {
    key: 'shipped',
    title: 'Shipped',
    description: 'Package is on its way via Express',
    status: 'active' as const,
    timestamp: 'Mar 29, 9:15 AM',
  },
  {
    key: 'delivered',
    title: 'Delivered',
    description: 'Estimated arrival at your doorstep',
    status: 'pending' as const,
    timestamp: 'Mar 31, by 6:00 PM',
  },
]

const reactions = [
  { emoji: '\u{1F44D}', count: 12, reacted: true },
  { emoji: '\u{2764}\u{FE0F}', count: 8, reacted: false },
  { emoji: '\u{1F602}', count: 5, reacted: false },
  { emoji: '\u{1F525}', count: 3, reacted: true },
  { emoji: '\u{1F389}', count: 2, reacted: false },
]

const mentionUsers = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Brown' },
  { id: '4', name: 'Diana Prince' },
  { id: '5', name: 'Edward Norton' },
]

export default function SocialShowcaseScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [reactionState, setReactionState] = useState(reactions)
  const [mentionValue, setMentionValue] = useState('')

  const handleReaction = (index: number) => {
    setReactionState((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, reacted: !r.reacted, count: r.reacted ? r.count - 1 : r.count + 1 }
          : r
      )
    )
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <Text variant="h3">Social</Text>
              <Text variant="caption" color="muted">Chat, notifications, and activity</Text>
            </View>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Icon name="arrow-back" size={16} />}
              onPress={() => router.back()}
            >
              Back
            </Button>
          </View>

          {/* Messages Section */}
          <Text variant="h5">Messages</Text>
          <View style={{ gap: 8 }}>
            <ChatBubble
              message="Hey! Are you coming to the meetup tonight?"
              variant="other"
              sender="Alice"
              timestamp="10:30 AM"
            />
            <ChatBubble
              message="Yes, I'll be there around 7pm!"
              variant="self"
              status="read"
              timestamp="10:32 AM"
            />
            <ChatBubble
              message="Great! I'll save you a seat near the front."
              variant="other"
              sender="Alice"
              timestamp="10:33 AM"
            />
            <ChatBubble
              message="Alice joined the group"
              variant="system"
            />
            <ChatBubble
              message="Can you bring the presentation slides?"
              variant="other"
              sender="Bob"
              timestamp="10:45 AM"
            />
            <ChatBubble
              message="Already uploaded them to the shared drive. Check your email."
              variant="self"
              status="delivered"
              timestamp="10:47 AM"
            />
          </View>

          <Separator label="Notifications" />

          <View style={{ gap: 12 }}>
            <NotificationCard
              variant="success"
              title="Payment received"
              description="You received $250.00 from Alice Johnson for the project milestone."
              timestamp="2 min ago"
              icon={<Icon name="checkmark-circle" size={20} color={theme.colors.success} />}
            />
            <NotificationCard
              variant="warning"
              title="Password expiring"
              description="Your password will expire in 3 days. Update it now to avoid losing access."
              timestamp="1 hour ago"
              icon={<Icon name="alert-circle" size={20} color={theme.colors.warning} />}
            />
            <NotificationCard
              variant="info"
              title="New follower"
              description="Diana Prince started following you. You now have 1,234 followers."
              timestamp="3 hours ago"
              icon={<Icon name="person-add" size={20} color={theme.colors.primary} />}
            />
          </View>

          <Separator label="Activity" />

          <Timeline items={timelineItems} />

          <Separator label="Comments" />

          <View style={{ gap: 16 }}>
            <Comment
              author="Alice Johnson"
              content="This is a fantastic update! The new design looks really polished."
              timestamp="2 hours ago"
              likes={12}
              replies={[
                {
                  author: 'Bob Smith',
                  content: 'Agreed! The attention to detail is impressive.',
                  timestamp: '1 hour ago',
                  likes: 4,
                },
                {
                  author: 'Charlie Brown',
                  content: 'The color palette is perfect for accessibility.',
                  timestamp: '45 min ago',
                  likes: 2,
                },
              ]}
            />
            <Comment
              author="Diana Prince"
              content="Would love to see dark mode support next. Any plans for that?"
              timestamp="30 min ago"
              likes={8}
              replies={[
                {
                  author: 'Edward Norton',
                  content: "It's on the roadmap for next sprint!",
                  timestamp: '15 min ago',
                  likes: 6,
                },
              ]}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Text variant="label">Reactions</Text>
            <ReactionBar
              reactions={reactionState}
              onReaction={handleReaction}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Text variant="label">Mention someone</Text>
            <MentionInput
              value={mentionValue}
              onChangeText={setMentionValue}
              users={mentionUsers}
              placeholder="Type @ to mention someone..."
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
