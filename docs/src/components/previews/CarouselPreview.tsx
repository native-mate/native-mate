'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Carousel } from '../../../../packages/registry/components/carousel/carousel'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']

function Slide({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ height: 140, borderRadius: 12, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <View />
      <View style={{ position: 'absolute' }}>
        <View />
      </View>
    </View>
  )
}

export default function CarouselPreview() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="space-y-10">
      <Preview title="Basic carousel" code={`import { Carousel } from '~/components/ui/carousel'
import { Text } from '@native-mate/core'
import { View } from 'react-native'

const slides = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

<Carousel
  data={slides}
  itemWidth={240}
  renderItem={(color, i) => (
    <View style={{ height: 140, borderRadius: 12, backgroundColor: color }}>
      <Text style={{ padding: 12, color: '#fff' }}>Slide {i + 1}</Text>
    </View>
  )}
/>`}>
        <View style={{ width: 340 }}>
          <Carousel
            data={COLORS}
            itemWidth={240}
            contentInset={16}
            renderItem={(color: string, i: number) => (
              <View style={{ height: 140, borderRadius: 12, backgroundColor: color }} />
            )}
          />
        </View>
      </Preview>

      <Preview title="Pagination on top" code={`<Carousel
  data={slides}
  itemWidth={240}
  paginationPosition="top"
  renderItem={(color) => <View style={{ height: 140, borderRadius: 12, backgroundColor: color }} />}
/>`}>
        <View style={{ width: 340 }}>
          <Carousel
            data={COLORS}
            itemWidth={240}
            contentInset={16}
            paginationPosition="top"
            renderItem={(color: string) => (
              <View style={{ height: 140, borderRadius: 12, backgroundColor: color }} />
            )}
          />
        </View>
      </Preview>

      <Preview title="Auto-play with loop" code={`<Carousel
  data={slides}
  itemWidth={240}
  autoPlay
  autoPlayInterval={2500}
  loop
  renderItem={(color) => <View style={{ height: 140, borderRadius: 12, backgroundColor: color }} />}
/>`}>
        <View style={{ width: 340 }}>
          <Carousel
            data={COLORS}
            itemWidth={240}
            contentInset={16}
            autoPlay
            autoPlayInterval={2500}
            loop
            renderItem={(color: string) => (
              <View style={{ height: 140, borderRadius: 12, backgroundColor: color }} />
            )}
          />
        </View>
      </Preview>

      <Preview title="Index change callback" code={`const [activeIndex, setActiveIndex] = useState(0)

<Carousel
  data={slides}
  itemWidth={240}
  onIndexChange={setActiveIndex}
  renderItem={(color) => <View style={{ height: 140, borderRadius: 12, backgroundColor: color }} />}
/>
<Text>Active: {activeIndex + 1} / {slides.length}</Text>`}>
        <View style={{ width: 340, gap: 8 }}>
          <Carousel
            data={COLORS}
            itemWidth={240}
            contentInset={16}
            onIndexChange={setActiveIndex}
            renderItem={(color: string) => (
              <View style={{ height: 140, borderRadius: 12, backgroundColor: color }} />
            )}
          />
        </View>
      </Preview>
    </div>
  )
}
