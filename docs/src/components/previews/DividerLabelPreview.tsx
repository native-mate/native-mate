'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { DividerLabel } from '../../../../packages/registry/components/divider-label/divider-label'

export default function DividerLabelPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Positions" code={`import { DividerLabel } from '~/components/ui/divider-label'

<DividerLabel label="or" position="center" />
<DividerLabel label="continue with" position="left" />
<DividerLabel label="more options" position="right" />`}>
        <View style={{ width: 320, gap: 4 }}>
          <DividerLabel label="or" position="center" />
          <DividerLabel label="continue with" position="left" />
          <DividerLabel label="more options" position="right" />
        </View>
      </Preview>

      <Preview title="Variants — line vs dashed" code={`<DividerLabel label="or" variant="line" />
<DividerLabel label="or" variant="dashed" />`}>
        <View style={{ width: 320, gap: 4 }}>
          <DividerLabel label="or" variant="line" />
          <DividerLabel label="or" variant="dashed" />
        </View>
      </Preview>

      <Preview title="Custom colors" code={`<DividerLabel
  label="premium"
  color="#6366f1"
  textColor="#6366f1"
/>`}>
        <View style={{ width: 320 }}>
          <DividerLabel label="premium" color="#6366f1" textColor="#6366f1" />
        </View>
      </Preview>

      <Preview title="Thickness + spacing" code={`<DividerLabel label="section" thickness={2} spacing={24} />`}>
        <View style={{ width: 320 }}>
          <DividerLabel label="section" thickness={2} spacing={24} />
        </View>
      </Preview>
    </div>
  )
}
