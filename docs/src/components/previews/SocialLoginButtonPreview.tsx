'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { SocialLoginButton } from '../../../../packages/registry/components/social-login-button/social-login-button'

export default function SocialLoginButtonPreview() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const simulateLogin = (provider: string) => {
    setLoadingProvider(provider)
    setTimeout(() => setLoadingProvider(null), 1500)
  }

  return (
    <div className="space-y-10">
      <Preview title="Providers" code={`import { SocialLoginButton } from '~/components/ui/social-login-button'

<SocialLoginButton provider="google" onPress={() => {}} />
<SocialLoginButton provider="apple" onPress={() => {}} />
<SocialLoginButton provider="github" onPress={() => {}} />
<SocialLoginButton provider="facebook" onPress={() => {}} />
<SocialLoginButton provider="twitter" onPress={() => {}} />
<SocialLoginButton provider="discord" onPress={() => {}} />`}>
        <View style={{ gap: 10, width: 280 }}>
          <SocialLoginButton provider="google" onPress={() => {}} />
          <SocialLoginButton provider="apple" onPress={() => {}} />
          <SocialLoginButton provider="github" onPress={() => {}} />
          <SocialLoginButton provider="facebook" onPress={() => {}} />
          <SocialLoginButton provider="twitter" onPress={() => {}} />
          <SocialLoginButton provider="discord" onPress={() => {}} />
        </View>
      </Preview>

      <Preview title="Outlined variant" code={`<SocialLoginButton provider="google" variant="outlined" onPress={() => {}} />
<SocialLoginButton provider="apple" variant="outlined" onPress={() => {}} />
<SocialLoginButton provider="github" variant="outlined" onPress={() => {}} />`}>
        <View style={{ gap: 10, width: 280 }}>
          <SocialLoginButton provider="google" variant="outlined" onPress={() => {}} />
          <SocialLoginButton provider="apple" variant="outlined" onPress={() => {}} />
          <SocialLoginButton provider="github" variant="outlined" onPress={() => {}} />
        </View>
      </Preview>

      <Preview title="Sizes" code={`<SocialLoginButton provider="google" size="md" onPress={() => {}} />
<SocialLoginButton provider="google" size="lg" onPress={() => {}} />`}>
        <View style={{ gap: 10, width: 280 }}>
          <SocialLoginButton provider="google" size="md" onPress={() => {}} />
          <SocialLoginButton provider="google" size="lg" onPress={() => {}} />
        </View>
      </Preview>

      <Preview title="Custom label" code={`<SocialLoginButton provider="apple" label="Sign in with Apple ID" onPress={() => {}} />`}>
        <View style={{ width: 280 }}>
          <SocialLoginButton provider="apple" label="Sign in with Apple ID" onPress={() => {}} />
        </View>
      </Preview>

      <Preview title="Loading state" code={`const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

<SocialLoginButton
  provider="google"
  loading={loadingProvider === 'google'}
  onPress={() => simulateLogin('google')}
/>`}>
        <View style={{ gap: 10, width: 280 }}>
          <SocialLoginButton
            provider="google"
            loading={loadingProvider === 'google'}
            onPress={() => simulateLogin('google')}
          />
          <SocialLoginButton
            provider="github"
            loading={loadingProvider === 'github'}
            onPress={() => simulateLogin('github')}
          />
        </View>
      </Preview>

      <Preview title="Disabled" code={`<SocialLoginButton provider="facebook" disabled onPress={() => {}} />`}>
        <View style={{ width: 280 }}>
          <SocialLoginButton provider="facebook" disabled onPress={() => {}} />
        </View>
      </Preview>
    </div>
  )
}
