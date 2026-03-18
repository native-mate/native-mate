'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from '../../../../packages/registry/components/skeleton/skeleton'

export default function SkeletonPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Shimmer (default)" minHeight={160} code={`import { SkeletonAvatar } from '~/components/ui/skeleton'

// Profile list loading state
{[1, 2, 3].map(i => (
  <SkeletonAvatar key={i} size={44} textLines={2} />
))}`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 14 }}>
          <SkeletonAvatar size={44} textLines={2} />
          <SkeletonAvatar size={44} textLines={2} />
          <SkeletonAvatar size={44} textLines={2} />
        </View>
      </Preview>

      <Preview title="SkeletonCard" minHeight={200} code={`import { SkeletonCard } from '~/components/ui/skeleton'

<SkeletonCard imageHeight={140} lines={3} />`}>
        <View style={{ width: '100%', maxWidth: 320 }}>
          <SkeletonCard imageHeight={140} lines={3} />
        </View>
      </Preview>

      <Preview title="SkeletonText" code={`import { SkeletonText } from '~/components/ui/skeleton'

<SkeletonText lines={4} lastLineWidth="55%" />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <SkeletonText lines={4} lastLineWidth="55%" />
        </View>
      </Preview>

      <Preview title="Pulse variant" minHeight={120} code={`import { Skeleton, SkeletonAvatar } from '~/components/ui/skeleton'

<SkeletonAvatar size={48} textLines={2} variant="pulse" />
<Skeleton width="100%" height={40} variant="pulse" borderRadius={8} />`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 12 }}>
          <SkeletonAvatar size={48} textLines={2} variant="pulse" />
          <Skeleton width="100%" height={40} variant="pulse" borderRadius={8} />
        </View>
      </Preview>
    </div>
  )
}
