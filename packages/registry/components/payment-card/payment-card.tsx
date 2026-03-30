// native-mate: payment-card@0.1.0 | hash:PLACEHOLDER
import React, { useCallback, useMemo } from 'react'
import { View, TextInput, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, shadow } from '@native-mate/core'
import type { PaymentCardProps, CardBrand } from './payment-card.types'

const brandColors: Record<CardBrand, [string, string]> = {
  visa: ['#1A1F71', '#2B3A8F'],
  mastercard: ['#EB001B', '#F79E1B'],
  amex: ['#006FCF', '#0080EF'],
  discover: ['#FF6000', '#FF8533'],
  generic: ['#374151', '#6B7280'],
}

const brandLabels: Record<CardBrand, string> = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'AMEX',
  discover: 'DISCOVER',
  generic: '',
}

function detectBrand(number: string): CardBrand {
  const clean = number.replace(/\s/g, '')
  if (/^4/.test(clean)) return 'visa'
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard'
  if (/^3[47]/.test(clean)) return 'amex'
  if (/^6(?:011|5)/.test(clean)) return 'discover'
  return 'generic'
}

function formatCardNumber(value: string): string {
  const clean = value.replace(/\D/g, '')
  const groups = clean.match(/.{1,4}/g)
  return groups ? groups.join(' ') : clean
}

function maskCardNumber(value: string): string {
  const clean = value.replace(/\s/g, '')
  if (clean.length <= 4) return clean
  const last4 = clean.slice(-4)
  const masked = clean.slice(0, -4).replace(/./g, '\u2022')
  const groups = (masked + last4).match(/.{1,4}/g)
  return groups ? groups.join(' ') : value
}

