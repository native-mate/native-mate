// native-mate: modal@0.2.0 | hash:PLACEHOLDER
import React, { useState, useEffect } from 'react'
import { Modal as RNModal, View, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, Separator, makeStyles } from '@native-mate/core'
import type { ModalProps, ModalAction } from './modal.types'

const sizeMap: Record<string, number | string> = {
  sm: 320, md: 420, lg: 600, fullscreen: '100%',
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  container: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border + '60',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  headerText: { flex: 1, gap: 4 },
  content: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  actionBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
}))

function ActionButton({ action, theme, styles }: { action: ModalAction; theme: any; styles: any }) {
  const isPrimary = action.variant === 'primary'
  const isDestructive = action.variant === 'destructive'
  const bg = isPrimary
    ? theme.colors.primary
    : isDestructive
      ? theme.colors.destructive
      : theme.colors.surface
  const color = isPrimary
    ? (theme.colors.onPrimary ?? '#fff')
    : isDestructive
      ? (theme.colors.onDestructive ?? '#fff')
      : theme.colors.foreground

  return (
    <Pressable
      onPress={action.onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        { backgroundColor: bg, opacity: pressed ? 0.8 : 1 },
        !isPrimary && !isDestructive && { borderWidth: 1, borderColor: theme.colors.border },
      ]}
    >
      <Text style={{ color, fontSize: 14, fontWeight: '600' }}>{action.label}</Text>
    </Pressable>
  )
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  description,
  children,
  size = 'md',
  actions,
  dismissible = true,
  showCloseButton = true,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [modalOpen, setModalOpen] = useState(visible)

  const scale = useSharedValue(0.94)
  const opacity = useSharedValue(0)
  const backdropOpacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      setModalOpen(true)
      scale.value = withSpring(1, theme.animation.easing.spring)
      opacity.value = withTiming(1, { duration: 180 })
      backdropOpacity.value = withTiming(1, { duration: 200 })
    } else {
      scale.value = withSpring(0.94, theme.animation.easing.spring)
      backdropOpacity.value = withTiming(0, { duration: 180 })
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(setModalOpen)(false)
      })
    }
  }, [visible])

  const containerAnim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const backdropAnim = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const maxWidth = sizeMap[size]
  const hasHeader = title != null || description != null || showCloseButton
  const hasFooter = actions != null && actions.length > 0

  return (
    <RNModal
      visible={modalOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissible ? onClose : undefined}
    >
      <Animated.View style={[styles.backdrop, backdropAnim]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismissible ? onClose : undefined} />

        <Animated.View style={[styles.container, { width: maxWidth as any }, containerAnim]}>
          {/* Stop inner press from dismissing */}
          <Pressable onPress={() => {}}>
            {hasHeader && (
              <>
                <View style={styles.header}>
                  <View style={styles.headerText}>
                    {title != null && <Text variant="heading">{title}</Text>}
                    {description != null && (
                      <Text variant="body" muted style={{ fontSize: 13 }}>{description}</Text>
                    )}
                  </View>
                  {showCloseButton && (
                    <Pressable onPress={onClose} hitSlop={8} style={{ marginTop: 2 }}>
                      <Ionicons name="close" size={20} color={theme.colors.muted} />
                    </Pressable>
                  )}
                </View>
                {children != null && <Separator />}
              </>
            )}

            {children != null && (
              <View style={styles.content}>{children}</View>
            )}

            {hasFooter && (
              <>
                <Separator />
                <View style={styles.footer}>
                  {actions!.map((a) => (
                    <ActionButton key={a.label} action={a} theme={theme} styles={styles} />
                  ))}
                </View>
              </>
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </RNModal>
  )
}
