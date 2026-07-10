'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Rating } from '../../../../packages/registry/components/rating/rating'

export default function RatingPreview() {
  const [value1, setValue1] = useState(3)
  const [value2, setValue2] = useState(3.5)
  const [value3, setValue3] = useState(4)

  return (
    <div className="space-y-10">
      <Preview title="Interactive" code={`import { Rating } from '~/components/ui/rating'

const [value, setValue] = useState(3)

<Rating value={value} onChange={setValue} />`}>
        <Rating value={value1} onChange={setValue1} />
      </Preview>

      <Preview title="Sizes" code={`<Rating value={4} size="sm" readonly />
<Rating value={4} size="md" readonly />
<Rating value={4} size="lg" readonly />`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <Rating value={4} size="sm" readonly />
          <Rating value={4} size="md" readonly />
          <Rating value={4} size="lg" readonly />
        </View>
      </Preview>

      <Preview title="Half-star precision" code={`const [value, setValue] = useState(3.5)

<Rating value={value} onChange={setValue} allowHalf showValue />`}>
        <Rating value={value2} onChange={setValue2} allowHalf showValue />
      </Preview>

      <Preview title="Custom color and max stars" code={`<Rating value={value} onChange={setValue} maxStars={10} color="#22C55E" showValue />`}>
        <Rating value={value3} onChange={setValue3} maxStars={10} color="#22C55E" showValue />
      </Preview>

      <Preview title="Read-only display" code={`<Rating value={4.5} readonly allowHalf showValue />`}>
        <Rating value={4.5} readonly allowHalf showValue />
      </Preview>

      <Preview title="Disabled" code={`<Rating value={2} disabled />`}>
        <Rating value={2} disabled />
      </Preview>
    </div>
  )
}
