'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { ChatBubble } from '../../../../packages/registry/components/chat-bubble/chat-bubble'

export default function ChatBubblePreview() {
  return (
    <div className="space-y-10">
      <Preview title="Conversation" code={`import { ChatBubble } from '~/components/ui/chat-bubble'

<ChatBubble sender="other" message="Hey! Are we still on for tomorrow?" timestamp={new Date()} />
<ChatBubble sender="self" message="Yep, 10am works for me." timestamp={new Date()} status="read" />
<ChatBubble sender="other" message="Perfect, see you then." timestamp={new Date()} />`}>
        <View style={{ width: 320, gap: 4 }}>
          <ChatBubble sender="other" message="Hey! Are we still on for tomorrow?" timestamp={new Date()} />
          <ChatBubble sender="self" message="Yep, 10am works for me." timestamp={new Date()} status="read" />
          <ChatBubble sender="other" message="Perfect, see you then." timestamp={new Date()} />
        </View>
      </Preview>

      <Preview title="Delivery statuses" code={`<ChatBubble sender="self" message="Sending…" timestamp={new Date()} status="sending" />
<ChatBubble sender="self" message="Sent" timestamp={new Date()} status="sent" />
<ChatBubble sender="self" message="Delivered" timestamp={new Date()} status="delivered" />
<ChatBubble sender="self" message="Read" timestamp={new Date()} status="read" />`}>
        <View style={{ width: 320, gap: 4 }}>
          <ChatBubble sender="self" message="Sending…" timestamp={new Date()} status="sending" />
          <ChatBubble sender="self" message="Sent" timestamp={new Date()} status="sent" />
          <ChatBubble sender="self" message="Delivered" timestamp={new Date()} status="delivered" />
          <ChatBubble sender="self" message="Read" timestamp={new Date()} status="read" />
        </View>
      </Preview>

      <Preview title="With avatar, sender name, and timestamp" code={`<ChatBubble
  sender="other"
  senderName="Priya Shah"
  message="Sounds good, I'll send the files over."
  timestamp={new Date()}
  showTimestamp
  avatar={{ uri: 'https://i.pravatar.cc/64?img=5' }}
/>`}>
        <View style={{ width: 320 }}>
          <ChatBubble
            sender="other"
            senderName="Priya Shah"
            message="Sounds good, I'll send the files over."
            timestamp={new Date()}
            showTimestamp
            avatar={{ uri: 'https://i.pravatar.cc/64?img=5' }}
          />
        </View>
      </Preview>

      <Preview title="System message" code={`<ChatBubble type="system" message="Priya joined the chat" timestamp={new Date()} sender="other" />`}>
        <View style={{ width: 320 }}>
          <ChatBubble type="system" message="Priya joined the chat" timestamp={new Date()} sender="other" />
        </View>
      </Preview>

      <Preview title="Custom bubble colors" code={`<ChatBubble
  sender="self"
  message="Custom colored bubble"
  timestamp={new Date()}
  selfColor="#8b5cf6"
/>`}>
        <View style={{ width: 320 }}>
          <ChatBubble sender="self" message="Custom colored bubble" timestamp={new Date()} selfColor="#8b5cf6" />
        </View>
      </Preview>
    </div>
  )
}
