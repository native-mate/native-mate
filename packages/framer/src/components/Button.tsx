import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, spacing, radius, type Preset } from '../tokens'

interface ButtonProps {
  label: string
  variant: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link'
  size: 'sm' | 'md' | 'lg'
  loading: boolean
  disabled: boolean
  fullWidth: boolean
  preset: Preset
  onTap?: () => void
}

export function Button({
  label = 'Button',
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  preset = 'zinc',
  onTap,
}: ButtonProps) {
  const t = presets[preset]

  const sizeMap = {
    sm: { height: 32, px: spacing.md, fontSize: 13 },
    md: { height: 40, px: spacing.lg, fontSize: 15 },
    lg: { height: 48, px: spacing.xl, fontSize: 17 },
  }

  const s = sizeMap[size]

  const variantStyles: React.CSSProperties =
    variant === 'default'
      ? { background: t.primary, color: t.primaryForeground, border: 'none' }
      : variant === 'outline'
      ? { background: 'transparent', color: t.foreground, border: `1px solid ${t.border}` }
      : variant === 'ghost'
      ? { background: 'transparent', color: t.foreground, border: 'none' }
      : variant === 'secondary'
      ? { background: t.surface, color: t.foreground, border: 'none' }
      : variant === 'link'
      ? { background: 'transparent', color: t.primary, border: 'none', textDecoration: 'underline' }
      : { background: t.destructive, color: '#ffffff', border: 'none' }

  return (
    <div
      role="button"
      onClick={!disabled && !loading ? onTap : undefined}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: variant === 'link' ? 'auto' : s.height,
        paddingLeft: variant === 'link' ? 0 : s.px,
        paddingRight: variant === 'link' ? 0 : s.px,
        borderRadius: radius.md,
        fontSize: s.fontSize,
        fontWeight: 600,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.15s',
        userSelect: 'none',
        ...variantStyles,
      }}
    >
      {loading ? (
        <span
          style={{
            width: 16,
            height: 16,
            border: `2px solid currentColor`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : null}
      {loading ? 'Loading…' : label}
    </div>
  )
}

addPropertyControls(Button, {
  label: { type: ControlType.String, title: 'Label', defaultValue: 'Button' },
  variant: {
    type: ControlType.Enum,
    title: 'Variant',
    options: ['default', 'outline', 'ghost', 'destructive', 'secondary', 'link'],
    defaultValue: 'default',
  },
  size: {
    type: ControlType.Enum,
    title: 'Size',
    options: ['sm', 'md', 'lg'],
    defaultValue: 'md',
  },
  loading: { type: ControlType.Boolean, title: 'Loading', defaultValue: false },
  disabled: { type: ControlType.Boolean, title: 'Disabled', defaultValue: false },
  fullWidth: { type: ControlType.Boolean, title: 'Full Width', defaultValue: false },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
})
