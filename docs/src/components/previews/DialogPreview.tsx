'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Dialog } from '../../../../packages/registry/components/dialog/dialog'
import { Text } from '@native-mate/core'

function TriggerBtn({ onPress, label, destructive }: { onPress: () => void; label: string; destructive?: boolean }) {
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: destructive ? '#ef4444' : '#6366f1',
        alignItems: 'center',
      }}
      // @ts-ignore web
      onClick={onPress}
    >
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </View>
  )
}

export default function DialogPreview() {
  const [defaultOpen, setDefaultOpen] = useState(false)
  const [destructiveOpen, setDestructiveOpen] = useState(false)
  const [persistentOpen, setPersistentOpen] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="Default confirm dialog" code={`import { Dialog } from '~/components/ui/dialog'

const [open, setOpen] = useState(false)

<Dialog
  visible={open}
  onClose={() => setOpen(false)}
  title="Save changes?"
  description="Your changes will be saved to this document."
  confirmLabel="Save"
  cancelLabel="Discard"
  onConfirm={handleSave}
/>`}>
        <TriggerBtn onPress={() => setDefaultOpen(true)} label="Save changes" />
        <Dialog
          visible={defaultOpen}
          onClose={() => setDefaultOpen(false)}
          title="Save changes?"
          description="Your changes will be saved to this document."
          confirmLabel="Save"
          cancelLabel="Discard"
          onConfirm={() => setDefaultOpen(false)}
        />
      </Preview>

      <Preview title="Destructive variant with icon" code={`<Dialog
  visible={open}
  onClose={() => setOpen(false)}
  variant="destructive"
  icon="trash"
  title="Delete project?"
  description="This action cannot be undone. All data will be permanently removed."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
/>`}>
        <TriggerBtn onPress={() => setDestructiveOpen(true)} label="Delete project" destructive />
        <Dialog
          visible={destructiveOpen}
          onClose={() => setDestructiveOpen(false)}
          variant="destructive"
          icon="trash"
          title="Delete project?"
          description="This action cannot be undone. All data will be permanently removed."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => setDestructiveOpen(false)}
        />
      </Preview>

      <Preview title="Non-dismissible (must choose an action)" code={`<Dialog
  visible={open}
  onClose={() => setOpen(false)}
  dismissible={false}
  title="Session expiring"
  description="Your session will expire in 60 seconds."
  confirmLabel="Stay signed in"
  cancelLabel="Sign out"
/>`}>
        <TriggerBtn onPress={() => setPersistentOpen(true)} label="Session expiring" />
        <Dialog
          visible={persistentOpen}
          onClose={() => setPersistentOpen(false)}
          dismissible={false}
          title="Session expiring"
          description="Your session will expire in 60 seconds."
          confirmLabel="Stay signed in"
          cancelLabel="Sign out"
          onConfirm={() => setPersistentOpen(false)}
          onCancel={() => setPersistentOpen(false)}
        />
      </Preview>
    </div>
  )
}
