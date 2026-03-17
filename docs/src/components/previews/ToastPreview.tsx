'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Toast ---

type ToastVariant = 'default' | 'success' | 'destructive' | 'warning'

interface ToastAction { label: string; onPress: () => void }

const icons: Record<ToastVariant, string> = { default: 'ℹ', success: '✓', destructive: '✕', warning: '⚠' }
const iconBg: Record<ToastVariant, string> = {
  default: '#52525b',
  success: '#22c55e',
  destructive: '#ef4444',
  warning: '#f59e0b',
}

function WebToast({
  visible,
  message,
  description,
  variant = 'default',
  duration = 3000,
  onHide,
  action,
  showProgress = false,
  persistent = false,
  position = 'bottom',
}: {
  visible: boolean
  message: string
  description?: string
  variant?: ToastVariant
  duration?: number
  onHide: () => void
  action?: ToastAction
  showProgress?: boolean
  persistent?: boolean
  position?: 'top' | 'bottom'
}) {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(100)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const rafRef = useRef<number>()

  useEffect(() => {
    if (visible) {
      setMounted(true)
      setProgress(100)
      if (!persistent) {
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          setProgress(Math.max(0, 100 - (elapsed / duration) * 100))
          if (elapsed < duration) rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
        timerRef.current = setTimeout(() => { setMounted(false); onHide() }, duration)
      }
      return () => {
        clearTimeout(timerRef.current)
        cancelAnimationFrame(rafRef.current!)
      }
    } else {
      setMounted(false)
    }
  }, [visible])

  if (!mounted) return null

  const posStyle: React.CSSProperties = position === 'top'
    ? { top: 16 }
    : { bottom: 16 }

  return (
    <div style={{
      position: 'fixed',
      left: 16, right: 16,
      maxWidth: 400,
      margin: '0 auto',
      ...posStyle,
      backgroundColor: '#18181b',
      borderRadius: 12,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      border: '1px solid #3f3f46',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      zIndex: 9999,
      animation: 'toast-in 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      overflow: 'hidden',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        backgroundColor: iconBg[variant],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700, color: '#fff',
        flexShrink: 0, marginTop: 1,
      }}>
        {icons[variant]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', lineHeight: '1.4' }}>{message}</div>
        {description && (
          <div style={{ fontSize: 12, color: '#71717a', marginTop: 2, lineHeight: '1.4' }}>{description}</div>
        )}
        {action && (
          <button
            onClick={action.onPress}
            style={{
              marginTop: 8, padding: '3px 8px',
              borderRadius: 6, border: '1px solid #3f3f46',
              background: 'none', color: '#e4e4e7',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {action.label}
          </button>
        )}
      </div>
      {persistent && (
        <button onClick={() => { setMounted(false); onHide() }}
          style={{ background: 'none', border: 'none', color: '#71717a', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 0 }}>
          ×
        </button>
      )}
      {showProgress && !persistent && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          height: 3, borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
          backgroundColor: iconBg[variant], opacity: 0.5,
          width: `${progress}%`, transition: 'width 0.1s linear',
        }} />
      )}
      <style>{`@keyframes toast-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

// --- Preview Block ---

function Preview({ title, code, children }: { title: string; code: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current)
  }, [code, expanded])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
      <div className="rounded-xl border border-zinc-800 overflow-hidden relative">
        <div className="flex items-center justify-center min-h-[100px] p-8 bg-zinc-950/50">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <div className="relative">
          <div className={`bg-zinc-950 overflow-hidden transition-all duration-300 ${expanded ? '' : 'max-h-[100px]'}`}>
            <pre className="!m-0 !bg-transparent !p-5 text-[13px] leading-6">
              <code ref={codeRef} className="language-tsx">{code}</code>
            </pre>
          </div>
          {!expanded && (
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent">
              <button onClick={() => setExpanded(true)} className="mb-4 px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-medium cursor-pointer hover:bg-white transition-colors">View Code</button>
            </div>
          )}
          {expanded && (
            <div className="flex justify-center gap-3 py-3 bg-zinc-950 border-t border-zinc-800/50">
              <button onClick={handleCopy} className="px-3 py-1 rounded-md text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">{copied ? 'Copied!' : 'Copy'}</button>
              <button onClick={() => setExpanded(false)} className="px-3 py-1 rounded-md text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">Collapse</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Toast Previews ---

export default function ToastPreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'

  const [activeVariant, setActiveVariant] = useState<ToastVariant | null>(null)
  const [showAction, setShowAction] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showPersistent, setShowPersistent] = useState(false)

  const trigger = (variant: ToastVariant, withAction = false, withProgress = false) => {
    setActiveVariant(null)
    setShowAction(withAction)
    setShowProgress(withProgress)
    setTimeout(() => setActiveVariant(variant), 50)
  }

  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Variants"
        code={`import { Toast } from "~/components/ui/toast"

export function ToastVariants() {
  const [variant, setVariant] = useState<ToastVariant | null>(null)
  return (
    <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button onPress={() => setVariant('success')}>Success</Button>
        <Button onPress={() => setVariant('destructive')}>Error</Button>
        <Button onPress={() => setVariant('warning')}>Warning</Button>
        <Button onPress={() => setVariant('default')}>Info</Button>
      </View>
      {variant && (
        <Toast
          visible
          message="Notification message"
          variant={variant}
          onHide={() => setVariant(null)}
        />
      )}
    </>
  )
}`}
      >
        <div className="flex flex-wrap gap-2">
          {(['success', 'destructive', 'warning', 'default'] as ToastVariant[]).map((v) => (
            <button
              key={v}
              onClick={() => trigger(v)}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:border-zinc-500 transition-colors cursor-pointer capitalize"
            >
              {v === 'destructive' ? 'Error' : v}
            </button>
          ))}
        </div>
        {activeVariant && !showAction && !showProgress && (
          <WebToast
            visible
            message={activeVariant === 'success' ? 'Changes saved successfully' : activeVariant === 'destructive' ? 'Something went wrong' : activeVariant === 'warning' ? 'Unsaved changes detected' : 'New update available'}
            variant={activeVariant}
            duration={3000}
            onHide={() => setActiveVariant(null)}
          />
        )}
      </Preview>
      )}

      {rest && (
      <Preview
        title="With Action Button"
        code={`import { Toast } from "~/components/ui/toast"

export function ToastWithAction() {
  const [show, setShow] = useState(false)
  return (
    <>
      <Button onPress={() => setShow(true)}>Show Toast</Button>
      <Toast
        visible={show}
        message="Item deleted"
        description="This can be undone"
        variant="default"
        action={{ label: 'Undo', onPress: () => setShow(false) }}
        onHide={() => setShow(false)}
      />
    </>
  )
}`}
      >
        <button
          onClick={() => trigger('default', true)}
          className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:border-zinc-500 transition-colors cursor-pointer"
        >
          Show with Action
        </button>
        {activeVariant && showAction && (
          <WebToast
            visible
            message="Item deleted"
            description="This action can be undone"
            variant="default"
            duration={4000}
            onHide={() => setActiveVariant(null)}
            action={{ label: 'Undo', onPress: () => setActiveVariant(null) }}
          />
        )}
      </Preview>
      )}

      {rest && (
      <Preview
        title="Progress Bar"
        code={`import { Toast } from "~/components/ui/toast"

export function ToastProgress() {
  const [show, setShow] = useState(false)
  return (
    <>
      <Button onPress={() => setShow(true)}>Show with Progress</Button>
      <Toast
        visible={show}
        message="Uploading file…"
        variant="default"
        duration={4000}
        showProgress
        onHide={() => setShow(false)}
      />
    </>
  )
}`}
      >
        <button
          onClick={() => trigger('default', false, true)}
          className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:border-zinc-500 transition-colors cursor-pointer"
        >
          Show with Progress
        </button>
        {activeVariant && showProgress && (
          <WebToast
            visible
            message="Uploading file…"
            description="Please wait"
            variant="default"
            duration={4000}
            onHide={() => setActiveVariant(null)}
            showProgress
          />
        )}
      </Preview>
      )}

      {rest && (
      <Preview
        title="Persistent (manual dismiss)"
        code={`import { Toast } from "~/components/ui/toast"

export function ToastPersistent() {
  const [show, setShow] = useState(false)
  return (
    <>
      <Button onPress={() => setShow(true)}>Show Persistent</Button>
      <Toast
        visible={show}
        message="No internet connection"
        description="Check your network settings"
        variant="warning"
        persistent
        onHide={() => setShow(false)}
      />
    </>
  )
}`}
      >
        <button
          onClick={() => setShowPersistent(true)}
          className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:border-zinc-500 transition-colors cursor-pointer"
        >
          Show Persistent
        </button>
        <WebToast
          visible={showPersistent}
          message="No internet connection"
          description="Check your network settings"
          variant="warning"
          persistent
          onHide={() => setShowPersistent(false)}
        />
      </Preview>
      )}

    </div>
  )
}
