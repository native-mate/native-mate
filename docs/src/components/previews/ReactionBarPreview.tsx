'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { ReactionBar } from '../../../../packages/registry/components/reaction-bar/reaction-bar'
import type { Reaction } from '../../../../packages/registry/components/reaction-bar/reaction-bar.types'

const INITIAL: Reaction[] = [
  { emoji: '❤️', count: 24, reacted: true },
  { emoji: '🔥', count: 8, reacted: false },
  { emoji: '😂', count: 3, reacted: false },
]

const OVERFLOW: Reaction[] = [
  { emoji: '❤️', count: 24, reacted: false },
  { emoji: '🔥', count: 8, reacted: false },
  { emoji: '😂', count: 3, reacted: false },
  { emoji: '👍', count: 12, reacted: false },
  { emoji: '👏', count: 5, reacted: false },
  { emoji: '🎉', count: 2, reacted: false },
]

function toggleReaction(list: Reaction[], emoji: string): Reaction[] {
  return list.map((r) =>
    r.emoji === emoji ? { ...r, reacted: !r.reacted, count: r.reacted ? r.count - 1 : r.count + 1 } : r
  )
}

export default function ReactionBarPreview() {
  const [reactions, setReactions] = useState<Reaction[]>(INITIAL)
  const [smallReactions, setSmallReactions] = useState<Reaction[]>(INITIAL)

  return (
    <div className="space-y-10">
      <Preview title="Basic — tap to react" code={`import { ReactionBar } from '~/components/ui/reaction-bar'

const [reactions, setReactions] = useState([
  { emoji: '❤️', count: 24, reacted: true },
  { emoji: '🔥', count: 8, reacted: false },
  { emoji: '😂', count: 3, reacted: false },
])

<ReactionBar
  reactions={reactions}
  onReact={(emoji) => toggle(emoji)}
/>`}>
        <ReactionBar
          reactions={reactions}
          onReact={(emoji) => setReactions((prev) => toggleReaction(prev, emoji))}
        />
      </Preview>

      <Preview title="Sizes" code={`<ReactionBar reactions={reactions} size="sm" />
<ReactionBar reactions={reactions} size="md" />`}>
        <View style={{ gap: 12 }}>
          <ReactionBar
            reactions={smallReactions}
            size="sm"
            onReact={(emoji) => setSmallReactions((prev) => toggleReaction(prev, emoji))}
          />
          <ReactionBar reactions={reactions} size="md" onReact={(emoji) => setReactions((prev) => toggleReaction(prev, emoji))} />
        </View>
      </Preview>

      <Preview title="With add-reaction button" code={`<ReactionBar
  reactions={reactions}
  onReact={(emoji) => toggle(emoji)}
  onLongPress={() => openEmojiPicker()}
/>`}>
        <ReactionBar
          reactions={reactions}
          onReact={(emoji) => setReactions((prev) => toggleReaction(prev, emoji))}
          onLongPress={() => {}}
        />
      </Preview>

      <Preview title="Overflow (maxVisible)" code={`<ReactionBar reactions={sixReactions} maxVisible={4} />`}>
        <ReactionBar reactions={OVERFLOW} maxVisible={4} />
      </Preview>
    </div>
  )
}
