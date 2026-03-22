'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const componentPreviews: Record<string, any> = {
  text:      dynamic(() => import('@/components/previews/TextPreview'),      { ssr: false }),
  icon:      dynamic(() => import('@/components/previews/IconPreview'),      { ssr: false }),
  spinner:   dynamic(() => import('@/components/previews/SpinnerPreview'),   { ssr: false }),
  separator: dynamic(() => import('@/components/previews/SeparatorPreview'), { ssr: false }),
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
  accordion: dynamic(() => import('@/components/previews/AccordionPreview'), { ssr: false }),
  tabs: dynamic(() => import('@/components/previews/TabsPreview'), { ssr: false }),
  'empty-state': dynamic(() => import('@/components/previews/EmptyStatePreview'), { ssr: false }),
  sheet: dynamic(() => import('@/components/previews/SheetPreview'), { ssr: false }),
  screen: dynamic(() => import('@/components/previews/ScreenPreview'), { ssr: false }),
}

export function ComponentPreview({ slug, part }: { slug: string; part?: string }) {
  const Preview = componentPreviews[slug]
  if (!Preview) return null
  return <Preview part={part} />
}
