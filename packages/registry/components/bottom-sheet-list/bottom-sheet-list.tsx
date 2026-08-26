// native-mate: bottom-sheet-list@0.1.0 | hash:PLACEHOLDER
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
  View,
  Pressable,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
  FadeIn,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, Separator, makeStyles, fontStyle } from '@native-mate/core'
import type { BottomSheetListProps, BottomSheetListItem } from './bottom-sheet-list.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const SPRING = { damping: 20, stiffness: 220, mass: 0.8 }

const useStyles = makeStyles((theme) => ({
  fill: { ...StyleSheet.absoluteFillObject },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  titleRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.surface,
  },
  searchIcon: {
    position: 'absolute',
    left: 28,
    top: Platform.OS === 'ios' ? 10 : 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    minHeight: 52,
  },
  selectedItem: {
    backgroundColor: theme.colors.primary + '10',
  },
  itemContent: {
    flex: 1,
    gap: 1,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 8,
  },
  confirmRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

// ── BottomSheetList ──────────────────────────────────────────────────────────

export const BottomSheetList: React.FC<BottomSheetListProps> = ({
  visible,
  onClose,
  items,
  onSelect,
  searchable = false,
  searchPlaceholder = 'Search...',
  title,
  multiSelect = false,
  selectedValues = [],
  emptyMessage = 'No results found',
  height = 460,
  showConfirmButton = true,
  confirmLabel = 'Done',
  haptic = true,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const [modalOpen, setModalOpen] = useState(visible)
  const [search, setSearch] = useState('')
  const [localSelected, setLocalSelected] = useState<string[]>(selectedValues)

  const translateY = useSharedValue(height)
  const backdropOpacity = useSharedValue(0)
  const bottomOffset = useSharedValue(0)

  // Sync localSelected with prop
  useEffect(() => {
    setLocalSelected(selectedValues)
  }, [selectedValues])

  const runShow = useCallback(() => {
    backdropOpacity.value = withTiming(1, { duration: 220 })
    translateY.value = withSpring(0, SPRING)
  }, [height])

  const runHide = useCallback(
    (cb?: () => void) => {
      backdropOpacity.value = withTiming(0, { duration: 220 })
      translateY.value = withTiming(
        height,
        { duration: 260, easing: Easing.in(Easing.cubic) },
        () => {
          runOnJS(setModalOpen)(false)
          if (cb) runOnJS(cb)()
        }
      )
    },
    [height]
  )

  useEffect(() => {
    if (visible) {
      setModalOpen(true)
      setSearch('')
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
    const onHide = Keyboard.addListener(hideEvent, () => {
      bottomOffset.value = withTiming(0, { duration: 250 })
    })
    return () => {
      onShow.remove()
      onHide.remove()
    }
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false)
    )
  }, [items, search])

  const handleItemPress = useCallback(
    (value: string) => {
      if (haptic && Haptics) Haptics.selectionAsync()

      if (multiSelect) {
        setLocalSelected((prev) => {
          const next = prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
          return next
        })
      } else {
        onSelect(value)
        runHide(onClose)
      }
    },
    [multiSelect, haptic, onSelect, onClose]
  )

  const handleConfirm = useCallback(() => {
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    localSelected.forEach((v) => onSelect(v))
    runHide(onClose)
  }, [localSelected, onSelect, haptic, onClose])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    bottom: bottomOffset.value,
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const isSelected = (value: string) =>
    multiSelect ? localSelected.includes(value) : selectedValues.includes(value)

  const renderItem = useCallback(
    ({ item }: { item: BottomSheetListItem }) => {
      const selected = isSelected(item.value)
      const isDisabled = item.disabled ?? false

      return (
        <Pressable
          style={[
            styles.itemRow,
            selected && styles.selectedItem,
            { opacity: isDisabled ? 0.4 : 1 },
          ]}
          onPress={() => !isDisabled && handleItemPress(item.value)}
          disabled={isDisabled}
          accessibilityRole={multiSelect ? 'checkbox' : 'button'}
          accessibilityState={{
            checked: multiSelect ? selected : undefined,
            selected: !multiSelect ? selected : undefined,
            disabled: isDisabled,
          }}
          accessibilityLabel={`${item.label}${item.description ? `, ${item.description}` : ''}`}
        >
          {item.icon && (
            <View style={{ opacity: selected ? 1 : 0.6 }}>{item.icon}</View>
          )}

          <View style={styles.itemContent}>
            <Text
              style={{
                fontSize: 15,
                ...fontStyle(theme.typography, selected ? 'semibold' : 'regular'),
                color: theme.colors.foreground,
              }}
              numberOfLines={1}
            >
              {item.label}
            </Text>
            {item.description && (
              <Text
                style={{
                  fontSize: 13,
                  color: theme.colors.muted,
                }}
                numberOfLines={1}
              >
                {item.description}
              </Text>
            )}
          </View>

          {selected && (
            <View
              style={[
                styles.checkContainer,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Ionicons name="checkmark" size={16} color={theme.colors.onPrimary} />
            </View>
          )}
        </Pressable>
      )
    },
    [handleItemPress, multiSelect, selectedValues, localSelected, theme]
  )

  if (!modalOpen) return null

  return (
    <Modal
      visible={modalOpen}
      transparent
      animationType="none"
      onRequestClose={() => runHide(onClose)}
      statusBarTranslucent
    >
      <View style={styles.fill}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => runHide(onClose)}
        />

        <Animated.View
          style={[styles.sheet, { height }, animatedStyle, style]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Title */}
          {title != null && (
            <>
              <View style={styles.titleRow}>
                <Text variant="heading">{title}</Text>
                {multiSelect && (
                  <Text
                    variant="caption"
                    style={{ color: theme.colors.primary }}
                  >
                    {localSelected.length} selected
                  </Text>
                )}
              </View>
              <Separator />
            </>
          )}

          {/* Search */}
          {searchable && (
            <View style={styles.searchContainer}>
              <TextInput
                style={[
                  styles.searchInput,
                  { paddingLeft: 36 },
                ]}
                placeholder={searchPlaceholder}
                placeholderTextColor={theme.colors.muted}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                accessibilityLabel="Search list items"
              />
              <View style={styles.searchIcon} pointerEvents="none">
                <Ionicons
                  name="search"
                  size={16}
                  color={theme.colors.muted}
                />
              </View>
            </View>
          )}

          {/* List */}
          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <Separator />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="search-outline"
                  size={32}
                  color={theme.colors.muted}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.muted,
                    textAlign: 'center',
                  }}
                >
                  {emptyMessage}
                </Text>
              </View>
            }
            style={{ flex: 1 }}
          />

          {/* Confirm button for multi-select */}
          {multiSelect && showConfirmButton && (
            <View style={styles.confirmRow}>
              <Pressable
                style={styles.confirmButton}
                onPress={handleConfirm}
                accessibilityRole="button"
                accessibilityLabel={confirmLabel}
              >
                <Text
                  style={{
                    fontSize: 15,
                    ...fontStyle(theme.typography, 'semibold'),
                    color: theme.colors.onPrimary,
                  }}
                >
                  {confirmLabel}
                </Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}
