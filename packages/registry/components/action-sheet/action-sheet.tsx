// native-mate: action-sheet@0.2.0 | hash:PLACEHOLDER
import React, { useState } from 'react'
import { View, Pressable, Modal, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { makeStyles, Text, useTheme } from '@native-mate/core'
import type { ActionSheetProps } from './action-sheet.types'

const useStyles = makeStyles((theme) => ({
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingBottom: 34,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: theme.colors.border + '50',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
    gap: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    minHeight: 52,
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
  },
  cancelWrap: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border + '50',
  },
  cancelRow: {
    alignItems: 'center',
    paddingVertical: 14,
  },
}))

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  title,
  message,
  actions,
  cancelLabel = 'Cancel',
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [modalOpen, setModalOpen] = useState(isOpen)

  const translateY = useSharedValue(500)
  const backdropOpacity = useSharedValue(0)

  React.useEffect(() => {
    if (isOpen) {
      setModalOpen(true)
      backdropOpacity.value = withTiming(1, { duration: 200 })
      translateY.value = withSpring(0, { damping: 22, stiffness: 260 })
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 })
      translateY.value = withTiming(500, { duration: 260 }, () => {
        runOnJS(setModalOpen)(false)
      })
    }
  }, [isOpen])

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }))
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }))

  const handleClose = () => {
    backdropOpacity.value = withTiming(0, { duration: 200 })
    translateY.value = withTiming(500, { duration: 260 }, () => {
      runOnJS(onClose)()
    })
  }

  return (
    <Modal
      visible={modalOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.fill, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.handle} />

          {(title != null || message != null) && (
            <View style={styles.header}>
              {title != null && (
                <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.muted }}>
                  {title}
                </Text>
              )}
              {message != null && (
                <Text style={{ fontSize: 13, color: theme.colors.muted, textAlign: 'center' }}>
                  {message}
                </Text>
              )}
            </View>
          )}

          {actions.map((action, i) => (
            <React.Fragment key={action.label}>
              {i > 0 && <View style={styles.sep} />}
              <Pressable
                style={({ pressed }) => [styles.actionRow, { opacity: pressed || action.disabled ? 0.55 : 1 }]}
                onPress={() => { handleClose(); action.onPress() }}
                disabled={action.disabled}
                android_ripple={{ color: theme.colors.border + '40' }}
                accessibilityRole="button"
              >
                {action.icon != null && <View style={{ opacity: action.disabled ? 0.4 : 1 }}>{action.icon}</View>}
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: action.variant === 'destructive' ? '600' : '400',
                    color: action.variant === 'destructive'
                      ? theme.colors.destructive
                      : theme.colors.foreground,
                    opacity: action.disabled ? 0.4 : 1,
                  }}
                >
                  {action.label}
                </Text>
                {action.variant === 'destructive' && (
                  <Ionicons name="trash-outline" size={18} color={theme.colors.destructive} style={{ opacity: 0.7 }} />
                )}
              </Pressable>
            </React.Fragment>
          ))}

          <View style={styles.cancelWrap}>
            <Pressable
              style={({ pressed }) => [styles.cancelRow, { opacity: pressed ? 0.7 : 1 }]}
              onPress={handleClose}
              android_ripple={{ color: theme.colors.border + '40' }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.foreground }}>
                {cancelLabel}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}
