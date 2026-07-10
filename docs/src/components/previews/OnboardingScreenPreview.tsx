'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { OnboardingScreen } from '../../../../packages/registry/components/onboarding-screen/onboarding-screen'
import { Icon } from '@native-mate/core'

const slides = [
  { title: 'Copy, not install', description: 'Component source lives in your project — no black-box dependency to fight with.' },
  { title: 'Themeable by default', description: 'Every component reads from your theme tokens for colors, spacing, and radius.' },
  { title: 'Built for React Native', description: 'Native gestures, Reanimated animations, and accessibility baked in.' },
]

function SlideIcon({ name }: { name: string }) {
  return (
    <View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: '#6366f122', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} size={64} color="primary" />
    </View>
  )
}

export default function OnboardingScreenPreview() {
  const [index, setIndex] = useState(0)

  return (
    <div className="space-y-10">
      <Preview title="Interactive onboarding flow" minHeight={420} code={`import { OnboardingScreen } from '~/components/ui/onboarding-screen'

const slides = [
  { title: 'Copy, not install', description: '...' },
  { title: 'Themeable by default', description: '...' },
  { title: 'Built for React Native', description: '...' },
]

const [index, setIndex] = useState(0)

<OnboardingScreen
  image={<SlideIcon name="copy-outline" />}
  title={slides[index].title}
  description={slides[index].description}
  index={index}
  total={slides.length}
  onNext={() => setIndex(i => Math.min(i + 1, slides.length - 1))}
  onSkip={() => setIndex(slides.length - 1)}
  onFinish={() => setIndex(0)}
/>`}>
          <View style={{ width: 320, height: 420, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a' }}>
            <OnboardingScreen
              image={<SlideIcon name={['copy-outline', 'color-palette-outline', 'phone-portrait-outline'][index]} />}
              title={slides[index].title}
              description={slides[index].description}
              index={index}
              total={slides.length}
              onNext={() => setIndex((i) => Math.min(i + 1, slides.length - 1))}
              onSkip={() => setIndex(slides.length - 1)}
              onFinish={() => setIndex(0)}
            />
          </View>
      </Preview>

      <Preview title="Last slide (Get Started)" minHeight={420} code={`<OnboardingScreen
  image={<SlideIcon name="rocket-outline" />}
  title="You're all set"
  description="Start adding components to your project."
  index={2}
  total={3}
  showSkip={false}
  finishLabel="Get Started"
  onFinish={() => router.replace('/home')}
/>`}>
        <View style={{ width: 320, height: 420, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a' }}>
          <OnboardingScreen
            image={<SlideIcon name="rocket-outline" />}
            title="You're all set"
            description="Start adding components to your project."
            index={2}
            total={3}
            showSkip={false}
            finishLabel="Get Started"
            onFinish={() => {}}
          />
        </View>
      </Preview>

      <Preview title="Custom colors, no dots" minHeight={420} code={`<OnboardingScreen
  image={<SlideIcon name="moon-outline" />}
  title="Dark by design"
  description="A carefully tuned dark theme out of the box."
  index={0}
  total={1}
  showDots={false}
  showSkip={false}
  backgroundColor="#0f0f11"
  textColor="#fafafa"
  nextLabel="Continue"
/>`}>
        <View style={{ width: 320, height: 420, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a' }}>
          <OnboardingScreen
            image={<SlideIcon name="moon-outline" />}
            title="Dark by design"
            description="A carefully tuned dark theme out of the box."
            index={0}
            total={1}
            showDots={false}
            showSkip={false}
            backgroundColor="#0f0f11"
            textColor="#fafafa"
            nextLabel="Continue"
          />
        </View>
      </Preview>
    </div>
  )
}
