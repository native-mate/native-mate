// native-mate: separator@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@native-mate/core'
import type { SeparatorProps } from './separator.types'

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  thickness = StyleSheet.hairlineWidth,
  color,
  spacing = 8,
  label,
  labelColor,
  labelSize = 11,
  labelWeight = '500',
  dashed = false,
  decorative = true,
  style,
}) => {
  const theme = useTheme()
  const lineColor = color ?? (theme.colors as Record<string, string>).border ?? '#27272a'
  const resolvedLabelColor = labelColor ?? (theme.colors as Record<string, string>).muted ?? '#71717a'

  const a11yProps = decorative
    ? { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const }
    : { accessibilityRole: 'separator' as const }

  // ── Vertical ────────────────────────────────────────────────────────────────
  if (orientation === 'vertical') {
    return (
      <View
        {...a11yProps}
        style={[
          {
            width: thickness,
            alignSelf: 'stretch',
            marginHorizontal: spacing,
            borderLeftWidth: thickness,
            borderColor: lineColor,
            borderStyle: dashed ? 'dashed' : 'solid',
          },
          style,
        ]}
      />
    )
  }

  // ── Horizontal with label ───────────────────────────────────────────────────
  if (label) {
    return (
      <View
        {...a11yProps}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: spacing,
          },
          style,
        ]}
      >
        <Line color={lineColor} thickness={thickness} dashed={dashed} />
        <Text
          style={{
            marginHorizontal: 12,
            fontSize: labelSize,
            fontWeight: labelWeight,
            color: resolvedLabelColor,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
          }}
        >
          {label}
        </Text>
        <Line color={lineColor} thickness={thickness} dashed={dashed} />
      </View>
    )
  }

  // ── Plain horizontal ────────────────────────────────────────────────────────
  return (
    <View
      {...a11yProps}
      style={[
        {
          height: thickness,
          marginVertical: spacing,
          borderBottomWidth: thickness,
          borderColor: lineColor,
          borderStyle: dashed ? 'dashed' : 'solid',
        },
        style,
      ]}
    />
  )
}

function Line({ color, thickness, dashed }: { color: string; thickness: number; dashed: boolean }) {
  return (
    <View
      style={{
        flex: 1,
        borderBottomWidth: thickness,
        borderColor: color,
        borderStyle: dashed ? 'dashed' : 'solid',
      }}
    />
  )
}
