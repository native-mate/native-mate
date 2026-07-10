'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { CartItem } from '../../../../packages/registry/components/cart-item/cart-item'

const IMG = { uri: 'https://picsum.photos/seed/sneaker/200/200' }

export default function CartItemPreview() {
  const [qty, setQty] = useState(1)
  const [qty2, setQty2] = useState(2)
  const [items, setItems] = useState([
    { id: 1, title: 'Classic Runner Sneaker', variant: 'Size: 9, Color: White', price: 89.99, quantity: 1 },
    { id: 2, title: 'Everyday Backpack', variant: 'Color: Charcoal', price: 54.0, quantity: 2 },
    { id: 3, title: 'Wireless Earbuds Pro', price: 129.5, quantity: 1 },
  ])

  return (
    <div className="space-y-10">
      <Preview title="Basic" code={`import { CartItem } from '~/components/ui/cart-item'

const [quantity, setQuantity] = useState(1)

<CartItem
  image={{ uri: 'https://...' }}
  title="Classic Runner Sneaker"
  variant="Size: 9, Color: White"
  price={89.99}
  quantity={quantity}
  onQuantityChange={setQuantity}
/>`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <CartItem
            image={IMG}
            title="Classic Runner Sneaker"
            variant="Size: 9, Color: White"
            price={89.99}
            quantity={qty}
            onQuantityChange={setQty}
          />
        </View>
      </Preview>

      <Preview title="With max quantity" code={`<CartItem
  image={{ uri: 'https://...' }}
  title="Everyday Backpack"
  price={54.0}
  quantity={quantity}
  onQuantityChange={setQuantity}
  maxQuantity={5}
  minQuantity={1}
/>`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <CartItem
            image={IMG}
            title="Everyday Backpack"
            price={54.0}
            quantity={qty2}
            onQuantityChange={setQty2}
            maxQuantity={5}
            minQuantity={1}
          />
        </View>
      </Preview>

      <Preview title="Removable, swipeable list" code={`{items.map(item => (
  <CartItem
    key={item.id}
    image={{ uri: item.image }}
    title={item.title}
    variant={item.variant}
    price={item.price}
    quantity={item.quantity}
    onQuantityChange={(q) => updateQuantity(item.id, q)}
    onRemove={() => removeItem(item.id)}
  />
))}`}>
        <View style={{ width: '100%', maxWidth: 380, gap: 10 }}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              image={IMG}
              title={item.title}
              variant={item.variant}
              price={item.price}
              quantity={item.quantity}
              onQuantityChange={(q) =>
                setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, quantity: q } : it)))
              }
              onRemove={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
            />
          ))}
          {items.length === 0 && (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <span style={{ color: '#71717a', fontSize: 13 }}>Cart is empty</span>
            </View>
          )}
        </View>
      </Preview>

      <Preview title="Disabled" code={`<CartItem
  image={{ uri: 'https://...' }}
  title="Wireless Earbuds Pro"
  price={129.5}
  quantity={1}
  disabled
/>`}>
        <View style={{ width: '100%', maxWidth: 380 }}>
          <CartItem
            image={IMG}
            title="Wireless Earbuds Pro"
            price={129.5}
            quantity={1}
            onQuantityChange={() => {}}
            disabled
          />
        </View>
      </Preview>
    </div>
  )
}
