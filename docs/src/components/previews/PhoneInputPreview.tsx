'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { PhoneInput } from '../../../../packages/registry/components/phone-input/phone-input'

export default function PhoneInputPreview() {
  const [phone1, setPhone1] = useState('')
  const [phone2, setPhone2] = useState('4155551234')
  const [phone3, setPhone3] = useState('')

  return (
    <div className="space-y-10">
      <Preview title="Default" minHeight={100} code={`import { PhoneInput } from '~/components/ui/phone-input'

const [phone, setPhone] = useState('')

<PhoneInput
  value={phone}
  onChangeText={setPhone}
  label="Phone number"
/>`}>
        <View style={{ width: 320 }}>
          <PhoneInput value={phone1} onChangeText={setPhone1} label="Phone number" />
        </View>
      </Preview>

      <Preview title="Default country + pre-filled value" minHeight={100} code={`<PhoneInput
  value={phone}
  onChangeText={setPhone}
  defaultCountry="US"
  label="Mobile number"
/>`}>
        <View style={{ width: 320 }}>
          <PhoneInput value={phone2} onChangeText={setPhone2} defaultCountry="US" label="Mobile number" />
        </View>
      </Preview>

      <Preview title="Error state" minHeight={100} code={`<PhoneInput
  value={phone}
  onChangeText={setPhone}
  label="Phone number"
  error="Enter a valid phone number"
/>`}>
        <View style={{ width: 320 }}>
          <PhoneInput value={phone3} onChangeText={setPhone3} label="Phone number" error="Enter a valid phone number" />
        </View>
      </Preview>

      <Preview title="Without flag / dial code, disabled" minHeight={100} code={`<PhoneInput value="4155551234" onChangeText={() => {}} showFlag={false} showDialCode={false} />
<PhoneInput value="4155551234" onChangeText={() => {}} disabled />`}>
        <View style={{ width: 320, gap: 12 }}>
          <PhoneInput value="4155551234" onChangeText={() => {}} showFlag={false} showDialCode={false} />
          <PhoneInput value="4155551234" onChangeText={() => {}} disabled />
        </View>
      </Preview>
    </div>
  )
}
