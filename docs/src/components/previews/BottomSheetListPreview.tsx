'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { BottomSheetList } from '../../../../packages/registry/components/bottom-sheet-list/bottom-sheet-list'
import { Text } from '@native-mate/core'

function TriggerBtn({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <View
      style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#6366f1', alignItems: 'center' }}
      // @ts-ignore web
      onClick={onPress}
    >
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </View>
  )
}

const COUNTRIES = [
  { label: 'United States', value: 'us', description: 'North America' },
  { label: 'United Kingdom', value: 'uk', description: 'Europe' },
  { label: 'Germany', value: 'de', description: 'Europe' },
  { label: 'Japan', value: 'jp', description: 'Asia' },
  { label: 'Brazil', value: 'br', description: 'South America' },
  { label: 'India', value: 'in', description: 'Asia' },
]

export default function BottomSheetListPreview() {
  const [basicOpen, setBasicOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [multiOpen, setMultiOpen] = useState(false)
  const [country, setCountry] = useState('us')
  const [selected, setSelected] = useState<string[]>(['us', 'de'])

  return (
    <div className="space-y-10">
      <Preview title="Single select" code={`import { BottomSheetList } from '~/components/ui/bottom-sheet-list'

const [open, setOpen] = useState(false)
const [country, setCountry] = useState('us')

<BottomSheetList
  visible={open}
  onClose={() => setOpen(false)}
  title="Select country"
  items={countries}
  selectedValues={[country]}
  onSelect={(value) => setCountry(value)}
/>`}>
        <TriggerBtn onPress={() => setBasicOpen(true)} label="Select country" />
        <BottomSheetList
          visible={basicOpen}
          onClose={() => setBasicOpen(false)}
          title="Select country"
          items={COUNTRIES}
          selectedValues={[country]}
          onSelect={(value) => {
            setCountry(value)
            setBasicOpen(false)
          }}
        />
      </Preview>

      <Preview title="Searchable" code={`<BottomSheetList
  visible={open}
  onClose={() => setOpen(false)}
  title="Select country"
  items={countries}
  searchable
  searchPlaceholder="Search countries..."
  onSelect={(value) => setCountry(value)}
/>`}>
        <TriggerBtn onPress={() => setSearchOpen(true)} label="Search countries" />
        <BottomSheetList
          visible={searchOpen}
          onClose={() => setSearchOpen(false)}
          title="Select country"
          items={COUNTRIES}
          searchable
          searchPlaceholder="Search countries..."
          selectedValues={[country]}
          onSelect={(value) => {
            setCountry(value)
            setSearchOpen(false)
          }}
        />
      </Preview>

      <Preview title="Multi-select with confirm" code={`<BottomSheetList
  visible={open}
  onClose={() => setOpen(false)}
  title="Select regions"
  items={countries}
  multiSelect
  selectedValues={selected}
  confirmLabel="Apply"
  onSelect={(value) => toggleSelection(value)}
/>`}>
        <TriggerBtn onPress={() => setMultiOpen(true)} label="Select regions" />
        <BottomSheetList
          visible={multiOpen}
          onClose={() => setMultiOpen(false)}
          title="Select regions"
          items={COUNTRIES}
          multiSelect
          selectedValues={selected}
          confirmLabel="Apply"
          onSelect={(value) => {
            setSelected((prev) =>
              prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
            )
          }}
        />
      </Preview>
    </div>
  )
}
