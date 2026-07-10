'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Image } from '../../../../packages/registry/components/image/image'

export default function ImagePreview() {
  return (
    <div className="space-y-10">
      <Preview title="Basic image with shimmer placeholder" code={`import { Image } from '~/components/ui/image'

<Image
  source={{ uri: 'https://picsum.photos/seed/native-mate/400/300' }}
  width={220}
  height={140}
  borderRadius={12}
/>`}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/native-mate/400/300' }}
          width={220}
          height={140}
          borderRadius={12}
        />
      </Preview>

      <Preview title="Aspect ratio" code={`<Image
  source={{ uri: 'https://picsum.photos/seed/aspect/800/450' }}
  aspectRatio={16 / 9}
  borderRadius={12}
  width={280}
/>`}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/aspect/800/450' }}
          aspectRatio={16 / 9}
          borderRadius={12}
          width={280}
        />
      </Preview>

      <Preview title="Blur placeholder + loading indicator" code={`<Image
  source={{ uri: 'https://picsum.photos/seed/blur/400/400' }}
  placeholder="blur"
  showLoadingIndicator
  width={160}
  height={160}
  borderRadius={80}
/>`}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/blur/400/400' }}
          placeholder="blur"
          showLoadingIndicator
          width={160}
          height={160}
          borderRadius={80}
        />
      </Preview>

      <Preview title="Broken source with fallback" code={`<Image
  source={{ uri: 'https://this-domain-does-not-exist.invalid/broken.jpg' }}
  fallbackSource={{ uri: 'https://picsum.photos/seed/fallback/400/300' }}
  width={220}
  height={140}
  borderRadius={12}
/>`}>
        <Image
          source={{ uri: 'https://this-domain-does-not-exist.invalid/broken.jpg' }}
          fallbackSource={{ uri: 'https://picsum.photos/seed/fallback/400/300' }}
          width={220}
          height={140}
          borderRadius={12}
        />
      </Preview>

      <Preview title="Error state (no fallback)" code={`<Image
  source={{ uri: 'https://this-domain-does-not-exist.invalid/broken.jpg' }}
  width={160}
  height={160}
  borderRadius={12}
/>`}>
        <Image
          source={{ uri: 'https://this-domain-does-not-exist.invalid/broken.jpg' }}
          width={160}
          height={160}
          borderRadius={12}
        />
      </Preview>
    </div>
  )
}
