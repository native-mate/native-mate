'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const componentPreviews: Record<string, React.ComponentType<{ part?: string }>> = {
  button: dynamic(() => import('@/components/previews/ButtonPreview'), { ssr: false }),
  input: dynamic(() => import('@/components/previews/InputPreview'), { ssr: false }),
  textarea: dynamic(() => import('@/components/previews/TextareaPreview'), { ssr: false }),
  checkbox: dynamic(() => import('@/components/previews/CheckboxPreview'), { ssr: false }),
  radio: dynamic(() => import('@/components/previews/RadioPreview'), { ssr: false }),
  slider: dynamic(() => import('@/components/previews/SliderPreview'), { ssr: false }),
  select: dynamic(() => import('@/components/previews/SelectPreview'), { ssr: false }),
  'otp-input': dynamic(() => import('@/components/previews/OtpInputPreview'), { ssr: false }),
  switch: dynamic(() => import('@/components/previews/SwitchPreview'), { ssr: false }),
  badge: dynamic(() => import('@/components/previews/BadgePreview'), { ssr: false }),
  avatar: dynamic(() => import('@/components/previews/AvatarPreview'), { ssr: false }),
  progress: dynamic(() => import('@/components/previews/ProgressPreview'), { ssr: false }),
  toast: dynamic(() => import('@/components/previews/ToastPreview'), { ssr: false }),
  tag: dynamic(() => import('@/components/previews/TagPreview'), { ssr: false }),
  skeleton: dynamic(() => import('@/components/previews/SkeletonPreview'), { ssr: false }),
  card: dynamic(() => import('@/components/previews/CardPreview'), { ssr: false }),
  alert: dynamic(() => import('@/components/previews/AlertPreview'), { ssr: false }),
  modal: dynamic(() => import('@/components/previews/ModalPreview'), { ssr: false }),
  'action-sheet': dynamic(() => import('@/components/previews/ActionSheetPreview'), { ssr: false }),
  tooltip: dynamic(() => import('@/components/previews/TooltipPreview'), { ssr: false }),
  popover: dynamic(() => import('@/components/previews/PopoverPreview'), { ssr: false }),
}

export function ComponentPreview({ slug, part }: { slug: string; part: 'first' | 'rest' }) {
  const Preview = componentPreviews[slug]
  if (!Preview) return null
  return <Preview part={part} />
}
