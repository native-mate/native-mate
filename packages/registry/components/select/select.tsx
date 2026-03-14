// native-mate: select@0.1.0 | hash:PLACEHOLDER
import React, { useState } from 'react'
import { View, Pressable, FlatList } from 'react-native'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import { Sheet } from '../sheet/sheet'
import type { SelectProps } from './select.types'

const useStyles = makeStyles((theme) => ({
  trigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md, minHeight: 44,
    backgroundColor: theme.colors.background,
  },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: theme.spacing.sm, minHeight: 44 },
  wrapper: { gap: theme.spacing.xs },
}))

export const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder = 'Select...', label, disabled = false }) => {
  const theme = useTheme()
  const styles = useStyles()
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <View style={styles.wrapper}>
      {label && <Text variant="label">{label}</Text>}
      <Pressable style={[styles.trigger, { opacity: disabled ? 0.5 : 1 }]} onPress={() => !disabled && setOpen(true)} accessibilityRole="combobox">
        <Text variant="body" color={selected ? theme.colors.foreground : theme.colors.muted}>{selected?.label ?? placeholder}</Text>
        <Text variant="caption" color={theme.colors.muted}>▼</Text>
      </Pressable>
      <Sheet visible={open} onClose={() => setOpen(false)} title={label} snapPoints={[Math.min(400, options.length * 52 + 120)]}>
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: theme.colors.border }} />}
          renderItem={({ item }) => (
            <Pressable style={styles.option} onPress={() => { onChange(item.value); setOpen(false) }} accessibilityRole="option" accessibilityState={{ selected: item.value === value }}>
              <Text variant="body">{item.label}</Text>
              {item.value === value && <Text variant="body" color={theme.colors.primary}>✓</Text>}
            </Pressable>
          )}
        />
      </Sheet>
    </View>
  )
}
