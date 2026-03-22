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
    case 'INSERT_COMPONENT':
      await handleInsertComponent(msg.payload as string)
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

// ── Insert component on canvas ─────────────────────────────────────────

// Theme colors (zinc dark)
const T = {
  bg:          { r: 0.027, g: 0.027, b: 0.035 },
  surface:     { r: 0.059, g: 0.059, b: 0.067 },
  border:      { r: 0.145, g: 0.145, b: 0.161 },
  primary:     { r: 0.980, g: 0.980, b: 0.980 },
  primaryFg:   { r: 0.094, g: 0.094, b: 0.106 },
  foreground:  { r: 0.980, g: 0.980, b: 0.980 },
  muted:       { r: 0.443, g: 0.443, b: 0.478 },
  destructive: { r: 0.973, g: 0.443, b: 0.443 },
  success:     { r: 0.290, g: 0.867, b: 0.502 },
  white:       { r: 1, g: 1, b: 1 },
}

function solid(color: RGB): SolidPaint[] {
  return [{ type: 'SOLID', color }]
}

function stroke(color: RGB): SolidPaint[] {
  return [{ type: 'SOLID', color }]
}

async function loadFont() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })
}

function makeText(text: string, size: number, color: RGB, bold = false): TextNode {
  const t = figma.createText()
  t.fontName = { family: 'Inter', style: bold ? 'Semi Bold' : 'Regular' }
  t.characters = text
  t.fontSize = size
  t.fills = solid(color)
  return t
}

async function handleInsertComponent(name: string) {
  await loadFont()
  const builder = COMPONENT_BUILDERS[name]
  const node = builder ? builder() : buildGeneric(name)
  node.name = `native-mate/${name}`

  // Place at center of viewport
  const vp = figma.viewport.center
  node.x = Math.round(vp.x - node.width / 2)
  node.y = Math.round(vp.y - node.height / 2)

  figma.currentPage.appendChild(node)
  figma.currentPage.selection = [node]
  figma.viewport.scrollAndZoomIntoView([node])
  figma.notify(`✓ ${name} inserted`)
  figma.ui.postMessage({ type: 'COMPONENT_INSERTED', name })
}

function buildGeneric(name: string): FrameNode {
  const f = figma.createFrame()
  f.resize(200, 48)
  f.fills = solid(T.surface)
  f.cornerRadius = 10
  f.strokes = stroke(T.border)
  f.strokeWeight = 1
  f.layoutMode = 'HORIZONTAL'
  f.primaryAxisAlignItems = 'CENTER'
  f.counterAxisAlignItems = 'CENTER'
  f.paddingLeft = 16; f.paddingRight = 16
  f.itemSpacing = 8
  const label = makeText(name, 14, T.foreground, true)
  f.appendChild(label)
  return f
}

