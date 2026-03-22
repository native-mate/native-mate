'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Text } from '@native-mate/core'
import { Preview } from './shared/Preview'
import { Slider, RangeSlider } from '../../../../packages/registry/components/slider/slider'

export default function SliderPreview() {
  const [vol, setVol] = useState(60)
  const [brightness, setBrightness] = useState(40)
  const [rangeLow, setRangeLow] = useState(20)
  const [rangeHigh, setRangeHigh] = useState(75)
  const [priceLow, setPriceLow] = useState(100)
  const [priceHigh, setPriceHigh] = useState(800)
  const [step, setStep] = useState(50)

  return (
    <div className="space-y-10">
      <Preview title="Default" code={`import { Slider } from '~/components/ui/slider'

const [value, setValue] = useState(60)

<Slider value={value} onChange={setValue} />`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 8 }}>
          <Slider value={vol} onChange={setVol} />
          <Text style={{ fontSize: 12, color: '#71717a', textAlign: 'center' }}>Volume: {vol}</Text>
        </View>
      </Preview>

      <Preview title="With showValue" code={`<Slider value={value} onChange={setValue} showValue />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Slider value={brightness} onChange={setBrightness} showValue />
        </View>
      </Preview>

      <Preview title="Step" code={`<Slider value={value} onChange={setValue} step={10} min={0} max={100} showValue />`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 8 }}>
          <Slider value={step} onChange={setStep} step={10} min={0} max={100} showValue />
          <Text style={{ fontSize: 12, color: '#71717a', textAlign: 'center' }}>Snaps to: {step}</Text>
        </View>
      </Preview>

      <Preview title="Custom color" code={`<Slider value={value} onChange={setValue} fillColor="#10b981" />
<Slider value={value} onChange={setValue} fillColor="#f59e0b" />`}>
        <View style={{ gap: 16, width: '100%', maxWidth: 340 }}>
          <Slider value={60} onChange={() => {}} fillColor="#10b981" showValue />
          <Slider value={40} onChange={() => {}} fillColor="#f59e0b" showValue />
          <Slider value={75} onChange={() => {}} fillColor="#8b5cf6" showValue />
        </View>
      </Preview>

      <Preview title="RangeSlider" code={`import { RangeSlider } from '~/components/ui/slider'

const [low, setLow] = useState(20)
const [high, setHigh] = useState(75)

<RangeSlider low={low} high={high} onChange={(l, h) => { setLow(l); setHigh(h) }} />`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 8 }}>
          <RangeSlider
            low={rangeLow}
            high={rangeHigh}
            onChange={(l, h) => { setRangeLow(l); setRangeHigh(h) }}
          />
          <Text style={{ fontSize: 12, color: '#71717a', textAlign: 'center' }}>{rangeLow} — {rangeHigh}</Text>
        </View>
      </Preview>

      <Preview title="Price range" code={`<RangeSlider
  low={priceLow}
  high={priceHigh}
  onChange={(l, h) => { setPriceLow(l); setPriceHigh(h) }}
  min={0}
  max={1000}
  step={50}
  showValue
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <RangeSlider
            low={priceLow}
            high={priceHigh}
            onChange={(l, h) => { setPriceLow(l); setPriceHigh(h) }}
            min={0}
            max={1000}
            step={50}
            showValue
          />
        </View>
      </Preview>

      <Preview title="Disabled" code={`<Slider value={50} onChange={() => {}} disabled />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Slider value={50} onChange={() => {}} disabled />
        </View>
      </Preview>
    </div>
  )
}
