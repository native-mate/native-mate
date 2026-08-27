// native-mate: draggable-list@0.1.0 | hash:PLACEHOLDER
import React, { useState, useRef, useCallback } from 'react'
import { View, Pressable, PanResponder } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, useMotion, Text, Separator, makeStyles } from '@native-mate/core'
import type { DraggableListProps } from './draggable-list.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
  },
  dragHandle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  draggingItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    borderRadius: 8,
    zIndex: 999,
  },
}))

// ── DraggableItem ────────────────────────────────────────────────────────────

interface DraggableItemProps<T> {
  item: T
  index: number
  isDragging: boolean
  isBeingDragged: boolean
  dragOffset: number
  itemHeight: number
  dragHandlePosition: 'left' | 'right'
  renderItem: DraggableListProps<T>['renderItem']
  onDragStart: (index: number) => void
  onDragMove: (dy: number) => void
  onDragEnd: () => void
  disabled: boolean
  hapticOnDrag: boolean
}

function DraggableItem<T>({
  item,
  index,
  isDragging,
  isBeingDragged,
  dragOffset,
  itemHeight,
  dragHandlePosition,
  renderItem,
  onDragStart,
  onDragMove,
  onDragEnd,
  disabled,
  hapticOnDrag,
}: DraggableItemProps<T>) {
  const theme = useTheme()
  const motion = useMotion()
  const styles = useStyles()

  const scale = useSharedValue(1)
  const elevation = useSharedValue(0)
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    if (isBeingDragged) {
      scale.value = withSpring(1.03, motion.spring())
      elevation.value = withTiming(12, motion.timing('fast'))
      opacity.value = 1
    } else {
      scale.value = withSpring(1, motion.spring())
      elevation.value = withTiming(0, motion.timing('fast'))
      opacity.value = isDragging ? withTiming(0.7, motion.timing('fast')) : withTiming(1, motion.timing('fast'))
    }
  }, [isBeingDragged, isDragging, motion])

  React.useEffect(() => {
    if (isBeingDragged) {
      translateY.value = dragOffset
    } else {
      translateY.value = withSpring(0, motion.spring())
    }
  }, [dragOffset, isBeingDragged, motion])

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: isBeingDragged ? translateY.value : translateY.value },
    ],
    opacity: opacity.value,
    zIndex: isBeingDragged ? 999 : 0,
  }))

  const grantY = useRef(0)

  const latest = useRef({ disabled, index, onDragStart, onDragMove, onDragEnd, hapticOnDrag })
  latest.current = { disabled, index, onDragStart, onDragMove, onDragEnd, hapticOnDrag }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.disabled,
      onMoveShouldSetPanResponder: (_, gs) => !latest.current.disabled && Math.abs(gs.dy) > 5,
      onPanResponderGrant: () => {
        grantY.current = 0
        if (latest.current.hapticOnDrag && Haptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        }
        latest.current.onDragStart(latest.current.index)
      },
      onPanResponderMove: (_, gs) => {
        latest.current.onDragMove(gs.dy)
      },
      onPanResponderRelease: () => {
        latest.current.onDragEnd()
      },
      onPanResponderTerminate: () => {
        latest.current.onDragEnd()
      },
    })
  ).current

  const handle = (
    <View style={styles.dragHandle} {...panResponder.panHandlers}>
      <Ionicons name="reorder-three" size={22} color={theme.colors.muted} />
    </View>
  )

  return (
    <Animated.View
      style={[
        styles.itemWrapper,
        { minHeight: itemHeight },
        isBeingDragged && styles.draggingItem,
        animStyle,
      ]}
      accessibilityRole="none"
      accessibilityHint="Long press and drag to reorder"
    >
      {dragHandlePosition === 'left' && handle}
      <View style={styles.itemContent}>
        {renderItem({ item, index, isDragging: isBeingDragged })}
      </View>
      {dragHandlePosition === 'right' && handle}
    </Animated.View>
  )
}

// ── DraggableList ────────────────────────────────────────────────────────────

export function DraggableList<T>({
  data,
  renderItem,
  onReorder,
  keyExtractor,
  dragHandlePosition = 'right',
  hapticOnDrag = true,
  itemHeight = 60,
  showSeparator = true,
  disabled = false,
  style,
}: DraggableListProps<T>) {
  const theme = useTheme()
  const styles = useStyles()

  const [items, setItems] = useState(data)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const currentOrderRef = useRef<T[]>(data)

  React.useEffect(() => {
    setItems(data)
    currentOrderRef.current = data
  }, [data])

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
    setDragOffset(0)
  }, [])

  const handleDragMove = useCallback(
    (dy: number) => {
      if (dragIndex === null) return
      setDragOffset(dy)

      const newIndex = Math.round(dragIndex + dy / itemHeight)
      const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex))

      if (clampedIndex !== dragIndex) {
        const newItems = [...currentOrderRef.current]
        const [moved] = newItems.splice(dragIndex, 1)
        newItems.splice(clampedIndex, 0, moved)
        currentOrderRef.current = newItems
        setItems(newItems)
        setDragIndex(clampedIndex)
        setDragOffset(dy - (clampedIndex - dragIndex) * itemHeight)

        if (hapticOnDrag && Haptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
      }
    },
    [dragIndex, items.length, itemHeight, hapticOnDrag]
  )

  const handleDragEnd = useCallback(() => {
    if (dragIndex !== null) {
      onReorder(currentOrderRef.current)
    }
    setDragIndex(null)
    setDragOffset(0)
  }, [dragIndex, onReorder])

  return (
    <View
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
      accessibilityRole="list"
    >
      {items.map((item, i) => (
        <React.Fragment key={keyExtractor(item, i)}>
          <DraggableItem
            item={item}
            index={i}
            isDragging={dragIndex !== null}
            isBeingDragged={dragIndex === i}
            dragOffset={dragIndex === i ? dragOffset : 0}
            itemHeight={itemHeight}
            dragHandlePosition={dragHandlePosition}
            renderItem={renderItem}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            disabled={disabled}
            hapticOnDrag={hapticOnDrag}
          />
          {showSeparator && i < items.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </View>
  )
}
