'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { PricingCard } from '../../../../packages/registry/components/pricing-card/pricing-card'

export default function PricingCardPreview() {
  const [selected, setSelected] = useState('pro')

  return (
    <div className="space-y-10">
      <Preview title="Basic plan" code={`import { PricingCard } from '~/components/ui/pricing-card'

<PricingCard
  title="Starter"
  price={9}
  period="month"
  description="For individuals getting started"
  features={[
    { text: '1 project', included: true },
    { text: 'Community support', included: true },
    { text: 'Custom domain', included: false },
  ]}
  ctaLabel="Choose Starter"
  onPress={() => {}}
/>`}>
        <View style={{ width: '100%', maxWidth: 300 }}>
          <PricingCard
            title="Starter"
            price={9}
            period="month"
            description="For individuals getting started"
            features={[
              { text: '1 project', included: true },
              { text: 'Community support', included: true },
              { text: 'Custom domain', included: false },
            ]}
            ctaLabel="Choose Starter"
            onPress={() => {}}
          />
        </View>
      </Preview>

      <Preview title="Popular plan with badge" code={`<PricingCard
  title="Pro"
  price={29}
  period="month"
  description="For growing teams"
  popular
  features={[
    { text: 'Unlimited projects', included: true },
    { text: 'Priority support', included: true },
    { text: 'Custom domain', included: true },
    { text: 'Advanced analytics', included: true },
  ]}
  ctaLabel="Upgrade to Pro"
  onPress={() => {}}
/>`}>
        <View style={{ width: '100%', maxWidth: 300 }}>
          <PricingCard
            title="Pro"
            price={29}
            period="month"
            description="For growing teams"
            popular
            features={[
              { text: 'Unlimited projects', included: true },
              { text: 'Priority support', included: true },
              { text: 'Custom domain', included: true },
              { text: 'Advanced analytics', included: true },
            ]}
            ctaLabel="Upgrade to Pro"
            onPress={() => {}}
          />
        </View>
      </Preview>

      <Preview title="Custom badge & color" code={`<PricingCard
  title="Enterprise"
  price={99}
  period="year"
  badge="Best Value"
  badgeColor="#8b5cf6"
  features={[
    { text: 'Everything in Pro', included: true },
    { text: 'SSO & SAML', included: true },
    { text: 'Dedicated support', included: true },
  ]}
  ctaLabel="Contact Sales"
  onPress={() => {}}
/>`}>
        <View style={{ width: '100%', maxWidth: 300 }}>
          <PricingCard
            title="Enterprise"
            price={99}
            period="year"
            badge="Best Value"
            badgeColor="#8b5cf6"
            features={[
              { text: 'Everything in Pro', included: true },
              { text: 'SSO & SAML', included: true },
              { text: 'Dedicated support', included: true },
            ]}
            ctaLabel="Contact Sales"
            onPress={() => {}}
          />
        </View>
      </Preview>

      <Preview title="Plan comparison row" code={`const [selected, setSelected] = useState('pro')

<View style={{ flexDirection: 'row', gap: 12 }}>
  <PricingCard title="Free" price={0} ctaLabel="Current plan" />
  <PricingCard title="Pro" price={29} popular ctaLabel="Select" onPress={() => setSelected('pro')} />
</View>`}>
        <View style={{ flexDirection: 'row', gap: 12, width: '100%', maxWidth: 640 }}>
          <View style={{ flex: 1 }}>
            <PricingCard
              title="Free"
              price={0}
              features={[
                { text: '1 project', included: true },
                { text: 'Community support', included: true },
              ]}
              ctaLabel="Current plan"
            />
          </View>
          <View style={{ flex: 1 }}>
            <PricingCard
              title="Pro"
              price={29}
              popular
              features={[
                { text: 'Unlimited projects', included: true },
                { text: 'Priority support', included: true },
              ]}
              ctaLabel={selected === 'pro' ? 'Selected' : 'Select'}
              onPress={() => setSelected('pro')}
            />
          </View>
        </View>
      </Preview>

      <Preview title="Disabled" code={`<PricingCard title="Legacy" price={19} disabled ctaLabel="Unavailable" onPress={() => {}} />`}>
        <View style={{ width: '100%', maxWidth: 300 }}>
          <PricingCard title="Legacy" price={19} disabled ctaLabel="Unavailable" onPress={() => {}} />
        </View>
      </Preview>
    </div>
  )
}
