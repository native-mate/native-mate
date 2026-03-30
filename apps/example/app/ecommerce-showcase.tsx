import { useState } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@native-mate/core'
import { Screen } from '../components/ui/screen'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { Icon } from '../components/ui/icon'
import { Separator } from '../components/ui/separator'
import { DividerLabel } from '../components/ui/divider-label'
import { ProductCard } from '../components/ui/product-card'
import { CartItem } from '../components/ui/cart-item'
import { QuantityStepper } from '../components/ui/quantity-stepper'
import { PricingCard } from '../components/ui/pricing-card'
import { PaymentCard } from '../components/ui/payment-card'
import { ReviewCard } from '../components/ui/review-card'

export default function EcommerceShowcaseScreen() {
  const router = useRouter()
  const theme = useTheme()
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ p1: false, p2: true })
  const [cartQty1, setCartQty1] = useState(2)
  const [cartQty2, setCartQty2] = useState(1)
  const [standaloneQty, setStandaloneQty] = useState(3)

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <Text variant="h3">E-Commerce</Text>
              <Text variant="caption" color="muted">Products, cart, pricing, reviews</Text>
            </View>
            <Button variant="ghost" size="sm" iconLeft={<Icon name="arrow-back" size={16} />} onPress={() => router.back()}>
              Back
            </Button>
          </View>

          <DividerLabel label="Featured Products" />

          {/* Product Cards */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <ProductCard
                image={
                  <View style={{ height: 140, backgroundColor: theme.colors.primary + '20', alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md }}>
                    <Icon name="headset-outline" size={48} color={theme.colors.primary} />
                  </View>
                }
                title="Wireless Headphones"
                price={79.99}
                originalPrice={129.99}
                rating={4.5}
                reviewCount={234}
                badge="Sale"
                favorite={favorites.p1}
                onFavoriteToggle={() => setFavorites(f => ({ ...f, p1: !f.p1 }))}
                onPress={() => {}}
                onAddToCart={() => {}}
                inStock
              />
            </View>
            <View style={{ flex: 1 }}>
              <ProductCard
                image={
                  <View style={{ height: 140, backgroundColor: theme.colors.success + '20', alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md }}>
                    <Icon name="watch-outline" size={48} color={theme.colors.success} />
                  </View>
                }
                title="Smart Watch Pro"
                price={299.99}
                rating={4.8}
                reviewCount={89}
                badge="New"
                favorite={favorites.p2}
                onFavoriteToggle={() => setFavorites(f => ({ ...f, p2: !f.p2 }))}
                onPress={() => {}}
                onAddToCart={() => {}}
                inStock
              />
            </View>
          </View>

          <DividerLabel label="Shopping Cart" />

          {/* Cart Items */}
          <CartItem
            image={
              <View style={{ width: 60, height: 60, backgroundColor: theme.colors.primary + '20', alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.sm }}>
                <Icon name="headset-outline" size={24} color={theme.colors.primary} />
              </View>
            }
            title="Wireless Headphones"
            variant="Color: Black"
            price={79.99}
            quantity={cartQty1}
            onQuantityChange={setCartQty1}
            onRemove={() => {}}
            maxQuantity={10}
          />
          <CartItem
            image={
              <View style={{ width: 60, height: 60, backgroundColor: theme.colors.warning + '20', alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.sm }}>
                <Icon name="shirt-outline" size={24} color={theme.colors.warning} />
              </View>
            }
            title="Cotton T-Shirt"
            variant="Size: M, Color: Navy"
            price={24.99}
            quantity={cartQty2}
            onQuantityChange={setCartQty2}
            onRemove={() => {}}
            maxQuantity={5}
          />

          {/* Standalone Quantity Stepper */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <Text variant="label">Quantity Stepper</Text>
            <QuantityStepper value={standaloneQty} onChange={setStandaloneQty} min={1} max={20} size="md" />
          </View>

          <DividerLabel label="Pricing Plans" />

          {/* Pricing Cards */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <PricingCard
                title="Basic"
                price={9}
                period="month"
                currency="$"
                features={[
                  { text: '5 Projects', included: true },
                  { text: '10 GB Storage', included: true },
                  { text: 'Email Support', included: true },
                  { text: 'API Access', included: false },
                  { text: 'Custom Domain', included: false },
                ]}
                ctaLabel="Get Started"
                onPress={() => {}}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PricingCard
                title="Pro"
                price={29}
                period="month"
                currency="$"
                popular
                badge="Best Value"
                features={[
                  { text: 'Unlimited Projects', included: true },
                  { text: '100 GB Storage', included: true },
                  { text: 'Priority Support', included: true },
                  { text: 'API Access', included: true },
                  { text: 'Custom Domain', included: true },
                ]}
                ctaLabel="Upgrade Now"
                onPress={() => {}}
              />
            </View>
          </View>

          <DividerLabel label="Payment" />

          {/* Payment Card Display */}
          <PaymentCard
            cardNumber="4242424242424242"
            cardholderName="Jane Cooper"
            expiryDate="12/28"
            brand="visa"
            variant="display"
          />

          <DividerLabel label="Customer Reviews" />

          {/* Review Cards */}
          <ReviewCard
            author="Alex Thompson"
            avatar={undefined}
            rating={5}
            date="2 days ago"
            text="Absolutely love these headphones! The noise cancellation is incredible and battery life lasts all day. Best purchase I've made this year. Highly recommend to anyone looking for premium audio quality."
            helpful={24}
            onHelpful={() => {}}
            verified
          />
          <ReviewCard
            author="Sarah Chen"
            avatar={undefined}
            rating={3}
            date="1 week ago"
            text="Good product overall but the ear cushions could be more comfortable for extended use. Sound quality is great though."
            helpful={8}
            images={[]}
            onHelpful={() => {}}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
