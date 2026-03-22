import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { useThemeControl } from './_layout'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Avatar, AvatarGroup } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Switch } from '../components/ui/switch'
import { Separator } from '../components/ui/separator'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { Select } from '../components/ui/select'
import { RadioGroup } from '../components/ui/radio'
import { Icon } from '../components/ui/icon'
import { Badge } from '../components/ui/badge'

const languageOptions = [
  { label: 'English', value: 'en', icon: <Icon name="globe-outline" size={16} /> },
  { label: 'Spanish', value: 'es', icon: <Icon name="globe-outline" size={16} /> },
  { label: 'French', value: 'fr', icon: <Icon name="globe-outline" size={16} /> },
  { label: 'German', value: 'de', icon: <Icon name="globe-outline" size={16} /> },
  { label: 'Japanese', value: 'jp', icon: <Icon name="globe-outline" size={16} /> },
]

const viewOptions = [
  { label: 'List', value: 'list', description: 'Show items in a vertical list' },
  { label: 'Grid', value: 'grid', description: 'Show items in a grid layout' },
  { label: 'Compact', value: 'compact', description: 'Condensed view with less spacing' },
]

const teamAvatars = [
  { name: 'Alice Chen' },
  { name: 'Bob Smith' },
  { name: 'Carol Davis' },
  { name: 'Dan Wilson' },
  { name: 'Eve Brown' },
]

export default function ProfileScreen() {
  const router = useRouter()
  const theme = useTheme()
  const { colorScheme, setColorScheme, preset } = useThemeControl()
  const [notifications, setNotifications] = useState(true)
  const [analytics, setAnalytics] = useState(false)
  const [biometric, setBiometric] = useState(true)
  const [language, setLanguage] = useState('en')
  const [defaultView, setDefaultView] = useState('list')

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Icon name="arrow-back" size={16} />}
            onPress={() => router.back()}
            style={{ alignSelf: 'flex-start' }}
          >
            Back
          </Button>

          {/* Profile header */}
          <View style={{ alignItems: 'center', gap: 12 }}>
            <Avatar name="Jane Doe" size="xl" status="online" />
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text variant="h4">Jane Doe</Text>
              <Text variant="body" color="muted">jane.doe@example.com</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Badge variant="success" size="sm">Pro Plan</Badge>
                <Badge variant="info" size="sm">{preset}</Badge>
              </View>
            </View>
          </View>

          {/* Avatar showcase */}
          <Card>
            <CardHeader title="Team" subtitle="Your team members" />
            <CardContent>
              <View style={{ gap: 12 }}>
                <AvatarGroup avatars={teamAvatars} size="md" max={4} />
                <Separator />
                <Text variant="caption" color="muted">Avatar sizes and shapes:</Text>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <Avatar name="SM" size="sm" />
                  <Avatar name="MD" size="md" status="online" />
                  <Avatar name="LG" size="lg" status="away" />
                  <Avatar name="SQ" size="md" shape="square" />
                </View>
              </View>
            </CardContent>
          </Card>

          <Separator label="Settings" />

          {/* Preferences */}
          <Card>
            <CardHeader title="Preferences" subtitle="Manage your app experience" />
            <CardContent>
              <View style={{ gap: 20 }}>
                <Switch
                  label="Push Notifications"
                  description="Receive alerts for important updates"
                  value={notifications}
                  onValueChange={setNotifications}
                />

                <Switch
                  label="Dark Mode"
                  description="Switch between light and dark theme"
                  value={colorScheme === 'dark'}
                  onValueChange={(val) => setColorScheme(val ? 'dark' : 'light')}
                />

                <Switch
                  label="Analytics"
                  description="Help improve the app with usage data"
                  value={analytics}
                  onValueChange={setAnalytics}
                />

                <Switch
                  label="Biometric Login"
                  description="Use Face ID or fingerprint to sign in"
                  value={biometric}
                  onValueChange={setBiometric}
                />
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Language" subtitle="Choose your preferred language" />
            <CardContent>
              <Select
                options={languageOptions}
                value={language}
                onChange={setLanguage}
                placeholder="Select a language"
                searchable
                searchPlaceholder="Search languages..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Default View" subtitle="How items are displayed in lists" />
            <CardContent>
              <RadioGroup
                options={viewOptions}
                value={defaultView}
                onChange={setDefaultView}
                card
              />
            </CardContent>
          </Card>

          <Separator />

          <Button variant="outline" onPress={() => {}} iconLeft={<Icon name="create-outline" size={18} />}>
            Edit Profile
          </Button>
          <Button variant="destructive" onPress={() => {}} iconLeft={<Icon name="log-out-outline" size={18} />}>
            Sign Out
          </Button>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
