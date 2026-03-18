'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Tooltip } from '../../../../../packages/registry/components/tooltip/tooltip'
import { Text } from '@native-mate/core'

function PillBtn({ label }: { label: string }) {
  return (
    <View style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#3f3f46', backgroundColor: '#27272a' }}>
      <Text style={{ color: '#fafafa', fontSize: 13 }}>{label}</Text>
    </View>
  )
}

export default function TooltipPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Placements" minHeight={180} code={`import { Tooltip } from '~/components/ui/tooltip'

<Tooltip content="Saves your progress" placement="top">
  <Button>Auto-save</Button>
</Tooltip>

<Tooltip content="Cannot undo this" placement="bottom">
  <Button variant="destructive">Delete</Button>
</Tooltip>

<Tooltip content="Copy to clipboard" placement="right">
  <Button variant="outline">Copy</Button>
</Tooltip>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Tooltip content="Saves your progress automatically" placement="top">
            <PillBtn label="Top" />
          </Tooltip>
          <Tooltip content="Cannot undo this action" placement="bottom">
            <PillBtn label="Bottom" />
          </Tooltip>
          <Tooltip content="Copy to clipboard" placement="right">
            <PillBtn label="Right" />
          </Tooltip>
          <Tooltip content="Go back to previous page" placement="left">
            <PillBtn label="Left" />
          </Tooltip>
        </View>
      </Preview>

      <Preview title="Custom delay" minHeight={120} code={`// Default delay is 300ms — hold to trigger
<Tooltip content="Hold to reveal" delay={600} placement="top">
  <Button variant="outline">Long hold (600ms)</Button>
</Tooltip>

<Tooltip content="Quick tip" delay={0} placement="bottom">
  <Button>Instant (0ms)</Button>
</Tooltip>`}>
        <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
          <Tooltip content="Hold longer to see this" delay={800} placement="top">
            <PillBtn label="Slow (800ms)" />
          </Tooltip>
          <Tooltip content="Appears instantly!" delay={0} placement="bottom">
            <PillBtn label="Instant" />
          </Tooltip>
        </View>
      </Preview>
    </div>
  )
}