function formatExpiry(value: string): string {
  const clean = value.replace(/\D/g, '')
  if (clean.length <= 2) return clean
  return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`
}

const useStyles = makeStyles((theme) => ({
  // Display card
  displayCard: {
    borderRadius: theme.radius.lg,
    padding: 24,
    aspectRatio: 1.586,
    justifyContent: 'space-between',
    ...shadow(4),
  },
  displayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chip: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1,
  },
  cardNumberDisplay: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  displayBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  displayLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  displayValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // Input variant
  inputContainer: {
    gap: theme.spacing.md,
  },
  inputField: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: theme.typography.size.md,
    color: theme.colors.foreground,
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  inputLabel: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.muted,
    marginBottom: 4,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.destructive,
    marginTop: 2,
  },
}))

export const PaymentCard: React.FC<PaymentCardProps> = ({
  cardNumber = '',
  cardholderName = '',
  expiryDate = '',
  cvc = '',
  brand,
  variant = 'display',
  onCardNumberChange,
  onExpiryChange,
  onCvcChange,
  onCardholderNameChange,
  errors = {},
  disabled = false,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const detectedBrand = brand ?? detectBrand(cardNumber)
  const colors = brandColors[detectedBrand]

  const handleCardNumberChange = useCallback(
    (text: string) => {
      const clean = text.replace(/\D/g, '').slice(0, 16)
      onCardNumberChange?.(clean)
    },
    [onCardNumberChange],
  )

  const handleExpiryChange = useCallback(
    (text: string) => {
      const clean = text.replace(/\D/g, '').slice(0, 4)
      onExpiryChange?.(clean)
    },
    [onExpiryChange],
  )

  const handleCvcChange = useCallback(
    (text: string) => {
      const maxLen = detectedBrand === 'amex' ? 4 : 3
      const clean = text.replace(/\D/g, '').slice(0, maxLen)
      onCvcChange?.(clean)
    },
    [onCvcChange, detectedBrand],
  )

  if (variant === 'display') {
    return (
      <View
        style={[
          styles.displayCard,
          {
            backgroundColor: colors[0],
          },
          disabled && { opacity: 0.5 },
          style,
        ]}
        accessibilityRole="summary"
        accessibilityLabel={`Payment card ending in ${cardNumber.slice(-4)}`}
        {...rest}
      >
        <View style={styles.displayTop}>
          <View style={styles.chip} />
          <Text variant="label" style={styles.brandText}>
            {brandLabels[detectedBrand]}
          </Text>
        </View>
        <Text variant="label" style={styles.cardNumberDisplay}>
          {maskCardNumber(cardNumber || '0000000000000000')}
        </Text>
        <View style={styles.displayBottom}>
          <View>
            <Text variant="caption" style={styles.displayLabel}>
              Card Holder
            </Text>
            <Text variant="body" style={styles.displayValue}>
              {cardholderName || 'YOUR NAME'}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant="caption" style={styles.displayLabel}>
              Expires
            </Text>
            <Text variant="body" style={styles.displayValue}>
              {formatExpiry(expiryDate) || 'MM/YY'}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  // Input variant
  return (
    <View
      style={[styles.inputContainer, disabled && { opacity: 0.5 }, style]}
      accessibilityRole="form"
      accessibilityLabel="Payment card form"
      {...rest}
    >
      <View>
        <Text variant="caption" style={styles.inputLabel}>
          Card Number
        </Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            value={formatCardNumber(cardNumber)}
            onChangeText={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={theme.colors.muted}
            keyboardType="number-pad"
            maxLength={19}
            editable={!disabled}
            style={[
              styles.inputField,
              errors.cardNumber != null && styles.inputError,
              { paddingRight: 44 },
            ]}
            accessibilityLabel="Card number"
          />
          <View
            style={{
              position: 'absolute',
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="card-outline"
              size={20}
              color={theme.colors.muted}
            />
          </View>
        </View>
        {errors.cardNumber != null && (
          <Text variant="caption" style={styles.errorText}>
            {errors.cardNumber}
          </Text>
        )}
      </View>
      <View>
        <Text variant="caption" style={styles.inputLabel}>
          Cardholder Name
        </Text>
        <TextInput
          value={cardholderName}
          onChangeText={onCardholderNameChange}
          placeholder="John Doe"
          placeholderTextColor={theme.colors.muted}
          autoCapitalize="words"
          editable={!disabled}
          style={[
            styles.inputField,
            errors.cardholderName != null && styles.inputError,
          ]}
          accessibilityLabel="Cardholder name"
        />
        {errors.cardholderName != null && (
          <Text variant="caption" style={styles.errorText}>
            {errors.cardholderName}
          </Text>
        )}
      </View>
      <View style={styles.inputRow}>
        <View style={{ flex: 1 }}>
          <Text variant="caption" style={styles.inputLabel}>
            Expiry Date
          </Text>
          <TextInput
            value={formatExpiry(expiryDate)}
            onChangeText={handleExpiryChange}
            placeholder="MM/YY"
            placeholderTextColor={theme.colors.muted}
            keyboardType="number-pad"
            maxLength={5}
            editable={!disabled}
            style={[
              styles.inputField,
              errors.expiryDate != null && styles.inputError,
            ]}
            accessibilityLabel="Expiry date"
          />
          {errors.expiryDate != null && (
            <Text variant="caption" style={styles.errorText}>
              {errors.expiryDate}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" style={styles.inputLabel}>
            CVC
          </Text>
          <TextInput
            value={cvc}
            onChangeText={handleCvcChange}
            placeholder={detectedBrand === 'amex' ? '1234' : '123'}
            placeholderTextColor={theme.colors.muted}
            keyboardType="number-pad"
            maxLength={detectedBrand === 'amex' ? 4 : 3}
            secureTextEntry
            editable={!disabled}
            style={[
              styles.inputField,
              errors.cvc != null && styles.inputError,
            ]}
            accessibilityLabel="CVC security code"
          />
          {errors.cvc != null && (
            <Text variant="caption" style={styles.errorText}>
              {errors.cvc}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}
