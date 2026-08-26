// native-mate: text@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Text as RNText, Platform } from 'react-native'
import { useTheme, fontStyle } from '@native-mate/core'
import type { FontWeightKey } from '@native-mate/core'
import type { TextProps, TextVariant, TextWeight, TextColor } from './text.types'

// ─── Variant presets ───────────────────────────────────────────────────────────

const VARIANTS: Record<TextVariant, {
  fontSize: number
  weightKey: FontWeightKey
  lineHeight: number
  letterSpacing?: number
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  fontFamily?: string
}> = {
  h1:        { fontSize: 36, weightKey: 'bold', lineHeight: 44 },
  h2:        { fontSize: 30, weightKey: 'bold', lineHeight: 38 },
  h3:        { fontSize: 24, weightKey: 'semibold', lineHeight: 32 },
  h4:        { fontSize: 20, weightKey: 'semibold', lineHeight: 28 },
  h5:        { fontSize: 17, weightKey: 'semibold', lineHeight: 24 },
  h6:        { fontSize: 15, weightKey: 'semibold', lineHeight: 22 },
  bodyLarge: { fontSize: 17, weightKey: 'regular', lineHeight: 26 },
  body:      { fontSize: 15, weightKey: 'regular', lineHeight: 22 },
  bodySmall: { fontSize: 13, weightKey: 'regular', lineHeight: 20 },
  label:     { fontSize: 13, weightKey: 'medium', lineHeight: 18 },
  caption:   { fontSize: 11, weightKey: 'regular', lineHeight: 16 },
  overline:  { fontSize: 10, weightKey: 'semibold', lineHeight: 14, letterSpacing: 1.5, textTransform: 'uppercase' },
  code:      {
    fontSize: 13, weightKey: 'regular', lineHeight: 20,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
}

// TextWeight has 6 levels but the core fontStyle helper only resolves 4 keys —
// 'light' collapses into 'regular' and 'extrabold' collapses into 'bold'.
const WEIGHT_KEYS: Record<TextWeight, FontWeightKey> = {
  light:    'regular',
  regular:  'regular',
  medium:   'medium',
  semibold: 'semibold',
  bold:     'bold',
  extrabold: 'bold',
}

// ─── Color resolution ──────────────────────────────────────────────────────────

function resolveColor(
  color: TextColor | undefined,
  muted: boolean | undefined,
  colors: Record<string, string>,
): string {
  if (muted) return colors.muted ?? '#71717a'
  if (!color) return colors.foreground ?? '#fafafa'
  // Token names
  if (color === 'foreground')  return colors.foreground  ?? '#fafafa'
  if (color === 'muted')       return colors.muted       ?? '#71717a'
  if (color === 'primary')     return colors.primary     ?? '#6366f1'
  if (color === 'destructive') return colors.destructive ?? '#ef4444'
  if (color === 'success')     return colors.success     ?? '#22c55e'
  if (color === 'warning')     return colors.warning     ?? '#f59e0b'
  // Raw value (hex / rgb / named)
  return color
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight,
  align,
  color,
  size,
  numberOfLines,
  ellipsizeMode = 'tail',
  transform,
  muted,
  selectable = false,
  children,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme()
  const preset = VARIANTS[variant]

  const resolvedColor = resolveColor(color, muted, theme.colors as Record<string, string>)
  const weightKey: FontWeightKey = weight ? WEIGHT_KEYS[weight] : preset.weightKey
  const resolvedTransform = transform ?? preset.textTransform ?? 'none'

  return (
    <RNText
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          fontSize:        size ?? preset.fontSize,
          ...fontStyle(theme.typography, weightKey),
          lineHeight:      preset.lineHeight,
          letterSpacing:   preset.letterSpacing ?? 0,
          fontFamily:      preset.fontFamily,
          textTransform:   resolvedTransform as any,
          color:           resolvedColor,
          textAlign:       align,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  )
}
