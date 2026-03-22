import { useState } from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { Icon } from '../components/ui/icon'

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [loading, setLoading] = useState(false)

  const emailError = emailTouched && email.length > 0 && !isValidEmail(email)
    ? 'Please enter a valid email address'
    : emailTouched && email.length === 0 ? 'Email is required' : undefined

  const passwordError = passwordTouched && password.length === 0
    ? 'Password is required'
    : passwordTouched && password.length < 6 ? 'Password must be at least 6 characters' : undefined

  const canSubmit = isValidEmail(email) && password.length >= 6

  const handleSignIn = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16 }}>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Icon name="arrow-back" size={16} />}
            onPress={() => router.back()}
            style={{ alignSelf: 'flex-start', marginBottom: 8 }}
          >
            Back
          </Button>

          <Text variant="h3">Welcome back</Text>
          <Text variant="body" color="muted">Sign in to your account to continue</Text>

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setEmailTouched(true)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            hint="We'll never share your email"
            prefix={<Icon name="mail-outline" size={18} />}
            clearable
            onClear={() => setEmail('')}
            required
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => setPasswordTouched(true)}
            secureTextEntry
            showPasswordToggle
            error={passwordError}
            hint="Minimum 6 characters"
            prefix={<Icon name="lock-closed-outline" size={18} />}
            maxLength={32}
            showCount
            required
          />

          <Button onPress={handleSignIn} disabled={!canSubmit} loading={loading}>
            Sign In
          </Button>

          <Button variant="ghost" onPress={() => {}}>Forgot Password?</Button>

          <Separator label="or continue with" />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button
              variant="outline"
              iconLeft={<Icon name="logo-google" size={18} />}
              onPress={() => {}}
              style={{ flex: 1 }}
            >
              Google
            </Button>
            <Button
              variant="outline"
              iconLeft={<Icon name="logo-apple" size={18} />}
              onPress={() => {}}
              style={{ flex: 1 }}
            >
              Apple
            </Button>
          </View>

          <Text variant="bodySmall" color="muted" align="center">
            Don't have an account? Sign up
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}
