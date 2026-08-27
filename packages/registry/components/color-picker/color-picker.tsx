// native-mate: color-picker@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback, useMemo } from 'react'
import { View, Pressable, TextInput, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle, monoFontFamily } from '@native-mate/core'
import type { ColorPickerProps } from './color-picker.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const DEFAULT_PRESETS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308',
  '#84CC16', '#22C55E', '#14B8A6', '#06B6D4',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
  '#D946EF', '#EC4899', '#F43F5E', '#78716C',
  '#000000', '#FFFFFF',
]

// ---- Color conversion helpers ----

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) || 0
  const g = parseInt(clean.substring(2, 4), 16) || 0
  const b = parseInt(clean.substring(4, 6), 16) || 0
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100
  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

const useStyles = makeStyles((theme) => ({
  container: {
    gap: 16,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swatch: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: theme.colors.foreground,
  },
  swatchWhite: {
    borderColor: theme.colors.border,
  },
  customSection: {
    gap: 12,
  },
  sliderLabel: {
    fontSize: theme.typography.size.xs,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sliderRow: {
    gap: 6,
  },
  sliderTrack: {
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    top: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewSwatch: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  hexInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: theme.typography.size.md,
    color: theme.colors.foreground,
    fontFamily: monoFontFamily(theme.typography),
    backgroundColor: theme.colors.surface,
  },
  disabled: {
    opacity: 0.5,
  },
}))

function Slider({
  value,
  onChange,
  min = 0,
  max = 360,
  colors,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  colors: string[]
  disabled?: boolean
}) {
  const theme = useTheme()
  const styles = useStyles()
  const progress = (value - min) / (max - min)
  const [trackWidth, setTrackWidth] = useState(280)

  const handleTouch = useCallback(
    (e: any) => {
      if (disabled) return
      const { locationX } = e.nativeEvent
      const ratio = Math.max(0, Math.min(1, locationX / trackWidth))
      onChange(Math.round(min + ratio * (max - min)))
    },
    [disabled, min, max, onChange, trackWidth],
  )

  const gradientStyle = {
    flex: 1,
    flexDirection: 'row' as const,
  }

  return (
    <Pressable
      onPress={handleTouch}
      disabled={disabled}
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
    >
      <View
        style={styles.sliderTrack}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        <View
          style={[
            {
              position: 'absolute',
              top: 0,
              start: 0,
              end: 0,
              bottom: 0,
              borderRadius: 14,
              backgroundColor: colors[0],
            },
          ]}
        >
          {/* Multi-stop gradient approximation */}
          <View style={{ flex: 1, flexDirection: 'row', borderRadius: 14, overflow: 'hidden' }}>
            {colors.map((color, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: color,
                }}
              />
            ))}
          </View>
        </View>
        <View
          style={[
            styles.sliderThumb,
            { left: `${Math.max(0, Math.min(95, progress * 100))}%` as any },
          ]}
        />
      </View>
    </Pressable>
  )
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  showCustom = true,
  format = 'hex',
  showAlpha = false,
  size = 40,
  disabled = false,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [hexInput, setHexInput] = useState(value)

  const rgb = useMemo(() => hexToRgb(value), [value])
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb])

  const handlePresetSelect = useCallback(
    (color: string) => {
      if (disabled) return
      if (haptic && Haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      onChange(color.toUpperCase())
      setHexInput(color.toUpperCase())
    },
    [disabled, haptic, onChange],
  )

  const handleHueChange = useCallback(
    (h: number) => {
      const newRgb = hslToRgb(h, hsl.s, hsl.l)
      const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
      onChange(hex)
      setHexInput(hex)
    },
    [hsl, onChange],
  )

  const handleSaturationChange = useCallback(
    (s: number) => {
      const newRgb = hslToRgb(hsl.h, s, hsl.l)
      const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
      onChange(hex)
      setHexInput(hex)
    },
    [hsl, onChange],
  )

  const handleLightnessChange = useCallback(
    (l: number) => {
      const newRgb = hslToRgb(hsl.h, hsl.s, l)
      const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
      onChange(hex)
      setHexInput(hex)
    },
    [hsl, onChange],
  )

  const handleHexInput = useCallback(
    (text: string) => {
      const clean = text.replace(/[^0-9A-Fa-f#]/g, '').slice(0, 7)
      setHexInput(clean)
      if (/^#[0-9A-Fa-f]{6}$/i.test(clean)) {
        onChange(clean.toUpperCase())
      }
    },
    [onChange],
  )

  // Generate hue gradient colors
  const hueColors = useMemo(() => {
    const colors = []
    for (let i = 0; i <= 360; i += 30) {
      const { r, g, b } = hslToRgb(i, 100, 50)
      colors.push(rgbToHex(r, g, b))
    }
    return colors
  }, [])

  const satColors = useMemo(() => {
    const lo = hslToRgb(hsl.h, 0, hsl.l)
    const hi = hslToRgb(hsl.h, 100, hsl.l)
    return [rgbToHex(lo.r, lo.g, lo.b), rgbToHex(hi.r, hi.g, hi.b)]
  }, [hsl.h, hsl.l])

  const lightColors = useMemo(() => {
    const lo = hslToRgb(hsl.h, hsl.s, 0)
    const mid = hslToRgb(hsl.h, hsl.s, 50)
    const hi = hslToRgb(hsl.h, hsl.s, 100)
    return [rgbToHex(lo.r, lo.g, lo.b), rgbToHex(mid.r, mid.g, mid.b), rgbToHex(hi.r, hi.g, hi.b)]
  }, [hsl.h, hsl.s])

  return (
    <View
      style={[styles.container, disabled && styles.disabled, style]}
      accessibilityRole="adjustable"
      accessibilityLabel="Color picker"
      {...rest}
    >
      {presets.length > 0 && (
        <View style={styles.presetGrid}>
          {presets.map((color) => {
            const isSelected = color.toUpperCase() === value.toUpperCase()
            const isWhite = color.toUpperCase() === '#FFFFFF'
            return (
              <Pressable
                key={color}
                onPress={() => handlePresetSelect(color)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`Select color ${color}`}
                accessibilityState={{ selected: isSelected }}
              >
                <View
                  style={[
                    styles.swatch,
                    { width: size, height: size, backgroundColor: color },
                    isSelected && styles.swatchSelected,
                    isWhite && !isSelected && styles.swatchWhite,
                  ]}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={size * 0.5}
                      color={getContrastColor(color)}
                    />
                  )}
                </View>
              </Pressable>
            )
          })}
        </View>
      )}

      {showCustom && (
        <View style={styles.customSection}>
          <View style={styles.sliderRow}>
            <Text variant="caption" style={styles.sliderLabel}>
              Hue
            </Text>
            <Slider
              value={hsl.h}
              onChange={handleHueChange}
              min={0}
              max={360}
              colors={hueColors}
              disabled={disabled}
            />
          </View>
          <View style={styles.sliderRow}>
            <Text variant="caption" style={styles.sliderLabel}>
              Saturation
            </Text>
            <Slider
              value={hsl.s}
              onChange={handleSaturationChange}
              min={0}
              max={100}
              colors={satColors}
              disabled={disabled}
            />
          </View>
          <View style={styles.sliderRow}>
            <Text variant="caption" style={styles.sliderLabel}>
              Lightness
            </Text>
            <Slider
              value={hsl.l}
              onChange={handleLightnessChange}
              min={0}
              max={100}
              colors={lightColors}
              disabled={disabled}
            />
          </View>

          <View style={styles.previewRow}>
            <View style={[styles.previewSwatch, { backgroundColor: value }]} />
            <TextInput
              value={hexInput}
              onChangeText={handleHexInput}
              placeholder="#000000"
              placeholderTextColor={theme.colors.muted}
              autoCapitalize="characters"
              maxLength={7}
              editable={!disabled}
              style={styles.hexInput}
              accessibilityLabel="Hex color value"
            />
          </View>
        </View>
      )}
    </View>
  )
}
