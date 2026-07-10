'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Popover } from '../../../../packages/registry/components/popover/popover'
import { Text } from '@native-mate/core'

function TriggerBtn({ label }: { label: string }) {
  return (
    <View
      style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#6366f1', alignItems: 'center' }}
    >
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </View>
  )
}

function InfoContent() {
  return (
    <View style={{ padding: 14, gap: 6, width: 220 }}>
      <Text style={{ color: '#e4e4e7', fontSize: 14, fontWeight: '600' }}>Storage usage</Text>
      <Text style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 18 }}>
        You've used 4.2 GB of your 10 GB plan. Upgrade for more space.
      </Text>
    </View>
  )
}

export default function PopoverPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Basic (bottom, with arrow)" code={`import { Popover } from '~/components/ui/popover'

<Popover
  trigger={<Button>Storage</Button>}
  content={<InfoContent />}
  position="bottom"
/>`}>
        <Popover
          trigger={<TriggerBtn label="Storage" />}
          content={<InfoContent />}
          position="bottom"
        />
      </Preview>

      <Preview title="Positions" code={`<Popover trigger={<Button>Top</Button>} content={<InfoContent />} position="top" />
<Popover trigger={<Button>Left</Button>} content={<InfoContent />} position="left" />
<Popover trigger={<Button>Right</Button>} content={<InfoContent />} position="right" />`}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Popover trigger={<TriggerBtn label="Top" />} content={<InfoContent />} position="top" />
          <Popover trigger={<TriggerBtn label="Right" />} content={<InfoContent />} position="right" />
        </View>
      </Preview>

      <Preview title="Without arrow, no outside-press dismiss" code={`<Popover
  trigger={<Button>Help</Button>}
  content={<InfoContent />}
  showArrow={false}
  closeOnOutsidePress={false}
/>`}>
        <Popover
          trigger={<TriggerBtn label="Help" />}
          content={<InfoContent />}
          showArrow={false}
          closeOnOutsidePress={false}
        />
      </Preview>

      <Preview title="Custom width" code={`<Popover
  trigger={<Button>Details</Button>}
  content={<InfoContent />}
  maxWidth={320}
  maxHeight={200}
/>`}>
        <Popover
          trigger={<TriggerBtn label="Details" />}
          content={<InfoContent />}
          maxWidth={320}
          maxHeight={200}
        />
      </Preview>
    </div>
  )
}
