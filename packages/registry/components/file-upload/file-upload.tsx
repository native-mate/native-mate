// native-mate: file-upload@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Pressable, Image } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { FileUploadProps, UploadFile } from './file-upload.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  // Dropzone
  dropzone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: theme.colors.background,
  },
  dropzoneActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '08',
  },
  dropzoneIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropzoneTitle: {
    fontSize: theme.typography.size.md,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  dropzoneSubtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
    marginTop: 4,
  },
  browseLabel: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.size.sm,
    ...fontStyle(theme.typography, 'semibold'),
  },
  // Button variant
  buttonVariant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonLabel: {
    fontSize: theme.typography.size.sm,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.foreground,
  },
  // Compact variant
  compactVariant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: theme.spacing.sm,
  },
  compactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // File preview
  fileList: {
    gap: 8,
    marginTop: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
  },
  fileThumbnail: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
    gap: 2,
  },
  fileName: {
    fontSize: theme.typography.size.sm,
    ...fontStyle(theme.typography, 'medium'),
    color: theme.colors.foreground,
  },
  fileSize: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.muted,
  },
  fileError: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.destructive,
  },
  removeButton: {
    padding: 4,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressBarError: {
    backgroundColor: theme.colors.destructive,
  },
  disabled: {
    opacity: 0.5,
  },
}))

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImageFile(type: string): boolean {
  return type.startsWith('image/')
}

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return 'image-outline'
  if (type.startsWith('video/')) return 'videocam-outline'
  if (type.startsWith('audio/')) return 'musical-notes-outline'
  if (type.includes('pdf')) return 'document-text-outline'
  if (type.includes('zip') || type.includes('archive')) return 'archive-outline'
  return 'document-outline'
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles,
  maxSize,
  accept,
  multiple = true,
  variant = 'dropzone',
  showPreview = true,
  files = [],
  onRemoveFile,
  disabled = false,
  placeholder,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const buttonScale = useSharedValue(1)

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const handlePress = useCallback(() => {
    if (disabled) return
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    buttonScale.value = withSpring(0.97, { damping: 15, stiffness: 300 })
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 12, stiffness: 300 })
    }, 100)
    // File picker would be triggered here via expo-document-picker or expo-image-picker
    onFilesSelected?.([])
  }, [disabled, haptic, onFilesSelected])

  const handleRemove = useCallback(
    (fileId: string) => {
      if (haptic && Haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      onRemoveFile?.(fileId)
    },
    [haptic, onRemoveFile],
  )

  const maxSizeLabel = maxSize ? formatFileSize(maxSize) : null
  const acceptLabel = accept ? accept.map((t) => t.split('/')[1]).join(', ') : null

  const renderFileItem = (file: UploadFile) => (
    <View key={file.id} style={styles.fileItem}>
      {file.uri && isImageFile(file.type) ? (
        <Image source={{ uri: file.uri }} style={styles.fileThumbnail} resizeMode="cover" />
      ) : (
        <View style={styles.fileIconContainer}>
          <Ionicons name={getFileIcon(file.type) as any} size={20} color={theme.colors.primary} />
        </View>
      )}
      <View style={styles.fileInfo}>
        <Text variant="body" numberOfLines={1} style={styles.fileName}>
          {file.name}
        </Text>
        {file.error != null ? (
          <Text variant="caption" style={styles.fileError}>
            {file.error}
          </Text>
        ) : (
          <Text variant="caption" style={styles.fileSize}>
            {formatFileSize(file.size)}
          </Text>
        )}
        {file.progress != null && file.progress < 1 && file.error == null && (
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${file.progress * 100}%` },
              ]}
            />
          </View>
        )}
      </View>
      {onRemoveFile != null && (
        <Pressable
          onPress={() => handleRemove(file.id)}
          style={styles.removeButton}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${file.name}`}
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={20} color={theme.colors.muted} />
        </Pressable>
      )}
    </View>
  )

  const renderDropzone = () => (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={placeholder ?? 'Upload files'}
    >
      <Animated.View
        style={[styles.dropzone, disabled && styles.disabled, buttonAnimStyle]}
      >
        <View style={styles.dropzoneIcon}>
          <Ionicons name="cloud-upload-outline" size={28} color={theme.colors.primary} />
        </View>
        <Text variant="label" style={styles.dropzoneTitle}>
          {placeholder ?? 'Tap to upload files'}
        </Text>
        <Text variant="caption" style={styles.dropzoneSubtitle}>
          {[
            acceptLabel && `Accepts: ${acceptLabel}`,
            maxSizeLabel && `Max size: ${maxSizeLabel}`,
            maxFiles != null && `Max ${maxFiles} file${maxFiles !== 1 ? 's' : ''}`,
          ]
            .filter(Boolean)
            .join(' \u2022 ') || 'Any file type'}
        </Text>
        <View style={styles.browseButton}>
          <Text variant="caption" style={styles.browseLabel}>
            Browse Files
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  )

  const renderButton = () => (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={placeholder ?? 'Upload files'}
    >
      <Animated.View
        style={[styles.buttonVariant, disabled && styles.disabled, buttonAnimStyle]}
      >
        <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.foreground} />
        <Text variant="label" style={styles.buttonLabel}>
          {placeholder ?? 'Upload Files'}
        </Text>
      </Animated.View>
    </Pressable>
  )

  const renderCompact = () => (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.compactVariant, disabled && styles.disabled]}
      accessibilityRole="button"
      accessibilityLabel={placeholder ?? 'Upload files'}
    >
      <View style={styles.compactIcon}>
        <Ionicons name="attach-outline" size={18} color={theme.colors.primary} />
      </View>
      <Text variant="body" style={{ color: theme.colors.primary, ...fontStyle(theme.typography, 'medium'), fontSize: 14 }}>
        {placeholder ?? 'Attach file'}
      </Text>
    </Pressable>
  )

  return (
    <View style={style} {...rest}>
      {variant === 'dropzone' && renderDropzone()}
      {variant === 'button' && renderButton()}
      {variant === 'compact' && renderCompact()}
      {showPreview && files.length > 0 && (
        <View style={styles.fileList}>{files.map(renderFileItem)}</View>
      )}
    </View>
  )
}
