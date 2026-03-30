// native-mate: carousel@0.1.0 | hash:PLACEHOLDER
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { View, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { useTheme, makeStyles } from '@native-mate/core'
import type { CarouselProps, PaginationPosition } from './carousel.types'

const SCREEN_WIDTH = Dimensions.get('window').width

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
  },
  paginationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: theme.spacing.sm,
  },
}))

const PaginationDot: React.FC<{
  index: number
  activeIndex: number
  activeColor: string
  inactiveColor: string
}> = ({ index, activeIndex, activeColor, inactiveColor }) => {
  const isActive = index === activeIndex
  const width = useSharedValue(isActive ? 20 : 6)
  const opacity = useSharedValue(isActive ? 1 : 0.4)

  useEffect(() => {
    width.value = withSpring(isActive ? 20 : 6, { damping: 16, stiffness: 220 })
    opacity.value = withSpring(isActive ? 1 : 0.4, { damping: 16, stiffness: 220 })
  }, [isActive])

  const animStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        {
          height: 6,
          borderRadius: 3,
          backgroundColor: isActive ? activeColor : inactiveColor,
        },
        animStyle,
      ]}
    />
  )
}

export function Carousel<T>({
  data,
  renderItem,
  itemWidth,
  gap = 12,
  showPagination = true,
  paginationPosition = 'bottom',
  autoPlay = false,
  autoPlayInterval = 3000,
  loop = false,
  onIndexChange,
  initialIndex = 0,
  contentInset = 24,
  style,
}: CarouselProps<T>) {
  const theme = useTheme()
  const styles = useStyles()
  const scrollRef = useRef<ScrollView>(null)
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resolvedItemWidth = itemWidth ?? SCREEN_WIDTH - contentInset * 2
  const snapInterval = resolvedItemWidth + gap

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / snapInterval)
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1))
    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex)
      onIndexChange?.(clampedIndex)
    }
  }, [snapInterval, data.length, activeIndex, onIndexChange])

  // Auto-play
  useEffect(() => {
    if (!autoPlay || data.length <= 1) return

    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1
        if (next >= data.length) {
          if (loop) {
            scrollRef.current?.scrollTo({ x: 0, animated: true })
            return 0
          }
          // Scroll back to start
          scrollRef.current?.scrollTo({ x: 0, animated: true })
          return 0
        }
        scrollRef.current?.scrollTo({ x: next * snapInterval, animated: true })
        return next
      })
    }, autoPlayInterval)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [autoPlay, autoPlayInterval, data.length, loop, snapInterval])

  // Pause auto-play on interaction
  const handleScrollBeginDrag = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
  }, [])

  const pagination = showPagination && data.length > 1 && (
    <View style={styles.paginationWrap}>
      {data.map((_, i) => (
        <PaginationDot
          key={i}
          index={i}
          activeIndex={activeIndex}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.muted}
        />
      ))}
    </View>
  )

  return (
    <View style={[styles.container, style]}>
      {paginationPosition === 'top' && pagination}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: contentInset,
          gap,
        }}
        accessibilityRole="adjustable"
        accessibilityLabel={`Carousel, item ${activeIndex + 1} of ${data.length}`}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={{ width: resolvedItemWidth }}
          >
            {renderItem(item, index)}
          </View>
        ))}
      </ScrollView>

      {paginationPosition === 'bottom' && pagination}
    </View>
  )
}
