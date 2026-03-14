// native-mate: modal@0.1.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { Modal as RNModal, View, Pressable, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'
import { useTheme, Text, Separator, makeStyles } from '@native-mate/core'
import type { ModalProps } from './modal.types'

const sizeMap = { sm: 320, md: 480, lg: 640, fullscreen: '100%' as const }

const useStyles = makeStyles((theme) => ({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  container: { backgroundColor: theme.colors.surfaceRaised, borderRadius: theme.radius.xl, overflow: 'hidden' },
  header: { padding: theme.spacing.lg },
  content: { padding: theme.spacing.lg },
}))

export const Modal: React.FC<ModalProps> = ({ visible, onClose, title, children, size = 'md' }) => {
  const theme = useTheme()
  const styles = useStyles()
  const scale = useSharedValue(0.95)
  const opacity = useSharedValue(0)

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0.95, theme.animation.easing.spring)
    opacity.value = withTiming(visible ? 1 : 0, { duration: theme.animation.speed.fast })
  }, [visible])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }))
  const maxWidth = sizeMap[size]

  return (
    <RNModal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.container, { width: maxWidth }, animatedStyle]}>
          <Pressable onPress={() => {}}>
            {title && (
              <>
                <View style={styles.header}><Text variant="heading">{title}</Text></View>
                <Separator />
              </>
            )}
            <View style={styles.content}>{children}</View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </RNModal>
  )
}
