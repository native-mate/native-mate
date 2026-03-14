// native-mate Figma Plugin — main code (runs in Figma sandbox)
/// <reference path="../../../node_modules/@figma/plugin-typings/index.d.ts" />

const REGISTRY = 'https://registry.native-mate.dev'

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

async function handleFetchIndex() {
  try {
    const res = await fetch(`${REGISTRY}/index.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    figma.ui.postMessage({ type: 'INDEX_LOADED', data })
  } catch (err: unknown) {
    figma.ui.postMessage({ type: 'INDEX_ERROR', error: (err as Error).message })
  }
}

function handleExportTokens(preset: string) {
  // Build Figma local styles from native-mate tokens
  const presets: Record<string, Record<string, { light: string; dark: string }>> = {
    zinc: {
      background: { light: '#ffffff', dark: '#0a0a0a' },
      surface: { light: '#f4f4f5', dark: '#18181b' },
      border: { light: '#e4e4e7', dark: '#27272a' },
      foreground: { light: '#09090b', dark: '#fafafa' },
      'muted-foreground': { light: '#71717a', dark: '#a1a1aa' },
      primary: { light: '#18181b', dark: '#fafafa' },
      'primary-foreground': { light: '#fafafa', dark: '#18181b' },
      destructive: { light: '#ef4444', dark: '#f87171' },
      success: { light: '#22c55e', dark: '#4ade80' },
      warning: { light: '#f59e0b', dark: '#fbbf24' },
    },
    slate: {
      background: { light: '#ffffff', dark: '#0f172a' },
      surface: { light: '#f1f5f9', dark: '#1e293b' },
      border: { light: '#e2e8f0', dark: '#334155' },
      foreground: { light: '#0f172a', dark: '#f8fafc' },
      'muted-foreground': { light: '#64748b', dark: '#94a3b8' },
      primary: { light: '#1e293b', dark: '#f8fafc' },
      'primary-foreground': { light: '#f8fafc', dark: '#1e293b' },
      destructive: { light: '#ef4444', dark: '#f87171' },
      success: { light: '#22c55e', dark: '#4ade80' },
      warning: { light: '#f59e0b', dark: '#fbbf24' },
    },
  }

  const tokens = presets[preset] ?? presets.zinc
  const result: Array<{ name: string; light: string; dark: string }> = Object.entries(tokens).map(
    ([name, value]) => ({ name, ...value })
  )

  figma.ui.postMessage({ type: 'TOKENS_EXPORTED', tokens: result, preset })
}

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

  // Try to detect which native-mate component this might be
  const lowerName = node.name.toLowerCase()
  const knownComponents = [
    'button', 'input', 'card', 'badge', 'avatar', 'sheet', 'dialog',
    'toast', 'checkbox', 'switch', 'slider', 'tabs', 'accordion',
  ]
  const detected = knownComponents.find((c) => lowerName.includes(c))
  if (detected) info.detectedComponent = detected

  figma.ui.postMessage({ type: 'SELECTION_INFO', info })
}

async function handleCopyComponentCode(name: string) {
  try {
    const res = await fetch(`${REGISTRY}/components/${name}/latest.json`)
    if (!res.ok) throw new Error(`Component "${name}" not found`)
    const data = await res.json()
    figma.ui.postMessage({ type: 'COMPONENT_CODE', data })
  } catch (err: unknown) {
    figma.ui.postMessage({ type: 'ERROR', error: (err as Error).message })
  }
}
