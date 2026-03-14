// native-mate: slider@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useState } from 'react'
import { View, PanResponder, LayoutChangeEvent } from 'react-native'
import { useTheme, makeStyles } from '@native-mate/core'
import type { SliderProps } from './slider.types'

const useStyles = makeStyles((theme) => ({
  track: { height: 4, borderRadius: theme.radius.full, backgroundColor: theme.colors.border, justifyContent: 'center' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: theme.radius.full },
  thumb: { position: 'absolute', width: 20, height: 20, borderRadius: theme.radius.full, backgroundColor: theme.colors.primary, top: -8, marginLeft: -10, elevation: 2 },
}))

export const Slider: React.FC<SliderProps> = ({ value, min = 0, max = 100, step = 1, onChange, onChangeEnd, accessibilityLabel }) => {
  const theme = useTheme()
  const styles = useStyles()
  const [width, setWidth] = useState(0)

  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  const snap = (v: number) => Math.round((v - min) / step) * step + min
  const pct = width > 0 ? ((value - min) / (max - min)) : 0

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        if (width <= 0) return
        const x = e.nativeEvent.locationX
        const newVal = clamp(snap(min + (x / width) * (max - min)))
        onChange?.(newVal)
      },
      onPanResponderMove: (e) => {
        if (width <= 0) return
        const x = e.nativeEvent.locationX
        const newVal = clamp(snap(min + (x / width) * (max - min)))
        onChange?.(newVal)
      },
      onPanResponderRelease: (e) => {
        if (width <= 0) return
        const x = e.nativeEvent.locationX
        const newVal = clamp(snap(min + (x / width) * (max - min)))
        onChangeEnd?.(newVal)
      },
    })
  ).current

  return (
    <View
      style={styles.track}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
    >
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: theme.colors.primary }]} />
      <View style={[styles.thumb, { left: `${pct * 100}%` as any }]} />
    </View>
  )
}
