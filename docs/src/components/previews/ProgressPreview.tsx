'use client'
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Progress } from '../../../../../packages/registry/components/progress/progress'

export default function ProgressPreview() {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimated(prev => (prev >= 100 ? 0 : prev + 5))
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-10">
      <Preview title="Linear progress" code={`import { Progress } from '~/components/ui/progress'

<Progress value={30} />
<Progress value={60} />
<Progress value={90} />`}>
        <View style={{ gap: 16, width: '100%', maxWidth: 340 }}>
          <Progress value={30} />
          <Progress value={60} />
          <Progress value={90} />
        </View>
      </Preview>

      <Preview title="With label" code={`<Progress value={45} showLabel label="Uploading…" />
<Progress value={75} showLabel />`}>
        <View style={{ gap: 16, width: '100%', maxWidth: 340 }}>
          <Progress value={45} showLabel label="Uploading…" />
          <Progress value={75} showLabel />
        </View>
      </Preview>

      <Preview title="Sizes" code={`<Progress value={60} size="sm" />
<Progress value={60} size="md" />
<Progress value={60} size="lg" />`}>
        <View style={{ gap: 16, width: '100%', maxWidth: 340 }}>
          <Progress value={60} size="sm" />
          <Progress value={60} size="md" />
          <Progress value={60} size="lg" />
        </View>
      </Preview>

      <Preview title="Custom colors" code={`<Progress value={70} color="#10b981" />
<Progress value={50} color="#f59e0b" />
<Progress value={85} color="#8b5cf6" />`}>
        <View style={{ gap: 16, width: '100%', maxWidth: 340 }}>
          <Progress value={70} color="#10b981" />
          <Progress value={50} color="#f59e0b" />
          <Progress value={85} color="#8b5cf6" />
        </View>
      </Preview>

      <Preview title="Animated (live)" minHeight={80} code={`// Animate the value prop to animate the bar
<Progress value={progress} animated />`}>
        <View style={{ width: '100%', maxWidth: 340 }}>
          <Progress value={animated} showLabel animated />
        </View>
      </Preview>

      <Preview title="Circular" code={`<Progress value={25} variant="circular" />
<Progress value={60} variant="circular" showValue />
<Progress value={90} variant="circular" size="lg" showValue color="#10b981" />`}>
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
          <Progress value={25} variant="circular" />
          <Progress value={60} variant="circular" showValue />
          <Progress value={90} variant="circular" size="lg" showValue color="#10b981" />
        </View>
      </Preview>

      <Preview title="Indeterminate" code={`<Progress indeterminate />
<Progress indeterminate color="#8b5cf6" />`}>
        <View style={{ gap: 12, width: '100%', maxWidth: 340 }}>
          <Progress indeterminate />
          <Progress indeterminate color="#8b5cf6" />
        </View>
      </Preview>
    </div>
  )
}
