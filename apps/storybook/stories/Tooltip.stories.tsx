import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { Tooltip } from '../../../packages/registry/components/tooltip/tooltip'
import { Button } from '../../../packages/registry/components/button/button'

const meta: Meta = {
  title: 'Overlay/Tooltip',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View style={{ padding: 48, alignItems: 'center' }}>
      <Tooltip content="This is a tooltip">
        <Button>Press me</Button>
      </Tooltip>
    </View>
  ),
}

export const Bottom: Story = {
  render: () => (
    <View style={{ padding: 48, alignItems: 'center' }}>
      <Tooltip content="Tooltip below" placement="bottom">
        <Button>Bottom tooltip</Button>
      </Tooltip>
    </View>
  ),
}

export const Left: Story = {
  render: () => (
    <View style={{ padding: 48, alignItems: 'center' }}>
      <Tooltip content="Tooltip on the left" placement="left">
        <Button>Left tooltip</Button>
      </Tooltip>
    </View>
  ),
}

export const Right: Story = {
  render: () => (
    <View style={{ padding: 48, alignItems: 'center' }}>
      <Tooltip content="Tooltip on the right" placement="right">
        <Button>Right tooltip</Button>
      </Tooltip>
    </View>
  ),
}

export const AllPlacements: Story = {
  render: () => (
    <View style={{ gap: 24, padding: 48, alignItems: 'center' }}>
      <Tooltip content="Top tooltip" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </View>
  ),
}
