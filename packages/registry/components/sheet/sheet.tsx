// native-mate: sheet@0.1.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { Modal, View, Pressable, StyleSheet, Keyboard, Platform } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from 'react-native-reanimated'
import { useTheme, Text, Separator, makeStyles } from '@native-mate/core'
import type { SheetProps } from './sheet.types'

const useStyles = makeStyles((theme) => ({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface ?? '#1c1c1e',
    borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl,
    paddingBottom: 32,
  },
  handle: { width: 36, height: 4, borderRadius: theme.radius.full, backgroundColor: theme.colors.border, alignSelf: 'center', marginTop: theme.spacing.sm, marginBottom: theme.spacing.sm },
  title: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.sm },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
}))

export const Sheet: React.FC<SheetProps> = ({ visible, onClose, snapPoints = [400], children, title }) => {
  const theme = useTheme()
  const styles = useStyles()
  const translateY = useSharedValue(snapPoints[0])
  const bottomOffset = useSharedValue(0)

  // Slide in/out animation
  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) })
    } else {
      translateY.value = withTiming(snapPoints[0], { duration: 280, easing: Easing.in(Easing.cubic) })
    }
  }, [visible])

  // Lift sheet above keyboard — works inside a Modal because we directly move the view
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const onShow = Keyboard.addListener(showEvent, (e) => {
      const kbHeight = e.endCoordinates.height
      const duration = (e as any).duration ?? 250
      bottomOffset.value = withTiming(kbHeight, { duration })
    })
    const onHide = Keyboard.addListener(hideEvent, (e) => {
      const duration = (e as any).duration ?? 250
      bottomOffset.value = withTiming(0, { duration })
    })

    return () => {
      onShow.remove()
      onHide.remove()
    }
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    bottom: bottomOffset.value,
  }))

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.sheet, { height: snapPoints[0] }, animatedStyle]}>
        <View style={styles.handle} />
        {title && (
          <>
            <View style={styles.title}><Text variant="heading">{title}</Text></View>
            <Separator />
          </>
        )}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Modal>
  )
}
