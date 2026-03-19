'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Text } from '../../../../packages/registry/components/text/text'

export default function TextPreview() {
  return (
    <div className="space-y-10">

      <Preview
        title="Variants"
        minHeight={360}
        code={`<Text variant="h1">Heading 1</Text>
<Text variant="h2">Heading 2</Text>
<Text variant="h3">Heading 3</Text>
<Text variant="h4">Heading 4</Text>
<Text variant="h5">Heading 5</Text>
<Text variant="body">Body text — the default variant.</Text>
<Text variant="bodySmall">Body Small</Text>
<Text variant="label">Label</Text>
<Text variant="caption">Caption</Text>
<Text variant="overline">Overline text</Text>
<Text variant="code">const greeting = "hello world"</Text>`}
      >
        <View style={{ gap: 6, width: '100%' }}>
          <Text variant="h1">Heading 1</Text>
          <Text variant="h2">Heading 2</Text>
          <Text variant="h3">Heading 3</Text>
          <Text variant="h4">Heading 4</Text>
          <Text variant="body">Body text — the default variant.</Text>
          <Text variant="bodySmall">Body Small</Text>
          <Text variant="label">Label</Text>
          <Text variant="caption">Caption</Text>
          <Text variant="overline">Overline text</Text>
          <Text variant="code">{'const greeting = "hello world"'}</Text>
        </View>
      </Preview>

      <Preview
        title="Weights"
        code={`<Text weight="light">Light 300</Text>
<Text weight="regular">Regular 400</Text>
<Text weight="medium">Medium 500</Text>
<Text weight="semibold">Semibold 600</Text>
<Text weight="bold">Bold 700</Text>
<Text weight="extrabold">Extra Bold 800</Text>`}
      >
        <View style={{ gap: 6, width: '100%' }}>
          {(['light','regular','medium','semibold','bold','extrabold'] as const).map(w => (
            <Text key={w} variant="body" weight={w} style={{ textTransform: 'capitalize' }}>{w}</Text>
          ))}
        </View>
      </Preview>

      <Preview
        title="Colors"
        code={`<Text color="foreground">Foreground</Text>
<Text color="muted">Muted</Text>
<Text color="primary">Primary</Text>
<Text color="success">Success</Text>
<Text color="warning">Warning</Text>
<Text color="destructive">Destructive</Text>
<Text color="#a78bfa">Custom hex</Text>`}
      >
        <View style={{ gap: 6, width: '100%' }}>
          <Text color="foreground">Foreground</Text>
          <Text color="muted">Muted</Text>
          <Text color="primary">Primary</Text>
          <Text color="success">Success</Text>
          <Text color="warning">Warning</Text>
          <Text color="destructive">Destructive</Text>
          <Text color="#a78bfa">Custom hex</Text>
        </View>
      </Preview>

      <Preview
        title="Alignment"
        code={`<Text align="left">Left aligned</Text>
<Text align="center">Center aligned</Text>
<Text align="right">Right aligned</Text>`}
      >
        <View style={{ gap: 8, width: '100%' }}>
          <Text align="left">Left aligned</Text>
          <Text align="center">Center aligned</Text>
          <Text align="right">Right aligned</Text>
        </View>
      </Preview>

      <Preview
        title="Transform"
        code={`<Text transform="uppercase">uppercase text</Text>
<Text transform="capitalize">capitalize each word</Text>
<Text transform="lowercase">LOWERCASE TEXT</Text>`}
      >
        <View style={{ gap: 6, width: '100%' }}>
          <Text transform="uppercase">uppercase text</Text>
          <Text transform="capitalize">capitalize each word</Text>
          <Text transform="lowercase">LOWERCASE TEXT</Text>
        </View>
      </Preview>

      <Preview
        title="Truncation"
        code={`<Text numberOfLines={2}>
  This is a very long paragraph that will be truncated after two
  lines of text. The rest of the content is hidden from view.
</Text>`}
      >
        <View style={{ width: '100%', maxWidth: 280 }}>
          <Text numberOfLines={2}>
            This is a very long paragraph that will be truncated after two
            lines of text. The rest of the content is hidden from view.
          </Text>
        </View>
      </Preview>

      <Preview
        title="Muted shorthand"
        code={`<Text>Normal text</Text>
<Text muted>Muted helper text — same as color="muted"</Text>`}
      >
        <View style={{ gap: 4 }}>
          <Text>Normal text</Text>
          <Text muted>Muted helper text</Text>
        </View>
      </Preview>

    </div>
  )
}
