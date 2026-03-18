// native-mate: card@0.2.0 | hash:PLACEHOLDER
import React from 'react'
import { View, Pressable, Image } from 'react-native'
import { useTheme, Text, Separator, makeStyles, shadow } from '@native-mate/core'
import { Skeleton } from '../skeleton/skeleton'
import type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps } from './card.types'

const useStyles = makeStyles((theme) => ({
  elevated: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...shadow(3),
  },
  outline: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  flat: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  skeletonWrap: {
    padding: 16,
    gap: 10,
  },
}))

const padMap: Record<string, number> = { none: 0, sm: 8, md: 16, lg: 24 }

// ─── Sub-components ──────────────────────────────────────────────────────────

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, trailing, style }) => {
  const styles = useStyles()
  return (
    <View style={[styles.header, style]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="label">{title}</Text>
        {subtitle && <Text variant="caption" muted>{subtitle}</Text>}
      </View>
      {trailing != null && <View>{trailing}</View>}
    </View>
  )
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  const styles = useStyles()
  return <View style={[styles.content, style]}>{children}</View>
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, separated = false, style }) => {
  const styles = useStyles()
  return (
    <>
      {separated && <Separator />}
      <View style={[styles.footer, style]}>{children}</View>
    </>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'none',
  loading = false,
  onPress,
  image,
  imageHeight = 180,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const containerStyle = [styles[variant], style]
  const pad = padMap[padding ?? 'none']

  const inner = loading ? (
    <View style={styles.skeletonWrap}>
      <Skeleton width="55%" height={14} />
      <Skeleton width="90%" height={11} />
      <Skeleton width="75%" height={11} />
      <Skeleton width="40%" height={11} />
    </View>
  ) : (
    <>
      {image != null && (
        <Image source={image} style={{ width: '100%', height: imageHeight }} resizeMode="cover" />
      )}
      {pad > 0 ? <View style={{ padding: pad }}>{children}</View> : children}
    </>
  )

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [containerStyle, { opacity: pressed ? 0.88 : 1 }]}
        onPress={onPress}
        android_ripple={{ color: theme.colors.border + '60', borderless: false }}
        accessibilityRole="button"
        {...(rest as any)}
      >
        {inner}
      </Pressable>
    )
  }

  return (
    <View style={containerStyle} {...rest}>
      {inner}
    </View>
  )
}
