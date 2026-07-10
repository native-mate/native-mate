'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { DropdownMenu } from '../../../../packages/registry/components/dropdown-menu/dropdown-menu'
import { Text } from '@native-mate/core'

function TriggerDots() {
  return (
    <View
      style={{ width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1e21', borderWidth: 1, borderColor: '#27272a' }}
    >
      <Text style={{ color: '#e4e4e7', fontSize: 18, fontWeight: '700' }}>⋯</Text>
    </View>
  )
}

function TriggerBtn({ label }: { label: string }) {
  return (
    <View
      style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#6366f1', alignItems: 'center' }}
    >
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </View>
  )
}

export default function DropdownMenuPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Basic menu" code={`import { DropdownMenu } from '~/components/ui/dropdown-menu'

<DropdownMenu
  trigger={<TriggerDots />}
  items={[
    { key: 'edit', label: 'Edit', icon: 'pencil', onPress: () => {} },
    { key: 'duplicate', label: 'Duplicate', icon: 'copy', onPress: () => {} },
    { key: 'share', label: 'Share', icon: 'share-outline', onPress: () => {} },
  ]}
/>`}>
        <DropdownMenu
          trigger={<TriggerDots />}
          items={[
            { key: 'edit', label: 'Edit', icon: 'pencil', onPress: () => {} },
            { key: 'duplicate', label: 'Duplicate', icon: 'copy', onPress: () => {} },
            { key: 'share', label: 'Share', icon: 'share-outline', onPress: () => {} },
          ]}
        />
      </Preview>

      <Preview title="With destructive item + divider" code={`<DropdownMenu
  trigger={<TriggerDots />}
  items={[
    { key: 'rename', label: 'Rename', icon: 'create-outline', onPress: () => {} },
    { key: 'archive', label: 'Archive', icon: 'archive-outline', onPress: () => {}, divider: true },
    { key: 'delete', label: 'Delete', icon: 'trash-outline', destructive: true, onPress: () => {} },
  ]}
/>`}>
        <DropdownMenu
          trigger={<TriggerDots />}
          items={[
            { key: 'rename', label: 'Rename', icon: 'create-outline', onPress: () => {} },
            { key: 'archive', label: 'Archive', icon: 'archive-outline', onPress: () => {}, divider: true },
            { key: 'delete', label: 'Delete', icon: 'trash-outline', destructive: true, onPress: () => {} },
          ]}
        />
      </Preview>

      <Preview title="Left-aligned, disabled item" code={`<DropdownMenu
  trigger={<Button variant="outline">Actions</Button>}
  align="left"
  items={[
    { key: 'export', label: 'Export data', icon: 'download-outline', onPress: () => {} },
    { key: 'sync', label: 'Force sync', icon: 'sync-outline', disabled: true, onPress: () => {} },
  ]}
/>`}>
        <DropdownMenu
          trigger={<TriggerBtn label="Actions" />}
          align="left"
          items={[
            { key: 'export', label: 'Export data', icon: 'download-outline', onPress: () => {} },
            { key: 'sync', label: 'Force sync', icon: 'sync-outline', disabled: true, onPress: () => {} },
          ]}
        />
      </Preview>
    </div>
  )
}
