'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Header } from '../../../../packages/registry/components/header/header'

export default function HeaderPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Basic header" minHeight={120} code={`import { Header } from '~/components/ui/header'

<Header title="Settings" onLeftPress={() => router.back()} />`}>
        <View style={{ width: '100%' }}>
          <Header title="Settings" onLeftPress={() => {}} topInset={0} />
        </View>
      </Preview>

      <Preview title="With subtitle and right actions" minHeight={120} code={`<Header
  title="Acme Corp"
  subtitle="12 members"
  onLeftPress={() => router.back()}
  rightActions={[
    { icon: 'search-outline', onPress: () => {}, accessibilityLabel: 'Search' },
    { icon: 'ellipsis-horizontal', onPress: () => {}, accessibilityLabel: 'More' },
  ]}
/>`}>
        <View style={{ width: '100%' }}>
          <Header
            title="Acme Corp"
            subtitle="12 members"
            onLeftPress={() => {}}
            topInset={0}
            rightActions={[
              { icon: 'search-outline', onPress: () => {}, accessibilityLabel: 'Search' },
              { icon: 'ellipsis-horizontal', onPress: () => {}, accessibilityLabel: 'More' },
            ]}
          />
        </View>
      </Preview>

      <Preview title="Large title" minHeight={160} code={`<Header
  title="Messages"
  largeTitle
  hideLeft
  rightActions={[
    { icon: 'create-outline', onPress: () => {}, accessibilityLabel: 'Compose' },
  ]}
/>`}>
        <View style={{ width: '100%' }}>
          <Header
            title="Messages"
            largeTitle
            hideLeft
            topInset={0}
            rightActions={[{ icon: 'create-outline', onPress: () => {}, accessibilityLabel: 'Compose' }]}
          />
        </View>
      </Preview>

      <Preview title="Transparent (over image/map)" minHeight={140} code={`<View style={{ backgroundColor: '#4338ca' }}>
  <Header
    title="Trip to Tokyo"
    transparent
    titleColor="#fff"
    onLeftPress={() => router.back()}
  />
</View>`}>
        <View style={{ width: '100%', backgroundColor: '#4338ca', borderRadius: 12, overflow: 'hidden' }}>
          <Header
            title="Trip to Tokyo"
            transparent
            titleColor="#fff"
            onLeftPress={() => {}}
            topInset={0}
          />
        </View>
      </Preview>

      <Preview title="No left icon, custom background" minHeight={120} code={`<Header
  title="Checkout"
  hideLeft
  backgroundColor="#0f172a"
  titleColor="#fff"
  rightActions={[{ icon: 'close', onPress: () => {}, accessibilityLabel: 'Close' }]}
/>`}>
        <View style={{ width: '100%' }}>
          <Header
            title="Checkout"
            hideLeft
            backgroundColor="#0f172a"
            titleColor="#fff"
            topInset={0}
            rightActions={[{ icon: 'close', onPress: () => {}, accessibilityLabel: 'Close' }]}
          />
        </View>
      </Preview>
    </div>
  )
}
