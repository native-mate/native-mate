'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Separator } from '../../../../packages/registry/components/separator/separator'
import { Button } from '../../../../packages/registry/components/button/button'

export default function SeparatorPreview() {
  return (
    <div className="space-y-10">

      <Preview
        title="Default (horizontal)"
        code={`<Separator />`}
        minHeight={80}
      >
        <View style={{ width: '100%', maxWidth: 320 }}>
          <Separator />
        </View>
      </Preview>

      <Preview
        title="With label"
        code={`<Separator label="or" />
<Separator label="continue with" />
<Separator label="today" />`}
        minHeight={120}
      >
        <View style={{ width: '100%', maxWidth: 320, gap: 0 }}>
          <Separator label="or" />
          <Separator label="continue with" />
          <Separator label="today" />
        </View>
      </Preview>

      <Preview
        title="Dashed"
        code={`<Separator dashed />
<Separator dashed label="or" />`}
        minHeight={100}
      >
        <View style={{ width: '100%', maxWidth: 320 }}>
          <Separator dashed />
          <Separator dashed label="or" />
        </View>
      </Preview>

      <Preview
        title="Thickness & color"
        code={`<Separator thickness={1} />
<Separator thickness={2} color="#6366f1" />
<Separator thickness={4} color="#22c55e" />`}
        minHeight={120}
      >
        <View style={{ width: '100%', maxWidth: 320 }}>
          <Separator thickness={1} />
          <Separator thickness={2} color="#6366f1" />
          <Separator thickness={4} color="#22c55e" />
        </View>
      </Preview>

      <Preview
        title="Vertical"
        code={`<View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
  <Button variant="ghost" size="sm">Cut</Button>
  <Separator orientation="vertical" spacing={4} />
  <Button variant="ghost" size="sm">Copy</Button>
  <Separator orientation="vertical" spacing={4} />
  <Button variant="ghost" size="sm">Paste</Button>
</View>`}
        minHeight={80}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
          <Button variant="ghost" size="sm">Cut</Button>
          <Separator orientation="vertical" spacing={4} />
          <Button variant="ghost" size="sm">Copy</Button>
          <Separator orientation="vertical" spacing={4} />
          <Button variant="ghost" size="sm">Paste</Button>
        </View>
      </Preview>

      <Preview
        title="Custom spacing"
        code={`<Separator spacing={4} />
<Separator spacing={16} />
<Separator spacing={24} />`}
        minHeight={160}
      >
        <View style={{ width: '100%', maxWidth: 320 }}>
          <Separator spacing={4}  label="tight" />
          <Separator spacing={16} label="normal" />
          <Separator spacing={24} label="loose" />
        </View>
      </Preview>

    </div>
  )
}
