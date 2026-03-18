'use client'
import React, { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Preview } from './shared/Preview'
import { Popover } from '../../../../packages/registry/components/popover/popover'
import { Text } from '@native-mate/core'

const MENU_ITEMS = [
  { label: 'Edit', icon: '✏', destructive: false },
  { label: 'Duplicate', icon: '⧉', destructive: false },
  { label: 'Move to folder', icon: '📁', destructive: false },
  { label: 'Delete', icon: '🗑', destructive: true },
]

function MenuItem({ icon, label, destructive, onPress }: { icon: string; label: string; destructive: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontSize: 15 }}>{icon}</Text>
      <Text style={{ fontSize: 14, color: destructive ? '#ef4444' : '#fafafa', flex: 1 }}>{label}</Text>
    </Pressable>
  )
}

function TriggerBtn({ children }: { children: string }) {
  return (
    <View style={{ paddingVertical: 9, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#3f3f46', backgroundColor: '#27272a', alignItems: 'center' }}>
      <Text style={{ color: '#fafafa', fontSize: 13 }}>{children}</Text>
    </View>
  )
}

export default function PopoverPreview() {
  const [lastAction, setLastAction] = useState<string | null>(null)

  const menuContent = (close: () => void) => (
    <View style={{ paddingVertical: 4 }}>
      {MENU_ITEMS.map((item, i) => (
        <View key={item.label}>
          {i > 0 && <View style={{ height: 1, backgroundColor: '#27272a' }} />}
          <MenuItem
            icon={item.icon}
            label={item.label}
            destructive={item.destructive}
            onPress={() => { setLastAction(item.label); close() }}
          />
        </View>
      ))}
    </View>
  )

  return (
    <div className="space-y-10">
      <Preview title="Context menu (bottom)" minHeight={200} code={`import { Popover } from '~/components/ui/popover'

<Popover
  placement="bottom"
  content={
    <View style={{ paddingVertical: 4 }}>
      <Pressable onPress={() => {}} style={rowStyle}>
        <Text>Edit</Text>
      </Pressable>
      <Pressable onPress={() => {}} style={rowStyle}>
        <Text style={{ color: '#ef4444' }}>Delete</Text>
      </Pressable>
    </View>
  }
>
  <Button variant="outline">Options</Button>
</Popover>`}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Popover
            placement="bottom"
            content={
              <View style={{ paddingVertical: 4 }}>
                {MENU_ITEMS.map((item, i) => (
                  <View key={item.label}>
                    {i > 0 && <View style={{ height: 1, backgroundColor: '#27272a' }} />}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 16 }}>
                      <Text style={{ fontSize: 15 }}>{item.icon}</Text>
                      <Text style={{ fontSize: 14, color: item.destructive ? '#ef4444' : '#fafafa' }}>{item.label}</Text>
                    </View>
                  </View>
                ))}
              </View>
            }
          >
            <TriggerBtn>••• Options</TriggerBtn>
          </Popover>
          {lastAction && (
            <Text style={{ color: '#71717a', fontSize: 13 }}>Selected: {lastAction}</Text>
          )}
        </View>
      </Preview>

      <Preview title="Placements" minHeight={160} code={`<Popover placement="top" content={<Text>Top popover</Text>}>
  <Button variant="outline">Top</Button>
</Popover>

<Popover placement="right" content={<Text>Right popover</Text>}>
  <Button variant="outline">Right</Button>
</Popover>`}>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {(['top', 'bottom', 'left', 'right'] as const).map(placement => (
            <Popover
              key={placement}
              placement={placement}
              content={
                <View style={{ padding: 12 }}>
                  <Text style={{ color: '#fafafa', fontSize: 13 }}>{placement} popover</Text>
                </View>
              }
            >
              <TriggerBtn>{placement.charAt(0).toUpperCase() + placement.slice(1)}</TriggerBtn>
            </Popover>
          ))}
        </View>
      </Preview>
    </div>
  )
}
