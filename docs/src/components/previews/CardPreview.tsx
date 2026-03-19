'use client'
import React, { useState } from 'react'
import { View, Pressable, Text as RNText } from 'react-native'
import { Preview } from './shared/Preview'
import { Card, CardHeader, CardContent, CardFooter, CardMedia } from '../../../../packages/registry/components/card/card'
import { Text } from '@native-mate/core'
import { Ionicons } from '@expo/vector-icons'

function Chip({ label, color = '#6366f1' }: { label: string; color?: string }) {
  return (
    <View style={{ paddingVertical: 3, paddingHorizontal: 8, borderRadius: 99, backgroundColor: color + '22', borderWidth: 1, borderColor: color + '55' }}>
      <Text style={{ color, fontSize: 11, fontWeight: '600' }}>{label}</Text>
    </View>
  )
}

function ActionBtn({ children, primary }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <View style={{ flex: 1, paddingVertical: 9, borderRadius: 8, backgroundColor: primary ? '#6366f1' : '#27272a', borderWidth: primary ? 0 : 1, borderColor: '#3f3f46', alignItems: 'center' }}>
      <RNText style={{ color: primary ? '#fff' : '#e4e4e7', fontSize: 13, fontWeight: '600' }}>{children}</RNText>
    </View>
  )
}

function Avatar({ initials, color = '#6366f1' }: { initials: string; color?: string }) {
  return (
    <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: color + '33', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: 14, fontWeight: '700' }}>{initials}</Text>
    </View>
  )
}

export default function CardPreview() {
  const [loading, setLoading] = useState(false)
  const [pressed, setPressed] = useState<string | null>(null)

  return (
    <div className="space-y-10">

      {/* Variants */}
      <Preview title="Variants" code={`<Card variant="elevated">...</Card>
<Card variant="outline">...</Card>
<Card variant="flat">...</Card>`}>
        <View style={{ gap: 12, width: '100%', maxWidth: 340 }}>
          {(['elevated', 'outline', 'flat'] as const).map(v => (
            <Card key={v} variant={v}>
              <CardHeader
                title={v.charAt(0).toUpperCase() + v.slice(1)}
                subtitle="variant prop"
                trailing={<Chip label={v} />}
              />
              <CardContent>
                <Text style={{ color: '#a1a1aa', fontSize: 13 }}>Card with {v} style.</Text>
              </CardContent>
            </Card>
          ))}
        </View>
      </Preview>

      {/* Pressable with spring animation */}
      <Preview title="Pressable + spring animation" code={`<Card onPress={() => console.log('pressed')} activeScale={0.97}>
  <CardHeader title="Click me" subtitle="Spring press animation" />
  <CardContent>
    <Text muted>Cards with onPress get a spring scale effect.</Text>
  </CardContent>
</Card>`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 12 }}>
          <Card variant="outline" onPress={() => setPressed('a')}>
            <CardHeader
              title="Open settings"
              subtitle="Tap to navigate"
              leading={<Avatar initials="S" color="#8b5cf6" />}
              trailing={<Ionicons name="chevron-forward" size={16} color="#71717a" />}
            />
          </Card>
          <Card variant="elevated" onPress={() => setPressed('b')}>
            <CardHeader
              title="Monthly Report"
              subtitle="March 2026"
              leading={<Ionicons name="bar-chart-outline" size={22} color="#6366f1" />}
              trailing={<Chip label="New" color="#22c55e" />}
            />
            <CardContent>
              <Text style={{ color: '#a1a1aa', fontSize: 13 }}>Revenue grew 14% this month.</Text>
            </CardContent>
          </Card>
          {pressed && (
            <Text style={{ color: '#71717a', fontSize: 12, textAlign: 'center' }}>Pressed card: {pressed}</Text>
          )}
        </View>
      </Preview>

      {/* With header slots */}
      <Preview title="CardHeader — leading, trailing, description" code={`<Card variant="outline">
  <CardHeader
    title="Team workspace"
    subtitle="Up to 10 members"
    description="Manage members, billing, and settings for your team."
    leading={<Avatar initials="T" />}
    trailing={<Chip label="Pro" color="#6366f1" />}
  />
  <CardFooter separated align="apart">
    <Text muted>3 / 10 seats used</Text>
    <Button size="sm">Invite</Button>
  </CardFooter>
</Card>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Card variant="outline">
            <CardHeader
              title="Team workspace"
              subtitle="Up to 10 members"
              description="Manage members, billing, and settings for your team."
              leading={<Avatar initials="TW" color="#6366f1" />}
              trailing={<Chip label="Pro" color="#6366f1" />}
            />
            <CardFooter separated align="apart">
              <Text style={{ color: '#71717a', fontSize: 12 }}>3 / 10 seats</Text>
              <View style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 7, backgroundColor: '#6366f1' }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Invite</Text>
              </View>
            </CardFooter>
          </Card>
        </View>
      </Preview>

      {/* Accent stripe */}
      <Preview title="Accent stripe" code={`<Card variant="outline" accent="#6366f1">
  <CardHeader title="Deployment ready" subtitle="main · 2 min ago" />
</Card>`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 10 }}>
          {[
            { title: 'Deployment ready', sub: 'main · 2 min ago', color: '#22c55e' },
            { title: 'Review required', sub: '2 approvals needed', color: '#f59e0b' },
            { title: 'Build failed', sub: 'Step 4/6 failed', color: '#ef4444' },
          ].map(item => (
            <Card key={item.title} variant="outline" accent={item.color}>
              <CardHeader
                title={item.title}
                subtitle={item.sub}
                leading={<Ionicons name="git-branch-outline" size={18} color={item.color} />}
              />
            </Card>
          ))}
        </View>
      </Preview>

      {/* Footer alignment */}
      <Preview title="CardFooter align" code={`<CardFooter align="apart">...</CardFooter>
<CardFooter align="right">...</CardFooter>`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 12 }}>
          <Card variant="outline">
            <CardHeader title="Workspace plan" subtitle="Pro · $12/mo" />
            <CardFooter separated align="apart">
              <ActionBtn>Cancel</ActionBtn>
              <ActionBtn primary>Upgrade</ActionBtn>
            </CardFooter>
          </Card>
          <Card variant="outline">
            <CardHeader title="Delete account" subtitle="This action is irreversible" />
            <CardFooter separated align="right">
              <View style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#ef444420', borderWidth: 1, borderColor: '#ef444455' }}>
                <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '600' }}>Delete</Text>
              </View>
            </CardFooter>
          </Card>
        </View>
      </Preview>

      {/* Loading skeleton */}
      <Preview title="Loading skeleton" code={`<Card loading={isLoading}>
  <CardHeader title="Report" />
  <CardContent>...</CardContent>
</Card>`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 12 }}>
          <Card loading={loading} />
          <Pressable
            style={{ padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#3f3f46', alignItems: 'center' }}
            onPress={() => setLoading(v => !v)}
          >
            <Text style={{ color: '#a1a1aa', fontSize: 12 }}>{loading ? 'Show content' : 'Show skeleton'}</Text>
          </Pressable>
        </View>
      </Preview>

    </div>
  )
}
