// native-mate: select@0.2.0 | hash:PLACEHOLDER
import React, { useState, useMemo, useCallback } from 'react'
import { View, Pressable, FlatList, TextInput, ActivityIndicator, SectionList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import { Sheet } from '../sheet/sheet'
import { Checkbox } from '../checkbox/checkbox'
import type { SelectProps, MultiSelectProps, SelectOption } from './select.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const heightMap = { sm: 36, md: 44, lg: 52 }
const fontMap = { sm: 13, md: 15, lg: 17 }

const useStyles = makeStyles((theme) => ({
  wrapper: { gap: theme.spacing.xs },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  triggerLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flex: 1 },
  triggerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  searchBar: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    color: theme.colors.foreground,
    fontSize: 14,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flex: 1 },
  optionDesc: { color: theme.colors.muted },
  separator: { height: 1, marginHorizontal: theme.spacing.md },
  sectionHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: 4,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  hint: { color: theme.colors.muted },
  error: { color: theme.colors.destructive },
}))

// ── Arrow icon ────────────────────────────────────────────────────

function ChevronIcon({ open, color }: { open: boolean; color: string }) {
  const rot = useSharedValue(0)
  React.useEffect(() => { rot.value = withTiming(open ? 1 : 0, { duration: 200 }) }, [open])
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(rot.value, [0, 1], [0, 180])}deg` }],
  }))
  return (
    <Animated.View style={style}>
      <Ionicons name="chevron-down" size={16} color={color} />
    </Animated.View>
  )
}

// ── Single Select ─────────────────────────────────────────────────

export const Select: React.FC<SelectProps> = ({
  options,
  groups,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  hint,
  disabled = false,
  required = false,
  clearable = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  loading = false,
  size = 'md',
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const allOptions: SelectOption[] = useMemo(() => {
    if (groups) return groups.flatMap((g) => g.options)
    return options
  }, [options, groups])

  const selected = allOptions.find((o) => o.value === value)

  const filteredOptions = useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q))
  }, [options, query])

  const filteredGroups = useMemo(() => {
    if (!groups || !query) return groups
    const q = query.toLowerCase()
    return groups.map((g) => ({
      ...g,
      options: g.options.filter((o) => o.label.toLowerCase().includes(q)),
    })).filter((g) => g.options.length > 0)
  }, [groups, query])

  const handleOpen = useCallback(() => {
    if (disabled) return
    Haptics?.impactAsync(Haptics?.ImpactFeedbackStyle?.Light)
    setQuery('')
    setOpen(true)
  }, [disabled])

  const handleSelect = useCallback((optVal: string) => {
    Haptics?.impactAsync(Haptics?.ImpactFeedbackStyle?.Light)
    onChange(optVal)
    setOpen(false)
  }, [onChange])

  const triggerH = heightMap[size]
  const triggerFs = fontMap[size]
  const borderColor = error ? theme.colors.destructive : theme.colors.border

  const renderOption = useCallback(({ item }: { item: SelectOption }) => (
    <Pressable
      style={[styles.option, { opacity: item.disabled ? 0.4 : 1 }]}
      onPress={() => !item.disabled && handleSelect(item.value)}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: item.value === value, disabled: item.disabled }}
    >
      <View style={styles.optionLeft}>
        {item.icon && <View>{item.icon}</View>}
        <View style={{ flex: 1 }}>
          <Text variant="body">{item.label}</Text>
          {item.description && <Text variant="caption" style={styles.optionDesc}>{item.description}</Text>}
        </View>
      </View>
      {item.value === value && (
        <Ionicons name="checkmark" size={16} color={theme.colors.primary} />
      )}
    </Pressable>
  ), [value, handleSelect, theme])

  const snapHeight = Math.min(480, (allOptions.length * 52) + (searchable ? 64 : 0) + 100)

  return (
    <View style={styles.wrapper}>
      {label && (
        <View style={styles.labelRow}>
          <Text variant="label">
            {label}{required && <Text variant="label" color={theme.colors.destructive}> *</Text>}
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.trigger, { minHeight: triggerH, borderColor, opacity: disabled ? 0.5 : 1 }]}
        onPress={handleOpen}
        accessibilityRole="combobox"
        accessibilityState={{ disabled, expanded: open }}
      >
        <View style={styles.triggerLeft}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.muted} />
          ) : (
            <Text
              variant="body"
              style={{ fontSize: triggerFs, color: selected ? theme.colors.foreground : theme.colors.muted, flex: 1 }}
              numberOfLines={1}
            >
              {selected?.label ?? placeholder}
            </Text>
          )}
        </View>
        <View style={styles.triggerRight}>
          {clearable && value && (
            <Pressable onPress={() => onChange('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={theme.colors.muted} />
            </Pressable>
          )}
          <ChevronIcon open={open} color={theme.colors.muted} />
        </View>
      </Pressable>

      {error && <Text variant="caption" style={styles.error}>{error}</Text>}
      {!error && hint && <Text variant="caption" style={styles.hint}>{hint}</Text>}

      <Sheet visible={open} onClose={() => setOpen(false)} title={label}>
        {searchable && (
          <TextInput
            style={styles.searchBar}
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.colors.muted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
        )}
        {groups ? (
          <SectionList
            sections={(filteredGroups ?? groups).map((g) => ({ title: g.label, data: g.options }))}
            keyExtractor={(item) => item.value}
            renderSectionHeader={({ section }) => (
              <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surface }]}>
                <Text variant="caption" muted style={{ textTransform: 'uppercase', letterSpacing: 0.8, fontSize: 11 }}>
                  {section.title}
                </Text>
              </View>
            )}
            renderItem={renderOption}
            ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={renderOption}
            ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />}
            ListEmptyComponent={
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text variant="body" muted>No results</Text>
              </View>
            }
            keyboardShouldPersistTaps="handled"
          />
        )}
      </Sheet>
    </View>
  )
}

// ── Multi Select ──────────────────────────────────────────────────

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  hint,
  disabled = false,
  required = false,
  clearable = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  maxSelections,
  size = 'md',
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selectedOptions = options.filter((o) => value.includes(o.value))

  const filteredOptions = useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const toggleOption = useCallback((optVal: string) => {
    Haptics?.impactAsync(Haptics?.ImpactFeedbackStyle?.Light)
    if (value.includes(optVal)) {
      onChange(value.filter((v) => v !== optVal))
    } else {
      if (maxSelections && value.length >= maxSelections) return
      onChange([...value, optVal])
    }
  }, [value, onChange, maxSelections])

  const triggerH = heightMap[size]
  const borderColor = error ? theme.colors.destructive : theme.colors.border

  return (
    <View style={styles.wrapper}>
      {label && (
        <View style={styles.labelRow}>
          <Text variant="label">
            {label}{required && <Text variant="label" color={theme.colors.destructive}> *</Text>}
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.trigger, { minHeight: triggerH, borderColor, opacity: disabled ? 0.5 : 1, paddingVertical: value.length > 0 ? 8 : 0 }]}
        onPress={() => { if (!disabled) { setQuery(''); setOpen(true) } }}
        accessibilityRole="combobox"
      >
        <View style={[styles.triggerLeft, { paddingVertical: 2 }]}>
          {selectedOptions.length > 0 ? (
            <View style={styles.chipRow}>
              {selectedOptions.map((opt) => (
                <View key={opt.value} style={[styles.chip, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Text variant="caption" style={{ color: theme.colors.primary }}>{opt.label}</Text>
                  <Pressable onPress={() => toggleOption(opt.value)} hitSlop={6}>
                    <Ionicons name="close" size={12} color={theme.colors.primary} />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <Text variant="body" style={{ color: theme.colors.muted }} numberOfLines={1}>{placeholder}</Text>
          )}
        </View>
        <View style={styles.triggerRight}>
          {clearable && value.length > 0 && (
            <Pressable onPress={() => onChange([])} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={theme.colors.muted} />
            </Pressable>
          )}
          <ChevronIcon open={open} color={theme.colors.muted} />
        </View>
      </Pressable>

      {error && <Text variant="caption" style={styles.error}>{error}</Text>}
      {!error && hint && <Text variant="caption" style={styles.hint}>{hint}</Text>}

      <Sheet visible={open} onClose={() => setOpen(false)} title={label}>
        {searchable && (
          <TextInput
            style={styles.searchBar}
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.colors.muted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        )}
        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isSelected = value.includes(item.value)
            const isDisabled = item.disabled || (!isSelected && !!maxSelections && value.length >= maxSelections)
            return (
              <Pressable
                style={[styles.option, { opacity: isDisabled ? 0.4 : 1 }]}
                onPress={() => !isDisabled && toggleOption(item.value)}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.optionLeft}>
                  {item.icon && <View>{item.icon}</View>}
                  <View style={{ flex: 1 }}>
                    <Text variant="body">{item.label}</Text>
                    {item.description && <Text variant="caption" style={styles.optionDesc}>{item.description}</Text>}
                  </View>
                </View>
                {/* Use the library Checkbox for visual consistency. pointerEvents="none" lets
                    the outer Pressable own all touch handling. */}
                <View pointerEvents="none">
                  <Checkbox checked={isSelected} onChange={() => {}} size="sm" disabled={isDisabled} />
                </View>
              </Pressable>
            )
          }}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Text variant="body" muted>No results</Text>
            </View>
          }
        />
      </Sheet>
    </View>
  )
}
