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

    return (
      <View style={{ gap: 10 }}>
        <Button onPress={() => setVariant('default')}>Default toast</Button>
        <Button variant="outline" onPress={() => setVariant('success')}>Success toast</Button>
        <Button variant="outline" onPress={() => setVariant('destructive')}>Error toast</Button>
        <Button variant="outline" onPress={() => setVariant('warning')}>Warning toast</Button>

        {variant && (
          <Toast
            visible
            message={`${variant.charAt(0).toUpperCase() + variant.slice(1)} message`}
            description="This is the toast description"
            variant={variant}
            onHide={() => setVariant(null)}
          />
        )}
      </View>
    )
  },
}
