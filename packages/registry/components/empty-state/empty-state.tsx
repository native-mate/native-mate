// native-mate: empty-state@0.2.0 | hash:PLACEHOLDER
import React from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import { Button } from '../button/button'
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

// Composes the registry Button so variants, haptics, loading, disabled and
// accessibility stay in one place instead of being reimplemented here.

const ActionButton: React.FC<{
  label: string
  onPress: () => void
  variant?: 'primary' | 'outline'
  compact?: boolean
}> = ({ label, onPress, variant = 'primary', compact }) => {
  const theme = useTheme()
  return (
    <Button
      variant={variant === 'primary' ? 'default' : 'outline'}
      size={compact ? 'sm' : 'md'}
      onPress={onPress}
      style={{
        alignSelf: compact ? 'flex-start' : 'center',
        marginTop: theme.spacing.sm,
      }}
    >
      {label}
    </Button>
  )
}

// ── Secondary action (link style) ─────────────────────────────────────────────

const SecondaryAction: React.FC<{ label: string; onPress: () => void; compact?: boolean }> = ({
  label,
  onPress,
  compact,
}) => (
  <Button
    variant="link"
    size="sm"
    haptic="none"
    onPress={onPress}
    style={{ alignSelf: compact ? 'flex-start' : 'center', marginTop: 4 }}
  >
    {label}
  </Button>
)

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
          ...fontStyle(theme.typography, 'semibold'),
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
              ...fontStyle(theme.typography, 'semibold'),
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
            <SecondaryAction label={secondaryAction.label} onPress={secondaryAction.onPress} compact />
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
          ...fontStyle(theme.typography, 'bold'),
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
