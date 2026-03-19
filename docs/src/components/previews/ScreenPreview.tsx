'use client'
import React from 'react'
import { View, ScrollView } from 'react-native'
import { Preview } from './shared/Preview'
import { Text } from '@native-mate/core'

export default function ScreenPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Basic screen layout" minHeight={360} code={`import { Screen } from '~/components/ui/screen'

<Screen>
  <View style={{ padding: 16 }}>
    <Text size="2xl" weight="bold">Home</Text>
    <Text color="muted">Welcome back!</Text>
  </View>
</Screen>`}>
        <View style={{
          width: 280,
          height: 320,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#252529',
          backgroundColor: '#0d0d0f',
        }}>
          {/* Simulated status bar */}
          <View style={{ height: 28, backgroundColor: '#0d0d0f', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
            <Text style={{ color: '#71717a', fontSize: 10, fontWeight: '600' }}>9:41</Text>
          </View>
          {/* Screen content area */}
          <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <Text style={{ color: '#e4e4e7', fontSize: 22, fontWeight: '700' }}>Home</Text>
            <Text style={{ color: '#71717a', fontSize: 13 }}>Welcome back! This is a basic Screen wrapper with safe area insets applied.</Text>
            <View style={{ marginTop: 8, gap: 8 }}>
              {['Profile', 'Settings', 'Notifications'].map(item => (
                <View key={item} style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#252529' }}>
                  <Text style={{ color: '#e4e4e7', fontSize: 13, fontWeight: '500' }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          {/* Simulated home indicator */}
          <View style={{ alignItems: 'center', paddingBottom: 8 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#333' }} />
          </View>
        </View>
      </Preview>

      <Preview title="Scrollable screen with header & footer" minHeight={400} code={`import { Screen } from '~/components/ui/screen'

<Screen scroll edges={['top', 'bottom']}>
  <Header />
  <ScrollableContent />
  <Footer />
</Screen>`}>
        <View style={{
          width: 280,
          height: 380,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#252529',
          backgroundColor: '#0d0d0f',
        }}>
          {/* Simulated status bar */}
          <View style={{ height: 28, backgroundColor: '#0d0d0f', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#71717a', fontSize: 10, fontWeight: '600' }}>9:41</Text>
          </View>
          {/* Header */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e1e21', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: '#e4e4e7', fontSize: 16, fontWeight: '700' }}>Activity</Text>
            <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#6366f120' }}>
              <Text style={{ color: '#6366f1', fontSize: 11, fontWeight: '600' }}>Filter</Text>
            </View>
          </View>
          {/* Scrollable content */}
          <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 10 }}>
              {[
                { title: 'Deployment succeeded', sub: 'main branch - 2 min ago', color: '#22c55e' },
                { title: 'New team member', sub: 'alex@example.com joined', color: '#6366f1' },
                { title: 'Invoice paid', sub: '$49.00 - Pro plan', color: '#22c55e' },
                { title: 'Build warning', sub: 'Unused imports detected', color: '#f59e0b' },
                { title: 'PR merged', sub: '#142 feat/auth - 1h ago', color: '#8b5cf6' },
                { title: 'Storage limit', sub: '85% capacity reached', color: '#ef4444' },
              ].map(item => (
                <View key={item.title} style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#252529', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#e4e4e7', fontSize: 12, fontWeight: '600' }}>{item.title}</Text>
                    <Text style={{ color: '#71717a', fontSize: 11, marginTop: 2 }}>{item.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          {/* Footer */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#1e1e21', alignItems: 'center' }}>
            <Text style={{ color: '#71717a', fontSize: 11 }}>Showing 6 of 24 events</Text>
          </View>
          {/* Simulated home indicator */}
          <View style={{ alignItems: 'center', paddingBottom: 8 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#333' }} />
          </View>
        </View>
      </Preview>

      <Preview title="Custom background color" code={`<Screen backgroundColor="#1a1a2e">
  <View style={{ padding: 16 }}>
    <Text>Custom themed screen</Text>
  </View>
</Screen>`}>
        <View style={{
          width: 280,
          height: 200,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#252529',
          backgroundColor: '#1a1a2e',
        }}>
          <View style={{ height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#71717a', fontSize: 10, fontWeight: '600' }}>9:41</Text>
          </View>
          <View style={{ flex: 1, padding: 16, gap: 8 }}>
            <Text style={{ color: '#e4e4e7', fontSize: 18, fontWeight: '700' }}>Custom theme</Text>
            <Text style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 20 }}>
              The Screen component accepts a backgroundColor prop to override the theme default.
            </Text>
          </View>
        </View>
      </Preview>
    </div>
  )
}
