'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { OTPInput } from '../../../../../packages/registry/components/otp-input/otp-input'

export default function OtpInputPreview() {
  const [v6, setV6] = useState('')
  const [v4, setV4] = useState('')
  const [secure, setSecure] = useState('')
  const [under, setUnder] = useState('')
  const [round, setRound] = useState('')
  const [alpha, setAlpha] = useState('')
  const [err, setErr] = useState('')

  return (
    <div className="space-y-10">
      <Preview title="Default (6-digit)" minHeight={140} code={`import { OTPInput } from '~/components/ui/otp-input'

const [value, setValue] = useState('')

<OTPInput
  value={value}
  onChange={setValue}
  length={6}
  hint="Enter the code sent to your email"
  resend
  onResend={() => {}}
  resendCooldown={30}
/>`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <OTPInput value={v6} onChange={setV6} onComplete={() => {}} length={6} hint="Enter the code sent to your email" resend onResend={() => {}} resendCooldown={30} />
        </View>
      </Preview>

      <Preview title="4-digit PIN" minHeight={120} code={`<OTPInput value={value} onChange={setValue} length={4} hint="Enter your 4-digit PIN" />`}>
        <View style={{ width: '100%', maxWidth: 280 }}>
          <OTPInput value={v4} onChange={setV4} length={4} hint="Enter your 4-digit PIN" />
        </View>
      </Preview>

      <Preview title="Secure (masked)" minHeight={120} code={`<OTPInput value={value} onChange={setValue} length={6} secure hint="Digits are hidden as you type" />`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <OTPInput value={secure} onChange={setSecure} length={6} secure hint="Digits are hidden as you type" />
        </View>
      </Preview>

      <Preview title="Variants" minHeight={280} code={`// default (box), underline, rounded
<OTPInput value={value} onChange={setValue} length={6} variant="default" />
<OTPInput value={value} onChange={setValue} length={6} variant="underline" />
<OTPInput value={value} onChange={setValue} length={6} variant="rounded" />`}>
        <View style={{ width: '100%', maxWidth: 380, gap: 24 }}>
          <OTPInput value={under} onChange={setUnder} length={6} variant="underline" />
          <OTPInput value={round} onChange={setRound} length={6} variant="rounded" />
        </View>
      </Preview>

      <Preview title="Alphanumeric" minHeight={120} code={`<OTPInput value={value} onChange={setValue} length={5} type="alphanumeric" hint="Letters and numbers" />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <OTPInput value={alpha} onChange={setAlpha} length={5} type="alphanumeric" hint="Letters and numbers" />
        </View>
      </Preview>

      <Preview title="Error state (shake)" minHeight={120} code={`<OTPInput value={value} onChange={setValue} length={6} error errorMessage="Invalid code. Please try again." />`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <OTPInput value={err} onChange={setErr} length={6} error errorMessage="Invalid code. Please try again." />
        </View>
      </Preview>

      <Preview title="Success state" minHeight={120} code={`<OTPInput value="123456" onChange={() => {}} length={6} success hint="Code verified successfully!" />`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <OTPInput value="123456" onChange={() => {}} length={6} success hint="Code verified successfully!" />
        </View>
      </Preview>
    </div>
  )
}
