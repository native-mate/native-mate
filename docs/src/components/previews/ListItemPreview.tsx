'use client'
import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Preview } from './shared/Preview'
import { ListItem } from '../../../../packages/registry/components/list-item/list-item'

export default function ListItemPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Basic list" code={`import { ListItem } from '~/components/ui/list-item'

<ListItem title="Notifications" subtitle="Push, email, SMS" onPress={() => {}} divider />
<ListItem title="Privacy" subtitle="Manage your data" onPress={() => {}} divider />
<ListItem title="Appearance" subtitle="Theme and display" onPress={() => {}} />`}>
        <View style={{ width: 320 }}>
          <ListItem title="Notifications" subtitle="Push, email, SMS" onPress={() => {}} divider />
          <ListItem title="Privacy" subtitle="Manage your data" onPress={() => {}} divider />
          <ListItem title="Appearance" subtitle="Theme and display" onPress={() => {}} />
        </View>
      </Preview>

      <Preview title="With leading icon and trailing chevron" code={`<ListItem
  title="Account"
  subtitle="jordan@example.com"
  leading={<Ionicons name="person-circle-outline" size={28} color="#6366f1" />}
  onPress={() => {}}
/>`}>
        <View style={{ width: 320 }}>
          <ListItem
            title="Account"
            subtitle="jordan@example.com"
            leading={<Ionicons name="person-circle-outline" size={28} color="#6366f1" />}
            onPress={() => {}}
          />
        </View>
      </Preview>

      <Preview title="Custom trailing content" code={`<ListItem
  title="Wi-Fi"
  subtitle="Connected — HomeNetwork"
  leading={<Ionicons name="wifi-outline" size={22} color="#10b981" />}
  trailing={<Ionicons name="checkmark-circle" size={20} color="#10b981" />}
/>`}>
        <View style={{ width: 320 }}>
          <ListItem
            title="Wi-Fi"
            subtitle="Connected — HomeNetwork"
            leading={<Ionicons name="wifi-outline" size={22} color="#10b981" />}
            trailing={<Ionicons name="checkmark-circle" size={20} color="#10b981" />}
          />
        </View>
      </Preview>

      <Preview title="Destructive and disabled" code={`<ListItem
  title="Delete account"
  destructive
  leading={<Ionicons name="trash-outline" size={20} color="#ef4444" />}
  onPress={() => {}}
  divider
/>
<ListItem title="Restore purchase" disabled onPress={() => {}} />`}>
        <View style={{ width: 320 }}>
          <ListItem
            title="Delete account"
            destructive
            leading={<Ionicons name="trash-outline" size={20} color="#ef4444" />}
            onPress={() => {}}
            divider
          />
          <ListItem title="Restore purchase" disabled onPress={() => {}} />
        </View>
      </Preview>

      <Preview title="Compact rows with description" code={`<ListItem
  title="Two-factor authentication"
  description="Add an extra layer of security to your account."
  compact
  onPress={() => {}}
/>`}>
        <View style={{ width: 320 }}>
          <ListItem
            title="Two-factor authentication"
            description="Add an extra layer of security to your account."
            compact
            onPress={() => {}}
          />
        </View>
      </Preview>
    </div>
  )
}
