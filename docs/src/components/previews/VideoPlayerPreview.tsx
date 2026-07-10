'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { VideoPlayer } from '../../../../packages/registry/components/video-player/video-player'

export default function VideoPlayerPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Basic player with poster" code={`import { VideoPlayer } from '~/components/ui/video-player'

<VideoPlayer
  source={{ uri: 'https://example.com/video.mp4' }}
  poster="https://example.com/poster.jpg"
/>`}>
        <View style={{ width: 320 }}>
          <VideoPlayer
            source={{ uri: 'https://example.com/video.mp4' }}
            poster="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&q=60"
            borderRadius={12}
          />
        </View>
      </Preview>

      <Preview title="No poster (tap-to-play placeholder)" code={`<VideoPlayer
  source={{ uri: 'https://example.com/video.mp4' }}
/>`}>
        <View style={{ width: 320 }}>
          <VideoPlayer source={{ uri: 'https://example.com/video.mp4' }} borderRadius={12} />
        </View>
      </Preview>

      <Preview title="Custom aspect ratio + rounded corners" code={`<VideoPlayer
  source={{ uri: 'https://example.com/video.mp4' }}
  poster="https://example.com/poster.jpg"
  aspectRatio={1}
  borderRadius={20}
/>`}>
        <View style={{ width: 240 }}>
          <VideoPlayer
            source={{ uri: 'https://example.com/video.mp4' }}
            poster="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe8f?w=480&q=60"
            aspectRatio={1}
            borderRadius={20}
          />
        </View>
      </Preview>

      <Preview title="Controls hidden" code={`<VideoPlayer
  source={{ uri: 'https://example.com/video.mp4' }}
  poster="https://example.com/poster.jpg"
  controls={false}
/>`}>
        <View style={{ width: 320 }}>
          <VideoPlayer
            source={{ uri: 'https://example.com/video.mp4' }}
            poster="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&q=60"
            controls={false}
            borderRadius={12}
          />
        </View>
      </Preview>
    </div>
  )
}
