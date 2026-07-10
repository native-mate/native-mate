'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { SpeedDial } from '../../../../packages/registry/components/speed-dial/speed-dial'

export default function SpeedDialPreview() {
  const [open, setOpen] = useState(true)

  return (
    <div className="space-y-10">
      <Preview title="Default (up direction)" code={`import { SpeedDial } from '~/components/ui/speed-dial'

<SpeedDial
  actions={[
    { icon: 'image-outline', label: 'Upload photo', onPress: () => {} },
    { icon: 'camera-outline', label: 'Take photo', onPress: () => {} },
    { icon: 'document-outline', label: 'Upload file', onPress: () => {} },
  ]}
/>`} minHeight={280}>
        <View style={{ position: 'relative', height: 260, width: 200, alignItems: 'flex-end' }}>
          <SpeedDial
            actions={[
              { icon: 'image-outline', label: 'Upload photo', onPress: () => {} },
              { icon: 'camera-outline', label: 'Take photo', onPress: () => {} },
              { icon: 'document-outline', label: 'Upload file', onPress: () => {} },
            ]}
            style={{ position: 'absolute', bottom: 0, right: 0 }}
          />
        </View>
      </Preview>

      <Preview title="Left direction" code={`<SpeedDial
  direction="left"
  position="bottom-right"
  actions={[
    { icon: 'share-outline', label: 'Share', onPress: () => {} },
    { icon: 'star-outline', label: 'Favorite', onPress: () => {} },
  ]}
/>`} minHeight={140}>
        <View style={{ position: 'relative', height: 100, width: 260, alignItems: 'flex-end' }}>
          <SpeedDial
            direction="left"
            position="bottom-right"
            actions={[
              { icon: 'share-outline', label: 'Share', onPress: () => {} },
              { icon: 'star-outline', label: 'Favorite', onPress: () => {} },
            ]}
            style={{ position: 'absolute', bottom: 0, right: 0 }}
          />
        </View>
      </Preview>

      <Preview title="Bottom-left position" code={`<SpeedDial
  position="bottom-left"
  actions={[
    { icon: 'add-circle-outline', label: 'New task', onPress: () => {} },
    { icon: 'folder-outline', label: 'New folder', onPress: () => {} },
  ]}
/>`} minHeight={280}>
        <View style={{ position: 'relative', height: 260, width: 200, alignItems: 'flex-start' }}>
          <SpeedDial
            position="bottom-left"
            actions={[
              { icon: 'add-circle-outline', label: 'New task', onPress: () => {} },
              { icon: 'folder-outline', label: 'New folder', onPress: () => {} },
            ]}
            style={{ position: 'absolute', bottom: 0, left: 0 }}
          />
        </View>
      </Preview>

      <Preview title="Custom icon & colors" code={`<SpeedDial
  icon="ellipsis-horizontal"
  color="#8b5cf6"
  actions={[
    { icon: 'checkmark-circle-outline', label: 'Mark done', color: '#10b981', onPress: () => {} },
    { icon: 'trash-outline', label: 'Delete', color: '#ef4444', onPress: () => {} },
  ]}
/>`} minHeight={280}>
        <View style={{ position: 'relative', height: 260, width: 200, alignItems: 'flex-end' }}>
          <SpeedDial
            icon="ellipsis-horizontal"
            color="#8b5cf6"
            actions={[
              { icon: 'checkmark-circle-outline', label: 'Mark done', color: '#10b981', onPress: () => {} },
              { icon: 'trash-outline', label: 'Delete', color: '#ef4444', onPress: () => {} },
            ]}
            style={{ position: 'absolute', bottom: 0, right: 0 }}
          />
        </View>
      </Preview>

      <Preview title="Controlled open state" code={`const [open, setOpen] = useState(true)

<SpeedDial
  open={open}
  onToggle={setOpen}
  actions={[
    { icon: 'mail-outline', label: 'Message', onPress: () => {} },
    { icon: 'call-outline', label: 'Call', onPress: () => {} },
  ]}
/>`} minHeight={280}>
        <View style={{ position: 'relative', height: 260, width: 200, alignItems: 'flex-end' }}>
          <SpeedDial
            open={open}
            onToggle={setOpen}
            actions={[
              { icon: 'mail-outline', label: 'Message', onPress: () => {} },
              { icon: 'call-outline', label: 'Call', onPress: () => {} },
            ]}
            style={{ position: 'absolute', bottom: 0, right: 0 }}
          />
        </View>
      </Preview>
    </div>
  )
}
