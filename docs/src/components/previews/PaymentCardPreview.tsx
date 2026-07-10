'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { PaymentCard } from '../../../../packages/registry/components/payment-card/payment-card'

export default function PaymentCardPreview() {
  const [cardNumber, setCardNumber] = useState('4242424242424242')
  const [name, setName] = useState('Ayush Sharma')
  const [expiry, setExpiry] = useState('1228')
  const [cvc, setCvc] = useState('')

  return (
    <div className="space-y-10">
      <Preview title="Display — brand auto-detection" code={`import { PaymentCard } from '~/components/ui/payment-card'

<PaymentCard cardNumber="4242424242424242" cardholderName="Ayush Sharma" expiryDate="12/28" />
<PaymentCard cardNumber="5500000000000004" cardholderName="Ayush Sharma" expiryDate="09/27" />
<PaymentCard cardNumber="340000000000009" cardholderName="Ayush Sharma" expiryDate="03/26" />`}>
        <View style={{ gap: 16, width: '100%', maxWidth: 340 }}>
          <PaymentCard cardNumber="4242424242424242" cardholderName="Ayush Sharma" expiryDate="12/28" />
          <PaymentCard cardNumber="5500000000000004" cardholderName="Ayush Sharma" expiryDate="09/27" />
          <PaymentCard cardNumber="340000000000009" cardholderName="Ayush Sharma" expiryDate="03/26" />
        </View>
      </Preview>

      <Preview title="Empty state" code={`<PaymentCard />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <PaymentCard />
        </View>
      </Preview>

      <Preview title="Input form (live-syncs to display card)" code={`const [cardNumber, setCardNumber] = useState('')
const [name, setName] = useState('')
const [expiry, setExpiry] = useState('')
const [cvc, setCvc] = useState('')

<PaymentCard
  cardNumber={cardNumber}
  cardholderName={name}
  expiryDate={expiry}
  variant="display"
/>

<PaymentCard
  variant="input"
  cardNumber={cardNumber}
  cardholderName={name}
  expiryDate={expiry}
  cvc={cvc}
  onCardNumberChange={setCardNumber}
  onCardholderNameChange={setName}
  onExpiryChange={setExpiry}
  onCvcChange={setCvc}
/>`}>
        <View style={{ gap: 20, width: '100%', maxWidth: 340 }}>
          <PaymentCard cardNumber={cardNumber} cardholderName={name} expiryDate={expiry} variant="display" />
          <PaymentCard
            variant="input"
            cardNumber={cardNumber}
            cardholderName={name}
            expiryDate={expiry}
            cvc={cvc}
            onCardNumberChange={setCardNumber}
            onCardholderNameChange={setName}
            onExpiryChange={setExpiry}
            onCvcChange={setCvc}
          />
        </View>
      </Preview>

      <Preview title="Input with validation errors" code={`<PaymentCard
  variant="input"
  cardNumber="123"
  errors={{
    cardNumber: 'Card number is incomplete',
    expiryDate: 'Enter a valid expiry date',
    cvc: 'CVC is required',
  }}
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <PaymentCard
            variant="input"
            cardNumber="123"
            errors={{
              cardNumber: 'Card number is incomplete',
              expiryDate: 'Enter a valid expiry date',
              cvc: 'CVC is required',
            }}
          />
        </View>
      </Preview>

      <Preview title="Disabled" code={`<PaymentCard
  variant="input"
  cardNumber="4242424242424242"
  cardholderName="Ayush Sharma"
  disabled
/>`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <PaymentCard variant="input" cardNumber="4242424242424242" cardholderName="Ayush Sharma" disabled />
        </View>
      </Preview>
    </div>
  )
}
