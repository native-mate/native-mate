'use client'
import React from 'react'
import { View } from 'react-native'
import { Text } from '@native-mate/core'
import { Preview } from './shared/Preview'
import { Accordion } from '../../../../packages/registry/components/accordion/accordion'
import { Ionicons } from '@expo/vector-icons'

const faqItems = [
  {
    key: 'q1',
    title: 'What is native-mate?',
    icon: <Ionicons name="information-circle-outline" size={16} color="#6366f1" />,
    content: <Text style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 20 }}>A copy-paste React Native component library with a CLI. Add only the components you need.</Text>,
  },
  {
    key: 'q2',
    title: 'Is it free and open source?',
    icon: <Ionicons name="code-slash-outline" size={16} color="#6366f1" />,
    content: <Text style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 20 }}>Yes, fully open source under the MIT license. Fork it, extend it, ship it.</Text>,
  },
  {
    key: 'q3',
    title: 'Does it support dark mode?',
    icon: <Ionicons name="moon-outline" size={16} color="#6366f1" />,
    content: <Text style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 20 }}>Yes. Every component uses design tokens so it switches seamlessly between light and dark.</Text>,
  },
  {
    key: 'q4',
    title: 'Disabled item',
    disabled: true,
    content: <Text style={{ color: '#a1a1aa', fontSize: 14 }}>This item cannot be expanded.</Text>,
  },
]

export default function AccordionPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Ghost (default)" code={`<Accordion
  items={[
    { key: 'q1', title: 'What is native-mate?', content: <Text>...</Text> },
    { key: 'q2', title: 'Is it free?', content: <Text>...</Text> },
  ]}
  defaultOpen={['q1']}
/>`}>
        <Accordion items={faqItems} defaultOpen={['q1']} />
      </Preview>

      <Preview title="Bordered" code={`<Accordion items={items} variant="bordered" />`}>
        <Accordion items={faqItems} variant="bordered" />
      </Preview>

      <Preview title="Card" code={`<Accordion items={items} variant="card" allowMultiple />`}>
        <Accordion items={faqItems} variant="card" allowMultiple />
      </Preview>

      <Preview title="With icons + trailing + disabled" code={`<Accordion
  items={[
    {
      key: 'settings',
      title: 'Account settings',
      icon: <Ionicons name="settings-outline" size={16} />,
      trailing: <Badge label="New" />,
      content: <Text>Manage your profile...</Text>,
    },
    { key: 'disabled', title: 'Locked section', disabled: true, content: <Text>...</Text> },
  ]}
/>`}>
        <Accordion
          variant="bordered"
          items={[
            {
              key: 's1',
              title: 'Account settings',
              icon: <Ionicons name="settings-outline" size={16} color="#6366f1" />,
              trailing: (
                <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99, backgroundColor: '#6366f122' }}>
                  <Text style={{ color: '#6366f1', fontSize: 11, fontWeight: '600' }}>New</Text>
                </View>
              ),
              content: <Text style={{ color: '#a1a1aa', fontSize: 14 }}>Manage your profile, password, and notifications.</Text>,
            },
            {
              key: 's2',
              title: 'Billing',
              icon: <Ionicons name="card-outline" size={16} color="#22c55e" />,
              content: <Text style={{ color: '#a1a1aa', fontSize: 14 }}>View invoices and manage your payment methods.</Text>,
            },
            {
              key: 's3',
              title: 'Locked section',
              disabled: true,
              content: <Text style={{ color: '#a1a1aa', fontSize: 14 }}>Upgrade to unlock.</Text>,
            },
          ]}
        />
      </Preview>

      <Preview title="Sizes" code={`<Accordion items={items} size="sm" />
<Accordion items={items} size="md" />
<Accordion items={items} size="lg" />`}>
        <View style={{ gap: 16 }}>
          {(['sm', 'md', 'lg'] as const).map(size => (
            <View key={size}>
              <Text style={{ color: '#71717a', fontSize: 11, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{size}</Text>
              <Accordion
                size={size}
                variant="bordered"
                items={[
                  { key: 'a', title: 'Size demo', content: <Text style={{ color: '#a1a1aa', fontSize: 13 }}>Content for size {size}.</Text> },
                  { key: 'b', title: 'Another item', content: <Text style={{ color: '#a1a1aa', fontSize: 13 }}>More content.</Text> },
                ]}
              />
            </View>
          ))}
        </View>
      </Preview>
    </div>
  )
}
