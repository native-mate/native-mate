'use client'
import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { InfiniteScroll } from '../../../../packages/registry/components/infinite-scroll/infinite-scroll'
import { Text, Separator } from '@native-mate/core'

function makeItems(start: number, count: number) {
  return Array.from({ length: count }, (_, i) => ({ id: start + i, title: `Item #${start + i + 1}` }))
}

export default function InfiniteScrollPreview() {
  const [data1, setData1] = useState(() => makeItems(0, 10))
  const [loading1, setLoading1] = useState(false)
  const [hasMore1, setHasMore1] = useState(true)

  const loadMore1 = useCallback(() => {
    if (loading1 || !hasMore1) return
    setLoading1(true)
    setTimeout(() => {
      setData1((prev) => {
        const next = [...prev, ...makeItems(prev.length, 10)]
        if (next.length >= 40) setHasMore1(false)
        return next
      })
      setLoading1(false)
    }, 900)
  }, [loading1, hasMore1])

  const [data2] = useState<{ id: number; title: string }[]>([])

  return (
    <div className="space-y-10">
      <Preview title="Load more on scroll" minHeight={320} code={`import { InfiniteScroll } from '~/components/ui/infinite-scroll'

const [data, setData] = useState(initialItems)
const [loading, setLoading] = useState(false)
const [hasMore, setHasMore] = useState(true)

const loadMore = () => {
  if (loading || !hasMore) return
  setLoading(true)
  fetchNextPage().then((page) => {
    setData(prev => [...prev, ...page])
    setHasMore(page.length > 0)
    setLoading(false)
  })
}

<InfiniteScroll
  data={data}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <ListRow title={item.title} />}
  onLoadMore={loadMore}
  hasMore={hasMore}
  loading={loading}
  endMessage="You've reached the end"
/>`}>
        <View style={{ width: '100%', maxWidth: 380, height: 280, borderWidth: 1, borderColor: '#27272a', borderRadius: 12 }}>
          <InfiniteScroll
            data={data1}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
                <Text>{item.title}</Text>
              </View>
            )}
            ItemSeparatorComponent={<Separator />}
            onLoadMore={loadMore1}
            hasMore={hasMore1}
            loading={loading1}
            endMessage="You've reached the end"
          />
        </View>
      </Preview>

      <Preview title="Empty state" minHeight={220} code={`<InfiniteScroll
  data={[]}
  renderItem={({ item }) => <ListRow title={item.title} />}
  onLoadMore={() => {}}
  hasMore={false}
  loading={false}
/>
// Renders the built-in "No items yet" empty state`}>
        <View style={{ width: '100%', maxWidth: 380, height: 200, borderWidth: 1, borderColor: '#27272a', borderRadius: 12 }}>
          <InfiniteScroll
            data={data2}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            onLoadMore={() => {}}
            hasMore={false}
            loading={false}
          />
        </View>
      </Preview>

      <Preview title="Grid layout (numColumns)" minHeight={260} code={`<InfiniteScroll
  data={products}
  numColumns={2}
  renderItem={({ item }) => <ProductCard product={item} />}
  onLoadMore={loadMore}
  hasMore={hasMore}
  loading={loading}
/>`}>
        <View style={{ width: '100%', maxWidth: 380, height: 240, borderWidth: 1, borderColor: '#27272a', borderRadius: 12 }}>
          <InfiniteScroll
            data={makeItems(0, 8)}
            numColumns={2}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={{ flex: 1, margin: 6, padding: 16, borderRadius: 8, backgroundColor: '#18181b', alignItems: 'center' }}>
                <Text>{item.title}</Text>
              </View>
            )}
            onLoadMore={() => {}}
            hasMore={false}
            loading={false}
          />
        </View>
      </Preview>
    </div>
  )
}
