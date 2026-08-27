// native-mate: phone-input@0.1.0 | hash:PLACEHOLDER
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { View, TextInput, Pressable, FlatList, Modal } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import {
  useTheme,
  useMotion,
  withAlpha,
  Text,
  makeStyles,
  Separator,
  fontStyle,
  resolveError,
  useHaptics,
  useStrings,
} from '@native-mate/core'
import type { PhoneInputProps, PhoneInputHandle, Country } from './phone-input.types'

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
    backgroundColor: withAlpha(theme.colors.primary, 0.08),
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

// Number of digit slots ('#') a mask can hold — the display truncates to this
// many digits, so the underlying value must be truncated to match.
function maskDigitCapacity(format?: string): number | undefined {
  if (!format) return undefined
  return (format.match(/#/g) ?? []).length
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
  const strings = useStrings()
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
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
            accessibilityLabel={strings.search}
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

export const PhoneInput = forwardRef<PhoneInputHandle, PhoneInputProps>(function PhoneInput(
  {
    value,
    onChangeText,
    onChangeFormatted,
    country,
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
    testID,
    style,
  },
  ref
) {
  const theme = useTheme()
  const motion = useMotion()
  const styles = useStyles()
  const haptics = useHaptics()
  const inputRef = useRef<TextInput>(null)

  const { hasError, message: errorText } = resolveError(error)

  const countryList = countries && countries.length > 0 ? countries : DEFAULT_COUNTRIES
  const [internalCountry, setInternalCountry] = useState<Country>(
    () => countryList.find((c) => c.code === defaultCountry) ?? countryList[0]
  )
  const [pickerVisible, setPickerVisible] = useState(false)

  // A `country` prop makes the component controlled: it wins over internal
  // state, and later changes to it are honoured (unlike `defaultCountry`,
  // which only seeds the initial value).
  const isControlled = country != null
  const selectedCountry = useMemo(() => {
    if (!isControlled) return internalCountry
    return countryList.find((c) => c.code === country) ?? internalCountry
  }, [isControlled, country, countryList, internalCountry])

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => {
        onChangeText('')
        inputRef.current?.clear()
      },
    }),
    [onChangeText]
  )

  const focusScale = useSharedValue(1)

  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
  }))

  // Read outside the worklet — hooks must never be called inside one.
  const springConfig = motion.spring()

  const handleFocus = () => {
    focusScale.value = withSpring(1.005, springConfig)
  }

  const handleBlur = () => {
    focusScale.value = withSpring(1, springConfig)
  }

  const handleCountrySelect = useCallback(
    (nextCountry: Country) => {
      haptics.trigger(haptic)
      if (!isControlled) setInternalCountry(nextCountry)
      onCountryChange?.(nextCountry)
    },
    [haptic, isControlled, onCountryChange]
  )

  const handleChangeText = useCallback(
    (text: string) => {
      const capacity = maskDigitCapacity(selectedCountry.format)
      const digits = capacity != null
        ? stripNonDigits(text).slice(0, capacity)
        : stripNonDigits(text)
      onChangeText(digits)
      if (onChangeFormatted) {
        const dial = selectedCountry.dialCode.startsWith('+')
          ? selectedCountry.dialCode
          : `+${selectedCountry.dialCode}`
        const isValid = capacity != null ? digits.length === capacity : digits.length > 0
        onChangeFormatted(`${dial}${digits}`, isValid)
      }
    },
    [onChangeText, onChangeFormatted, selectedCountry.format, selectedCountry.dialCode]
  )

  const formattedValue = useMemo(
    () => formatPhone(value, selectedCountry.format),
    [value, selectedCountry.format]
  )

  const openPicker = () => {
    if (disabled) return
    haptics.trigger(haptic)
    setPickerVisible(true)
  }

  return (
    <View style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]} testID={testID}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputRow,
          hasError ? styles.inputRowError : undefined,
          containerAnimStyle,
        ]}
      >
        {/* Country selector */}
        <Pressable
          style={styles.countryButton}
          onPress={openPicker}
          disabled={disabled}
          testID={testID ? `${testID}-country` : undefined}
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
          autoComplete="tel"
          textContentType="telephoneNumber"
          maxLength={selectedCountry.format?.length}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label ?? placeholder}
          accessibilityState={{ disabled }}
          testID={testID ? `${testID}-input` : undefined}
        />
      </Animated.View>

      {errorText && <Text style={styles.errorText}>{errorText}</Text>}

      <CountryPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        countries={countryList}
        selectedCode={selectedCountry.code}
        onSelect={handleCountrySelect}
      />
    </View>
  )
})
