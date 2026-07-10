'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { ColorPicker } from '../../../../packages/registry/components/color-picker/color-picker'

export default function ColorPickerPreview() {
  const [color1, setColor1] = useState('#6366F1')
  const [color2, setColor2] = useState('#22C55E')
  const [color3, setColor3] = useState('#EC4899')

  return (
    <div className="space-y-10">
      <Preview title="Default (presets + custom sliders)" code={`import { ColorPicker } from '~/components/ui/color-picker'

const [color, setColor] = useState('#6366F1')

<ColorPicker value={color} onChange={setColor} />`}>
        <View style={{ width: 320 }}>
          <ColorPicker value={color1} onChange={setColor1} />
        </View>
      </Preview>

      <Preview title="Presets only (no custom sliders)" code={`<ColorPicker
  value={color}
  onChange={setColor}
  showCustom={false}
/>`}>
        <View style={{ width: 320 }}>
          <ColorPicker value={color2} onChange={setColor2} showCustom={false} />
        </View>
      </Preview>

      <Preview title="Custom preset palette" code={`<ColorPicker
  value={color}
  onChange={setColor}
  presets={['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#5856D6', '#AF52DE']}
  size={32}
/>`}>
        <View style={{ width: 320 }}>
          <ColorPicker
            value={color3}
            onChange={setColor3}
            presets={['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#5856D6', '#AF52DE']}
            size={32}
          />
        </View>
      </Preview>

      <Preview title="Disabled" code={`<ColorPicker value="#6366F1" onChange={() => {}} disabled />`}>
        <View style={{ width: 320 }}>
          <ColorPicker value="#6366F1" onChange={() => {}} disabled />
        </View>
      </Preview>
    </div>
  )
}
