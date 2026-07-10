'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { BottomBar } from '../../../../packages/registry/components/bottom-bar/bottom-bar'

const baseItems = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
  { key: 'cart', label: 'Cart', icon: 'cart-outline', activeIcon: 'cart', badge: { value: 3 } },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
]

export default function BottomBarPreview() {
  const [active1, setActive1] = useState('home')
  const [active2, setActive2] = useState('search')
  const [active3, setActive3] = useState('cart')

  return (
    <div className="space-y-10">
      <Preview title="Basic tab bar" minHeight={100} code={`import { BottomBar } from '~/components/ui/bottom-bar'

const items = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
  { key: 'cart', label: 'Cart', icon: 'cart-outline', activeIcon: 'cart' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
]

const [active, setActive] = useState('home')

<BottomBar items={items} activeKey={active} onChange={setActive} />`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <BottomBar items={baseItems} activeKey={active1} onChange={setActive1} bottomInset={8} />
        </View>
      </Preview>

      <Preview title="With badge + pulse" minHeight={100} code={`const items = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  {
    key: 'cart',
    label: 'Cart',
    icon: 'cart-outline',
    activeIcon: 'cart',
    badge: { value: 3, pulse: true },
  },
  { key: 'alerts', label: 'Alerts', icon: 'notifications-outline', badge: { pulse: true } },
]

<BottomBar items={items} activeKey={active} onChange={setActive} />`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <BottomBar
            items={[
              { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
              { key: 'cart', label: 'Cart', icon: 'cart-outline', activeIcon: 'cart', badge: { value: 3, pulse: true } },
              { key: 'alerts', label: 'Alerts', icon: 'notifications-outline', activeIcon: 'notifications', badge: { pulse: true, color: '#f59e0b' } },
              { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
            ]}
            activeKey={active2}
            onChange={setActive2}
            bottomInset={8}
          />
        </View>
      </Preview>

      <Preview title="No labels, no indicator" minHeight={100} code={`<BottomBar
  items={items}
  activeKey={active}
  onChange={setActive}
  showLabels={false}
  showIndicator={false}
/>`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <BottomBar
            items={baseItems}
            activeKey={active3}
            onChange={setActive3}
            showLabels={false}
            showIndicator={false}
            bottomInset={8}
          />
        </View>
      </Preview>

      <Preview title="Disabled item" minHeight={100} code={`const items = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline', disabled: true },
]

<BottomBar items={items} activeKey={active} onChange={setActive} />`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <BottomBar
            items={[
              { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
              { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
              { key: 'settings', label: 'Settings', icon: 'settings-outline', disabled: true },
            ]}
            activeKey="home"
            onChange={() => {}}
            bottomInset={8}
          />
        </View>
      </Preview>
    </div>
  )
}
