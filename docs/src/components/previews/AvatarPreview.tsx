'use client'
import React from 'react'
import { View } from 'react-native'
import { Text } from '@native-mate/core'
import { Preview } from './shared/Preview'
import { Avatar, AvatarGroup } from '../../../../../packages/registry/components/avatar/avatar'

export default function AvatarPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Initials & auto color" code={`import { Avatar } from '~/components/ui/avatar'

<Avatar size="xs" name="John Doe" />
<Avatar size="sm" name="Jane Smith" />
<Avatar size="md" name="Alex Ray" />
<Avatar size="lg" name="Sam Lee" />
<Avatar size="xl" name="Chris Park" />`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar size="xs" name="John Doe" />
          <Avatar size="sm" name="Jane Smith" />
          <Avatar size="md" name="Alex Ray" />
          <Avatar size="lg" name="Sam Lee" />
          <Avatar size="xl" name="Chris Park" />
        </View>
      </Preview>

      <Preview title="With image & fallback" code={`<Avatar size="lg" src="https://i.pravatar.cc/100?img=1" name="Alice" />
<Avatar size="lg" src="https://i.pravatar.cc/100?img=2" name="Bob" />
// Broken URL falls back to initials:
<Avatar size="lg" src="https://broken.url/img.jpg" name="Carol" />`}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Avatar size="lg" src="https://i.pravatar.cc/100?img=1" name="Alice" />
          <Avatar size="lg" src="https://i.pravatar.cc/100?img=2" name="Bob" />
          <Avatar size="lg" src="https://i.pravatar.cc/100?img=3" name="Carol" />
          <Avatar size="lg" src="https://broken.url/img.jpg" name="Broken" />
        </View>
      </Preview>

      <Preview title="Status indicator" code={`<Avatar size="md" name="Online" status="online" />
<Avatar size="md" name="Busy" status="busy" />
<Avatar size="md" name="Away" status="away" />
<Avatar size="md" name="Offline" status="offline" />`}>
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'flex-start' }}>
          {([['online', 'Online'], ['busy', 'Busy'], ['away', 'Away'], ['offline', 'Offline']] as const).map(([s, label]) => (
            <View key={s} style={{ alignItems: 'center', gap: 6 }}>
              <Avatar size="md" name={label} status={s} />
              <Text style={{ fontSize: 11, color: '#71717a' }}>{s}</Text>
            </View>
          ))}
        </View>
      </Preview>

      <Preview title="Square shape" code={`<Avatar size="md" name="A B" shape="square" />
<Avatar size="md" src="https://i.pravatar.cc/100?img=5" shape="square" />
<Avatar size="lg" name="C D" shape="square" status="online" />`}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Avatar size="md" name="Alpha B" shape="square" />
          <Avatar size="md" src="https://i.pravatar.cc/100?img=5" shape="square" />
          <Avatar size="lg" name="Carol D" shape="square" status="online" />
        </View>
      </Preview>

      <Preview title="AvatarGroup" code={`import { Avatar, AvatarGroup } from '~/components/ui/avatar'

<AvatarGroup
  size="md"
  max={4}
  avatars={[
    { name: 'Alice B' },
    { name: 'Bob C' },
    { src: 'https://i.pravatar.cc/100?img=4', name: 'Dave E' },
    { name: 'Eve F' },
    { name: 'Frank G' },
  ]}
/>`}>
        <View style={{ gap: 16 }}>
          <AvatarGroup
            size="md"
            max={4}
            avatars={[
              { name: 'Alice B' },
              { name: 'Bob C' },
              { name: 'Carol D' },
              { src: 'https://i.pravatar.cc/100?img=4', name: 'Dave E' },
              { name: 'Eve F' },
              { name: 'Frank G' },
            ]}
          />
          <AvatarGroup
            size="sm"
            max={3}
            avatars={[
              { name: 'User One' },
              { name: 'User Two' },
              { name: 'User Three' },
              { name: 'User Four' },
              { name: 'User Five' },
            ]}
          />
        </View>
      </Preview>
    </div>
  )
}
