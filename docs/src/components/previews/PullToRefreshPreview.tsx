'use client'
import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { PullToRefresh } from '../../../../packages/registry/components/pull-to-refresh/pull-to-refresh'
import { Text } from '@native-mate/core'

export default function PullToRefreshPreview() {
  const [refreshing1, setRefreshing1] = useState(false)
  const [count, setCount] = useState(1)

  const onRefresh1 = useCallback(() => {
    setRefreshing1(true)
    setTimeout(() => {
      setCount((c) => c + 1)
      setRefreshing1(false)
    }, 1200)
  }, [])

  const [refreshing2, setRefreshing2] = useState(false)
  const onRefresh2 = useCallback(() => {
    setRefreshing2(true)
    setTimeout(() => setRefreshing2(false), 1200)
  }, [])

  return (
    <div className="space-y-10">
      <Preview title="Basic pull to refresh" minHeight={280} code={`import { PullToRefresh } from '~/components/ui/pull-to-refresh'

const [refreshing, setRefreshing] = useState(false)

const onRefresh = () => {
  setRefreshing(true)
  fetchLatest().then(() => setRefreshing(false))
}

<PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
  <View style={{ padding: 16 }}>
    <Text>Pull down from the top to refresh (refreshed {count}x)</Text>
  </View>
</PullToRefresh>`}>
        <View style={{ width: '100%', maxWidth: 380, height: 240, borderWidth: 1, borderColor: '#27272a', borderRadius: 12, overflow: 'hidden' }}>
          <PullToRefresh onRefresh={onRefresh1} refreshing={refreshing1}>
            <View style={{ padding: 16, gap: 8 }}>
              <Text weight="semibold">Feed</Text>
              <Text muted>Pull down from the top to refresh. Refreshed {count}x.</Text>
              {Array.from({ length: 6 }).map((_, i) => (
                <Text key={i} muted>Feed item #{i + 1}</Text>
              ))}
            </View>
          </PullToRefresh>
        </View>
      </Preview>

      <Preview title="Custom indicator color & pull distance" minHeight={280} code={`<PullToRefresh
  onRefresh={onRefresh}
  refreshing={refreshing}
  indicatorColor="#10b981"
  pullDistance={100}
  indicatorSize={32}
>
  <View style={{ padding: 16 }}>
    <Text>Requires a longer pull before it triggers</Text>
  </View>
</PullToRefresh>`}>
        <View style={{ width: '100%', maxWidth: 380, height: 240, borderWidth: 1, borderColor: '#27272a', borderRadius: 12, overflow: 'hidden' }}>
          <PullToRefresh
            onRefresh={onRefresh2}
            refreshing={refreshing2}
            indicatorColor="#10b981"
            pullDistance={100}
            indicatorSize={32}
          >
            <View style={{ padding: 16, gap: 8 }}>
              <Text weight="semibold">Longer pull distance</Text>
              <Text muted>Emerald indicator, 100px pull distance.</Text>
            </View>
          </PullToRefresh>
        </View>
      </Preview>

      <Preview title="Disabled" minHeight={200} code={`<PullToRefresh onRefresh={onRefresh} refreshing={false} disabled>
  <View style={{ padding: 16 }}>
    <Text>Pull to refresh is disabled here</Text>
  </View>
</PullToRefresh>`}>
        <View style={{ width: '100%', maxWidth: 380, height: 180, borderWidth: 1, borderColor: '#27272a', borderRadius: 12, overflow: 'hidden' }}>
          <PullToRefresh onRefresh={() => {}} refreshing={false} disabled>
            <View style={{ padding: 16 }}>
              <Text muted>Pull to refresh is disabled on this screen.</Text>
            </View>
          </PullToRefresh>
        </View>
      </Preview>
    </div>
  )
}
