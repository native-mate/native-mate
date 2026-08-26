// native-mate: phone-input@0.1.0 | hash:PLACEHOLDER
import React, { useState, useMemo, useCallback, useRef } from 'react'
import {
  View,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, Separator, fontStyle } from '@native-mate/core'
import type { PhoneInputProps, Country } from './phone-input.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

// ── Built-in country data ────────────────────────────────────────────────────

const DEFAULT_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '\u{1F1FA}\u{1F1F8}', format: '(###) ###-####' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '\u{1F1EC}\u{1F1E7}', format: '#### ######' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '\u{1F1EE}\u{1F1F3}', format: '##### #####' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '\u{1F1E8}\u{1F1E6}', format: '(###) ###-####' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '\u{1F1E6}\u{1F1FA}', format: '### ### ###' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '\u{1F1E9}\u{1F1EA}', format: '#### #######' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '\u{1F1EB}\u{1F1F7}', format: '# ## ## ## ##' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '\u{1F1EF}\u{1F1F5}', format: '##-####-####' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '\u{1F1E7}\u{1F1F7}', format: '(##) #####-####' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '\u{1F1F2}\u{1F1FD}', format: '## #### ####' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '\u{1F1E8}\u{1F1F3}', format: '### #### ####' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '\u{1F1F0}\u{1F1F7}', format: '##-####-####' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '\u{1F1EE}\u{1F1F9}', format: '### ### ####' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '\u{1F1EA}\u{1F1F8}', format: '### ## ## ##' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '\u{1F1F7}\u{1F1FA}', format: '(###) ###-##-##' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '\u{1F1FF}\u{1F1E6}', format: '## ### ####' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '\u{1F1F3}\u{1F1EC}', format: '### ### ####' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '\u{1F1E6}\u{1F1EA}', format: '## ### ####' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '\u{1F1F8}\u{1F1EC}', format: '#### ####' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '\u{1F1F3}\u{1F1FF}', format: '## ### ####' },
]

const useStyles = makeStyles((theme) => ({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    ...fontStyle(theme.typography, 'medium'),
    color: theme.colors.foreground,
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    minHeight: 48,
    overflow: 'hidden',
  },
  inputRowError: {
    borderColor: theme.colors.destructive,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.colors.foreground,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.destructive,
    marginTop: 2,
  },
  // Sheet styles
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  countryRowSelected: {
    backgroundColor: theme.colors.primary + '15',
  },
}))

// ── Format phone number ──────────────────────────────────────────────────────

function formatPhone(digits: string, format?: string): string {
  if (!format) return digits
  let result = ''
  let di = 0
  for (let i = 0; i < format.length && di < digits.length; i++) {
    if (format[i] === '#') {
      result += digits[di]
      di++
    } else {
      result += format[i]
    }
  }
  return result
}

function stripNonDigits(text: string): string {
  return text.replace(/\D/g, '')
}

// ── Country Picker Sheet ─────────────────────────────────────────────────────

interface CountryPickerProps {
  visible: boolean
  onClose: () => void
  countries: Country[]
  selectedCode: string
  onSelect: (country: Country) => void
}

const CountryPicker: React.FC<CountryPickerProps> = ({
  visible,
  onClose,
  countries,
  selectedCode,
  onSelect,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return countries
    const q = search.toLowerCase()
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.includes(q)
    )
  }, [countries, search])

  const handleSelect = (country: Country) => {
    onSelect(country)
    setSearch('')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <Pressable
          style={styles.sheetContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text variant="heading" style={{ textAlign: 'center' }}>
              Select Country
            </Text>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search countries..."
            placeholderTextColor={theme.colors.muted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            accessibilityLabel="Search countries"
          />
          <Separator />
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.countryRow,
                  item.code === selectedCode && styles.countryRowSelected,
                ]}
                onPress={() => handleSelect(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.name} ${item.dialCode}`}
              >
                <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      ...(item.code === selectedCode
                        ? fontStyle(theme.typography, 'semibold')
                        : fontStyle(theme.typography, 'regular')),
                      color: theme.colors.foreground,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.muted,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {item.dialCode}
                </Text>
                {item.code === selectedCode && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={theme.colors.primary}
                  />
                )}
              </Pressable>
            )}
            ItemSeparatorComponent={() => <Separator />}
          />
        </Pressable>
      </Pressable>
    </Modal>
  )
}

// ── PhoneInput ───────────────────────────────────────────────────────────────

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  defaultCountry = 'US',
  onCountryChange,
  countries,
  showFlag = true,
  showDialCode = true,
  disabled = false,
  error,
  label,
  placeholder = 'Phone number',
  haptic = true,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const inputRef = useRef<TextInput>(null)

  const countryList = countries ?? DEFAULT_COUNTRIES
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    () => countryList.find((c) => c.code === defaultCountry) ?? countryList[0]
  )
  const [pickerVisible, setPickerVisible] = useState(false)

  const focusScale = useSharedValue(1)
  const borderColor = useSharedValue(theme.colors.border)

  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
  }))

  const handleFocus = () => {
    focusScale.value = withSpring(1.005, { damping: 20, stiffness: 300 })
  }

  const handleBlur = () => {
    focusScale.value = withSpring(1, { damping: 20, stiffness: 300 })
  }

  const handleCountrySelect = useCallback(
    (country: Country) => {
      if (haptic && Haptics) Haptics.selectionAsync()
      setSelectedCountry(country)
      onCountryChange?.(country)
    },
    [haptic, onCountryChange]
  )

  const handleChangeText = useCallback(
    (text: string) => {
      const digits = stripNonDigits(text)
      onChangeText(digits)
    },
    [onChangeText]
  )

  const formattedValue = useMemo(
    () => formatPhone(value, selectedCountry.format),
    [value, selectedCountry.format]
  )

  const openPicker = () => {
    if (disabled) return
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setPickerVisible(true)
  }

  return (
    <View style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputRow,
          error ? styles.inputRowError : undefined,
          containerAnimStyle,
        ]}
      >
        {/* Country selector */}
        <Pressable
          style={styles.countryButton}
          onPress={openPicker}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Selected country: ${selectedCountry.name}. Tap to change.`}
        >
          {showFlag && (
            <Text style={{ fontSize: 20 }}>{selectedCountry.flag}</Text>
          )}
          {showDialCode && (
            <Text
              style={{
                fontSize: 15,
                ...fontStyle(theme.typography, 'medium'),
                color: theme.colors.foreground,
                fontVariant: ['tabular-nums'],
              }}
            >
              {selectedCountry.dialCode}
            </Text>
          )}
          <Ionicons
            name="chevron-down"
            size={14}
            color={theme.colors.muted}
          />
        </Pressable>

        {/* Phone number input */}
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={formattedValue}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          keyboardType="phone-pad"
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label ?? placeholder}
          accessibilityState={{ disabled }}
        />
      </Animated.View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <CountryPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        countries={countryList}
        selectedCode={selectedCountry.code}
        onSelect={handleCountrySelect}
      />
    </View>
  )
}
