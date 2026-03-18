'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Text } from '@native-mate/core'
import { Preview } from './shared/Preview'
import { Slider, RangeSlider } from '../../../../../packages/registry/components/slider/slider'

export default function SliderPreview() {
  const [vol, setVol] = useState(60)
  const [brightness, setBrightness] = useState(40)
  const [range, setRange] = useState<[number, number]>([20, 75])
  const [price, setPrice] = useState<[number, number]>([100, 800])
  const [step, setStep] = useState(50)

  return (
    <div className="space-y-10">
      <Preview title="Default" code={`import { Slider } from '~/components/ui/slider'

const [value, setValue] = useState(60)

<Slider value={value} onValueChange={setValue} />`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 8 }}>
          <Slider value={vol} onValueChange={setVol} />
          <Text style={{ fontSize: 12, color: '#71717a', textAlign: 'center' }}>Volume: {vol}</Text>
        </View>
      </Preview>

      <Preview title="With label" code={`<Slider value={value} onValueChange={setValue} label="Brightness" showValue />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Slider value={brightness} onValueChange={setBrightness} label="Brightness" showValue />
        </View>
      </Preview>

      <Preview title="Step" code={`<Slider value={value} onValueChange={setValue} step={10} min={0} max={100} showValue />`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 8 }}>
          <Slider value={step} onValueChange={setStep} step={10} min={0} max={100} showValue label="Step: 10" />
          <Text style={{ fontSize: 12, color: '#71717a', textAlign: 'center' }}>Snaps to: {step}</Text>
        </View>
      </Preview>

      <Preview title="Custom color" code={`<Slider value={value} onValueChange={setValue} color="#10b981" />
<Slider value={value} onValueChange={setValue} color="#f59e0b" />`}>
        <View style={{ gap: 16, width: '100%', maxWidth: 340 }}>
          <Slider value={60} onValueChange={() => {}} color="#10b981" label="Emerald" showValue />
          <Slider value={40} onValueChange={() => {}} color="#f59e0b" label="Amber" showValue />
          <Slider value={75} onValueChange={() => {}} color="#8b5cf6" label="Violet" showValue />
        </View>
      </Preview>

      <Preview title="RangeSlider" code={`import { RangeSlider } from '~/components/ui/slider'

const [range, setRange] = useState([20, 75])

<RangeSlider value={range} onValueChange={setRange} />`}>
        <View style={{ width: '100%', maxWidth: 340, gap: 8 }}>
          <RangeSlider value={range} onValueChange={setRange} />
          <Text style={{ fontSize: 12, color: '#71717a', textAlign: 'center' }}>{range[0]} — {range[1]}</Text>
        </View>
      </Preview>

      <Preview title="Price range" code={`<RangeSlider
  value={price}
  onValueChange={setPrice}
  min={0}
  max={1000}
  step={50}
  label="Price range"
  showValue
  formatValue={(v) => \`$\${v}\`}
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <RangeSlider
            value={price}
            onValueChange={setPrice}
            min={0}
            max={1000}
            step={50}
            label="Price range"
            showValue
            formatValue={(v) => `$${v}`}
          />
        </View>
      </Preview>

      <Preview title="Disabled" code={`<Slider value={50} onValueChange={() => {}} disabled />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Slider value={50} onValueChange={() => {}} disabled label="Disabled" />
        </View>
      </Preview>
    </div>
  )
}
