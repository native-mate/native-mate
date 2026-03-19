'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Icon } from '../../../../packages/registry/components/icon/icon'

const SHOWCASE_ICONS = [
  'home', 'person', 'settings', 'search', 'notifications',
  'heart', 'star', 'bookmark', 'camera', 'image',
  'mail', 'call', 'chatbubble', 'share', 'cloud',
  'download', 'upload', 'trash', 'pencil', 'add',
]

export default function IconPreview() {
  return (
    <div className="space-y-10">

      <Preview
        title="Icon grid"
        minHeight={200}
        code={`import { Icon } from '~/components/ui/icon'

<Icon name="home" />
<Icon name="person" />
<Icon name="settings" />
<Icon name="search" />
<Icon name="heart" />`}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {SHOWCASE_ICONS.map(name => (
            <Icon key={name} name={name as any} size="lg" color="foreground" />
          ))}
        </View>
      </Preview>

      <Preview
        title="Sizes"
        code={`<Icon name="star" size="xs" />   {/* 12 */}
<Icon name="star" size="sm" />   {/* 16 */}
<Icon name="star" size="md" />   {/* 20 */}
<Icon name="star" size="lg" />   {/* 24 */}
<Icon name="star" size="xl" />   {/* 32 */}
<Icon name="star" size="2xl" />  {/* 40 */}
<Icon name="star" size={56} />   {/* custom */}`}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 16 }}>
          {(['xs','sm','md','lg','xl','2xl'] as const).map(s => (
            <Icon key={s} name="star" size={s} color="primary" />
          ))}
          <Icon name="star" size={56} color="primary" />
        </View>
      </Preview>

      <Preview
        title="Color tokens"
        code={`<Icon name="checkmark-circle" color="success" size="xl" />
<Icon name="alert-circle"    color="warning" size="xl" />
<Icon name="close-circle"    color="destructive" size="xl" />
<Icon name="information-circle" color="primary" size="xl" />
<Icon name="person-circle"   color="foreground" size="xl" />
<Icon name="help-circle"     color="muted" size="xl" />`}
      >
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Icon name="checkmark-circle" color="success"     size="xl" />
          <Icon name="alert-circle"     color="warning"     size="xl" />
          <Icon name="close-circle"     color="destructive" size="xl" />
          <Icon name="information-circle" color="primary"   size="xl" />
          <Icon name="person-circle"    color="foreground"  size="xl" />
          <Icon name="help-circle"      color="muted"       size="xl" />
        </View>
      </Preview>

      <Preview
        title="Custom color & opacity"
        code={`<Icon name="heart" size="xl" color="#f43f5e" />
<Icon name="heart" size="xl" color="#f43f5e" opacity={0.5} />
<Icon name="heart" size="xl" color="#f43f5e" opacity={0.2} />`}
      >
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <Icon name="heart" size="xl" color="#f43f5e" />
          <Icon name="heart" size="xl" color="#f43f5e" opacity={0.5} />
          <Icon name="heart" size="xl" color="#f43f5e" opacity={0.2} />
        </View>
      </Preview>

      <Preview
        title="Outline vs filled"
        code={`<Icon name="heart"         size="lg" />  {/* filled */}
<Icon name="heart-outline" size="lg" />  {/* outline */}
<Icon name="star"          size="lg" />
<Icon name="star-outline"  size="lg" />
<Icon name="bookmark"      size="lg" />
<Icon name="bookmark-outline" size="lg" />`}
      >
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <Icon name="heart"           size="lg" color="primary" />
          <Icon name="heart-outline"   size="lg" color="primary" />
          <Icon name="star"            size="lg" color="warning" />
          <Icon name="star-outline"    size="lg" color="warning" />
          <Icon name="bookmark"        size="lg" color="foreground" />
          <Icon name="bookmark-outline" size="lg" color="foreground" />
        </View>
      </Preview>

    </div>
  )
}
