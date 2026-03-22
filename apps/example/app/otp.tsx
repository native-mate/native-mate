import { useState } from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { OTPInput } from '../components/ui/otp-input'
import { Button } from '../components/ui/button'
import { Spinner } from '../components/ui/spinner'
import { Icon } from '../components/ui/icon'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'

export default function OTPScreen() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(false)

  const handleVerify = () => {
    setVerifying(true)
    setError(false)
    setTimeout(() => {
      setVerifying(false)
      if (code === '123456') {
        setVerified(true)
      } else {
        setError(true)
      }
    }, 2000)
  }

  const handleResend = () => {
    setCode('')
    setError(false)
    setVerified(false)
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 20 }}>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Icon name="arrow-back" size={16} />}
            onPress={() => router.back()}
            style={{ alignSelf: 'flex-start' }}
          >
            Back
          </Button>

          <View style={{ alignItems: 'center', gap: 8 }}>
            <View style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: verified ? '#22c55e20' : '#6366f120',
              alignItems: 'center', justifyContent: 'center', marginBottom: 8,
            }}>
              <Icon
                name={verified ? 'checkmark-circle' : 'mail-outline'}
                size={32}
                color={verified ? '#22c55e' : '#6366f1'}
              />
            </View>
            <Text variant="h3" align="center">
              {verified ? 'Verified!' : 'Enter verification code'}
            </Text>
            <Text variant="body" color="muted" align="center">
              {verified
                ? 'Your identity has been confirmed'
                : 'We sent a 6-digit code to j***@example.com'}
            </Text>
            {!verified && (
              <Badge variant="info" size="sm">Hint: try 123456</Badge>
            )}
          </View>

          {!verified && (
            <>
              <OTPInput
                length={6}
                value={code}
                onChange={(val) => { setCode(val); setError(false) }}
                onComplete={(val) => console.log('OTP complete:', val)}
                error={error}
                errorMessage="Invalid code. Please try again."
                autoFocus
              />

              {verifying && (
                <View style={{ alignItems: 'center', paddingVertical: 12, gap: 8 }}>
                  <Spinner size="md" />
                  <Text variant="bodySmall" color="muted">Verifying your code...</Text>
                </View>
              )}

              <Button onPress={handleVerify} disabled={code.length < 6 || verifying} loading={verifying}>
                Verify
              </Button>

              <Separator />

              <Button variant="ghost" onPress={handleResend} iconLeft={<Icon name="refresh-outline" size={16} />}>
                Resend code
              </Button>
            </>
          )}

          {verified && (
            <Button onPress={() => router.back()} iconLeft={<Icon name="checkmark-outline" size={18} />}>
              Continue
            </Button>
          )}

          <Separator label="Spinner sizes" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Spinner size="sm" />
              <Text variant="caption" color="muted">Small</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Spinner size="md" />
              <Text variant="caption" color="muted">Medium</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Spinner size="lg" />
              <Text variant="caption" color="muted">Large</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}
