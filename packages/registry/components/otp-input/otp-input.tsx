// native-mate: otp-input@0.1.0 | hash:PLACEHOLDER
import React, { useRef } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { OTPInputProps } from './otp-input.types'

const useStyles = makeStyles((theme) => ({
  row: { flexDirection: 'row', gap: theme.spacing.sm },
  box: {
    width: 48, height: 56, borderRadius: theme.radius.md, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
}))

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value, onChange, onComplete, error = false }) => {
  const theme = useTheme()
  const styles = useStyles()
  const inputRef = useRef<TextInput>(null)

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length)
    onChange(digits)
    if (digits.length === length) onComplete?.(digits)
  }

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.row}>
      {Array.from({ length }).map((_, i) => {
        const isFilled = i < value.length
        const isActive = i === value.length
        const borderColor = error
          ? theme.colors.destructive
          : isActive ? theme.colors.primary
          : isFilled ? theme.colors.onSurface
          : theme.colors.border

        return (
          <View key={i} style={[styles.box, { borderColor }]}>
            <Text variant="title" color={isFilled ? theme.colors.foreground : theme.colors.muted}>
              {value[i] ?? (isActive ? '|' : '')}
            </Text>
          </View>
        )
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        accessibilityLabel={`${length}-digit code input`}
      />
    </Pressable>
  )
}
