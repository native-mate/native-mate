import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { Tag } from '../../../packages/registry/components/tag/tag'

const meta: Meta = {
  title: 'Display/Tag',
}

export default meta
type Story = StoryObj<typeof meta>

export const Dismissible: Story = {
  render: () => {
    const [tags, setTags] = useState(['React Native', 'TypeScript', 'Expo', 'Reanimated'])
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {tags.map((t) => (
          <Tag key={t} label={t} onRemove={() => setTags((prev) => prev.filter((x) => x !== t))} />
        ))}
      </View>
    )
  },
}

export const ReadOnly: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Tag label="design" />
      <Tag label="mobile" />
      <Tag label="ui" />
    </View>
  ),
}
