'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Collapsible } from '../../../../packages/registry/components/collapsible/collapsible'
import { Text } from '@native-mate/core'

export default function CollapsiblePreview() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="Basic" minHeight={100} code={`import { Collapsible } from '~/components/ui/collapsible'
import { Text } from '@native-mate/core'

<Collapsible title="What is native-mate?">
  <Text muted>
    A shadcn-style component library for React Native — copy the source
    into your project and own it.
  </Text>
</Collapsible>`}>
        <View style={{ width: '100%' }}>
          <Collapsible title="What is native-mate?">
            <Text muted>
              A shadcn-style component library for React Native — copy the source into your project and own it.
            </Text>
          </Collapsible>
        </View>
      </Preview>

      <Preview title="Default open" minHeight={140} code={`<Collapsible title="Shipping details" defaultOpen>
  <Text muted>Ships within 2-3 business days via standard courier.</Text>
</Collapsible>`}>
        <View style={{ width: '100%' }}>
          <Collapsible title="Shipping details" defaultOpen>
            <Text muted>Ships within 2-3 business days via standard courier.</Text>
          </Collapsible>
        </View>
      </Preview>

      <Preview title="Controlled" minHeight={140} code={`const [open, setOpen] = useState(false)

<Collapsible title="Advanced settings" open={open} onToggle={setOpen}>
  <Text muted>Controlled from outside — sync with a parent accordion.</Text>
</Collapsible>`}>
        <View style={{ width: '100%' }}>
          <Collapsible title="Advanced settings" open={open} onToggle={setOpen}>
            <Text muted>Controlled from outside — sync with a parent accordion.</Text>
          </Collapsible>
        </View>
      </Preview>

      <Preview title="Stacked FAQ list" minHeight={200} code={`<View style={{ gap: 4 }}>
  <Collapsible title="Can I customize the styles?">
    <Text muted>Yes — every component ships as editable source.</Text>
  </Collapsible>
  <Collapsible title="Does it work with Expo?">
    <Text muted>Yes, fully compatible with Expo and bare React Native.</Text>
  </Collapsible>
  <Collapsible title="Is it free?">
    <Text muted>Yes, native-mate is fully open source.</Text>
  </Collapsible>
</View>`}>
        <View style={{ width: '100%', gap: 4 }}>
          <Collapsible title="Can I customize the styles?">
            <Text muted>Yes — every component ships as editable source.</Text>
          </Collapsible>
          <Collapsible title="Does it work with Expo?">
            <Text muted>Yes, fully compatible with Expo and bare React Native.</Text>
          </Collapsible>
          <Collapsible title="Is it free?">
            <Text muted>Yes, native-mate is fully open source.</Text>
          </Collapsible>
        </View>
      </Preview>

      <Preview title="Disabled" minHeight={100} code={`<Collapsible title="Locked section" disabled defaultOpen={false}>
  <Text muted>This content is unavailable.</Text>
</Collapsible>`}>
        <View style={{ width: '100%' }}>
          <Collapsible title="Locked section" disabled>
            <Text muted>This content is unavailable.</Text>
          </Collapsible>
        </View>
      </Preview>
    </div>
  )
}
