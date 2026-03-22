// native-mate Figma Plugin — main code (runs in Figma sandbox)
/// <reference path="../../../node_modules/@figma/plugin-typings/index.d.ts" />

const REGISTRY = 'https://registry.native-mate.dev'
const GITHUB_FALLBACK = 'https://raw.githubusercontent.com/native-mate/native-mate/main/packages/registry/dist/registry'

figma.showUI(__html__, { width: 380, height: 560, title: 'native-mate' })

figma.ui.onmessage = async (msg: { type: string; payload?: unknown }) => {
  switch (msg.type) {
    case 'FETCH_INDEX':
      await handleFetchIndex()
      break
    case 'EXPORT_TOKENS':
      handleExportTokens(msg.payload as string)
      break
    case 'INSPECT_SELECTION':
      handleInspectSelection()
      break
    case 'COPY_COMPONENT_CODE':
      await handleCopyComponentCode(msg.payload as string)
      break
    default:
      figma.ui.postMessage({ type: 'ERROR', error: `Unknown message: ${msg.type}` })
  }
}

// ── Fetch component index ──────────────────────────────────────────────

async function handleFetchIndex() {
  try {
    const res = await fetch(`${REGISTRY}/index.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    figma.ui.postMessage({ type: 'INDEX_LOADED', data })
  } catch {
    // Fallback to GitHub raw
    try {
      const res = await fetch(`${GITHUB_FALLBACK}/index.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      figma.ui.postMessage({ type: 'INDEX_LOADED', data })
    } catch (err: unknown) {
      figma.ui.postMessage({ type: 'INDEX_ERROR', error: (err as Error).message })
    }
  }
}

// ── Export tokens as Figma local paint styles ──────────────────────────

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
}

function handleExportTokens(preset: string) {
  const presets: Record<string, Record<string, { light: string; dark: string }>> = {
    zinc: {
      background:    { light: '#ffffff', dark: '#070709' },
      surface:       { light: '#e4e4e7', dark: '#0f0f11' },
      'surface-raised': { light: '#f4f4f5', dark: '#161619' },
      border:        { light: '#d4d4d8', dark: '#252529' },
      primary:       { light: '#18181b', dark: '#fafafa' },
      'on-primary':  { light: '#fafafa', dark: '#18181b' },
      foreground:    { light: '#09090b', dark: '#fafafa' },
      muted:         { light: '#71717a', dark: '#71717a' },
      destructive:   { light: '#ef4444', dark: '#f87171' },
      success:       { light: '#22c55e', dark: '#4ade80' },
      warning:       { light: '#f59e0b', dark: '#fbbf24' },
    },
    slate: {
      background:    { light: '#ffffff', dark: '#0f172a' },
      surface:       { light: '#f1f5f9', dark: '#1e293b' },
      'surface-raised': { light: '#ffffff', dark: '#263548' },
      border:        { light: '#e2e8f0', dark: '#334155' },
      primary:       { light: '#1e293b', dark: '#f8fafc' },
      'on-primary':  { light: '#f8fafc', dark: '#1e293b' },
      foreground:    { light: '#0f172a', dark: '#f8fafc' },
      muted:         { light: '#64748b', dark: '#94a3b8' },
      destructive:   { light: '#ef4444', dark: '#f87171' },
      success:       { light: '#22c55e', dark: '#4ade80' },
      warning:       { light: '#f59e0b', dark: '#fbbf24' },
    },
    rose: {
      background:    { light: '#ffffff', dark: '#0c0a0b' },
      surface:       { light: '#fff1f2', dark: '#1c1115' },
      'surface-raised': { light: '#ffffff', dark: '#2d1a1f' },
      border:        { light: '#fecdd3', dark: '#4c2030' },
      primary:       { light: '#e11d48', dark: '#fb7185' },
      'on-primary':  { light: '#ffffff', dark: '#1c0a0f' },
      foreground:    { light: '#0f0a0b', dark: '#fef2f4' },
      muted:         { light: '#9f4258', dark: '#be738a' },
      destructive:   { light: '#dc2626', dark: '#f87171' },
      success:       { light: '#22c55e', dark: '#4ade80' },
      warning:       { light: '#f59e0b', dark: '#fbbf24' },
    },
    midnight: {
      background:    { light: '#f8fafc', dark: '#000000' },
      surface:       { light: '#f1f5f9', dark: '#111111' },
      'surface-raised': { light: '#ffffff', dark: '#1a1a1a' },
      border:        { light: '#e2e8f0', dark: '#2a2a2a' },
      primary:       { light: '#6366f1', dark: '#818cf8' },
      'on-primary':  { light: '#ffffff', dark: '#000000' },
      foreground:    { light: '#0f172a', dark: '#f8fafc' },
      muted:         { light: '#64748b', dark: '#6b7280' },
      destructive:   { light: '#ef4444', dark: '#f87171' },
      success:       { light: '#22c55e', dark: '#4ade80' },
      warning:       { light: '#f59e0b', dark: '#fbbf24' },
    },
  }

  const tokens = presets[preset] ?? presets.zinc
  let created = 0

  // Get existing paint styles to avoid duplicates
  const existing = figma.getLocalPaintStyles()
  const existingNames = new Set(existing.map((s) => s.name))

  for (const [name, { dark }] of Object.entries(tokens)) {
    const styleName = `native-mate/${preset}/${name}`

    if (existingNames.has(styleName)) {
      // Update existing style
      const style = existing.find((s) => s.name === styleName)!
      style.paints = [{ type: 'SOLID', color: hexToRgb(dark) }]
    } else {
      // Create new style
      const style = figma.createPaintStyle()
      style.name = styleName
      style.paints = [{ type: 'SOLID', color: hexToRgb(dark) }]
    }
    created++
  }

  figma.ui.postMessage({ type: 'TOKENS_EXPORTED', tokens: Object.entries(tokens).map(([name, value]) => ({ name, ...value })), preset, created })
}

