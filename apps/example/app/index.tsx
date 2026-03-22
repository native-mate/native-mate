import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { useThemeControl } from './_layout'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button, ButtonGroup } from '../components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Icon } from '../components/ui/icon'
import { Badge } from '../components/ui/badge'
import { Tag } from '../components/ui/tag'

const screens = [
  { name: 'login', label: 'Login', desc: 'Email, password, social auth', icon: 'log-in-outline' },
  { name: 'otp', label: 'OTP Verification', desc: 'Code input, spinner, states', icon: 'keypad-outline' },
  { name: 'dashboard', label: 'Dashboard', desc: 'Tabs, cards, charts, skeleton', icon: 'bar-chart-outline' },
  { name: 'profile', label: 'Profile', desc: 'Avatar, switch, select, radio', icon: 'person-outline' },
  { name: 'forms', label: 'Forms', desc: 'Input, textarea, slider, toast', icon: 'create-outline' },
  { name: 'overlays', label: 'Overlays', desc: 'Modal, sheet, action sheet, alerts', icon: 'layers-outline' },
] as const

const presets = ['zinc', 'slate', 'rose', 'midnight'] as const

export default function HomeScreen() {
  const router = useRouter()
  const theme = useTheme()
  const { preset, colorScheme, setPreset, setColorScheme } = useThemeControl()
  const [selectedTags, setSelectedTags] = useState<string[]>(['React Native'])

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>

          {/* Header */}
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text variant="h3">Native Mate</Text>
              <Badge variant="info" size="sm">v0.1</Badge>
            </View>
            <Text variant="body" color="muted">
              Production-ready UI components for React Native. This demo showcases all 28 components across every theme preset and color mode.
            </Text>
          </View>

          {/* Current theme info */}
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Badge variant="default">{preset}</Badge>
            <Badge variant={colorScheme === 'dark' ? 'warning' : 'success'} dot pulse>{colorScheme} mode</Badge>
            <Badge variant="info" count={28}>components</Badge>
          </View>

          <Separator label="Screens" />

          {/* Navigation cards */}
          {screens.map((s) => (
            <Card key={s.name} onPress={() => router.push(`/${s.name}` as any)}>
              <CardContent style={{ paddingTop: 16 }}>
                <View style={{ flexDirection: 'row', gap: 14 }}>
                  <View style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: theme.colors.primary + '15',
                    alignItems: 'center', justifyContent: 'center',
                    marginTop: 2,
                  }}>
                    <Icon name={s.icon} size={22} color={theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text variant="h6">{s.label}</Text>
                    <Text variant="caption" color="muted">{s.desc}</Text>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <Icon name="chevron-forward" size={18} color={theme.colors.muted} />
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}

          <Separator label="Theme" />

          {/* Preset switcher */}
          <Card>
            <CardHeader title="Preset" subtitle="Switch between 4 design tokens" />
            <CardContent>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {presets.map((p) => (
                  <Button
                    key={p}
                    variant={preset === p ? 'default' : 'outline'}
                    size="sm"
                    onPress={() => setPreset(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Color mode switcher */}
          <Card>
            <CardHeader title="Color Mode" subtitle="Toggle between light and dark" />
            <CardContent>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                  variant={colorScheme === 'light' ? 'default' : 'outline'}
                  onPress={() => setColorScheme('light')}
                  iconLeft={<Icon name="sunny-outline" size={18} color={colorScheme === 'light' ? theme.colors.background : undefined} />}
                  style={{ flex: 1 }}
                >
                  Light
                </Button>
                <Button
                  variant={colorScheme === 'dark' ? 'default' : 'outline'}
                  onPress={() => setColorScheme('dark')}
                  iconLeft={<Icon name="moon-outline" size={18} color={colorScheme === 'dark' ? theme.colors.background : undefined} />}
                  style={{ flex: 1 }}
                >
                  Dark
                </Button>
              </View>
            </CardContent>
          </Card>

          <Separator label="Components" />

          {/* Tag showcase */}
          <Card>
            <CardHeader title="Tags" subtitle="Tap to toggle, animated selection" />
            <CardContent>
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {['React Native', 'Expo', 'TypeScript', 'Reanimated', 'Gestures'].map((t) => (
                    <Tag
                      key={t}
                      label={t}
                      selected={selectedTags.includes(t)}
                      onPress={() =>
                        setSelectedTags((prev) =>
                          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                        )
                      }
                    />
                  ))}
                </View>
                <Separator />
                <Text variant="caption" color="muted">Variant colors:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  <Tag label="Success" variant="success" />
                  <Tag label="Warning" variant="warning" />
                  <Tag label="Error" variant="destructive" />
                  <Tag label="Info" variant="info" />
                  <Tag label="Removable" onRemove={() => {}} />
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Badge showcase */}
          <Card>
            <CardHeader title="Badges" subtitle="Status indicators and counts" />
            <CardContent>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Active</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="info">New</Badge>
                <Badge variant="success" dot pulse>Online</Badge>
                <Badge variant="destructive" count={5} />
                <Badge variant="info" count={99} maxCount={50} />
              </View>
            </CardContent>
          </Card>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
