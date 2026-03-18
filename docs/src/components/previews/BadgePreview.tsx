'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Badge } from '../../../../../packages/registry/components/badge/badge'

export default function BadgePreview() {
  const [tags, setTags] = useState(['React Native', 'TypeScript', 'Expo'])

  return (
    <div className="space-y-10">
      <Preview title="Variants" code={`import { Badge } from '~/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </View>
      </Preview>

      <Preview title="Appearances" code={`<Badge appearance="solid">Solid</Badge>
<Badge appearance="soft">Soft</Badge>
<Badge appearance="outline">Outline</Badge>`}>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge variant="default" appearance="solid">Solid</Badge>
            <Badge variant="success" appearance="solid">Solid</Badge>
            <Badge variant="destructive" appearance="solid">Solid</Badge>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge variant="default" appearance="soft">Soft</Badge>
            <Badge variant="success" appearance="soft">Soft</Badge>
            <Badge variant="destructive" appearance="soft">Soft</Badge>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge variant="default" appearance="outline">Outline</Badge>
            <Badge variant="success" appearance="outline">Outline</Badge>
            <Badge variant="destructive" appearance="outline">Outline</Badge>
          </View>
        </View>
      </Preview>

      <Preview title="Sizes" code={`<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </View>
      </Preview>

      <Preview title="With dot indicator" code={`<Badge variant="success" dot>Active</Badge>
<Badge variant="destructive" dot>Error</Badge>
<Badge variant="warning" dot>Pending</Badge>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="destructive" dot>Error</Badge>
          <Badge variant="warning" dot>Pending</Badge>
          <Badge variant="secondary" dot>Inactive</Badge>
        </View>
      </Preview>

      <Preview title="Animated pulse dot" code={`<Badge variant="success" dot pulse>Live</Badge>
<Badge variant="destructive" dot pulse>Critical</Badge>`}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Badge variant="success" dot pulse>Live</Badge>
          <Badge variant="destructive" dot pulse>Critical</Badge>
          <Badge variant="warning" dot pulse>Syncing</Badge>
        </View>
      </Preview>

      <Preview title="Count / notification" code={`<Badge variant="destructive" count={3} />
<Badge variant="default" count={12} />
<Badge variant="secondary" count={150} maxCount={99} />`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Badge variant="destructive" count={3} />
          <Badge variant="default" count={12} />
          <Badge variant="secondary" count={150} maxCount={99} />
        </View>
      </Preview>

      <Preview title="Dismissible" code={`const [tags, setTags] = useState(['React Native', 'TypeScript', 'Expo'])

{tags.map(t => (
  <Badge key={t} variant="secondary" onDismiss={() => setTags(p => p.filter(x => x !== t))}>
    {t}
  </Badge>
))}`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {tags.map(t => (
            <Badge key={t} variant="secondary" onDismiss={() => setTags(p => p.filter(x => x !== t))}>
              {t}
            </Badge>
          ))}
        </View>
      </Preview>
    </div>
  )
}
