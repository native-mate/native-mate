// native-mate: empty-state@0.1.0 | hash:f32c622964e543c6
import React from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { EmptyStateProps } from './empty-state.types'

// ── Shared entrance animation ─────────────────────────────────────────────────

function useEntranceAnimation() {
  const theme = useTheme()
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(16)

  React.useEffect(() => {
    opacity.value = withDelay(80, withSpring(1, theme.animation.easing.spring))
    translateY.value = withDelay(80, withSpring(0, theme.animation.easing.spring))
  }, [])

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))
}

// ── Action button ─────────────────────────────────────────────────────────────

const ActionButton: React.FC<{
  label: string
  onPress: () => void
  variant?: 'primary' | 'outline'
  compact?: boolean
}> = ({ label, onPress, variant = 'primary', compact }) => {
  const theme = useTheme()
  const isPrimary = variant === 'primary'
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        alignSelf: compact ? 'flex-start' : 'center',
        paddingVertical: compact ? theme.spacing.xs : theme.spacing.sm,
        paddingHorizontal: compact ? theme.spacing.md : theme.spacing.xl,
        borderRadius: theme.radius.md,
        backgroundColor: isPrimary ? theme.colors.primary : 'transparent',
        borderWidth: isPrimary ? 0 : 1,
        borderColor: theme.colors.border,
        marginTop: theme.spacing.sm,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: isPrimary ? theme.colors.onPrimary : theme.colors.foreground,
        }}
      >
        {label}
      </Text>
    </Pressable>
  )
}

// ── Secondary action (link style) ─────────────────────────────────────────────

const SecondaryAction: React.FC<{ label: string; onPress: () => void }> = ({
  label,
  onPress,
}) => {
  const theme = useTheme()
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ marginTop: 4 }}>
      <Text style={{ fontSize: 13, color: theme.colors.muted, textDecorationLine: 'underline' }}>
        {label}
      </Text>
    </Pressable>
  )
}

// ── Default variant (centered column) ────────────────────────────────────────

const DefaultEmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  style,
}) => {
  const theme = useTheme()
  const animStyle = useEntranceAnimation()

  return (
    <Animated.View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing['2xl'],
          gap: 4,
        },
        style,
        animStyle,
      ]}
    >
      {icon && (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: theme.radius.xl,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.sm,
          }}
        >
          {icon}
        </View>
      )}
      <Text
        style={{
          fontSize: 17,
          fontWeight: '600',
          color: theme.colors.foreground,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.muted,
            textAlign: 'center',
            maxWidth: 260,
            lineHeight: 20,
            marginTop: 2,
          }}
        >
          {description}
        </Text>
      )}
      {action && (
        <ActionButton
          label={action.label}
          onPress={action.onPress}
          variant={action.variant ?? 'primary'}
        />
      )}
      {secondaryAction && (
        <SecondaryAction label={secondaryAction.label} onPress={secondaryAction.onPress} />
      )}
    </Animated.View>
  )
}

// ── Compact variant (horizontal row) ─────────────────────────────────────────

const CompactEmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  style,
}) => {
  const theme = useTheme()
  const animStyle = useEntranceAnimation()

  return (
    <Animated.View
      style={[
        {
          padding: theme.spacing.lg,
        },
        style,
        animStyle,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md }}>
        {icon && (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: theme.colors.foreground,
            }}
          >
            {title}
          </Text>
          {description && (
            <Text
              style={{
                fontSize: 13,
                color: theme.colors.muted,
                marginTop: 2,
                lineHeight: 18,
              }}
            >
              {description}
            </Text>
          )}
          {action && (
            <ActionButton
              label={action.label}
              onPress={action.onPress}
              variant={action.variant ?? 'primary'}
              compact
            />
          )}
          {secondaryAction && (
            <SecondaryAction label={secondaryAction.label} onPress={secondaryAction.onPress} />
          )}
        </View>
      </View>
    </Animated.View>
  )
}

// ── Illustration variant (large icon in circle with tinted bg) ────────────────

const IllustrationEmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  style,
}) => {
  const theme = useTheme()
  const animStyle = useEntranceAnimation()

  return (
    <Animated.View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing['2xl'],
          gap: 4,
        },
        style,
        animStyle,
      ]}
    >
      {icon && (
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: theme.colors.primary + '12',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          {/* Inner circle */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.colors.primary + '22',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </View>
        </View>
      )}
      <Text
        style={{
          fontSize: 19,
          fontWeight: '700',
          color: theme.colors.foreground,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.muted,
            textAlign: 'center',
            maxWidth: 280,
            lineHeight: 20,
            marginTop: 4,
          }}
        >
          {description}
        </Text>
      )}
      {action && (
        <ActionButton
          label={action.label}
          onPress={action.onPress}
          variant={action.variant ?? 'primary'}
        />
      )}
      {secondaryAction && (
        <SecondaryAction label={secondaryAction.label} onPress={secondaryAction.onPress} />
      )}
    </Animated.View>
  )
}

// ── Public EmptyState component ───────────────────────────────────────────────

export const EmptyState: React.FC<EmptyStateProps> = (props) => {
  const { variant = 'default' } = props

  if (variant === 'compact') return <CompactEmptyState {...props} />
  if (variant === 'illustration') return <IllustrationEmptyState {...props} />
  return <DefaultEmptyState {...props} />
}
