'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Switch } from '../../../../packages/registry/components/switch/switch'

export default function SwitchPreview() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [dark, setDark] = useState(false)
  const [notif, setNotif] = useState(true)
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="Default" code={`import { Switch } from '~/components/ui/switch'

const [on, setOn] = useState(false)

<Switch value={on} onValueChange={setOn} />`}>
        <View style={{ gap: 16 }}>
          <Switch value={a} onValueChange={setA} />
          <Switch value={b} onValueChange={setB} />
        </View>
      </Preview>

      <Preview title="With label" code={`<Switch
  value={on}
  onValueChange={setOn}
  label="Dark mode"
  description="Switch to dark color scheme"
/>`}>
        <View style={{ gap: 16, width: '100%', maxWidth: 320 }}>
          <Switch
            value={dark}
            onValueChange={setDark}
            label="Dark mode"
            description="Switch to dark color scheme"
          />
          <Switch
            value={notif}
            onValueChange={setNotif}
            label="Push notifications"
            description="Receive alerts for new messages"
          />
        </View>
      </Preview>

      <Preview title="Sizes" code={`<Switch value={true} onValueChange={() => {}} size="sm" label="Small" />
<Switch value={true} onValueChange={() => {}} size="md" label="Medium" />
<Switch value={true} onValueChange={() => {}} size="lg" label="Large" />`}>
        <View style={{ gap: 16 }}>
          <Switch value={true} onValueChange={() => {}} size="sm" label="Small" />
          <Switch value={true} onValueChange={() => {}} size="md" label="Medium" />
          <Switch value={true} onValueChange={() => {}} size="lg" label="Large" />
        </View>
      </Preview>

      <Preview title="Custom colors" code={`<Switch value={true} onValueChange={() => {}} color="#10b981" label="Emerald" />
<Switch value={true} onValueChange={() => {}} color="#f43f5e" label="Rose" />
<Switch value={true} onValueChange={() => {}} color="#8b5cf6" label="Violet" />`}>
        <View style={{ gap: 16 }}>
          <Switch value={true} onValueChange={() => {}} color="#10b981" label="Emerald" />
          <Switch value={true} onValueChange={() => {}} color="#f43f5e" label="Rose" />
          <Switch value={true} onValueChange={() => {}} color="#8b5cf6" label="Violet" />
        </View>
      </Preview>

      <Preview title="Loading & disabled" code={`<Switch value={loading} onValueChange={setLoading} loading label="Loading state" />
<Switch value={true} onValueChange={() => {}} disabled label="Disabled on" />
<Switch value={false} onValueChange={() => {}} disabled label="Disabled off" />`}>
        <View style={{ gap: 16 }}>
          <Switch value={loading} onValueChange={setLoading} loading label="Loading state" />
          <Switch value={true} onValueChange={() => {}} disabled label="Disabled on" />
          <Switch value={false} onValueChange={() => {}} disabled label="Disabled off" />
        </View>
      </Preview>
    </div>
  )
}
