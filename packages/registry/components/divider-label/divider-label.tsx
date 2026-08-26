// native-mate: divider-label@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { View } from 'react-native'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { DividerLabelProps, DividerLabelPosition } from './divider-label.types'

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: 1,
  },
  labelWrap: {
    paddingHorizontal: theme.spacing.md,
  },
}))

export const DividerLabel: React.FC<DividerLabelProps> = ({
  label,
  position = 'center',
  variant = 'line',
  color,
  textColor,
  thickness = 1,
  spacing = 16,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const lineColor = color ?? theme.colors.border
  const labelColor = textColor ?? theme.colors.muted

  const lineStyle = {
    height: thickness,
    backgroundColor: variant === 'line' ? lineColor : 'transparent',
    borderBottomWidth: variant === 'dashed' ? thickness : 0,
    borderBottomColor: variant === 'dashed' ? lineColor : undefined,
    borderStyle: variant === 'dashed' ? 'dashed' as const : undefined,
  }

  const leftFlex = position === 'left' ? 0.15 : position === 'right' ? 1 : 1
  const rightFlex = position === 'right' ? 0.15 : position === 'left' ? 1 : 1

  return (
    <View
      style={[
        styles.container,
        { marginVertical: spacing },
        style,
      ]}
      accessibilityRole="separator"
    >
      <View style={[styles.line, lineStyle, { flex: leftFlex }]} />
      <View style={styles.labelWrap}>
        <Text
          style={{
            fontSize: 12,
            ...fontStyle(theme.typography, 'medium'),
            color: labelColor,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
      </View>
      <View style={[styles.line, lineStyle, { flex: rightFlex }]} />
    </View>
  )
}
