'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { QuantityStepper } from '../../../../packages/registry/components/quantity-stepper/quantity-stepper'

export default function QuantityStepperPreview() {
  const [qty1, setQty1] = useState(1)
  const [qty2, setQty2] = useState(3)
  const [qty3, setQty3] = useState(2)
  const [qty4, setQty4] = useState(5)

  return (
    <div className="space-y-10">
      <Preview title="Basic" code={`import { QuantityStepper } from '~/components/ui/quantity-stepper'

const [quantity, setQuantity] = useState(1)

<QuantityStepper value={quantity} onChange={setQuantity} />`}>
        <QuantityStepper value={qty1} onChange={setQty1} />
      </Preview>

      <Preview title="Sizes" code={`<QuantityStepper value={quantity} onChange={setQuantity} size="sm" />
<QuantityStepper value={quantity} onChange={setQuantity} size="md" />
<QuantityStepper value={quantity} onChange={setQuantity} size="lg" />`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <QuantityStepper value={qty2} onChange={setQty2} size="sm" />
          <QuantityStepper value={qty2} onChange={setQty2} size="md" />
          <QuantityStepper value={qty2} onChange={setQty2} size="lg" />
        </View>
      </Preview>

      <Preview title="Min / max bounds" code={`<QuantityStepper
  value={quantity}
  onChange={setQuantity}
  min={1}
  max={5}
  step={1}
/>`}>
        <QuantityStepper value={qty3} onChange={setQty3} min={1} max={5} step={1} />
      </Preview>

      <Preview title="Step increment" code={`<QuantityStepper value={quantity} onChange={setQuantity} step={5} min={0} max={50} />`}>
        <QuantityStepper value={qty4} onChange={setQty4} step={5} min={0} max={50} />
      </Preview>

      <Preview title="Disabled" code={`<QuantityStepper value={2} onChange={() => {}} disabled />`}>
        <QuantityStepper value={2} onChange={() => {}} disabled />
      </Preview>
    </div>
  )
}
