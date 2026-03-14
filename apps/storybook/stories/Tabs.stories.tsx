import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Tabs } from '../../../packages/registry/components/tabs/tabs'
import { Text } from '@native-mate/core'

const ITEMS = [
  { key: 'overview', label: 'Overview' },
  { key: 'components', label: 'Components' },
  { key: 'tokens', label: 'Tokens' },
  { key: 'cli', label: 'CLI' },
]

const meta: Meta = {
  title: 'Layout/Tabs',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('overview')
    return (
      <View>
        <Tabs items={ITEMS} activeKey={active} onChange={setActive} />
        <View style={{ padding: 16 }}>
          <Text color="muted">Active tab: {active}</Text>
        </View>
      </View>
    )
  },
}
