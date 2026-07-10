'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Preview } from './shared/Preview'
import { StatCard } from '../../../../packages/registry/components/stat-card/stat-card'

export default function StatCardPreview() {
  const [revenue, setRevenue] = useState(48250)

  return (
    <div className="space-y-10">
      <Preview title="Basic, animated counter" code={`import { StatCard } from '~/components/ui/stat-card'

<StatCard title="Total Users" value={12480} />`}>
        <View style={{ width: '100%', maxWidth: 220 }}>
          <StatCard title="Total Users" value={12480} />
        </View>
      </Preview>

      <Preview title="With trend (auto-computed from previousValue)" code={`<StatCard
  title="Monthly Revenue"
  value={48250}
  previousValue={41200}
  format="currency"
  icon={<Ionicons name="cash-outline" size={18} color="#22c55e" />}
/>`}>
        <View style={{ width: '100%', maxWidth: 220 }}>
          <StatCard
            title="Monthly Revenue"
            value={revenue}
            previousValue={41200}
            format="currency"
            icon={<Ionicons name="cash-outline" size={18} color="#22c55e" />}
          />
        </View>
      </Preview>

      <Preview title="Explicit change + decrease" code={`<StatCard
  title="Churn Rate"
  value={4.2}
  format="percent"
  change={-1.3}
  changeType="decrease"
/>`}>
        <View style={{ width: '100%', maxWidth: 220 }}>
          <StatCard title="Churn Rate" value={4.2} format="percent" change={-1.3} changeType="decrease" />
        </View>
      </Preview>

      <Preview title="Grid of stats" code={`<View style={{ flexDirection: 'row', gap: 12 }}>
  <StatCard title="Orders" value={342} change={12.4} changeType="increase" />
  <StatCard title="Refunds" value={8} change={-4.1} changeType="decrease" />
</View>`}>
        <View style={{ flexDirection: 'row', gap: 12, width: '100%', maxWidth: 460 }}>
          <View style={{ flex: 1 }}>
            <StatCard title="Orders" value={342} change={12.4} changeType="increase" />
          </View>
          <View style={{ flex: 1 }}>
            <StatCard title="Refunds" value={8} change={-4.1} changeType="decrease" />
          </View>
        </View>
      </Preview>

      <Preview title="Pressable" code={`<StatCard
  title="Active Sessions"
  value={1204}
  icon={<Ionicons name="pulse-outline" size={18} color="#6366f1" />}
  onPress={() => {}}
/>`}>
        <View style={{ width: '100%', maxWidth: 220 }}>
          <StatCard
            title="Active Sessions"
            value={1204}
            icon={<Ionicons name="pulse-outline" size={18} color="#6366f1" />}
            onPress={() => setRevenue((r) => r + 500)}
          />
        </View>
      </Preview>

      <Preview title="Loading skeleton" code={`<StatCard title="Total Users" value={0} loading />`}>
        <View style={{ width: '100%', maxWidth: 220 }}>
          <StatCard title="Total Users" value={0} loading />
        </View>
      </Preview>
    </div>
  )
}
