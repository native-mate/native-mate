'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Spinner } from '../../../../packages/registry/components/spinner/spinner'

export default function SpinnerPreview() {
  return (
    <div className="space-y-10">

      <Preview
        title="Variants"
        code={`<Spinner variant="circle" />
<Spinner variant="dots" />
<Spinner variant="pulse" />`}
      >
        <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
          <Spinner variant="circle" />
          <Spinner variant="dots" />
          <Spinner variant="pulse" />
        </View>
      </Preview>

      <Preview
        title="Sizes"
        code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size={56} />`}
      >
        <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size={56} />
        </View>
      </Preview>

      <Preview
        title="Colors"
        code={`<Spinner color="primary" />
<Spinner color="success" />
<Spinner color="warning" />
<Spinner color="destructive" />
<Spinner color="foreground" />
<Spinner color="muted" />
<Spinner color="#a78bfa" />`}
      >
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Spinner color="primary" />
          <Spinner color="success" />
          <Spinner color="warning" />
          <Spinner color="destructive" />
          <Spinner color="foreground" />
          <Spinner color="muted" />
          <Spinner color="#a78bfa" />
        </View>
      </Preview>

      <Preview
        title="Speed"
        code={`<Spinner speed="slow" />
<Spinner speed="normal" />
<Spinner speed="fast" />`}
      >
        <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
          <Spinner speed="slow"   label="Slow"   />
          <Spinner speed="normal" label="Normal" />
          <Spinner speed="fast"   label="Fast"   />
        </View>
      </Preview>

      <Preview
        title="Dots — sizes & colors"
        code={`<Spinner variant="dots" size="sm" color="muted" />
<Spinner variant="dots" size="md" color="primary" />
<Spinner variant="dots" size="lg" color="success" />`}
      >
        <View style={{ flexDirection: 'row', gap: 28, alignItems: 'center' }}>
          <Spinner variant="dots" size="sm" color="muted"   />
          <Spinner variant="dots" size="md" color="primary" />
          <Spinner variant="dots" size="lg" color="success" />
        </View>
      </Preview>

      <Preview
        title="Pulse — sizes & colors"
        code={`<Spinner variant="pulse" size="sm" color="primary" />
<Spinner variant="pulse" size="md" color="warning" />
<Spinner variant="pulse" size="lg" color="destructive" />`}
      >
        <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
          <Spinner variant="pulse" size="sm" color="primary"     />
          <Spinner variant="pulse" size="md" color="warning"     />
          <Spinner variant="pulse" size="lg" color="destructive" />
        </View>
      </Preview>

    </div>
  )
}
