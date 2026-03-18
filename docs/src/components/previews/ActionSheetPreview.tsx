'use client'
import React, { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Preview } from './shared/Preview'
import { ActionSheet } from '../../../../../packages/registry/components/action-sheet/action-sheet'
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

export default function ActionSheetPreview() {
  const [photoOpen, setPhotoOpen] = useState(false)
  const [fileOpen, setFileOpen] = useState(false)
  const [last, setLast] = useState<string | null>(null)

  return (
    <div className="space-y-10">
      <Preview title="Photo options" minHeight={160} code={`import { ActionSheet } from '~/components/ui/action-sheet'

const [open, setOpen] = useState(false)

<ActionSheet
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Change profile photo"
  actions={[
    { label: 'Take Photo', onPress: () => setOpen(false) },
    { label: 'Choose from Library', onPress: () => setOpen(false) },
    { label: 'Remove Photo', variant: 'destructive', onPress: () => setOpen(false) },
  ]}
/>`}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <TriggerBtn onPress={() => setPhotoOpen(true)} label="Change avatar" />
          {last && (
            <Text style={{ color: '#71717a', fontSize: 13 }}>Selected: {last}</Text>
          )}
        </View>
        <ActionSheet
          isOpen={photoOpen}
          onClose={() => setPhotoOpen(false)}
          title="Change profile photo"
          actions={[
            { label: 'Take Photo', onPress: () => { setLast('Take Photo'); setPhotoOpen(false) } },
            { label: 'Choose from Library', onPress: () => { setLast('Library'); setPhotoOpen(false) } },
            { label: 'Remove Photo', variant: 'destructive', onPress: () => { setLast('Remove'); setPhotoOpen(false) } },
          ]}
        />
      </Preview>

      <Preview title="File actions with message" minHeight={160} code={`<ActionSheet
  isOpen={open}
  onClose={() => setOpen(false)}
  title="project-report.pdf"
  message="Last modified 2 hours ago"
  actions={[
    { label: 'Open', onPress: () => setOpen(false) },
    { label: 'Share', onPress: () => setOpen(false) },
    { label: 'Download', onPress: () => setOpen(false) },
    { label: 'Delete', variant: 'destructive', onPress: handleDelete },
  ]}
/>`}>
        <TriggerBtn onPress={() => setFileOpen(true)} label="File options" />
        <ActionSheet
          isOpen={fileOpen}
          onClose={() => setFileOpen(false)}
          title="project-report.pdf"
          message="Last modified 2 hours ago"
          actions={[
            { label: 'Open', onPress: () => setFileOpen(false) },
            { label: 'Share', onPress: () => setFileOpen(false) },
            { label: 'Download', onPress: () => setFileOpen(false) },
            { label: 'Delete', variant: 'destructive', onPress: () => setFileOpen(false) },
          ]}
        />
      </Preview>
    </div>
  )
}
