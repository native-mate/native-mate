'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { ReviewCard } from '../../../../packages/registry/components/review-card/review-card'

export default function ReviewCardPreview() {
  const [helpful, setHelpful] = useState(12)
  const [isHelpful, setIsHelpful] = useState(false)

  return (
    <div className="space-y-10">
      <Preview title="Basic" code={`import { ReviewCard } from '~/components/ui/review-card'

<ReviewCard
  author="Jordan Lee"
  rating={5}
  date="2026-06-20"
  text="Absolutely love this product. Fast shipping and exactly as described!"
/>`}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <ReviewCard
            author="Jordan Lee"
            rating={5}
            date="2026-06-20"
            text="Absolutely love this product. Fast shipping and exactly as described!"
          />
        </View>
      </Preview>

      <Preview title="Verified purchaser with avatar" code={`<ReviewCard
  author="Priya Nair"
  avatar={{ uri: 'https://...' }}
  rating={4}
  date={new Date(Date.now() - 1000 * 60 * 60 * 5)}
  text="Great quality overall. Sizing runs a little small so consider ordering one size up."
  verified
/>`}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <ReviewCard
            author="Priya Nair"
            avatar={{ uri: 'https://picsum.photos/seed/priya/100/100' }}
            rating={4}
            date={new Date(Date.now() - 1000 * 60 * 60 * 5)}
            text="Great quality overall. Sizing runs a little small so consider ordering one size up."
            verified
          />
        </View>
      </Preview>

      <Preview title="Long text with Read more" code={`<ReviewCard
  author="Marcus Webb"
  rating={3}
  date="2026-05-02"
  maxLines={2}
  text="It's a decent product for the price, but I've had a few issues with durability after a couple of months of daily use. Customer support was helpful when I reached out, and they offered a replacement, which I appreciated. Would consider buying again if the material is improved."
/>`}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <ReviewCard
            author="Marcus Webb"
            rating={3}
            date="2026-05-02"
            maxLines={2}
            text="It's a decent product for the price, but I've had a few issues with durability after a couple of months of daily use. Customer support was helpful when I reached out, and they offered a replacement, which I appreciated. Would consider buying again if the material is improved."
          />
        </View>
      </Preview>

      <Preview title="With images and helpful voting" code={`const [helpful, setHelpful] = useState(12)
const [isHelpful, setIsHelpful] = useState(false)

<ReviewCard
  author="Sam Rivera"
  rating={5}
  date="2026-04-11"
  text="Photos don't do it justice — even better in person!"
  images={[
    'https://.../1.jpg',
    'https://.../2.jpg',
    'https://.../3.jpg',
  ]}
  helpful={helpful}
  isHelpful={isHelpful}
  onHelpful={() => {
    setIsHelpful(h => !h)
    setHelpful(h => isHelpful ? h - 1 : h + 1)
  }}
  onReport={() => {}}
/>`}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <ReviewCard
            author="Sam Rivera"
            rating={5}
            date="2026-04-11"
            text="Photos don't do it justice — even better in person!"
            images={[
              'https://picsum.photos/seed/r1/200/200',
              'https://picsum.photos/seed/r2/200/200',
              'https://picsum.photos/seed/r3/200/200',
              'https://picsum.photos/seed/r4/200/200',
              'https://picsum.photos/seed/r5/200/200',
            ]}
            helpful={helpful}
            isHelpful={isHelpful}
            onHelpful={() => {
              setIsHelpful((h) => !h)
              setHelpful((h) => (isHelpful ? h - 1 : h + 1))
            }}
            onReport={() => {}}
          />
        </View>
      </Preview>
    </div>
  )
}
