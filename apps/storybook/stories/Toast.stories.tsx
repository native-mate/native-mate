import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Toast } from '../../../packages/registry/components/toast/toast'
import { Button } from '../../../packages/registry/components/button/button'

const meta: Meta = {
  title: 'Feedback/Toast',
}

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: () => {
    const [variant, setVariant] = useState<'default' | 'success' | 'destructive' | 'warning' | null>(null)

    const trigger = (v: NonNullable<typeof variant>) => {
      setVariant(null)
      setTimeout(() => setVariant(v), 50)
    }

    return (
      <View style={{ gap: 10 }}>
        <Button onPress={() => trigger('default')}>Default</Button>
        <Button variant="outline" onPress={() => trigger('success')}>Success</Button>
        <Button variant="destructive" onPress={() => trigger('destructive')}>Error</Button>
        <Button variant="outline" onPress={() => trigger('warning')}>Warning</Button>
        {variant && (
          <Toast
            visible
            message={`${variant.charAt(0).toUpperCase() + variant.slice(1)} notification`}
            description="Tap or wait for it to dismiss"
            variant={variant}
            onHide={() => setVariant(null)}
            showProgress
          />
        )}
      </View>
    )
  },
}

export const WithAction: Story = {
  render: () => {
    const [show, setShow] = useState(false)
    return (
      <View style={{ gap: 10 }}>
        <Button onPress={() => setShow(true)}>Show Toast with Action</Button>
        <Toast
          visible={show}
          onHide={() => setShow(false)}
          message="Item deleted"
          description="This action can be undone"
          variant="default"
          duration={4000}
          action={{ label: 'Undo', onPress: () => setShow(false) }}
        />
      </View>
    )
  },
}

export const TopPosition: Story = {
  render: () => {
    const [show, setShow] = useState(false)
    return (
      <View style={{ gap: 10 }}>
        <Button onPress={() => setShow(true)}>Show Top Toast</Button>
        <Toast
          visible={show}
          onHide={() => setShow(false)}
          message="Synced with cloud"
          variant="success"
          position="top"
          duration={2500}
        />
      </View>
    )
  },
}

export const WithProgressBar: Story = {
  render: () => {
    const [show, setShow] = useState(false)
    return (
      <View style={{ gap: 10 }}>
        <Button onPress={() => { setShow(false); setTimeout(() => setShow(true), 50) }}>
          Show with Progress
        </Button>
        <Toast
          visible={show}
          onHide={() => setShow(false)}
          message="Uploading file…"
          description="Please wait"
          variant="default"
          duration={4000}
          showProgress
        />
      </View>
    )
  },
}

export const Persistent: Story = {
  render: () => {
    const [show, setShow] = useState(false)
    return (
      <View style={{ gap: 10 }}>
        <Button onPress={() => setShow(true)}>Show Persistent Toast</Button>
        <Toast
          visible={show}
          onHide={() => setShow(false)}
          message="No internet connection"
          description="Check your network settings"
          variant="warning"
          persistent
        />
      </View>
    )
  },
}
