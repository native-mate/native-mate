import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { Icon } from '../components/ui/icon'
import { Card, CardContent } from '../components/ui/card'
import { DividerLabel } from '../components/ui/divider-label'
import { SocialLoginButton } from '../components/ui/social-login-button'
import { PinLock } from '../components/ui/pin-lock'
import { BiometricPrompt } from '../components/ui/biometric-prompt'
import { OnboardingScreen } from '../components/ui/onboarding-screen'

export default function AuthShowcaseScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [biometricVisible, setBiometricVisible] = useState(false)
  const [pinValue, setPinValue] = useState('')
  const [pinError, setPinError] = useState<string | undefined>(undefined)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const handleSocialLogin = (provider: string) => {
    setSocialLoading(provider)
    setTimeout(() => setSocialLoading(null), 2000)
  }

  const handlePinComplete = (pin: string) => {
    if (pin === '1234') {
      setPinError(undefined)
    } else {
      setPinError('Incorrect PIN. Try 1234')
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <Text variant="h3">Auth & Onboarding</Text>
              <Text variant="caption" color="muted">Social login, PIN, biometrics</Text>
            </View>
            <Button variant="ghost" size="sm" iconLeft={<Icon name="arrow-back" size={16} />} onPress={() => router.back()}>
              Back
            </Button>
          </View>

          <DividerLabel label="Social Login" />

          {/* Social Login Buttons */}
          <View style={{ gap: 12 }}>
            <SocialLoginButton
              provider="google"
              onPress={() => handleSocialLogin('google')}
              loading={socialLoading === 'google'}
              size="lg"
            />
            <SocialLoginButton
              provider="apple"
              onPress={() => handleSocialLogin('apple')}
              loading={socialLoading === 'apple'}
              size="lg"
            />
            <SocialLoginButton
              provider="github"
              onPress={() => handleSocialLogin('github')}
              loading={socialLoading === 'github'}
              variant="outlined"
              size="lg"
            />
            <SocialLoginButton
              provider="discord"
              onPress={() => handleSocialLogin('discord')}
              loading={socialLoading === 'discord'}
              variant="outlined"
              size="lg"
            />
          </View>

          <DividerLabel label="Security" />

          {/* PIN Lock */}
          <Card>
            <CardContent style={{ paddingTop: 16, alignItems: 'center' }}>
              <Text variant="label" style={{ marginBottom: 8 }}>Enter PIN (try 1234)</Text>
              <PinLock
                length={4}
                onComplete={handlePinComplete}
                error={pinError}
                title="Secure Access"
                subtitle="Enter your 4-digit PIN"
                showBiometric
                onBiometric={() => setBiometricVisible(true)}
              />
            </CardContent>
          </Card>

          {/* Biometric Button */}
          <Button
            variant="outline"
            fullWidth
            iconLeft={<Icon name="finger-print-outline" size={20} />}
            onPress={() => setBiometricVisible(true)}
          >
            Test Biometric Prompt
          </Button>

          {/* Biometric Prompt */}
          <BiometricPrompt
            visible={biometricVisible}
            onAuthenticate={() => setBiometricVisible(false)}
            onCancel={() => setBiometricVisible(false)}
            title="Authenticate"
            subtitle="Verify your identity to continue"
            type="fingerprint"
            fallbackLabel="Use PIN instead"
          />

          <DividerLabel label="Onboarding Preview" />

          {/* Onboarding Screen Preview */}
          <Card>
            <CardContent style={{ paddingTop: 16 }}>
              <View style={{
                height: 360,
                borderRadius: theme.radius.lg,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}>
                <OnboardingScreen
                  image={
                    <View style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: theme.colors.primary + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon name="rocket-outline" size={56} color={theme.colors.primary} />
                    </View>
                  }
                  title="Welcome to Native Mate"
                  description="Build beautiful, production-ready React Native apps with 80+ components, animations, and theme presets."
                  index={0}
                  total={3}
                  onNext={() => {}}
                  onSkip={() => {}}
                  showSkip
                  showDots
                />
              </View>
            </CardContent>
          </Card>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
