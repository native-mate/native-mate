// native-mate: separator@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme, fontStyle } from '@native-mate/core'
import type { SeparatorProps } from './separator.types'

function weightToKey(weight: SeparatorProps['labelWeight']): 'regular' | 'medium' | 'semibold' | 'bold' {
  switch (weight) {
    case 'normal':
    case '100':
    case '200':
    case '300':
    case '400':
      return 'regular'
    case '500':
      return 'medium'
    case '600':
      return 'semibold'
    case 'bold':
    case '700':
    case '800':
    case '900':
      return 'bold'
    default:
      return 'medium'
  }
}

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
  const lineColor = color ?? theme.colors.border
  const resolvedLabelColor = labelColor ?? theme.colors.muted

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
            ...fontStyle(theme.typography, weightToKey(labelWeight)),
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
