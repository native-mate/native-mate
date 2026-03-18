'use client'
import React, { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Text } from '@native-mate/core'
import { Preview } from './shared/Preview'
import { Toast } from '../../../../../packages/registry/components/toast/toast'

function FireBtn({ label, onPress, color = '#6366f1' }: { label: string; onPress: () => void; color?: string }) {
  return (
    <View
      style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: color, alignItems: 'center' }}
      // @ts-ignore web
      onClick={onPress}
    >
      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{label}</Text>
    </View>
  )
}

export default function ToastPreview() {
  const [config, setConfig] = useState<any>(null)
  const [show, setShow] = useState(false)

  const fire = (cfg: any) => {
    setConfig(cfg)
    setShow(false)
    setTimeout(() => setShow(true), 50)
  }

  return (
    <div className="space-y-10">
      <Preview title="Variants" minHeight={140} code={`import { Toast } from '~/components/ui/toast'

<Toast
  visible={show}
  onHide={() => setShow(false)}
  variant="success"
  message="Changes saved"
  duration={3000}
/>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          <FireBtn label="Success" color="#22c55e" onPress={() => fire({ variant: 'success', message: 'Changes saved' })} />
          <FireBtn label="Error" color="#ef4444" onPress={() => fire({ variant: 'destructive', message: 'Something went wrong', description: 'Please try again.' })} />
          <FireBtn label="Warning" color="#f59e0b" onPress={() => fire({ variant: 'warning', message: 'Unsaved changes' })} />
          <FireBtn label="Info" color="#3b82f6" onPress={() => fire({ variant: 'default', message: 'Update available' })} />
        </View>
        {config && <Toast visible={show} onHide={() => setShow(false)} duration={config.duration ?? 3000} {...config} />}
      </Preview>

      <Preview title="With action (Undo)" minHeight={140} code={`<Toast
  visible={show}
  onHide={() => setShow(false)}
  variant="default"
  message="Email sent"
  showProgress
  action={{ label: 'Undo', onPress: () => setShow(false) }}
  duration={4000}
/>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          <FireBtn label="Undo action" onPress={() => fire({
            variant: 'default', message: 'Email sent', showProgress: true,
            action: { label: 'Undo', onPress: () => setShow(false) },
            duration: 4000,
          })} />
          <FireBtn label="Progress bar" color="#22c55e" onPress={() => fire({ variant: 'success', message: 'File uploaded!', showProgress: true, duration: 4000 })} />
        </View>
        {config && <Toast visible={show} onHide={() => setShow(false)} duration={config.duration ?? 3000} {...config} />}
      </Preview>

      <Preview title="Position" minHeight={140} code={`<Toast visible={show} onHide={() => setShow(false)} position="top" message="Appears at top" variant="success" />
<Toast visible={show} onHide={() => setShow(false)} position="bottom" message="Appears at bottom" variant="success" />`}>
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
          <FireBtn label="Top" onPress={() => fire({ variant: 'success', message: 'Appears at top', position: 'top' })} />
          <FireBtn label="Bottom" onPress={() => fire({ variant: 'success', message: 'Appears at bottom' })} />
        </View>
        {config && <Toast visible={show} onHide={() => setShow(false)} duration={config.duration ?? 3000} {...config} />}
      </Preview>
    </div>
  )
}
