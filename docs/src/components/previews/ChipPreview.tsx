'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Chip, ChipGroup } from '../../../../packages/registry/components/chip/chip'

export default function ChipPreview() {
  const [selected, setSelected] = useState<string[]>(['React Native'])
  const [tags, setTags] = useState(['Design', 'Engineering', 'Marketing'])

  const toggle = (label: string) =>
    setSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))

  return (
    <div className="space-y-10">
      <Preview title="Variants" code={`import { Chip } from '~/components/ui/chip'

<Chip label="Outlined" variant="outlined" />
<Chip label="Filled" variant="filled" />`}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label="Outlined" variant="outlined" />
          <Chip label="Filled" variant="filled" selected />
        </View>
      </Preview>

      <Preview title="Selectable group" code={`const [selected, setSelected] = useState(['React Native'])

<ChipGroup>
  {['React Native', 'TypeScript', 'Expo', 'GraphQL'].map(label => (
    <Chip
      key={label}
      label={label}
      selected={selected.includes(label)}
      onPress={() => toggle(label)}
    />
  ))}
</ChipGroup>`}>
        <ChipGroup>
          {['React Native', 'TypeScript', 'Expo', 'GraphQL'].map((label) => (
            <Chip key={label} label={label} selected={selected.includes(label)} onPress={() => toggle(label)} />
          ))}
        </ChipGroup>
      </Preview>

      <Preview title="Sizes" code={`<Chip label="Small" size="sm" selected />
<Chip label="Medium" size="md" selected />`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Chip label="Small" size="sm" selected />
          <Chip label="Medium" size="md" selected />
        </View>
      </Preview>

      <Preview title="With icon" code={`<Chip label="Favorites" icon="heart" variant="filled" selected color="#f43f5e" />
<Chip label="Location" icon="location" variant="outlined" />`}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label="Favorites" icon="heart" variant="filled" selected color="#f43f5e" />
          <Chip label="Location" icon="location" variant="outlined" />
        </View>
      </Preview>

      <Preview title="Closable" code={`const [tags, setTags] = useState(['Design', 'Engineering', 'Marketing'])

<ChipGroup>
  {tags.map(t => (
    <Chip
      key={t}
      label={t}
      closable
      onClose={() => setTags(prev => prev.filter(x => x !== t))}
    />
  ))}
</ChipGroup>`}>
        <ChipGroup>
          {tags.map((t) => (
            <Chip key={t} label={t} closable onClose={() => setTags((prev) => prev.filter((x) => x !== t))} />
          ))}
        </ChipGroup>
      </Preview>

      <Preview title="Disabled" code={`<Chip label="Unavailable" disabled />
<Chip label="Locked" variant="filled" selected disabled />`}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label="Unavailable" disabled />
          <Chip label="Locked" variant="filled" selected disabled />
        </View>
      </Preview>
    </div>
  )
}
