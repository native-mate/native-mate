'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Alert } from '../../../../packages/registry/components/alert/alert'

export default function AlertPreview() {
  const [showWarning, setShowWarning] = useState(true)

  return (
    <div className="space-y-10">
      <Preview title="Variants" minHeight={260} code={`import { Alert } from '~/components/ui/alert'

<Alert variant="default" title="Scheduled maintenance" description="Service unavailable Sunday 2 AM UTC." />
<Alert variant="info" title="Pro tip" description="Drag items to reorder your list." />
<Alert variant="success" title="Payment received" description="Your invoice has been paid." />
<Alert variant="warning" title="Trial ending" description="3 days remaining." />
<Alert variant="destructive" title="Upload failed" description="File exceeds 10 MB limit." />`}>
        <View style={{ width: '100%', maxWidth: 400, gap: 10 }}>
          <Alert variant="default" title="Scheduled maintenance" description="Service unavailable Sunday 2 AM UTC." />
          <Alert variant="info" title="Pro tip" description="Drag items to reorder your list." />
          <Alert variant="success" title="Payment received" description="Your invoice has been paid." />
          <Alert variant="warning" title="Trial ending" description="3 days remaining." />
          <Alert variant="destructive" title="Upload failed" description="File exceeds 10 MB limit." />
        </View>
      </Preview>

      <Preview title="Dismissible" code={`const [show, setShow] = useState(true)

{show && (
  <Alert
    variant="warning"
    title="Low disk space"
    description="Less than 500 MB remaining."
    onDismiss={() => setShow(false)}
  />
)}`}>
        <View style={{ width: '100%', maxWidth: 400 }}>
          {showWarning ? (
            <Alert
              variant="warning"
              title="Low disk space"
              description="Less than 500 MB remaining."
              onDismiss={() => setShowWarning(false)}
            />
          ) : (
            <View
              style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#3f3f46', alignItems: 'center' }}
              // @ts-ignore
              onClick={() => setShowWarning(true)}
            >
              <Alert variant="success" title="Alert dismissed" description="Tap to reset" />
            </View>
          )}
        </View>
      </Preview>

      <Preview title="With action button" code={`<Alert
  variant="destructive"
  title="Sync failed"
  description="Check your internet connection."
  action={{ label: 'Retry', onPress: handleRetry }}
/>`}>
        <View style={{ width: '100%', maxWidth: 400 }}>
          <Alert
            variant="destructive"
            title="Sync failed"
            description="Check your internet connection and try again."
            action={{ label: 'Retry', onPress: () => {} }}
          />
        </View>
      </Preview>
    </div>
  )
}