const COMPONENT_BUILDERS: Record<string, () => FrameNode> = {
  button: () => {
    const f = figma.createFrame()
    f.resize(120, 40)
    f.fills = solid(T.primary)
    f.cornerRadius = 10
    f.layoutMode = 'HORIZONTAL'
    f.primaryAxisAlignItems = 'CENTER'
    f.counterAxisAlignItems = 'CENTER'
    f.paddingLeft = 16; f.paddingRight = 16
    const label = makeText('Button', 15, T.primaryFg, true)
    f.appendChild(label)
    return f
  },

  input: () => {
    const f = figma.createFrame()
    f.resize(280, 44)
    f.fills = solid(T.bg)
    f.cornerRadius = 10
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'HORIZONTAL'
    f.counterAxisAlignItems = 'CENTER'
    f.paddingLeft = 12; f.paddingRight = 12
    const placeholder = makeText('Enter text…', 15, T.muted)
    f.appendChild(placeholder)
    return f
  },

  card: () => {
    const f = figma.createFrame()
    f.resize(300, 180)
    f.fills = solid(T.surface)
    f.cornerRadius = 16
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'VERTICAL'
    f.paddingTop = 20; f.paddingBottom = 20; f.paddingLeft = 20; f.paddingRight = 20
    f.itemSpacing = 8
    const title = makeText('Card Title', 17, T.foreground, true)
    const desc = makeText('Card description goes here.', 13, T.muted)
    f.appendChild(title)
    f.appendChild(desc)
    return f
  },

  badge: () => {
    const f = figma.createFrame()
    f.resize(60, 24)
    f.fills = solid(T.primary)
    f.cornerRadius = 9999
    f.layoutMode = 'HORIZONTAL'
    f.primaryAxisAlignItems = 'CENTER'
    f.counterAxisAlignItems = 'CENTER'
    f.paddingLeft = 10; f.paddingRight = 10
    const label = makeText('Badge', 11, T.primaryFg, true)
    f.appendChild(label)
    return f
  },

  avatar: () => {
    const f = figma.createFrame()
    f.resize(40, 40)
    f.fills = solid(T.surface)
    f.cornerRadius = 20
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'HORIZONTAL'
    f.primaryAxisAlignItems = 'CENTER'
    f.counterAxisAlignItems = 'CENTER'
    const initials = makeText('AB', 14, T.foreground, true)
    f.appendChild(initials)
    return f
  },

  checkbox: () => {
    const f = figma.createFrame()
    f.resize(140, 24)
    f.fills = []
    f.layoutMode = 'HORIZONTAL'
    f.counterAxisAlignItems = 'CENTER'
    f.itemSpacing = 8
    const box = figma.createFrame()
    box.resize(18, 18)
    box.fills = solid(T.primary)
    box.cornerRadius = 4
    const label = makeText('Checkbox', 14, T.foreground)
    f.appendChild(box)
    f.appendChild(label)
    return f
  },

  switch: () => {
    const track = figma.createFrame()
    track.resize(44, 26)
    track.fills = solid(T.primary)
    track.cornerRadius = 13
    const thumb = figma.createFrame()
    thumb.resize(20, 20)
    thumb.fills = solid(T.primaryFg)
    thumb.cornerRadius = 10
    thumb.x = 21; thumb.y = 3
    track.appendChild(thumb)
    return track
  },

  toast: () => {
    const f = figma.createFrame()
    f.resize(320, 56)
    f.fills = solid(T.surface)
    f.cornerRadius = 12
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'HORIZONTAL'
    f.counterAxisAlignItems = 'CENTER'
    f.paddingLeft = 16; f.paddingRight = 16
    f.itemSpacing = 10
    const icon = makeText('✓', 16, T.success, true)
    const msg = makeText('Action completed successfully', 13, T.foreground)
    f.appendChild(icon)
    f.appendChild(msg)
    return f
  },

  alert: () => {
    const f = figma.createFrame()
    f.resize(320, 72)
    f.fills = solid(T.surface)
    f.cornerRadius = 10
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'HORIZONTAL'
    f.counterAxisAlignItems = 'MIN'
    f.paddingTop = 14; f.paddingBottom = 14; f.paddingLeft = 14; f.paddingRight = 14
    f.itemSpacing = 10
    const icon = makeText('ℹ', 16, T.primary, true)
    const content = figma.createFrame()
    content.fills = []
    content.layoutMode = 'VERTICAL'
    content.itemSpacing = 2
    content.layoutGrow = 1
    const title = makeText('Heads up', 14, T.foreground, true)
    const desc = makeText('This is an informational alert.', 12, T.muted)
    content.appendChild(title)
    content.appendChild(desc)
    f.appendChild(icon)
    f.appendChild(content)
    return f
  },

  tabs: () => {
    const f = figma.createFrame()
    f.resize(300, 40)
    f.fills = solid(T.surface)
    f.cornerRadius = 10
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'HORIZONTAL'
    f.counterAxisAlignItems = 'CENTER'
    f.itemSpacing = 0
    f.paddingLeft = 4; f.paddingRight = 4; f.paddingTop = 4; f.paddingBottom = 4
    const labels = ['Overview', 'Analytics', 'Settings']
    labels.forEach((l, i) => {
      const tab = figma.createFrame()
      tab.resize(92, 32)
      tab.fills = i === 0 ? solid(T.bg) : []
      tab.cornerRadius = 6
      tab.layoutMode = 'HORIZONTAL'
      tab.primaryAxisAlignItems = 'CENTER'
      tab.counterAxisAlignItems = 'CENTER'
      const text = makeText(l, 13, i === 0 ? T.foreground : T.muted, i === 0)
      tab.appendChild(text)
      f.appendChild(tab)
    })
    return f
  },

  progress: () => {
    const track = figma.createFrame()
    track.resize(240, 8)
    track.fills = solid(T.border)
    track.cornerRadius = 9999
    const fill = figma.createFrame()
    fill.resize(144, 8)
    fill.fills = solid(T.primary)
    fill.cornerRadius = 9999
    track.appendChild(fill)
    return track
  },

  skeleton: () => {
    const f = figma.createFrame()
    f.resize(240, 16)
    f.fills = solid(T.surface)
    f.cornerRadius = 6
    return f
  },

  modal: () => {
    const f = figma.createFrame()
    f.resize(320, 200)
    f.fills = solid(T.surface)
    f.cornerRadius = 16
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'VERTICAL'
    f.paddingTop = 24; f.paddingBottom = 24; f.paddingLeft = 24; f.paddingRight = 24
    f.itemSpacing = 12
    const title = makeText('Dialog Title', 17, T.foreground, true)
    const desc = makeText('Are you sure you want to continue?\nThis action cannot be undone.', 13, T.muted)
    const actions = figma.createFrame()
    actions.fills = []
    actions.layoutMode = 'HORIZONTAL'
    actions.itemSpacing = 8
    actions.counterAxisAlignItems = 'CENTER'
    const cancel = figma.createFrame()
    cancel.resize(80, 36); cancel.fills = []; cancel.strokes = stroke(T.border); cancel.strokeWeight = 1
    cancel.cornerRadius = 10; cancel.layoutMode = 'HORIZONTAL'
    cancel.primaryAxisAlignItems = 'CENTER'; cancel.counterAxisAlignItems = 'CENTER'
    cancel.appendChild(makeText('Cancel', 13, T.foreground, true))
    const confirm = figma.createFrame()
    confirm.resize(80, 36); confirm.fills = solid(T.primary)
    confirm.cornerRadius = 10; confirm.layoutMode = 'HORIZONTAL'
    confirm.primaryAxisAlignItems = 'CENTER'; confirm.counterAxisAlignItems = 'CENTER'
    confirm.appendChild(makeText('Confirm', 13, T.primaryFg, true))
    actions.appendChild(cancel); actions.appendChild(confirm)
    f.appendChild(title); f.appendChild(desc); f.appendChild(actions)
    return f
  },

  tag: () => {
    const f = figma.createFrame()
    f.resize(70, 28)
    f.fills = solid(T.surface)
    f.cornerRadius = 9999
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'HORIZONTAL'
    f.primaryAxisAlignItems = 'CENTER'
    f.counterAxisAlignItems = 'CENTER'
    f.paddingLeft = 10; f.paddingRight = 10
    const label = makeText('Tag', 12, T.foreground)
    f.appendChild(label)
    return f
  },

  textarea: () => {
    const f = figma.createFrame()
    f.resize(280, 100)
    f.fills = solid(T.bg)
    f.cornerRadius = 10
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'VERTICAL'
    f.paddingTop = 12; f.paddingLeft = 12; f.paddingRight = 12; f.paddingBottom = 12
    const placeholder = makeText('Write your message…', 15, T.muted)
    f.appendChild(placeholder)
    return f
  },

  select: () => {
    const f = figma.createFrame()
    f.resize(280, 44)
    f.fills = solid(T.bg)
    f.cornerRadius = 10
    f.strokes = stroke(T.border)
    f.strokeWeight = 1
    f.layoutMode = 'HORIZONTAL'
    f.counterAxisAlignItems = 'CENTER'
    f.primaryAxisAlignItems = 'SPACE_BETWEEN'
    f.paddingLeft = 12; f.paddingRight = 12
    const placeholder = makeText('Select…', 15, T.muted)
    const chevron = makeText('▾', 14, T.muted)
    f.appendChild(placeholder)
    f.appendChild(chevron)
    return f
  },

  radio: () => {
    const f = figma.createFrame()
    f.resize(140, 24)
    f.fills = []
    f.layoutMode = 'HORIZONTAL'
    f.counterAxisAlignItems = 'CENTER'
    f.itemSpacing = 8
    const circleWrap = figma.createFrame()
    circleWrap.resize(18, 18)
    circleWrap.fills = []
    circleWrap.cornerRadius = 9
    circleWrap.strokes = stroke(T.primary)
    circleWrap.strokeWeight = 2
    circleWrap.layoutMode = 'HORIZONTAL'
    circleWrap.primaryAxisAlignItems = 'CENTER'
    circleWrap.counterAxisAlignItems = 'CENTER'
    const dot = figma.createEllipse()
    dot.resize(8, 8)
    dot.fills = solid(T.primary)
    circleWrap.appendChild(dot)
    const label = makeText('Option', 14, T.foreground)
    f.appendChild(circleWrap)
    f.appendChild(label)
    return f
  },

  separator: () => {
    const f = figma.createFrame()
    f.resize(280, 1)
    f.fills = solid(T.border)
    return f
  },

  accordion: () => {
    const f = figma.createFrame()
    f.resize(300, 130)
    f.fills = []
    f.layoutMode = 'VERTICAL'
    f.itemSpacing = 0
    for (let i = 0; i < 3; i++) {
      const row = figma.createFrame()
      row.resize(300, 44)
      row.fills = []
      row.layoutMode = 'HORIZONTAL'
      row.counterAxisAlignItems = 'CENTER'
      row.primaryAxisAlignItems = 'SPACE_BETWEEN'
      row.paddingLeft = 16; row.paddingRight = 16
      const label = makeText(`Section ${i + 1}`, 15, T.foreground, true)
      const chevron = makeText('▾', 12, T.muted)
      row.appendChild(label); row.appendChild(chevron)
      f.appendChild(row)
      if (i < 2) {
        const sep = figma.createFrame(); sep.resize(300, 1); sep.fills = solid(T.border)
        f.appendChild(sep)
      }
    }
    return f
  },

  sheet: () => {
    const f = figma.createFrame()
    f.resize(320, 240)
    f.fills = solid(T.surface)
    f.cornerRadius = 16
    f.layoutMode = 'VERTICAL'
    f.primaryAxisAlignItems = 'CENTER'
    f.paddingTop = 12; f.paddingBottom = 24; f.paddingLeft = 20; f.paddingRight = 20
    f.itemSpacing = 16
    const handle = figma.createFrame()
    handle.resize(36, 4); handle.fills = solid(T.border); handle.cornerRadius = 2
    const title = makeText('Sheet Title', 17, T.foreground, true)
    f.appendChild(handle); f.appendChild(title)
    return f
  },

  slider: () => {
    const f = figma.createFrame()
    f.resize(240, 20)
    f.fills = []
    const track = figma.createFrame()
    track.resize(240, 4); track.y = 8; track.fills = solid(T.border); track.cornerRadius = 2
    const filled = figma.createFrame()
    filled.resize(144, 4); filled.y = 8; filled.fills = solid(T.primary); filled.cornerRadius = 2
    const thumb = figma.createEllipse()
    thumb.resize(20, 20); thumb.x = 134; thumb.fills = solid(T.primary)
    f.appendChild(track); f.appendChild(filled); f.appendChild(thumb)
    return f
  },

  'otp-input': () => {
    const f = figma.createFrame()
    f.fills = []
    f.layoutMode = 'HORIZONTAL'
    f.itemSpacing = 8
    for (let i = 0; i < 6; i++) {
      const cell = figma.createFrame()
      cell.resize(48, 56)
      cell.fills = solid(T.bg)
      cell.cornerRadius = 10
      cell.strokes = stroke(T.border)
      cell.strokeWeight = 2
      cell.layoutMode = 'HORIZONTAL'
      cell.primaryAxisAlignItems = 'CENTER'
      cell.counterAxisAlignItems = 'CENTER'
      if (i < 3) {
        const digit = makeText(`${i + 1}`, 22, T.foreground, true)
        cell.appendChild(digit)
      }
      f.appendChild(cell)
    }
    return f
  },

  'empty-state': () => {
    const f = figma.createFrame()
    f.resize(280, 160)
    f.fills = []
    f.layoutMode = 'VERTICAL'
    f.primaryAxisAlignItems = 'CENTER'
    f.counterAxisAlignItems = 'CENTER'
    f.itemSpacing = 10
    const icon = makeText('📭', 32, T.foreground)
    const title = makeText('No results', 17, T.foreground, true)
    const desc = makeText('Try adjusting your search or filters.', 13, T.muted)
    f.appendChild(icon); f.appendChild(title); f.appendChild(desc)
    return f
  },

  spinner: () => {
    const f = figma.createEllipse()
    f.resize(24, 24)
    f.fills = []
    f.strokes = stroke(T.primary)
    f.strokeWeight = 3
    f.arcData = { startingAngle: 0, endingAngle: 4.7, innerRadius: 0.75 }
    return f as unknown as FrameNode
  },

  'action-sheet': () => {
    const f = figma.createFrame()
    f.resize(320, 200)
    f.fills = solid(T.surface)
    f.cornerRadius = 16
    f.layoutMode = 'VERTICAL'
    f.paddingTop = 12; f.paddingBottom = 16; f.paddingLeft = 0; f.paddingRight = 0
    f.itemSpacing = 0
    const handle = figma.createFrame()
    handle.resize(36, 4); handle.fills = solid(T.border); handle.cornerRadius = 2
    handle.x = 142
    f.appendChild(handle)
    const actions = ['Edit', 'Share', 'Delete']
    const colors = [T.foreground, T.foreground, T.destructive]
    actions.forEach((label, i) => {
      const row = figma.createFrame()
      row.resize(320, 48); row.fills = []
      row.layoutMode = 'HORIZONTAL'
      row.counterAxisAlignItems = 'CENTER'
      row.paddingLeft = 20
      row.appendChild(makeText(label, 15, colors[i], false))
      f.appendChild(row)
    })
    return f
  },
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
