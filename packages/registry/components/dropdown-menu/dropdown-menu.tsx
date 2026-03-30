// native-mate: dropdown-menu@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useState, useCallback } from 'react'
import { View, Pressable, Modal, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, shadow } from '@native-mate/core'
import type { DropdownMenuProps, DropdownMenuItem, HapticStyle } from './dropdown-menu.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

interface AnchorRect { x: number; y: number; width: number; height: number }

const useStyles = makeStyles((theme) => ({
  menu: {
    position: 'absolute',
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border + '80',
    overflow: 'hidden',
    minWidth: 180,
    maxWidth: 280,
    ...shadow(6),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
  },
}))

const MenuItem: React.FC<{
  item: DropdownMenuItem
  theme: any
  haptic: HapticStyle
  onClose: () => void
}> = ({ item, theme, haptic, onClose }) => {
  const styles = useStyles()
  const textColor = item.destructive
    ? theme.colors.destructive
    : theme.colors.foreground

  const handlePress = useCallback(() => {
    triggerHaptic(haptic)
    onClose()
    // Small delay to let menu animate out
    setTimeout(() => item.onPress(), 100)
  }, [haptic, item, onClose])

  return (
    <Pressable
      onPress={handlePress}
      disabled={item.disabled}
      accessibilityRole="menuitem"
      accessibilityLabel={item.label}
      accessibilityState={{ disabled: item.disabled }}
      style={({ pressed }) => [
        styles.item,
        pressed && { backgroundColor: theme.colors.surface },
        item.disabled && { opacity: 0.4 },
      ]}
    >
      {item.icon && (
        <Ionicons
          name={item.icon as any}
          size={18}
          color={item.disabled ? theme.colors.muted : textColor}
        />
      )}
      <Text
        style={{
          flex: 1,
          fontSize: 15,
          fontWeight: '500',
          color: item.disabled ? theme.colors.muted : textColor,
        }}
        numberOfLines={1}
      >
        {item.label}
      </Text>
    </Pressable>
  )
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  open: controlledOpen,
  onOpenChange,
  align = 'right',
  haptic = 'light',
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const triggerRef = useRef<View>(null)
  const [anchor, setAnchor] = useState<AnchorRect>({ x: 0, y: 0, width: 0, height: 0 })
  const [internalOpen, setInternalOpen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const isOpen = controlledOpen ?? internalOpen
  const scale = useSharedValue(0.92)
  const opacity = useSharedValue(0)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const openMenu = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setModalVisible(true)
      setInternalOpen(true)
      onOpenChange?.(true)
      triggerHaptic(haptic)
      scale.value = withSpring(1, { damping: 16, stiffness: 260 })
      opacity.value = withTiming(1, { duration: 160 })
    })
  }, [onOpenChange, haptic])

  const closeMenu = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 16, stiffness: 260 })
    opacity.value = withTiming(0, { duration: 120 }, () => {
      runOnJS(setModalVisible)(false)
      runOnJS(setInternalOpen)(false)
    })
    onOpenChange?.(false)
  }, [onOpenChange])

  const toggle = useCallback(() => {
    if (isOpen) closeMenu()
    else openMenu()
  }, [isOpen, openMenu, closeMenu])

  // Position the menu below the trigger
  const menuTop = anchor.y + anchor.height + 4
  const menuStyle: any = { top: menuTop }
  if (align === 'right') {
    menuStyle.right = undefined
    menuStyle.left = anchor.x + anchor.width - 180
    // Clamp to screen
    if (menuStyle.left < 8) menuStyle.left = 8
  } else {
    menuStyle.left = anchor.x
  }

  return (
    <>
      <Pressable
        ref={triggerRef as React.RefObject<View>}
        onPress={toggle}
        style={style}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        accessibilityState={{ expanded: isOpen }}
      >
        {trigger}
      </Pressable>

      {modalVisible && (
        <Modal
          visible
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={closeMenu}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />

          <Animated.View
            style={[styles.menu, menuStyle, animStyle]}
            accessibilityRole="menu"
          >
            {items.map((item, i) => (
              <React.Fragment key={item.key}>
                <MenuItem
                  item={item}
                  theme={theme}
                  haptic={haptic}
                  onClose={closeMenu}
                />
                {item.divider && i < items.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </Animated.View>
        </Modal>
      )}
    </>
  )
}
