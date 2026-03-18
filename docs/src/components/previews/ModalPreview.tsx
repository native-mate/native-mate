'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Modal } from '../../../../../packages/registry/components/modal/modal'
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

export default function ModalPreview() {
  const [infoOpen, setInfoOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="Info modal" code={`import { Modal } from '~/components/ui/modal'

const [open, setOpen] = useState(false)

<Modal
  visible={open}
  onClose={() => setOpen(false)}
  title="What's new in v2"
  description="New components and improvements."
  actions={[
    { label: 'Later', onPress: () => setOpen(false) },
    { label: 'See what\\'s new', variant: 'primary', onPress: () => setOpen(false) },
  ]}
>
  <Text muted>This release includes Popover, Card v2 with loading prop, improved Toast...</Text>
</Modal>`}>
        <TriggerBtn onPress={() => setInfoOpen(true)} label="Open modal" />
        <Modal
          visible={infoOpen}
          onClose={() => setInfoOpen(false)}
          title="What's new in v2"
          description="New components and performance improvements."
          actions={[
            { label: 'Later', onPress: () => setInfoOpen(false) },
            { label: "See what's new", variant: 'primary', onPress: () => setInfoOpen(false) },
          ]}
        >
          <Text style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 20 }}>
            This release includes Popover, Card v2 with loading prop, improved Toast with avatar support, and over 20 component improvements.
          </Text>
        </Modal>
      </Preview>

      <Preview title="Confirm / Destructive" code={`<Modal
  visible={open}
  onClose={() => setOpen(false)}
  title="Delete project?"
  description="This action cannot be undone."
  actions={[
    { label: 'Cancel', onPress: () => setOpen(false) },
    { label: 'Delete', variant: 'destructive', onPress: handleDelete },
  ]}
/>`}>
        <TriggerBtn onPress={() => setConfirmOpen(true)} label="Confirm dialog" />
        <Modal
          visible={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Delete project?"
          description="This action cannot be undone. All data will be permanently removed."
          actions={[
            { label: 'Cancel', onPress: () => setConfirmOpen(false) },
            { label: 'Delete', variant: 'destructive', onPress: () => setConfirmOpen(false) },
          ]}
        />
      </Preview>
    </div>
  )
}
