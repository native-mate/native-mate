// native-mate: sheet@0.2.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { Modal, View, Pressable, StyleSheet, Keyboard, Platform } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS, Easing,
} from 'react-native-reanimated'
import { useTheme, Text, Separator, makeStyles } from '@native-mate/core'
import type { SheetProps } from './sheet.types'

const useStyles = makeStyles((theme) => ({
  fill: { ...StyleSheet.absoluteFillObject },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border + '50',
    overflow: 'hidden',
  },
  handle: {
    width: 36, height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: 10, marginBottom: 6,
  },
  titleRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 4,
  },
}))

export const Sheet: React.FC<SheetProps> = ({
  visible,
  onClose,
  height = 400,
  children,
  title,
  showHandle = true,
  closeOnBackdrop = true,
  animation = 'slide',
  padding = 16,
  snapPoints,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  // Support legacy snapPoints prop
  const sheetHeight = snapPoints?.[0] ?? height

  const [modalOpen, setModalOpen] = React.useState(visible)
  const translateY = useSharedValue(sheetHeight)
  const backdropOpacity = useSharedValue(0)
  const sheetScale = useSharedValue(animation === 'fade' ? 0.97 : 1)
  const bottomOffset = useSharedValue(0)

  const runShow = () => {
    backdropOpacity.value = withTiming(1, { duration: 220 })
    if (animation === 'spring') {
      sheetScale.value = 1
      translateY.value = withSpring(0, { damping: 20, stiffness: 220, mass: 0.8 })
    } else if (animation === 'fade') {
      sheetScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
      translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) })
    } else {
      // slide (default)
      sheetScale.value = 1
      translateY.value = withTiming(0, { duration: 360, easing: Easing.out(Easing.cubic) })
    }
  }

  const runHide = (cb?: () => void) => {
    backdropOpacity.value = withTiming(0, { duration: 220 })
    if (animation === 'fade') {
      sheetScale.value = withTiming(0.97, { duration: 240 })
    }
    translateY.value = withTiming(sheetHeight, { duration: 260, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(setModalOpen)(false)
      if (cb) runOnJS(cb)()
    })
  }

  useEffect(() => {
    if (visible) {
      setModalOpen(true)
      // slight delay so modal has time to mount
      const t = setTimeout(runShow, 10)
      return () => clearTimeout(t)
    } else {
      runHide()
    }
  }, [visible])

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const onShow = Keyboard.addListener(showEvent, (e) => {
      bottomOffset.value = withTiming(e.endCoordinates.height, { duration: (e as any).duration ?? 250 })
    })
    const onHide = Keyboard.addListener(hideEvent, (e) => {
      bottomOffset.value = withTiming(0, { duration: (e as any).duration ?? 250 })
    })
    return () => { onShow.remove(); onHide.remove() }
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: sheetScale.value },
    ],
    bottom: bottomOffset.value,
  }))

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }))

  return (
    <Modal visible={modalOpen} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.fill}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
        {closeOnBackdrop && (
          <Pressable style={StyleSheet.absoluteFill} onPress={() => runHide(onClose)} />
        )}
        <Animated.View style={[styles.sheet, { height: sheetHeight }, animatedStyle]}>
          {showHandle && <View style={styles.handle} />}
          {title != null && (
            <>
              <View style={styles.titleRow}>
                <Text variant="heading">{title}</Text>
              </View>
              <Separator />
            </>
          )}
          <View style={{ flex: 1, paddingHorizontal: padding, paddingTop: title ? 16 : 8 }}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}
