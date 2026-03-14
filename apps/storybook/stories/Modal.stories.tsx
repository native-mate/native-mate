import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Modal } from '../../../packages/registry/components/modal/modal'
import { Button } from '../../../packages/registry/components/button/button'

const meta: Meta = {
  title: 'Overlay/Modal',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <View style={{ padding: 16 }}>
        <Button onPress={() => setVisible(true)}>Open Modal</Button>
        <Modal visible={visible} onClose={() => setVisible(false)} title="Modal Title">
          <Button onPress={() => setVisible(false)}>Close</Button>
        </Modal>
      </View>
    )
  },
}

export const Small: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <View style={{ padding: 16 }}>
        <Button onPress={() => setVisible(true)}>Open Small Modal</Button>
        <Modal visible={visible} onClose={() => setVisible(false)} title="Small Modal" size="sm">
          <Button onPress={() => setVisible(false)}>Close</Button>
        </Modal>
      </View>
    )
  },
}

export const Large: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <View style={{ padding: 16 }}>
        <Button onPress={() => setVisible(true)}>Open Large Modal</Button>
        <Modal visible={visible} onClose={() => setVisible(false)} title="Large Modal" size="lg">
          <Button onPress={() => setVisible(false)}>Close</Button>
        </Modal>
      </View>
    )
  },
}

export const NoTitle: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <View style={{ padding: 16 }}>
        <Button onPress={() => setVisible(true)}>Open Modal (No Title)</Button>
        <Modal visible={visible} onClose={() => setVisible(false)}>
          <Button onPress={() => setVisible(false)}>Close</Button>
        </Modal>
      </View>
    )
  },
}
