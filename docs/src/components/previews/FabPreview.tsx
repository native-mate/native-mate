'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Fab } from '../../../../packages/registry/components/fab/fab'

export default function FabPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Variants" code={`import { Fab } from '~/components/ui/fab'

<Fab icon="add" variant="default" onPress={() => {}} />
<Fab icon="pencil" variant="secondary" onPress={() => {}} />
<Fab icon="trash" variant="destructive" onPress={() => {}} />`} minHeight={100}>
        <View style={{ flexDirection: 'row', gap: 20, position: 'relative', height: 68 }}>
          <Fab icon="add" variant="default" onPress={() => {}} style={{ position: 'relative', bottom: 0, right: 0 }} />
          <Fab icon="pencil" variant="secondary" onPress={() => {}} style={{ position: 'relative', bottom: 0, right: 0 }} />
          <Fab icon="trash" variant="destructive" onPress={() => {}} style={{ position: 'relative', bottom: 0, right: 0 }} />
        </View>
      </Preview>

      <Preview title="Sizes" code={`<Fab icon="add" size="sm" onPress={() => {}} />
<Fab icon="add" size="md" onPress={() => {}} />
<Fab icon="add" size="lg" onPress={() => {}} />`} minHeight={100}>
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', position: 'relative', height: 68 }}>
          <Fab icon="add" size="sm" onPress={() => {}} style={{ position: 'relative', bottom: 0, right: 0 }} />
          <Fab icon="add" size="md" onPress={() => {}} style={{ position: 'relative', bottom: 0, right: 0 }} />
          <Fab icon="add" size="lg" onPress={() => {}} style={{ position: 'relative', bottom: 0, right: 0 }} />
        </View>
      </Preview>

      <Preview title="Extended (with label)" code={`<Fab icon="create-outline" label="Compose" onPress={() => {}} />`} minHeight={100}>
        <View style={{ position: 'relative', height: 56 }}>
          <Fab icon="create-outline" label="Compose" onPress={() => {}} style={{ position: 'relative', bottom: 0, right: 0 }} />
        </View>
      </Preview>

      <Preview title="Speed dial actions" code={`<Fab
  icon="add"
  actions={[
    { icon: 'image-outline', label: 'Photo', onPress: () => {} },
    { icon: 'document-text-outline', label: 'Document', onPress: () => {} },
    { icon: 'location-outline', label: 'Location', onPress: () => {} },
  ]}
/>`} minHeight={260}>
        <View style={{ position: 'relative', height: 240, width: 160, alignItems: 'flex-end' }}>
          <Fab
            icon="add"
            actions={[
              { icon: 'image-outline', label: 'Photo', onPress: () => {} },
              { icon: 'document-text-outline', label: 'Document', onPress: () => {} },
              { icon: 'location-outline', label: 'Location', onPress: () => {} },
            ]}
            style={{ position: 'absolute', bottom: 0, right: 0 }}
          />
        </View>
      </Preview>

      <Preview title="Custom color & disabled" code={`<Fab icon="heart" color="#ec4899" onPress={() => {}} />
<Fab icon="add" disabled onPress={() => {}} />`} minHeight={100}>
        <View style={{ flexDirection: 'row', gap: 20, position: 'relative', height: 56 }}>
          <Fab icon="heart" color="#ec4899" onPress={() => {}} style={{ position: 'relative', bottom: 0, right: 0 }} />
          <Fab icon="add" disabled onPress={() => {}} style={{ position: 'relative', bottom: 0, right: 0 }} />
        </View>
      </Preview>
    </div>
  )
}
