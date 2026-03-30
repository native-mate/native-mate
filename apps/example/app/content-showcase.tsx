import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { Icon } from '../components/ui/icon'
import { DividerLabel } from '../components/ui/divider-label'
import { Breadcrumb } from '../components/ui/breadcrumb'
import { Markdown } from '../components/ui/markdown'
import { VideoPlayer } from '../components/ui/video-player'
import { AudioPlayer } from '../components/ui/audio-player'
import { FileUpload } from '../components/ui/file-upload'
import { ColorPicker } from '../components/ui/color-picker'
import { SpeedDial } from '../components/ui/speed-dial'

const sampleMarkdown = `# Welcome to Native Mate

This is a **bold statement** about building *beautiful* mobile apps.

## Features

- 80+ production-ready components
- 12 theme presets with dark mode
- Spring animations powered by Reanimated
- Full TypeScript support

## Code Example

\`\`\`typescript
import { Button } from './components/ui/button'

export const App = () => (
  <Button variant="default" size="lg">
    Get Started
  </Button>
)
\`\`\`

> Native Mate: Own your components. Build something great.

Visit [native-mate.dev](https://native-mate.dev) for docs.`

export default function ContentShowcaseScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [selectedColor, setSelectedColor] = useState(theme.colors.primary)
  const [speedDialOpen, setSpeedDialOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  const presetColors = [
    theme.colors.primary,
    theme.colors.destructive,
    theme.colors.success,
    theme.colors.warning,
    '#6366f1',
    '#ec4899',
    '#14b8a6',
    '#f97316',
  ]

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <Text variant="h3">Content & Media</Text>
              <Text variant="caption" color="muted">Markdown, media, uploads, tools</Text>
            </View>
            <Button variant="ghost" size="sm" iconLeft={<Icon name="arrow-back" size={16} />} onPress={() => router.back()}>
              Back
            </Button>
          </View>

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Projects', onPress: () => {} },
              { label: 'My App', onPress: () => {} },
              { label: 'Design' },
            ]}
            separator="chevron"
          />

          <DividerLabel label="Markdown Content" />

          {/* Markdown */}
          <Markdown content={sampleMarkdown} />

          <DividerLabel label="Media" />

          {/* Video Player */}
          <View style={{
            height: 200,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            overflow: 'hidden',
          }}>
            <VideoPlayer
              source={{ uri: '' }}
              poster={undefined}
              controls
              aspectRatio={16 / 9}
              borderRadius={theme.radius.lg}
            />
          </View>

          {/* Audio Player */}
          <AudioPlayer
            title="Midnight Jazz"
            artist="Lo-Fi Beats"
            source={{ uri: '' }}
            showProgress
            showControls
          />

          <AudioPlayer
            title="Morning Coffee"
            artist="Chill Vibes"
            source={{ uri: '' }}
            compact
          />

          <DividerLabel label="File Upload" />

          {/* File Upload */}
          <FileUpload
            variant="dropzone"
            multiple
            maxFiles={5}
            accept={['image/*', 'application/pdf']}
            onFilesSelected={(files) => setUploadedFiles(files)}
            showPreview
          />

          <DividerLabel label="Color Picker" />

          {/* Color Picker */}
          <ColorPicker
            value={selectedColor}
            onChange={setSelectedColor}
            presets={presetColors}
            showCustom
            format="hex"
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: theme.radius.md,
              backgroundColor: selectedColor,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }} />
            <Text variant="body" color="muted">Selected: {selectedColor}</Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Speed Dial */}
      <SpeedDial
        icon="add"
        open={speedDialOpen}
        onToggle={() => setSpeedDialOpen(!speedDialOpen)}
        position="bottom-right"
        actions={[
          { icon: 'camera-outline', label: 'Camera', onPress: () => setSpeedDialOpen(false) },
          { icon: 'images-outline', label: 'Gallery', onPress: () => setSpeedDialOpen(false) },
          { icon: 'document-outline', label: 'Document', onPress: () => setSpeedDialOpen(false) },
        ]}
      />
    </Screen>
  )
}
