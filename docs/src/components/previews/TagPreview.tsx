'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Tag, TagGroup } from '../../../../packages/registry/components/tag/tag'

const CATEGORIES = [
  { label: 'All', variant: 'default' as const },
  { label: 'Design', variant: 'primary' as const },
  { label: 'Engineering', variant: 'success' as const },
  { label: 'Marketing', variant: 'warning' as const },
  { label: 'Support', variant: 'info' as const },
]

const SKILLS_INIT = ['React Native', 'TypeScript', 'Expo', 'Reanimated']

export default function TagPreview() {
  const [filter, setFilter] = useState(['All'])
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [skills, setSkills] = useState(SKILLS_INIT)

  return (
    <div className="space-y-10">
      <Preview title="Single select filter (TagGroup)" code={`import { TagGroup } from '~/components/ui/tag'

const CATEGORIES = [
  { label: 'All', variant: 'default' },
  { label: 'Design', variant: 'primary' },
  { label: 'Engineering', variant: 'success' },
  { label: 'Marketing', variant: 'warning' },
  { label: 'Support', variant: 'info' },
]

const [filter, setFilter] = useState(['All'])

<TagGroup tags={CATEGORIES} selected={filter} onChange={setFilter} />`}>
        <TagGroup tags={CATEGORIES} selected={filter} onChange={setFilter} />
      </Preview>

      <Preview title="Multi select" code={`const [selected, setSelected] = useState([])

<TagGroup
  tags={CATEGORIES}
  selected={selected}
  onChange={setSelected}
  multiSelect
/>`}>
        <TagGroup
          tags={CATEGORIES}
          selected={multiSelected}
          onChange={setMultiSelected}
          multiSelect
        />
      </Preview>

      <Preview title="Removable tags" code={`const [skills, setSkills] = useState(['React Native', 'TypeScript', 'Expo', 'Reanimated'])

<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
  {skills.map(s => (
    <Tag
      key={s}
      label={s}
      onRemove={() => setSkills(prev => prev.filter(x => x !== s))}
    />
  ))}
</View>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, maxWidth: 360 }}>
          {skills.map(s => (
            <Tag
              key={s}
              label={s}
              onRemove={() => setSkills(prev => prev.filter(x => x !== s))}
            />
          ))}
          {skills.length === 0 && (
            <Tag label="Reset" onPress={() => setSkills(SKILLS_INIT)} variant="primary" />
          )}
        </View>
      </Preview>

      <Preview title="Sizes" code={`<Tag label="Small" size="sm" />
<Tag label="Medium" size="md" />
<Tag label="Large" size="lg" />`}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Tag label="Small" size="sm" />
          <Tag label="Medium" size="md" />
          <Tag label="Large" size="lg" />
        </View>
      </Preview>
    </div>
  )
}
