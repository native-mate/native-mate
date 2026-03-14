import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { ActionSheet } from '../../../packages/registry/components/action-sheet/action-sheet'
import { Button } from '../../../packages/registry/components/button/button'

const meta: Meta = {
  title: 'Overlay/ActionSheet',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <View>
        <Button onPress={() => setOpen(true)}>Open Action Sheet</Button>
        <ActionSheet
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Photo options"
          actions={[
            { label: 'Take photo', onPress: () => {} },
            { label: 'Choose from library', onPress: () => {} },
            { label: 'Delete photo', onPress: () => {}, variant: 'destructive' },
          ]}
        />
      </View>
    )
  },
}
