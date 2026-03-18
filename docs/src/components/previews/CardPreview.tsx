'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Card, CardHeader, CardContent, CardFooter } from '../../../../../packages/registry/components/card/card'
import { Text } from '@native-mate/core'

function Btn({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'ghost' }) {
  const bg = variant === 'default' ? '#6366f1' : 'transparent'
  const color = variant === 'default' ? '#fff' : '#a1a1aa'
  return (
    <View style={{ flex: 1, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 8, backgroundColor: bg, borderWidth: variant === 'ghost' ? 1 : 0, borderColor: '#3f3f46', alignItems: 'center' }}>
      <Text style={{ color, fontSize: 13, fontWeight: '600' }}>{children}</Text>
    </View>
  )
}

export default function CardPreview() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="Elevated with sub-components" minHeight={200} code={`import { Card, CardHeader, CardContent, CardFooter } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Text } from '@native-mate/core'

<Card>
  <CardHeader title="Workspace plan" subtitle="Up to 10 team members" />
  <CardContent>
    <Text muted>Pro plan · Renews March 1, 2026.</Text>
  </CardContent>
  <CardFooter separated>
    <Button variant="ghost" style={{ flex: 1 }}>Cancel</Button>
    <Button style={{ flex: 1 }}>Upgrade</Button>
  </CardFooter>
</Card>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Card>
            <CardHeader title="Workspace plan" subtitle="Up to 10 team members" />
            <CardContent>
              <Text style={{ color: '#a1a1aa', fontSize: 13 }}>Pro plan · Renews March 1, 2026.</Text>
            </CardContent>
            <CardFooter separated>
              <Btn variant="ghost">Cancel</Btn>
              <Btn>Upgrade</Btn>
            </CardFooter>
          </Card>
        </View>
      </Preview>

      <Preview title="loading prop — built-in skeleton" minHeight={140} code={`// Replace children with animated skeleton placeholder
const [loading, setLoading] = useState(true)

<Card loading={loading}>
  <CardHeader title="Monthly Report" />
  <CardContent>
    <Text>Revenue grew 14% this month.</Text>
  </CardContent>
</Card>`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 12 }}>
          <Card loading={loading} />
          <View
            style={{ padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#3f3f46', alignItems: 'center' }}
            // @ts-ignore - web pressable
            onClick={() => setLoading(v => !v)}
          >
            <Text style={{ color: '#a1a1aa', fontSize: 12 }}>{loading ? 'Show content' : 'Show skeleton'}</Text>
          </View>
        </View>
      </Preview>

      <Preview title="Outline variant" minHeight={140} code={`<Card variant="outline">
  <CardHeader
    title="API keys"
    subtitle="Manage your access"
    trailing={<Button size="sm" variant="ghost">Add key</Button>}
  />
  <CardContent>
    <Text muted>No keys yet. Create one to get started.</Text>
  </CardContent>
</Card>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Card variant="outline">
            <CardHeader title="API keys" subtitle="Manage your access" />
            <CardContent>
              <Text style={{ color: '#71717a', fontSize: 13 }}>No keys yet. Create one to get started.</Text>
            </CardContent>
          </Card>
        </View>
      </Preview>
    </div>
  )
}
