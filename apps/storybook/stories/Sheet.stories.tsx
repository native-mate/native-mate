import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Sheet } from '../../../packages/registry/components/sheet/sheet'
import { Button } from '../../../packages/registry/components/button/button'
import { Text } from '@native-mate/core'

const meta: Meta = {
  title: 'Overlay/Sheet',
}

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <View>
        <Button onPress={() => setOpen(true)}>Open Sheet</Button>
        <Sheet isOpen={open} onClose={() => setOpen(false)} snapPoints={['50%']}>
          <View style={{ padding: 24, gap: 12 }}>
            <Text size="lg" weight="semibold">Sheet title</Text>
            <Text color="muted">Some content inside the bottom sheet.</Text>
            <Button onPress={() => setOpen(false)}>Close</Button>
          </View>
        </Sheet>
      </View>
    )
  },
}

export const MultiSnap: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <View>
        <Button onPress={() => setOpen(true)}>Open Multi-snap Sheet</Button>
        <Sheet isOpen={open} onClose={() => setOpen(false)} snapPoints={['30%', '60%', '90%']}>
          <View style={{ padding: 24 }}>
            <Text size="lg" weight="semibold">Drag to snap</Text>
            <Text color="muted" style={{ marginTop: 8 }}>Try dragging to 30%, 60% or 90% snap points.</Text>
          </View>
        </Sheet>
      </View>
    )
  },
}
