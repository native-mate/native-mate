'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { MentionInput } from '../../../../packages/registry/components/mention-input/mention-input'

const USERS = [
  { id: 'ada', name: 'Ada Lovelace' },
  { id: 'alan', name: 'Alan Turing' },
  { id: 'grace', name: 'Grace Hopper' },
  { id: 'linus', name: 'Linus Torvalds' },
]

export default function MentionInputPreview() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('Hey @Ada Lovelace, can you review this?')
  const [text3, setText3] = useState('')

  return (
    <div className="space-y-10">
      <Preview title="Default — type @ to trigger mentions" minHeight={80} code={`import { MentionInput } from '~/components/ui/mention-input'

const users = [
  { id: 'ada', name: 'Ada Lovelace' },
  { id: 'alan', name: 'Alan Turing' },
]

const [text, setText] = useState('')

<MentionInput
  value={text}
  onChangeText={setText}
  mentions={users}
  placeholder="Type a message..."
/>`}>
        <View style={{ width: 320 }}>
          <MentionInput value={text1} onChangeText={setText1} mentions={USERS} placeholder="Type a message..." />
        </View>
      </Preview>

      <Preview title="Pre-filled with a mention" minHeight={80} code={`<MentionInput
  value="Hey @Ada Lovelace, can you review this?"
  onChangeText={setText}
  mentions={users}
/>`}>
        <View style={{ width: 320 }}>
          <MentionInput value={text2} onChangeText={setText2} mentions={USERS} />
        </View>
      </Preview>

      <Preview title="Multiline comment box" minHeight={120} code={`<MentionInput
  value={text}
  onChangeText={setText}
  mentions={users}
  multiline
  maxLines={4}
  placeholder="Write a comment..."
/>`}>
        <View style={{ width: 320 }}>
          <MentionInput
            value={text3}
            onChangeText={setText3}
            mentions={USERS}
            multiline
            maxLines={4}
            placeholder="Write a comment..."
          />
        </View>
      </Preview>

      <Preview title="Disabled" minHeight={80} code={`<MentionInput value="Locked message" onChangeText={() => {}} disabled />`}>
        <View style={{ width: 320 }}>
          <MentionInput value="Locked message" onChangeText={() => {}} disabled />
        </View>
      </Preview>
    </div>
  )
}
