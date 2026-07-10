'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Banner } from '../../../../packages/registry/components/banner/banner'

export default function BannerPreview() {
  const [visible, setVisible] = useState(true)

  return (
    <div className="space-y-10">
      <Preview title="Variants" code={`import { Banner } from '~/components/ui/banner'

<Banner variant="info" message="A new version is available." />
<Banner variant="success" message="Payment received successfully." />
<Banner variant="warning" message="Your trial ends in 3 days." />
<Banner variant="error" message="Failed to sync your changes." />`}>
        <View style={{ width: 320, gap: 10 }}>
          <Banner variant="info" message="A new version is available." />
          <Banner variant="success" message="Payment received successfully." />
          <Banner variant="warning" message="Your trial ends in 3 days." />
          <Banner variant="error" message="Failed to sync your changes." />
        </View>
      </Preview>

      <Preview title="With description and action" code={`<Banner
  variant="warning"
  message="Storage almost full"
  description="You've used 92% of your available storage."
  action={{ label: 'Upgrade', onPress: () => {} }}
/>`}>
        <View style={{ width: 320 }}>
          <Banner
            variant="warning"
            message="Storage almost full"
            description="You've used 92% of your available storage."
            action={{ label: 'Upgrade', onPress: () => {} }}
          />
        </View>
      </Preview>

      <Preview title="Dismissible" code={`const [visible, setVisible] = useState(true)

<Banner
  variant="info"
  message="We use cookies to improve your experience."
  dismissible
  visible={visible}
  onDismiss={() => setVisible(false)}
/>`}>
        <View style={{ width: 320 }}>
          {visible ? (
            <Banner
              variant="info"
              message="We use cookies to improve your experience."
              dismissible
              visible={visible}
              onDismiss={() => setVisible(false)}
            />
          ) : null}
        </View>
      </Preview>

      <Preview title="Custom icon" code={`<Banner
  variant="info"
  icon="rocket-outline"
  message="Your app was deployed successfully."
/>`}>
        <View style={{ width: 320 }}>
          <Banner variant="info" icon="rocket-outline" message="Your app was deployed successfully." />
        </View>
      </Preview>
    </div>
  )
}
