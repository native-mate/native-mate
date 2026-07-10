'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { BiometricPrompt } from '../../../../packages/registry/components/biometric-prompt/biometric-prompt'
import { Text } from '@native-mate/core'

function TriggerBtn({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <View
      style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#6366f1', alignItems: 'center' }}
      // @ts-ignore web
      onClick={onPress}
    >
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </View>
  )
}

export default function BiometricPromptPreview() {
  const [faceIdOpen, setFaceIdOpen] = useState(false)
  const [fingerprintOpen, setFingerprintOpen] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="Face ID" code={`import { BiometricPrompt } from '~/components/ui/biometric-prompt'

const [open, setOpen] = useState(false)

<BiometricPrompt
  visible={open}
  type="faceId"
  title="Authenticate"
  subtitle="Use Face ID to verify your identity"
  onAuthenticate={() => { /* run real auth */ }}
  onCancel={() => setOpen(false)}
/>`}>
        <TriggerBtn onPress={() => setFaceIdOpen(true)} label="Show Face ID prompt" />
        <BiometricPrompt
          visible={faceIdOpen}
          type="faceId"
          title="Authenticate"
          subtitle="Use Face ID to verify your identity"
          onAuthenticate={() => setFaceIdOpen(false)}
          onCancel={() => setFaceIdOpen(false)}
        />
      </Preview>

      <Preview title="Fingerprint with passcode fallback" code={`<BiometricPrompt
  visible={open}
  type="fingerprint"
  title="Unlock App"
  subtitle="Use your fingerprint to continue"
  fallbackLabel="Use Passcode"
  onAuthenticate={handleAuth}
  onFallback={() => usePasscodeInstead()}
  onCancel={() => setOpen(false)}
/>`}>
        <TriggerBtn onPress={() => setFingerprintOpen(true)} label="Show fingerprint prompt" />
        <BiometricPrompt
          visible={fingerprintOpen}
          type="fingerprint"
          title="Unlock App"
          subtitle="Use your fingerprint to continue"
          fallbackLabel="Use Passcode"
          onAuthenticate={() => setFingerprintOpen(false)}
          onFallback={() => setFingerprintOpen(false)}
          onCancel={() => setFingerprintOpen(false)}
        />
      </Preview>
    </div>
  )
}
