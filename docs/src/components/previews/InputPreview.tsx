'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@native-mate/core'
import { Preview } from './shared/Preview'
import { Input } from '../../../../../packages/registry/components/input/input'

export default function InputPreview() {
  const [val, setVal] = useState('')
  const [pw, setPw] = useState('')
  const [search, setSearch] = useState('')
  const [bio, setBio] = useState('')
  const [amount, setAmount] = useState('')
  const [floatVal, setFloatVal] = useState('')

  return (
    <div className="space-y-10">
      <Preview title="Default" code={`import { Input } from '~/components/ui/input'

<Input label="Email" placeholder="you@example.com" />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Input label="Email" placeholder="you@example.com" value={val} onChangeText={setVal} />
        </View>
      </Preview>

      <Preview title="Sizes" code={`<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium (default)" />
<Input size="lg" placeholder="Large" />`}>
        <View style={{ gap: 12, width: '100%', maxWidth: 340 }}>
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium (default)" />
          <Input size="lg" placeholder="Large" />
        </View>
      </Preview>

      <Preview title="Prefix & suffix" code={`<Input label="Price" placeholder="0.00" prefixText="$" suffixText="USD" />
<Input label="Website" placeholder="example.com" prefixText="https://" />
<Input
  placeholder="Search..."
  prefix={<Ionicons name="search" size={16} color="#71717a" />}
  clearable
/>`}>
        <View style={{ gap: 12, width: '100%', maxWidth: 340 }}>
          <Input label="Price" placeholder="0.00" prefixText="$" suffixText="USD" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
          <Input
            placeholder="Search..."
            prefix={<Ionicons name="search" size={16} color="#71717a" />}
            clearable
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </Preview>

      <Preview title="Password with toggle" code={`<Input
  label="Password"
  placeholder="••••••••"
  secureTextEntry
  showPasswordToggle
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Input label="Password" placeholder="••••••••" secureTextEntry showPasswordToggle value={pw} onChangeText={setPw} />
        </View>
      </Preview>

      <Preview title="Character count" code={`<Input label="Bio" showCount maxLength={100} />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Input label="Bio" placeholder="Write something..." showCount maxLength={100} value={bio} onChangeText={setBio} />
        </View>
      </Preview>

      <Preview title="Floating label" code={`<Input floatingLabel label="Email Address" placeholder="you@example.com" />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Input floatingLabel label="Email Address" placeholder="you@example.com" value={floatVal} onChangeText={setFloatVal} />
        </View>
      </Preview>

      <Preview title="Error with shake" code={`<Input label="Username" placeholder="johndoe" error="Username is already taken" />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Input label="Username" placeholder="johndoe" error="Username is already taken" />
        </View>
      </Preview>

      <Preview title="With hint" code={`<Input label="Username" placeholder="johndoe" hint="Must be at least 3 characters" />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Input label="Username" placeholder="johndoe" hint="Must be at least 3 characters" />
        </View>
      </Preview>

      <Preview title="Disabled" code={`<Input label="Company" value="Acme Inc." disabled />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Input label="Company" value="Acme Inc." disabled />
        </View>
      </Preview>
    </div>
  )
}
