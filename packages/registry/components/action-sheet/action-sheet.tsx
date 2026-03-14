// native-mate: action-sheet@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { View, Pressable, Modal } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated'
import { makeStyles, Text, useTheme } from '@native-mate/core'
import type { ActionSheetProps } from './action-sheet.types'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingBottom: 34, // safe area
    overflow: 'hidden',
  },
  header: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    minHeight: 52,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
  },
  cancelBtn: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
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
  const translateY = useSharedValue(400)
  const opacity = useSharedValue(0)

  React.useEffect(() => {
    if (isOpen) {
      opacity.value = withTiming(1, { duration: theme.animation.speed.fast })
      translateY.value = withSpring(0, theme.animation.easing.spring)
    } else {
      opacity.value = withTiming(0, { duration: theme.animation.speed.fast })
      translateY.value = withSpring(400, theme.animation.easing.spring)
    }
  }, [isOpen])

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: theme.animation.speed.fast })
    translateY.value = withSpring(400, theme.animation.easing.spring, () => runOnJS(onClose)())
  }

  if (!isOpen && translateY.value === 400) return null

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={{ flex: 1 }} onPress={handleClose} />
        <Animated.View style={[styles.sheet, sheetStyle]}>
          {(title || message) && (
            <View style={styles.header}>
              {title && <Text weight="semibold" size="sm" color={theme.colors.mutedForeground}>{title}</Text>}
              {message && <Text size="sm" color={theme.colors.mutedForeground} style={{ textAlign: 'center', marginTop: 2 }}>{message}</Text>}
            </View>
          )}
          {actions.map((action, i) => (
            <React.Fragment key={action.label}>
              {i > 0 && <View style={styles.separator} />}
              <Pressable
                style={styles.actionRow}
                onPress={() => { handleClose(); action.onPress() }}
                disabled={action.disabled}
                accessibilityRole="button"
              >
                {action.icon}
                <Text
                  size="md"
                  weight={action.variant === 'destructive' ? 'semibold' : 'regular'}
                  style={{
                    color: action.variant === 'destructive' ? theme.colors.destructive : theme.colors.foreground,
                    opacity: action.disabled ? 0.4 : 1,
                    flex: 1,
                  }}
                >
                  {action.label}
                </Text>
              </Pressable>
            </React.Fragment>
          ))}
          <View style={styles.cancelBtn}>
            <Pressable onPress={handleClose} style={{ width: '100%', alignItems: 'center', paddingVertical: 4 }}>
              <Text weight="semibold" size="md">{cancelLabel}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}