// ── Inspect selection ──────────────────────────────────────────────────

function handleInspectSelection() {
  const selection = figma.currentPage.selection
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'SELECTION_EMPTY' })
    return
  }

  const node = selection[0]
  const info: Record<string, unknown> = {
    id: node.id,
    name: node.name,
    type: node.type,
    width: 'width' in node ? node.width : null,
    height: 'height' in node ? node.height : null,
  }

  const lowerName = node.name.toLowerCase()
  const knownComponents = [
    'button', 'input', 'textarea', 'card', 'badge', 'avatar', 'sheet',
    'modal', 'dialog', 'toast', 'checkbox', 'switch', 'slider', 'tabs',
    'accordion', 'select', 'radio', 'otp', 'tag', 'progress', 'skeleton',
    'alert', 'action-sheet', 'tooltip', 'popover', 'spinner', 'separator',
    'screen', 'empty-state',
  ]
  const detected = knownComponents.find((c) => lowerName.includes(c))
  if (detected) info.detectedComponent = detected

  figma.ui.postMessage({ type: 'SELECTION_INFO', info })
}

// ── Copy component code ────────────────────────────────────────────────

async function handleCopyComponentCode(name: string) {
  try {
    const res = await fetch(`${REGISTRY}/${name}/latest.json`)
    if (!res.ok) throw new Error('not found')
    const data = await res.json()
    figma.ui.postMessage({ type: 'COMPONENT_CODE', data })
  } catch {
    // Fallback to GitHub raw
    try {
      const res = await fetch(`${GITHUB_FALLBACK}/${name}/latest.json`)
      if (!res.ok) throw new Error(`Component "${name}" not found`)
      const data = await res.json()
      figma.ui.postMessage({ type: 'COMPONENT_CODE', data })
    } catch (err: unknown) {
      figma.ui.postMessage({ type: 'ERROR', error: (err as Error).message })
    }
  }
}
