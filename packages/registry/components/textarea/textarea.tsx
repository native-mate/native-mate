// native-mate: textarea@0.1.0 | hash:PLACEHOLDER
import React, { useState } from 'react'
import { View, TextInput } from 'react-native'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { TextareaProps } from './textarea.types'

const useStyles = makeStyles((theme) => ({
  wrapper: { gap: theme.spacing.xs },
  inputContainer: { borderWidth: 1, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  hint: { color: theme.colors.muted },
  error: { color: theme.colors.destructive },
}))

export const Textarea: React.FC<TextareaProps> = ({ label, error, hint, disabled = false, rows = 4, ...rest }) => {
  const theme = useTheme()
  const styles = useStyles()
  const [focused, setFocused] = useState(false)
  const borderColor = error ? theme.colors.destructive : focused ? theme.colors.primary : theme.colors.border

  return (
    <View style={styles.wrapper}>
      {label && <Text variant="label">{label}</Text>}
      <View style={[styles.inputContainer, { borderColor, backgroundColor: disabled ? theme.colors.surface : theme.colors.background, minHeight: rows * 24 }]}>
        <TextInput
          multiline
          textAlignVertical="top"
          style={{ color: theme.colors.foreground, fontSize: theme.typography.size.md, opacity: disabled ? 0.5 : 1 }}
          placeholderTextColor={theme.colors.muted}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </View>
      {error && <Text variant="caption" style={styles.error}>{error}</Text>}
      {!error && hint && <Text variant="caption" style={styles.hint}>{hint}</Text>}
    </View>
  )
}
