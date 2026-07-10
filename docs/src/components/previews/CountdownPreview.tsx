'use client'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Countdown } from '../../../../packages/registry/components/countdown/countdown'

export default function CountdownPreview() {
  const target = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 26 + 1000 * 42), [])

  return (
    <div className="space-y-10">
      <Preview title="Card variant (default), dhms format" code={`import { Countdown } from '~/components/ui/countdown'

<Countdown targetDate={new Date('2026-08-01T00:00:00')} label="Sale ends in" />`}>
        <Countdown targetDate={target} label="Sale ends in" />
      </Preview>

      <Preview title="Sizes" code={`<Countdown targetDate={target} size="sm" format="hms" />
<Countdown targetDate={target} size="md" format="hms" />
<Countdown targetDate={target} size="lg" format="hms" />`}>
        <View style={{ gap: 20, alignItems: 'center' }}>
          <Countdown targetDate={target} size="sm" format="hms" />
          <Countdown targetDate={target} size="md" format="hms" />
          <Countdown targetDate={target} size="lg" format="hms" />
        </View>
      </Preview>

      <Preview title="Inline variant" code={`<Countdown targetDate={target} variant="inline" format="hms" label="Offer expires" />`}>
        <Countdown targetDate={target} variant="inline" format="hms" label="Offer expires" />
      </Preview>

      <Preview title="Minimal variant" code={`<Countdown targetDate={target} variant="minimal" format="ms" separator=":" />`}>
        <Countdown targetDate={target} variant="minimal" format="ms" separator=":" />
      </Preview>

      <Preview title="Custom colors & separator" code={`<Countdown
  targetDate={target}
  digitColor="#f43f5e"
  cardColor="#1c1917"
  separator="·"
  label="Flash sale"
/>`}>
        <Countdown targetDate={target} digitColor="#f43f5e" cardColor="#1c1917" separator="·" label="Flash sale" />
      </Preview>

      <Preview title="Disabled (paused)" code={`<Countdown targetDate={target} disabled label="Paused" />`}>
        <Countdown targetDate={target} disabled label="Paused" />
      </Preview>
    </div>
  )
}
