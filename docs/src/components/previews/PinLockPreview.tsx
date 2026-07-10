'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { PinLock } from '../../../../packages/registry/components/pin-lock/pin-lock'

export default function PinLockPreview() {
  const [error, setError] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="4-digit PIN" minHeight={520} code={`import { PinLock } from '~/components/ui/pin-lock'

<PinLock
  length={4}
  title="Enter PIN"
  subtitle="Enter your 4-digit passcode"
  onComplete={(pin) => console.log(pin)}
/>`}>
        <View style={{ width: 320, height: 480 }}>
          <PinLock length={4} title="Enter PIN" subtitle="Enter your 4-digit passcode" onComplete={(pin) => console.log(pin)} />
        </View>
      </Preview>

      <Preview title="6-digit PIN with biometric" minHeight={560} code={`<PinLock
  length={6}
  title="Welcome back"
  subtitle="Enter your PIN to continue"
  showBiometric
  onBiometric={() => console.log('biometric requested')}
  onComplete={(pin) => console.log(pin)}
/>`}>
        <View style={{ width: 320, height: 520 }}>
          <PinLock
            length={6}
            title="Welcome back"
            subtitle="Enter your PIN to continue"
            showBiometric
            onBiometric={() => console.log('biometric requested')}
            onComplete={(pin) => console.log(pin)}
          />
        </View>
      </Preview>

      <Preview title="Error state (shake + attempts remaining)" minHeight={520} code={`const [error, setError] = useState(false)

<PinLock
  length={4}
  title="Enter PIN"
  error={error}
  errorMessage="Incorrect PIN"
  attemptsRemaining={2}
  onComplete={() => setError(true)}
/>`}>
        <View style={{ width: 320, height: 480 }}>
          <PinLock
            length={4}
            title="Enter PIN"
            error={error}
            errorMessage="Incorrect PIN"
            attemptsRemaining={2}
            onComplete={() => setError(true)}
          />
        </View>
      </Preview>

      <Preview title="Locked out" minHeight={520} code={`<PinLock
  length={4}
  title="Too many attempts"
  locked
  lockDuration={30}
/>`}>
        <View style={{ width: 320, height: 480 }}>
          <PinLock length={4} title="Too many attempts" locked lockDuration={30} />
        </View>
      </Preview>
    </div>
  )
}
