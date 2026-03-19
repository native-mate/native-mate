// native-mate: text@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Text as RNText, Platform } from 'react-native'
import { useTheme } from '@native-mate/core'
import type { TextProps, TextVariant, TextWeight, TextColor } from './text.types'

// ─── Variant presets ───────────────────────────────────────────────────────────

const VARIANTS: Record<TextVariant, {
  fontSize: number
  fontWeight: string
  lineHeight: number
  letterSpacing?: number
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  fontFamily?: string
}> = {
  h1:        { fontSize: 36, fontWeight: '700', lineHeight: 44 },
  h2:        { fontSize: 30, fontWeight: '700', lineHeight: 38 },
  h3:        { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h4:        { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h5:        { fontSize: 17, fontWeight: '600', lineHeight: 24 },
  h6:        { fontSize: 15, fontWeight: '600', lineHeight: 22 },
  bodyLarge: { fontSize: 17, fontWeight: '400', lineHeight: 26 },
  body:      { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400', lineHeight: 20 },
  label:     { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  caption:   { fontSize: 11, fontWeight: '400', lineHeight: 16 },
  overline:  { fontSize: 10, fontWeight: '600', lineHeight: 14, letterSpacing: 1.5, textTransform: 'uppercase' },
  code:      {
    fontSize: 13, fontWeight: '400', lineHeight: 20,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
}

const WEIGHTS: Record<string, string> = {
  light:    '300',
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
  extrabold: '800',
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
  const resolvedWeight = weight ? WEIGHTS[weight] : preset.fontWeight
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
          fontWeight:      resolvedWeight as any,
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
