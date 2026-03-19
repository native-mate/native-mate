'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Sheet } from '../../../../packages/registry/components/sheet/sheet'
import { Text } from '@native-mate/core'

function TriggerBtn({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <View
      style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#6366f1', alignItems: 'center' }}
      // @ts-ignore web
      onClick={onPress}
    >
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </View>
  )
}

export default function SheetPreview() {
  const [basicOpen, setBasicOpen] = useState(false)
  const [titleOpen, setTitleOpen] = useState(false)
  const [tallOpen, setTallOpen] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="Basic sheet" code={`import { Sheet } from '~/components/ui/sheet'

const [open, setOpen] = useState(false)

<Sheet visible={open} onClose={() => setOpen(false)}>
  <Text>Sheet content goes here.</Text>
</Sheet>`}>
        <TriggerBtn onPress={() => setBasicOpen(true)} label="Open sheet" />
        <Sheet
          visible={basicOpen}
          onClose={() => setBasicOpen(false)}
        >
          <View style={{ gap: 12 }}>
            <Text style={{ color: '#e4e4e7', fontSize: 15, fontWeight: '600' }}>Welcome</Text>
            <Text style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 20 }}>
              This is a basic bottom sheet with default height, drag handle, and backdrop dismiss.
            </Text>
          </View>
        </Sheet>
      </Preview>

      <Preview title="With title + custom height" code={`<Sheet
  visible={open}
  onClose={() => setOpen(false)}
  title="Settings"
  height={500}
>
  <View style={{ gap: 12 }}>
    <Text>Sheet with a built-in title bar and taller height.</Text>
  </View>
</Sheet>`}>
        <TriggerBtn onPress={() => setTitleOpen(true)} label="Sheet with title" />
        <Sheet
          visible={titleOpen}
          onClose={() => setTitleOpen(false)}
          title="Settings"
          height={500}
        >
          <View style={{ gap: 12 }}>
            <Text style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 20 }}>
              This sheet has a built-in title, a taller height of 500px, and the default drag handle.
            </Text>
          </View>
        </Sheet>
      </Preview>

      <Preview title="Spring animation + no handle" code={`<Sheet
  visible={open}
  onClose={() => setOpen(false)}
  animation="spring"
  showHandle={false}
  title="Confirm action"
  height={260}
>
  <Text>Are you sure you want to proceed?</Text>
</Sheet>`}>
        <TriggerBtn onPress={() => setTallOpen(true)} label="Spring sheet" />
        <Sheet
          visible={tallOpen}
          onClose={() => setTallOpen(false)}
          animation="spring"
          showHandle={false}
          title="Confirm action"
          height={260}
        >
          <View style={{ gap: 12 }}>
            <Text style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 20 }}>
              Are you sure you want to proceed? This sheet uses a spring animation and hides the drag handle.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <View
                style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#1e1e21', borderWidth: 1, borderColor: '#252529', alignItems: 'center' }}
                // @ts-ignore web
                onClick={() => setTallOpen(false)}
              >
                <Text style={{ color: '#e4e4e7', fontSize: 13, fontWeight: '600' }}>Cancel</Text>
              </View>
              <View
                style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#6366f1', alignItems: 'center' }}
                // @ts-ignore web
                onClick={() => setTallOpen(false)}
              >
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Confirm</Text>
              </View>
            </View>
          </View>
        </Sheet>
      </Preview>
    </div>
  )
}
