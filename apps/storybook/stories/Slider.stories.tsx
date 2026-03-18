import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Text } from '../../../packages/core/src/components/Text/Text'
import { Slider, RangeSlider } from '../../../packages/registry/components/slider/slider'

const meta: Meta = { title: 'Forms/Slider' }
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState(50)
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <Slider value={val} onChange={setVal} min={0} max={100} showValue />
      </View>
    )
  },
}

export const WithMarks: Story = {
  render: () => {
    const [val, setVal] = useState(3)
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <Text variant="caption" muted>Rating: {val}</Text>
        <Slider value={val} onChange={setVal} min={1} max={5} step={1} marks showValue />
      </View>
    )
  },
}

export const CustomColor: Story = {
  render: () => {
    const [val, setVal] = useState(65)
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <Slider value={val} onChange={setVal} fillColor="#f59e0b" showValue />
      </View>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Slider value={60} onChange={() => {}} disabled showValue />
    </View>
  ),
}

export const Range: Story = {
  render: () => {
    const [low, setLow] = useState(20)
    const [high, setHigh] = useState(75)
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <RangeSlider
          low={low}
          high={high}
          min={0}
          max={100}
          onChange={(l, h) => { setLow(l); setHigh(h) }}
          showValue
        />
      </View>
    )
  },
}

export const RangeWithMarks: Story = {
  render: () => {
    const [low, setLow] = useState(100)
    const [high, setHigh] = useState(500)
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <RangeSlider
          low={low}
          high={high}
          min={0}
          max={1000}
          step={50}
          onChange={(l, h) => { setLow(l); setHigh(h) }}
          showValue
          fillColor="#10b981"
          marks
        />
      </View>
    )
  },
}
