// native-mate: card@0.3.0 | hash:PLACEHOLDER
import React from 'react'
import { View, Pressable, Image } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useTheme, Text, Separator, makeStyles, shadow } from '@native-mate/core'
import { Skeleton } from '../skeleton/skeleton'
import type { CardProps, CardSize, CardHeaderProps, CardContentProps, CardFooterProps, CardMediaProps } from './card.types'

// `radius` names a theme.radius token so a themed radius scale flows through.
// `md` reproduces the values Card/Header/Content/Footer used to hardcode.
const sizeTokens = {
  sm: { pad: 12, gap: 8,  radius: 'md' as const, headerPad: 12 },
  md: { pad: 16, gap: 10, radius: 'lg' as const, headerPad: 16 },
  lg: { pad: 20, gap: 12, radius: 'xl' as const, headerPad: 20 },
}

const DEFAULT_CARD_SIZE: CardSize = 'md'

/** Lets CardHeader/Content/Footer/Media pick up the enclosing Card's size. */
const CardSizeContext = React.createContext<CardSize>(DEFAULT_CARD_SIZE)

const useCardSize = () => sizeTokens[React.useContext(CardSizeContext)]

const useStyles = makeStyles((theme) => ({
  elevated: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...shadow(2),
  },
  outline: {
    backgroundColor: theme.colors.surface,
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
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  skeletonWrap: {},
}))

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// ─── CardMedia ────────────────────────────────────────────────────────────────

export const CardMedia: React.FC<CardMediaProps> = ({
  source,
  height = 180,
  roundedTop = true,
  style,
}) => {
  const theme = useTheme()
  const radius = theme.radius[useCardSize().radius]
  return (
    <Image
      source={source}
      style={[
        { width: '100%', height },
        roundedTop && { borderTopLeftRadius: radius, borderTopRightRadius: radius },
        style,
      ]}
      resizeMode="cover"
    />
  )
}

// ─── CardHeader ───────────────────────────────────────────────────────────────

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  description,
  leading,
  trailing,
  style,
}) => {
  const t = useCardSize()
  return (
    <View
      style={[
        {
          paddingHorizontal: t.headerPad,
          paddingTop: t.headerPad,
          paddingBottom: description ? t.gap - 2 : t.gap + 2,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {leading != null && <View style={{ flexShrink: 0 }}>{leading}</View>}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="label" style={{ fontSize: 15 }}>{title}</Text>
          {subtitle != null && (
            <Text variant="caption" muted style={{ fontSize: 12 }}>{subtitle}</Text>
          )}
        </View>
        {trailing != null && <View style={{ flexShrink: 0 }}>{trailing}</View>}
      </View>
      {description != null && (
        <Text variant="body" muted style={{ fontSize: 13, marginTop: 8, lineHeight: 20 }}>
          {description}
        </Text>
      )}
    </View>
  )
}

// ─── CardContent ──────────────────────────────────────────────────────────────

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  const t = useCardSize()
  return (
    <View style={[{ paddingHorizontal: t.pad, paddingBottom: t.pad }, style]}>
      {children}
    </View>
  )
}

// ─── CardFooter ───────────────────────────────────────────────────────────────

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  separated = false,
  align = 'left',
  style,
}) => {
  const t = useCardSize()
  const justifyContent =
    align === 'right' ? 'flex-end' :
    align === 'apart' ? 'space-between' :
    'flex-start'

  return (
    <>
      {separated && <Separator />}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent,
            paddingHorizontal: t.pad,
            paddingVertical: t.gap + 2,
            gap: 8,
          },
          style,
        ]}
      >
        {children}
      </View>
    </>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export const Card = React.memo<CardProps>(({
  children,
  variant = 'elevated',
  size = DEFAULT_CARD_SIZE,
  loading = false,
  onPress,
  disabled = false,
  activeScale = 0.97,
  accent,
  style,
  testID,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const scale = useSharedValue(1)
  const config = sizeTokens[size]

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const accentStyle = accent != null ? { borderLeftWidth: 3, borderLeftColor: accent } : {}
  const containerStyle = [styles[variant], { borderRadius: theme.radius[config.radius] }, accentStyle, style]

  const inner = loading ? (
    <View style={[styles.skeletonWrap, { padding: config.pad, gap: config.gap }]}>
      <Skeleton width="45%" height={13} />
      <Skeleton width="85%" height={11} style={{ marginTop: 2 }} />
      <Skeleton width="70%" height={11} />
      <Skeleton width="35%" height={11} />
    </View>
  ) : (
    children
  )

  if (onPress) {
    return (
      <CardSizeContext.Provider value={size}>
        <AnimatedPressable
          onPress={onPress}
          disabled={disabled}
          onPressIn={() => { scale.value = withSpring(activeScale, { damping: 15, stiffness: 300 }) }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }) }}
          android_ripple={{ color: theme.colors.border + '50', borderless: false }}
          accessibilityRole="button"
          style={[containerStyle, animStyle, disabled && { opacity: 0.5 }]}
          testID={testID}
          {...(rest as any)}
        >
          {inner}
        </AnimatedPressable>
      </CardSizeContext.Provider>
    )
  }

  return (
    <CardSizeContext.Provider value={size}>
      <View style={containerStyle} testID={testID} {...rest}>
        {inner}
      </View>
    </CardSizeContext.Provider>
  )
})

Card.displayName = 'Card'
