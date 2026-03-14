import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Slider } from '../../../packages/registry/components/slider/slider'
import { Text } from '@native-mate/core'

const meta: Meta = {
  title: 'Forms/Slider',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState(50)
    return (
      <View style={{ gap: 12 }}>
        <Text>{val}</Text>
        <Slider value={val} onValueChange={setVal} min={0} max={100} />
      </View>
    )
  },
}
