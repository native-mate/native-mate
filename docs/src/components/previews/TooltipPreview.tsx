'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Tooltip } from '../../../../packages/registry/components/tooltip/tooltip'
import { Text } from '@native-mate/core'

function PillBtn({ label }: { label: string }) {
  return (
    <View style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#252529', backgroundColor: '#1e1e21' }}>
      <Text style={{ color: '#fafafa', fontSize: 13 }}>{label}</Text>
    </View>
  )
}

export default function TooltipPreview() {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="Positions" minHeight={180} code={`import { Tooltip } from '~/components/ui/tooltip'

<Tooltip content="Saves your progress automatically" position="top">
  <Button>Auto-save</Button>
</Tooltip>

<Tooltip content="Cannot undo this action" position="bottom">
  <Button variant="destructive">Delete</Button>
</Tooltip>

<Tooltip content="Copy to clipboard" position="right">
  <Button variant="outline">Copy</Button>
</Tooltip>

<Tooltip content="Go back to previous page" position="left">
  <Button variant="ghost">Back</Button>
</Tooltip>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Tooltip content="Saves your progress automatically" position="top">
            <PillBtn label="Top" />
          </Tooltip>
          <Tooltip content="Cannot undo this action" position="bottom">
            <PillBtn label="Bottom" />
          </Tooltip>
          <Tooltip content="Copy to clipboard" position="right">
            <PillBtn label="Right" />
          </Tooltip>
          <Tooltip content="Go back to previous page" position="left">
            <PillBtn label="Left" />
          </Tooltip>
        </View>
      </Preview>

      <Preview title="Custom delay" minHeight={120} code={`// Web: hover delay in ms (default 300). Native: long-press delay (default 500).
<Tooltip content="Hold to reveal" delay={800} position="top">
  <Button variant="outline">Slow (800ms)</Button>
</Tooltip>

<Tooltip content="Appears instantly" delay={0} position="bottom">
  <Button>Instant</Button>
</Tooltip>`}>
        <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
          <Tooltip content="Hold longer to see this" delay={800} position="top">
            <PillBtn label="Slow (800ms)" />
          </Tooltip>
          <Tooltip content="Appears instantly!" delay={0} position="bottom">
            <PillBtn label="Instant" />
          </Tooltip>
        </View>
      </Preview>

      <Preview title="Rich content + maxWidth" minHeight={140} code={`<Tooltip
  position="top"
  maxWidth={260}
  content={
    <View>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Pro tip</Text>
      <Text style={{ color: '#fff', fontSize: 11, opacity: 0.85 }}>
        Long-press any row to reveal quick actions.
      </Text>
    </View>
  }
>
  <Button variant="outline">Info</Button>
</Tooltip>`}>
        <View style={{ alignItems: 'center' }}>
          <Tooltip
            position="top"
            maxWidth={260}
            content={
              <View>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Pro tip</Text>
                <Text style={{ color: '#fff', fontSize: 11, opacity: 0.85 }}>
                  Long-press any row to reveal quick actions.
                </Text>
              </View>
            }
          >
            <PillBtn label="Info" />
          </Tooltip>
        </View>
      </Preview>

      <Preview title="Controlled visibility" minHeight={140} code={`const [visible, setVisible] = useState(false)

<Tooltip
  content="I'm controlled from outside"
  position="top"
  visible={visible}
  onOpenChange={setVisible}
>
  <Button onPress={() => setVisible(v => !v)}>Toggle tooltip</Button>
</Tooltip>`}>
        <View style={{ alignItems: 'center' }}>
          <Tooltip
            content="I'm controlled from outside"
            position="top"
            visible={visible}
            onOpenChange={setVisible}
          >
            <View
              // @ts-ignore web
              onClick={() => setVisible((v) => !v)}
            >
              <PillBtn label={visible ? 'Hide tooltip' : 'Show tooltip'} />
            </View>
          </Tooltip>
        </View>
      </Preview>
    </div>
  )
}
