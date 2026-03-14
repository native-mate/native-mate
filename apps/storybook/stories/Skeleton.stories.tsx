import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'
import { Skeleton } from '../../../packages/registry/components/skeleton/skeleton'

const meta: Meta = {
  title: 'Feedback/Skeleton',
}

export default meta
type Story = StoryObj<typeof meta>

export const CardSkeleton: Story = {
  render: () => (
    <View style={{ gap: 12, padding: 16, backgroundColor: '#18181b', borderRadius: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={{ gap: 6 }}>
          <Skeleton width={120} height={12} />
          <Skeleton width={80} height={10} />
        </View>
      </View>
      <Skeleton width="100%" height={12} />
      <Skeleton width="85%" height={12} />
      <Skeleton width="70%" height={12} />
    </View>
  ),
}

export const ListItem: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Skeleton width={40} height={40} borderRadius={8} />
          <View style={{ gap: 6 }}>
            <Skeleton width={140} height={12} />
            <Skeleton width={90} height={10} />
          </View>
        </View>
      ))}
    </View>
  ),
}
