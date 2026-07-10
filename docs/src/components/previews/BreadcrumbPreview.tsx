'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Breadcrumb } from '../../../../packages/registry/components/breadcrumb/breadcrumb'

export default function BreadcrumbPreview() {
  const items = [
    { label: 'Home', onPress: () => {}, icon: 'home-outline' },
    { label: 'Settings', onPress: () => {} },
    { label: 'Billing', onPress: () => {} },
    { label: 'Invoices' },
  ]

  return (
    <div className="space-y-10">
      <Preview title="Separators" code={`import { Breadcrumb } from '~/components/ui/breadcrumb'

<Breadcrumb
  items={[
    { label: 'Home', onPress: () => router.push('/') },
    { label: 'Settings', onPress: () => router.push('/settings') },
    { label: 'Billing' },
  ]}
/>

<Breadcrumb separator="slash" items={items} />
<Breadcrumb separator="dot" items={items} />
<Breadcrumb separator="—" items={items} />`}>
        <View style={{ gap: 12 }}>
          <Breadcrumb items={items.slice(0, 3)} />
          <Breadcrumb separator="slash" items={items.slice(0, 3)} />
          <Breadcrumb separator="dot" items={items.slice(0, 3)} />
          <Breadcrumb separator="—" items={items.slice(0, 3)} />
        </View>
      </Preview>

      <Preview title="With icons" code={`<Breadcrumb
  items={[
    { label: 'Home', icon: 'home-outline', onPress: () => {} },
    { label: 'Settings', onPress: () => {} },
    { label: 'Billing', onPress: () => {} },
    { label: 'Invoices' },
  ]}
/>`}>
        <Breadcrumb items={items} />
      </Preview>

      <Preview title="Truncated with maxItems" code={`<Breadcrumb
  maxItems={3}
  items={[
    { label: 'Home', onPress: () => {} },
    { label: 'Projects', onPress: () => {} },
    { label: 'Acme Corp', onPress: () => {} },
    { label: 'Website Redesign', onPress: () => {} },
    { label: 'Assets' },
  ]}
/>`}>
        <Breadcrumb
          maxItems={3}
          items={[
            { label: 'Home', onPress: () => {} },
            { label: 'Projects', onPress: () => {} },
            { label: 'Acme Corp', onPress: () => {} },
            { label: 'Website Redesign', onPress: () => {} },
            { label: 'Assets' },
          ]}
        />
      </Preview>

      <Preview title="Sizes" code={`<Breadcrumb size="sm" items={items} />
<Breadcrumb size="md" items={items} />`}>
        <View style={{ gap: 12 }}>
          <Breadcrumb size="sm" items={items.slice(0, 3)} />
          <Breadcrumb size="md" items={items.slice(0, 3)} />
        </View>
      </Preview>
    </div>
  )
}
