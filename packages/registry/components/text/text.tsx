// native-mate: text@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Text as RNText } from 'react-native'
import { useTheme, fontStyle, monoFontFamily } from '@native-mate/core'
import type { FontWeightKey } from '@native-mate/core'
import type { TextProps, TextVariant, TextWeight, TextColor } from './text.types'

// ─── Variant presets ───────────────────────────────────────────────────────────

const VARIANTS: Record<TextVariant, {
  fontSize: number
  weightKey: FontWeightKey
  lineHeight: number
  letterSpacing?: number
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  // Presets are module-level, so the mono face cannot be resolved here (it needs
  // `theme`). The flag defers that to the component, where monoFontFamily runs.
  mono?: boolean
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
  code:      { fontSize: 13, weightKey: 'regular', lineHeight: 20, mono: true },
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
  if (muted) return colors.muted
  if (!color) return colors.foreground
  // Token names
  if (color === 'foreground')  return colors.foreground
  if (color === 'muted')       return colors.muted
  if (color === 'primary')     return colors.primary
  if (color === 'destructive') return colors.destructive
  if (color === 'success')     return colors.success
  if (color === 'warning')     return colors.warning
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
          // Code text overrides the weight-resolved family with the mono face
          // (brand-themed via typography.family.mono, else the platform default).
          ...(preset.mono ? { fontFamily: monoFontFamily(theme.typography) } : null),
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
