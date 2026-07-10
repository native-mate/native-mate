'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { SearchBar } from '../../../../packages/registry/components/search-bar/search-bar'

const SUGGESTIONS = [
  { id: '1', label: 'React Native', icon: 'logo-react' },
  { id: '2', label: 'React Navigation', icon: 'compass-outline' },
  { id: '3', label: 'Reanimated', icon: 'flash-outline' },
]

export default function SearchBarPreview() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('React')
  const [text3, setText3] = useState('')

  return (
    <div className="space-y-10">
      <Preview title="Default" minHeight={90} code={`import { SearchBar } from '~/components/ui/search-bar'

const [text, setText] = useState('')

<SearchBar value={text} onChangeText={setText} placeholder="Search..." />`}>
        <View style={{ width: 320 }}>
          <SearchBar value={text1} onChangeText={setText1} placeholder="Search..." />
        </View>
      </Preview>

      <Preview title="With suggestions dropdown" minHeight={220} code={`const suggestions = [
  { id: '1', label: 'React Native', icon: 'logo-react' },
  { id: '2', label: 'React Navigation', icon: 'compass-outline' },
  { id: '3', label: 'Reanimated', icon: 'flash-outline' },
]

<SearchBar
  value={text}
  onChangeText={setText}
  suggestions={suggestions}
  onSuggestionPress={(s) => setText(s.label)}
  showCancel
/>`}>
        <View style={{ width: 320 }}>
          <SearchBar
            value={text2}
            onChangeText={setText2}
            suggestions={SUGGESTIONS}
            onSuggestionPress={(s) => setText2(s.label)}
            showCancel
          />
        </View>
      </Preview>

      <Preview title="Loading state" minHeight={90} code={`<SearchBar value={text} onChangeText={setText} loading />`}>
        <View style={{ width: 320 }}>
          <SearchBar value={text3} onChangeText={setText3} loading placeholder="Searching..." />
        </View>
      </Preview>

      <Preview title="Disabled" minHeight={90} code={`<SearchBar value="" onChangeText={() => {}} disabled />`}>
        <View style={{ width: 320 }}>
          <SearchBar value="" onChangeText={() => {}} disabled />
        </View>
      </Preview>
    </div>
  )
}
