'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Comment } from '../../../../packages/registry/components/comment/comment'

export default function CommentPreview() {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(12)

  return (
    <div className="space-y-10">
      <Preview title="Basic comment" code={`import { Comment } from '~/components/ui/comment'

<Comment
  author="Jordan Lee"
  content="This is exactly the pattern I was looking for, thanks!"
  timestamp={new Date(Date.now() - 1000 * 60 * 12)}
  likes={12}
  onLike={() => {}}
  onReply={() => {}}
/>`}>
        <View style={{ width: 340 }}>
          <Comment
            author="Jordan Lee"
            content="This is exactly the pattern I was looking for, thanks!"
            timestamp={new Date(Date.now() - 1000 * 60 * 12)}
            likes={likes}
            liked={liked}
            onLike={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1) }}
            onReply={() => {}}
          />
        </View>
      </Preview>

      <Preview title="With nested replies" code={`<Comment
  author="Alex Rivera"
  content="Does this support pagination for large threads?"
  timestamp={new Date(Date.now() - 1000 * 60 * 60 * 2)}
  likes={4}
  onLike={() => {}}
  onReply={() => {}}
  replies={[
    {
      id: '1',
      author: 'Sam Okafor',
      content: 'Not yet, but it handles a few hundred comments fine.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 2,
    },
  ]}
/>`}>
        <View style={{ width: 340 }}>
          <Comment
            author="Alex Rivera"
            content="Does this support pagination for large threads?"
            timestamp={new Date(Date.now() - 1000 * 60 * 60 * 2)}
            likes={4}
            onLike={() => {}}
            onReply={() => {}}
            replies={[
              {
                id: '1',
                author: 'Sam Okafor',
                content: 'Not yet, but it handles a few hundred comments fine.',
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                likes: 2,
              },
            ]}
          />
        </View>
      </Preview>

      <Preview title="With avatar and author press" code={`<Comment
  author="Maya Chen"
  avatar={{ uri: 'https://i.pravatar.cc/64?img=8' }}
  content="Great write-up on the animation timing."
  timestamp={new Date(Date.now() - 1000 * 60 * 5)}
  onAuthorPress={(author) => console.log(author)}
/>`}>
        <View style={{ width: 340 }}>
          <Comment
            author="Maya Chen"
            avatar={{ uri: 'https://i.pravatar.cc/64?img=8' }}
            content="Great write-up on the animation timing."
            timestamp={new Date(Date.now() - 1000 * 60 * 5)}
            onAuthorPress={() => {}}
          />
        </View>
      </Preview>
    </div>
  )
}
