// native-mate: sheet@0.1.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { Modal, View, Pressable, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated'
import { useTheme, Text, Separator, makeStyles } from '@native-mate/core'
import type { SheetProps } from './sheet.types'

const useStyles = makeStyles((theme) => ({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: theme.colors.surfaceRaised,
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

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : snapPoints[0], theme.animation.easing.spring)
  }, [visible])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }))

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
