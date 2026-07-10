'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { ProductCard } from '../../../../packages/registry/components/product-card/product-card'

const IMG = { uri: 'https://picsum.photos/seed/shoe/400/400' }

export default function ProductCardPreview() {
  const [fav, setFav] = useState(false)
  const [fav2, setFav2] = useState(true)
  const [cartCount, setCartCount] = useState(0)

  return (
    <div className="space-y-10">
      <Preview title="Basic" code={`import { ProductCard } from '~/components/ui/product-card'

<ProductCard
  image={{ uri: 'https://...' }}
  title="Classic Runner Sneaker"
  price={89.99}
  rating={4.5}
  reviewCount={128}
  onAddToCart={() => {}}
/>`}>
        <View style={{ width: '100%', maxWidth: 240 }}>
          <ProductCard
            image={IMG}
            title="Classic Runner Sneaker"
            price={89.99}
            rating={4.5}
            reviewCount={128}
            onAddToCart={() => setCartCount((c) => c + 1)}
          />
        </View>
      </Preview>

      <Preview title="Sale badge with discount" code={`<ProductCard
  image={{ uri: 'https://...' }}
  title="Wireless Earbuds Pro"
  price={79.99}
  originalPrice={129.99}
  badge="Sale"
  rating={4.2}
  reviewCount={340}
  favorite={favorite}
  onFavoriteToggle={() => setFavorite(f => !f)}
  onAddToCart={() => {}}
/>`}>
        <View style={{ width: '100%', maxWidth: 240 }}>
          <ProductCard
            image={IMG}
            title="Wireless Earbuds Pro"
            price={79.99}
            originalPrice={129.99}
            badge="Sale"
            rating={4.2}
            reviewCount={340}
            favorite={fav}
            onFavoriteToggle={() => setFav((f) => !f)}
            onAddToCart={() => setCartCount((c) => c + 1)}
          />
        </View>
      </Preview>

      <Preview title="Favorited, custom badge color" code={`<ProductCard
  image={{ uri: 'https://...' }}
  title="Everyday Backpack"
  price={54.0}
  badge="New"
  badgeColor="#8b5cf6"
  favorite
  rating={5}
  reviewCount={12}
  onFavoriteToggle={() => {}}
/>`}>
        <View style={{ width: '100%', maxWidth: 240 }}>
          <ProductCard
            image={IMG}
            title="Everyday Backpack"
            price={54.0}
            badge="New"
            badgeColor="#8b5cf6"
            favorite={fav2}
            onFavoriteToggle={() => setFav2((f) => !f)}
            rating={5}
            reviewCount={12}
          />
        </View>
      </Preview>

      <Preview title="Out of stock" code={`<ProductCard
  image={{ uri: 'https://...' }}
  title="Limited Edition Jacket"
  price={199.0}
  inStock={false}
/>`}>
        <View style={{ width: '100%', maxWidth: 240 }}>
          <ProductCard image={IMG} title="Limited Edition Jacket" price={199.0} inStock={false} />
        </View>
      </Preview>

      <Preview title="Grid layout, pressable" code={`<View style={{ flexDirection: 'row', gap: 12 }}>
  <ProductCard image={{ uri: '...' }} title="Item A" price={45} onPress={() => {}} />
  <ProductCard image={{ uri: '...' }} title="Item B" price={65} onPress={() => {}} />
</View>`}>
        <View style={{ flexDirection: 'row', gap: 12, width: '100%', maxWidth: 500 }}>
          <View style={{ flex: 1 }}>
            <ProductCard image={IMG} title="Minimalist Watch" price={45} rating={4.0} onPress={() => {}} />
          </View>
          <View style={{ flex: 1 }}>
            <ProductCard image={IMG} title="Canvas Tote Bag" price={22} rating={3.8} onPress={() => {}} />
          </View>
        </View>
      </Preview>
    </div>
  )
}
