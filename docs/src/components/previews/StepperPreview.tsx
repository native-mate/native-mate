'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Stepper } from '../../../../packages/registry/components/stepper/stepper'

export default function StepperPreview() {
  const [step, setStep] = useState(1)

  return (
    <div className="space-y-10">
      <Preview title="Numbered (horizontal)" code={`import { Stepper } from '~/components/ui/stepper'

<Stepper
  steps={[
    { label: 'Cart' },
    { label: 'Shipping' },
    { label: 'Payment' },
    { label: 'Review' },
  ]}
  currentStep={1}
/>`}>
        <View style={{ width: 340 }}>
          <Stepper
            steps={[
              { label: 'Cart' },
              { label: 'Shipping' },
              { label: 'Payment' },
              { label: 'Review' },
            ]}
            currentStep={1}
          />
        </View>
      </Preview>

      <Preview title="With descriptions" code={`<Stepper
  steps={[
    { label: 'Account', description: 'Create your login' },
    { label: 'Profile', description: 'Add your details' },
    { label: 'Done', description: 'All set' },
  ]}
  currentStep={2}
/>`}>
        <View style={{ width: 340 }}>
          <Stepper
            steps={[
              { label: 'Account', description: 'Create your login' },
              { label: 'Profile', description: 'Add your details' },
              { label: 'Done', description: 'All set' },
            ]}
            currentStep={2}
          />
        </View>
      </Preview>

      <Preview title="Dot variant" code={`<Stepper
  steps={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]}
  currentStep={1}
  variant="dot"
/>`}>
        <View style={{ width: 260 }}>
          <Stepper
            steps={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]}
            currentStep={1}
            variant="dot"
          />
        </View>
      </Preview>

      <Preview title="Vertical orientation" code={`<Stepper
  steps={[
    { label: 'Order placed', description: 'Jul 8, 10:04 AM' },
    { label: 'Packed', description: 'Jul 8, 3:20 PM' },
    { label: 'Shipped', description: 'Jul 9, 9:00 AM' },
    { label: 'Delivered' },
  ]}
  currentStep={2}
  orientation="vertical"
/>`}>
        <View style={{ width: 260 }}>
          <Stepper
            steps={[
              { label: 'Order placed', description: 'Jul 8, 10:04 AM' },
              { label: 'Packed', description: 'Jul 8, 3:20 PM' },
              { label: 'Shipped', description: 'Jul 9, 9:00 AM' },
              { label: 'Delivered' },
            ]}
            currentStep={2}
            orientation="vertical"
          />
        </View>
      </Preview>

      <Preview title="Interactive (tap completed steps)" code={`const [step, setStep] = useState(1)

<Stepper
  steps={[{ label: 'Info' }, { label: 'Address' }, { label: 'Confirm' }]}
  currentStep={step}
  onStepPress={setStep}
/>`}>
        <View style={{ width: 300 }}>
          <Stepper
            steps={[{ label: 'Info' }, { label: 'Address' }, { label: 'Confirm' }]}
            currentStep={step}
            onStepPress={setStep}
          />
        </View>
      </Preview>

      <Preview title="Sizes & custom colors" code={`<Stepper steps={steps} currentStep={1} size="sm" />
<Stepper steps={steps} currentStep={1} completedColor="#10b981" activeColor="#f59e0b" />`}>
        <View style={{ gap: 20, width: 300 }}>
          <Stepper
            steps={[{ label: 'A' }, { label: 'B' }, { label: 'C' }]}
            currentStep={1}
            size="sm"
          />
          <Stepper
            steps={[{ label: 'A' }, { label: 'B' }, { label: 'C' }]}
            currentStep={1}
            completedColor="#10b981"
            activeColor="#f59e0b"
          />
        </View>
      </Preview>
    </div>
  )
}
