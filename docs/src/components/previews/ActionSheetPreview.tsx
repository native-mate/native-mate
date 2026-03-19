'use client'
import React, { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Preview } from './shared/Preview'
import { ActionSheet } from '../../../../packages/registry/components/action-sheet/action-sheet'
import { Text } from '@native-mate/core'
import { Ionicons } from '@expo/vector-icons'

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
  const [springOpen, setSpringOpen] = useState(false)
  const [fadeOpen, setFadeOpen] = useState(false)
  const [iconOpen, setIconOpen] = useState(false)
  const [last, setLast] = useState<string | null>(null)

  return (
    <div className="space-y-10">

      <Preview title="Default (slide)" minHeight={160} code={`<ActionSheet
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Change profile photo"
  actions={[
    { label: 'Take Photo', onPress: () => {} },
    { label: 'Choose from Library', onPress: () => {} },
    { label: 'Remove Photo', variant: 'destructive', onPress: () => {} },
  ]}
/>`}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <TriggerBtn onPress={() => setPhotoOpen(true)} label="Open action sheet" />
          {last && <Text style={{ color: '#71717a', fontSize: 13 }}>Selected: {last}</Text>}
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

      <Preview title="Spring animation" minHeight={160} code={`<ActionSheet animation="spring" ... />`}>
        <View style={{ alignItems: 'center' }}>
          <TriggerBtn onPress={() => setSpringOpen(true)} label="Spring animation" />
        </View>
        <ActionSheet
          animation="spring"
          isOpen={springOpen}
          onClose={() => setSpringOpen(false)}
          title="Share document"
          actions={[
            { label: 'AirDrop', onPress: () => setSpringOpen(false) },
            { label: 'Messages', onPress: () => setSpringOpen(false) },
            { label: 'Copy link', onPress: () => setSpringOpen(false) },
          ]}
        />
      </Preview>

      <Preview title="Fade animation" minHeight={160} code={`<ActionSheet animation="fade" ... />`}>
        <View style={{ alignItems: 'center' }}>
          <TriggerBtn onPress={() => setFadeOpen(true)} label="Fade animation" />
        </View>
        <ActionSheet
          animation="fade"
          isOpen={fadeOpen}
          onClose={() => setFadeOpen(false)}
          title="Account"
          actions={[
            { label: 'Edit profile', onPress: () => setFadeOpen(false) },
            { label: 'Settings', onPress: () => setFadeOpen(false) },
            { label: 'Delete account', variant: 'destructive', onPress: () => setFadeOpen(false) },
          ]}
        />
      </Preview>

      <Preview title="Icons + descriptions" minHeight={160} code={`<ActionSheet
  title="project-report.pdf"
  message="Last modified 2 hours ago"
  actions={[
    { label: 'Open', description: 'Open in default app', icon: <Ionicons name="open-outline" size={20} />, onPress: () => {} },
    { label: 'Share', icon: <Ionicons name="share-outline" size={20} />, onPress: () => {} },
    { label: 'Delete', variant: 'destructive', icon: <Ionicons name="trash-outline" size={20} />, onPress: () => {} },
  ]}
/>`}>
        <View style={{ alignItems: 'center' }}>
          <TriggerBtn onPress={() => setFileOpen(true)} label="File options" />
        </View>
        <ActionSheet
          isOpen={fileOpen}
          onClose={() => setFileOpen(false)}
          title="project-report.pdf"
          message="Last modified 2 hours ago"
          actions={[
            { label: 'Open', description: 'Open in default viewer', icon: <Ionicons name="open-outline" size={20} color="#6366f1" />, onPress: () => setFileOpen(false) },
            { label: 'Share', icon: <Ionicons name="share-outline" size={20} color="#a1a1aa" />, onPress: () => setFileOpen(false) },
            { label: 'Download', icon: <Ionicons name="download-outline" size={20} color="#a1a1aa" />, onPress: () => setFileOpen(false) },
            { label: 'Delete', variant: 'destructive', onPress: () => setFileOpen(false) },
          ]}
        />
      </Preview>

      <Preview title="Icons in actions" minHeight={160} code={`<ActionSheet
  actions={[
    { label: 'Camera', icon: <Ionicons name="camera-outline" size={20} />, onPress: () => {} },
    { label: 'Gallery', icon: <Ionicons name="images-outline" size={20} />, onPress: () => {} },
    { label: 'Remove', variant: 'destructive', onPress: () => {} },
  ]}
/>`}>
        <View style={{ alignItems: 'center' }}>
          <TriggerBtn onPress={() => setIconOpen(true)} label="Pick media source" />
        </View>
        <ActionSheet
          isOpen={iconOpen}
          onClose={() => setIconOpen(false)}
          actions={[
            { label: 'Camera', icon: <Ionicons name="camera-outline" size={20} color="#6366f1" />, onPress: () => setIconOpen(false) },
            { label: 'Photo Library', icon: <Ionicons name="images-outline" size={20} color="#6366f1" />, onPress: () => setIconOpen(false) },
            { label: 'Remove current photo', variant: 'destructive', onPress: () => setIconOpen(false) },
          ]}
        />
      </Preview>

    </div>
  )
}
