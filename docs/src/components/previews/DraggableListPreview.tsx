'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { DraggableList } from '../../../../packages/registry/components/draggable-list/draggable-list'
import { Text } from '../../../../packages/registry/components/text/text'
import { Icon } from '../../../../packages/registry/components/icon/icon'

interface Track {
  id: string
  title: string
  artist: string
}

const INITIAL_TRACKS: Track[] = [
  { id: '1', title: 'Midnight City', artist: 'M83' },
  { id: '2', title: 'Instant Crush', artist: 'Daft Punk' },
  { id: '3', title: 'Nightcall', artist: 'Kavinsky' },
  { id: '4', title: 'Genesis', artist: 'Justice' },
]

export default function DraggableListPreview() {
  const [tracks, setTracks] = useState(INITIAL_TRACKS)
  const [tasks, setTasks] = useState(['Design review', 'Write tests', 'Ship release'])

  return (
    <div className="space-y-10">
      <Preview title="Reorderable list" code={`import { DraggableList } from '~/components/ui/draggable-list'

const [tracks, setTracks] = useState(initialTracks)

<DraggableList
  data={tracks}
  keyExtractor={(item) => item.id}
  onReorder={setTracks}
  renderItem={({ item }) => (
    <View style={{ padding: 12 }}>
      <Text weight="semibold">{item.title}</Text>
      <Text variant="caption" muted>{item.artist}</Text>
    </View>
  )}
/>`} minHeight={260}>
        <View style={{ width: 320 }}>
          <DraggableList
            data={tracks}
            keyExtractor={(item) => item.id}
            onReorder={setTracks}
            renderItem={({ item }) => (
              <View style={{ padding: 12 }}>
                <Text weight="semibold">{item.title}</Text>
                <Text variant="caption" muted>{item.artist}</Text>
              </View>
            )}
          />
        </View>
      </Preview>

      <Preview title="Drag handle on the left" code={`<DraggableList
  data={tasks}
  keyExtractor={(item) => item}
  onReorder={setTasks}
  dragHandlePosition="left"
  renderItem={({ item }) => (
    <View style={{ padding: 12 }}>
      <Text>{item}</Text>
    </View>
  )}
/>`} minHeight={220}>
        <View style={{ width: 300 }}>
          <DraggableList
            data={tasks}
            keyExtractor={(item) => item}
            onReorder={setTasks}
            dragHandlePosition="left"
            renderItem={({ item }) => (
              <View style={{ padding: 12 }}>
                <Text>{item}</Text>
              </View>
            )}
          />
        </View>
      </Preview>

      <Preview title="Without separators" code={`<DraggableList
  data={tracks}
  keyExtractor={(item) => item.id}
  onReorder={setTracks}
  showSeparator={false}
  itemHeight={52}
  renderItem={({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.title}</Text>
    </View>
  )}
/>`} minHeight={220}>
        <View style={{ width: 300 }}>
          <DraggableList
            data={tracks}
            keyExtractor={(item) => item.id}
            onReorder={setTracks}
            showSeparator={false}
            itemHeight={52}
            renderItem={({ item }) => (
              <View style={{ padding: 10 }}>
                <Text>{item.title}</Text>
              </View>
            )}
          />
        </View>
      </Preview>

      <Preview title="Disabled" code={`<DraggableList data={tracks} keyExtractor={(item) => item.id} onReorder={setTracks} disabled renderItem={...} />`} minHeight={200}>
        <View style={{ width: 300 }}>
          <DraggableList
            data={tracks}
            keyExtractor={(item) => item.id}
            onReorder={setTracks}
            disabled
            renderItem={({ item }) => (
              <View style={{ padding: 12 }}>
                <Text>{item.title}</Text>
              </View>
            )}
          />
        </View>
      </Preview>
    </div>
  )
}
