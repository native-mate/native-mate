// native-mate: breadcrumb@0.1.0 | hash:PLACEHOLDER
import React, { useCallback, useMemo } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { BreadcrumbProps, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbSize } from './breadcrumb.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeTokens: Record<BreadcrumbSize, { fontSize: number; iconSize: number; gap: number; padding: number }> = {
  sm: { fontSize: 12, iconSize: 12, gap: 4, padding: 4 },
  md: { fontSize: 14, iconSize: 14, gap: 6, padding: 6 },
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemLabel: {
    color: theme.colors.muted,
    fontWeight: '400',
  },
  itemLabelActive: {
    color: theme.colors.foreground,
    fontWeight: '600',
  },
  itemLabelPressable: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  separator: {
    color: theme.colors.muted,
  },
  ellipsis: {
    color: theme.colors.muted,
    fontWeight: '500',
  },
}))

function SeparatorIcon({
  type,
  size,
}: {
  type: BreadcrumbSeparator
  size: BreadcrumbSize
}) {
  const theme = useTheme()
  const styles = useStyles()
  const tokens = sizeTokens[size]

  if (type === 'chevron') {
    return (
      <Ionicons
        name="chevron-forward"
        size={tokens.iconSize}
        color={theme.colors.muted}
      />
    )
  }

  if (type === 'slash') {
    return (
      <Text variant="caption" style={[styles.separator, { fontSize: tokens.fontSize }]}>
        /
      </Text>
    )
  }

  if (type === 'dot') {
    return (
      <Text variant="caption" style={[styles.separator, { fontSize: tokens.fontSize }]}>
        {'\u00B7'}
      </Text>
    )
  }

  // Custom string separator
  return (
    <Text variant="caption" style={[styles.separator, { fontSize: tokens.fontSize }]}>
      {type}
    </Text>
  )
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = 'chevron',
  maxItems,
  size = 'md',
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const tokens = sizeTokens[size]

  const displayItems = useMemo((): (BreadcrumbItem | 'ellipsis')[] => {
    if (maxItems == null || items.length <= maxItems) {
      return items
    }
    // Show first, ellipsis, and last (maxItems - 1) items
    const firstCount = 1
    const lastCount = maxItems - firstCount - 1
    const result: (BreadcrumbItem | 'ellipsis')[] = [
      items[0],
      'ellipsis',
      ...items.slice(items.length - lastCount),
    ]
    return result
  }, [items, maxItems])

  const handleItemPress = useCallback(
    (item: BreadcrumbItem) => {
      if (haptic && Haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      item.onPress?.()
    },
    [haptic],
  )

  return (
    <View
      style={[styles.container, { gap: tokens.gap }, style]}
      accessibilityRole="navigation"
      accessibilityLabel="Breadcrumb"
      {...rest}
    >
      {displayItems.map((item, i) => {
        const isLast = i === displayItems.length - 1

        if (item === 'ellipsis') {
          return (
            <React.Fragment key="ellipsis">
              <Text
                variant="caption"
                style={[styles.ellipsis, { fontSize: tokens.fontSize }]}
              >
                ...
              </Text>
              {!isLast && (
                <SeparatorIcon type={separator} size={size} />
              )}
            </React.Fragment>
          )
        }

        const breadcrumbItem = item as BreadcrumbItem
        const hasPressHandler = breadcrumbItem.onPress != null && !isLast

        return (
          <React.Fragment key={i}>
            {hasPressHandler ? (
              <Pressable
                onPress={() => handleItemPress(breadcrumbItem)}
                style={[styles.itemButton, { paddingVertical: tokens.padding }]}
                accessibilityRole="link"
                accessibilityLabel={breadcrumbItem.label}
              >
                {breadcrumbItem.icon != null && (
                  <Ionicons
                    name={breadcrumbItem.icon as any}
                    size={tokens.iconSize}
                    color={theme.colors.primary}
                  />
                )}
                <Text
                  variant="body"
                  style={[styles.itemLabelPressable, { fontSize: tokens.fontSize }]}
                  numberOfLines={1}
                >
                  {breadcrumbItem.label}
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.itemButton, { paddingVertical: tokens.padding }]}>
                {breadcrumbItem.icon != null && (
                  <Ionicons
                    name={breadcrumbItem.icon as any}
                    size={tokens.iconSize}
                    color={isLast ? theme.colors.foreground : theme.colors.muted}
                  />
                )}
                <Text
                  variant="body"
                  style={[
                    isLast ? styles.itemLabelActive : styles.itemLabel,
                    { fontSize: tokens.fontSize },
                  ]}
                  numberOfLines={1}
                >
                  {breadcrumbItem.label}
                </Text>
              </View>
            )}
            {!isLast && <SeparatorIcon type={separator} size={size} />}
          </React.Fragment>
        )
      })}
    </View>
  )
}
