import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { Icon } from '../components/ui/icon'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { ListItem } from '../components/ui/list-item'
import { Chip } from '../components/ui/chip'
import { ToggleGroup } from '../components/ui/toggle-group'
import { DividerLabel } from '../components/ui/divider-label'
import { SegmentedControl } from '../components/ui/segmented-control'
import { Collapsible } from '../components/ui/collapsible'
import { SwipeableRow } from '../components/ui/swipeable-row'

export default function ListsShowcaseScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [activeSegment, setActiveSegment] = useState('settings')
  const [selectedChips, setSelectedChips] = useState<string[]>(['all'])
  const [viewMode, setViewMode] = useState('list')
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New follower', subtitle: 'Sarah started following you', icon: 'person-add-outline' },
    { id: '2', title: 'Comment received', subtitle: 'Mike commented on your post', icon: 'chatbubble-outline' },
    { id: '3', title: 'Upload complete', subtitle: 'Your file has been uploaded', icon: 'cloud-done-outline' },
    { id: '4', title: 'Payment processed', subtitle: 'Invoice #1234 has been paid', icon: 'card-outline' },
  ])

  const segments = [
    { label: 'Settings', value: 'settings' },
    { label: 'Notifications', value: 'notifications' },
    { label: 'Activity', value: 'activity' },
  ]

  const chips = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Archived', value: 'archived' },
    { label: 'Starred', value: 'starred' },
  ]

  const viewModes = [
    { label: 'Grid', value: 'grid', icon: 'grid-outline' },
    { label: 'List', value: 'list', icon: 'list-outline' },
    { label: 'Compact', value: 'compact', icon: 'menu-outline' },
  ]

  const handleChipPress = (value: string) => {
    if (value === 'all') {
      setSelectedChips(['all'])
    } else {
      setSelectedChips((prev) => {
        const filtered = prev.filter((c) => c !== 'all')
        if (filtered.includes(value)) {
          const next = filtered.filter((c) => c !== value)
          return next.length === 0 ? ['all'] : next
        }
        return [...filtered, value]
      })
    }
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text variant="h3">Lists & Filters</Text>
              <Text variant="caption" color="muted">List items, chips, toggles, swipe</Text>
            </View>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Icon name="arrow-back" size={16} />}
              onPress={() => router.back()}
            >
              Back
            </Button>
          </View>

          {/* Segmented Control */}
          <Card>
            <CardHeader title="Segmented Control" subtitle="Switch between content sections" />
            <CardContent>
              <SegmentedControl
                segments={segments}
                value={activeSegment}
                onChange={setActiveSegment}
              />
              <View style={{ marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: theme.colors.muted + '15' }}>
                <Text variant="bodySmall" color="muted">
                  Active tab: {segments.find((s) => s.value === activeSegment)?.label}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* List Items */}
          <DividerLabel label="Account Settings" />

          <Card>
            <CardContent style={{ paddingHorizontal: 0 }}>
              <ListItem
                title="Profile"
                subtitle="Edit your personal information"
                leading={<Icon name="person-outline" size={22} color={theme.colors.primary} />}
                trailing={<Icon name="chevron-forward" size={18} color={theme.colors.muted} />}
                onPress={() => {}}
              />
              <ListItem
                title="Notifications"
                subtitle="Manage push and email alerts"
                leading={<Icon name="notifications-outline" size={22} color={theme.colors.primary} />}
                trailing={<Icon name="chevron-forward" size={18} color={theme.colors.muted} />}
                onPress={() => {}}
              />
              <ListItem
                title="Privacy & Security"
                subtitle="Control data sharing and visibility"
                leading={<Icon name="shield-outline" size={22} color={theme.colors.primary} />}
                trailing={<Icon name="chevron-forward" size={18} color={theme.colors.muted} />}
                onPress={() => {}}
              />
              <ListItem
                title="Storage & Data"
                subtitle="Manage cache and downloads"
                leading={<Icon name="cloud-outline" size={22} color={theme.colors.primary} />}
                trailing={<Icon name="chevron-forward" size={18} color={theme.colors.muted} />}
                onPress={() => {}}
              />
            </CardContent>
          </Card>

          {/* Collapsible */}
          <Card>
            <CardContent>
              <Collapsible title="Advanced Settings">
                <View style={{ gap: 0 }}>
                  <ListItem
                    title="Developer Mode"
                    subtitle="Enable debug tools and logging"
                    leading={<Icon name="code-outline" size={22} color={theme.colors.primary} />}
                    trailing={<Icon name="chevron-forward" size={18} color={theme.colors.muted} />}
                    onPress={() => {}}
                  />
                  <ListItem
                    title="Experimental Features"
                    subtitle="Try out new features before release"
                    leading={<Icon name="flask-outline" size={22} color={theme.colors.primary} />}
                    trailing={<Icon name="chevron-forward" size={18} color={theme.colors.muted} />}
                    onPress={() => {}}
                  />
                  <ListItem
                    title="Reset to Defaults"
                    subtitle="Restore all settings to factory values"
                    leading={<Icon name="refresh-outline" size={22} color={theme.colors.destructive} />}
                    trailing={<Icon name="chevron-forward" size={18} color={theme.colors.muted} />}
                    onPress={() => {}}
                  />
                </View>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Chips */}
          <DividerLabel label="Filter" />

          <Card>
            <CardHeader title="Chips" subtitle="Tap to filter content by category" />
            <CardContent>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {chips.map((chip) => (
                  <Chip
                    key={chip.value}
                    label={chip.label}
                    selected={selectedChips.includes(chip.value)}
                    onPress={() => handleChipPress(chip.value)}
                  />
                ))}
              </View>
              <View style={{ marginTop: 12 }}>
                <Text variant="caption" color="muted">
                  Selected: {selectedChips.join(', ')}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Toggle Group */}
          <Card>
            <CardHeader title="Toggle Group" subtitle="Switch between view modes" />
            <CardContent>
              <ToggleGroup
                items={viewModes}
                value={viewMode}
                onChange={setViewMode}
              />
              <View style={{ marginTop: 12 }}>
                <Text variant="caption" color="muted">
                  Current view: {viewModes.find((v) => v.value === viewMode)?.label}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Swipeable Rows */}
          <Separator label="Notifications" />

          <Card>
            <CardHeader title="Swipeable Rows" subtitle="Swipe left to delete" />
            <CardContent style={{ paddingHorizontal: 0 }}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <SwipeableRow
                    key={notification.id}
                    onDelete={() => handleDeleteNotification(notification.id)}
                  >
                    <ListItem
                      title={notification.title}
                      subtitle={notification.subtitle}
                      leading={<Icon name={notification.icon} size={22} color={theme.colors.primary} />}
                    />
                  </SwipeableRow>
                ))
              ) : (
                <View style={{ padding: 24, alignItems: 'center', gap: 8 }}>
                  <Icon name="checkmark-circle-outline" size={32} color={theme.colors.success} />
                  <Text variant="bodySmall" color="muted">All caught up! No notifications.</Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => setNotifications([
                      { id: '1', title: 'New follower', subtitle: 'Sarah started following you', icon: 'person-add-outline' },
                      { id: '2', title: 'Comment received', subtitle: 'Mike commented on your post', icon: 'chatbubble-outline' },
                      { id: '3', title: 'Upload complete', subtitle: 'Your file has been uploaded', icon: 'cloud-done-outline' },
                      { id: '4', title: 'Payment processed', subtitle: 'Invoice #1234 has been paid', icon: 'card-outline' },
                    ])}
                  >
                    Reset Notifications
                  </Button>
                </View>
              )}
            </CardContent>
          </Card>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
