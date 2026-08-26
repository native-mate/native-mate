// native-mate: infinite-scroll@0.1.0 | hash:PLACEHOLDER
import React, { useCallback, useRef } from 'react'
import { View, FlatList, ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles, Spinner, fontStyle } from '@native-mate/core'
import type { InfiniteScrollProps } from './infinite-scroll.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  },
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 12,
  },
  endMessage: {
    paddingVertical: 16,
    alignItems: 'center',
  },
}))

// ── Footer loading indicator ─────────────────────────────────────────────────

interface FooterProps {
  loading: boolean
  hasMore: boolean
  endMessage?: string
  loadingIndicator?: React.ReactNode
}

const ListFooter: React.FC<FooterProps> = ({
  loading,
  hasMore,
  endMessage,
  loadingIndicator,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  if (loading) {
    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        style={styles.footerContainer}
      >
        {loadingIndicator ?? (
          <>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text
              variant="caption"
              style={{ color: theme.colors.muted, fontSize: 12 }}
            >
              Loading more...
            </Text>
          </>
        )}
      </Animated.View>
    )
  }

  if (!hasMore && endMessage) {
    return (
      <View style={styles.endMessage}>
        <Text
          variant="caption"
          style={{ color: theme.colors.muted, fontSize: 12 }}
        >
          {endMessage}
        </Text>
      </View>
    )
  }

  return null
}

// ── Default empty component ──────────────────────────────────────────────────

const DefaultEmpty: React.FC = () => {
  const theme = useTheme()
  const styles = useStyles()

  return (
    <View style={styles.emptyContainer}>
      <Text
        style={{
          fontSize: 16,
          ...fontStyle(theme.typography, 'semibold'),
          color: theme.colors.foreground,
        }}
      >
        No items yet
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.colors.muted,
          textAlign: 'center',
        }}
      >
        Pull down to refresh or check back later.
      </Text>
    </View>
  )
}

// ── InfiniteScroll ───────────────────────────────────────────────────────────

export function InfiniteScroll<T>({
  data,
  renderItem,
  onLoadMore,
  hasMore,
  loading,
  keyExtractor,
  ListHeaderComponent,
  ListEmptyComponent,
  ItemSeparatorComponent,
  threshold = 200,
  loadingIndicator,
  endMessage,
  haptic = false,
  numColumns = 1,
  style,
  contentContainerStyle,
}: InfiniteScrollProps<T>) {
  const theme = useTheme()
  const styles = useStyles()

  const loadingRef = useRef(loading)
  loadingRef.current = loading
  const hasMoreRef = useRef(hasMore)
  hasMoreRef.current = hasMore
  const hasTriggeredRef = useRef(false)

  // Reset trigger flag when loading completes
  React.useEffect(() => {
    if (!loading) {
      hasTriggeredRef.current = false
    }
  }, [loading])

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent
      const distanceFromBottom =
        contentSize.height - layoutMeasurement.height - contentOffset.y

      if (
        distanceFromBottom <= threshold &&
        hasMoreRef.current &&
        !loadingRef.current &&
        !hasTriggeredRef.current
      ) {
        hasTriggeredRef.current = true
        if (haptic && Haptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        onLoadMore()
      }
    },
    [threshold, haptic, onLoadMore]
  )

  const handleEndReached = useCallback(() => {
    if (hasMore && !loading && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true
      if (haptic && Haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      onLoadMore()
    }
  }, [hasMore, loading, haptic, onLoadMore])

  const renderFlatItem = useCallback(
    ({ item, index }: { item: T; index: number }) => (
      <View>{renderItem({ item, index })}</View>
    ),
    [renderItem]
  )

  const defaultKeyExtractor = useCallback(
    (_: T, index: number) => String(index),
    []
  )

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={data}
        renderItem={renderFlatItem}
        keyExtractor={keyExtractor ?? defaultKeyExtractor}
        numColumns={numColumns}
        ListHeaderComponent={ListHeaderComponent ? <>{ListHeaderComponent}</> : null}
        ListEmptyComponent={
          !loading ? (
            ListEmptyComponent !== undefined ? (
              <>{ListEmptyComponent}</>
            ) : (
              <DefaultEmpty />
            )
          ) : null
        }
        ListFooterComponent={
          <ListFooter
            loading={loading}
            hasMore={hasMore}
            endMessage={endMessage}
            loadingIndicator={loadingIndicator}
          />
        }
        ItemSeparatorComponent={
          ItemSeparatorComponent
            ? () => <>{ItemSeparatorComponent}</>
            : undefined
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={handleEndReached}
        onEndReachedThreshold={threshold / 1000}
        contentContainerStyle={[
          data.length === 0 && { flexGrow: 1 },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={true}
        accessibilityRole="list"
      />
    </View>
  )
}
