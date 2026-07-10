'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { AudioPlayer } from '../../../../packages/registry/components/audio-player/audio-player'

export default function AudioPlayerPreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [compactPlaying, setCompactPlaying] = useState(true)

  return (
    <div className="space-y-10">
      <Preview title="Full player" code={`import { AudioPlayer } from '~/components/ui/audio-player'
import { useState } from 'react'

const [isPlaying, setIsPlaying] = useState(false)

<AudioPlayer
  title="Weightless"
  artist="Marconi Union"
  isPlaying={isPlaying}
  currentTime={68}
  duration={300}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
  onNext={() => {}}
  onPrevious={() => {}}
/>`}>
        <View style={{ width: 260 }}>
          <AudioPlayer
            title="Weightless"
            artist="Marconi Union"
            isPlaying={isPlaying}
            currentTime={68}
            duration={300}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onNext={() => {}}
            onPrevious={() => {}}
          />
        </View>
      </Preview>

      <Preview title="Without artwork (placeholder icon)" code={`<AudioPlayer
  title="Untitled Track"
  isPlaying={false}
  currentTime={0}
  duration={180}
/>`}>
        <View style={{ width: 260 }}>
          <AudioPlayer title="Untitled Track" isPlaying={false} currentTime={0} duration={180} />
        </View>
      </Preview>

      <Preview title="Compact mode" code={`<AudioPlayer
  title="Clair de Lune"
  artist="Debussy"
  compact
  isPlaying={compactPlaying}
  currentTime={45}
  duration={280}
  onPlay={() => setCompactPlaying(true)}
  onPause={() => setCompactPlaying(false)}
/>`}>
        <View style={{ width: 300 }}>
          <AudioPlayer
            title="Clair de Lune"
            artist="Debussy"
            compact
            isPlaying={compactPlaying}
            currentTime={45}
            duration={280}
            onPlay={() => setCompactPlaying(true)}
            onPause={() => setCompactPlaying(false)}
          />
        </View>
      </Preview>

      <Preview title="No progress / no controls" code={`<AudioPlayer
  title="Ambient Loop"
  artist="Field Recording"
  showProgress={false}
  showControls={false}
/>`}>
        <View style={{ width: 260 }}>
          <AudioPlayer title="Ambient Loop" artist="Field Recording" showProgress={false} showControls={false} />
        </View>
      </Preview>
    </div>
  )
}
