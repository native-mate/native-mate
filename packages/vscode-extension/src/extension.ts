import * as vscode from 'vscode'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const REGISTRY_API = 'https://registry.native-mate.dev'

interface ComponentMeta {
  name: string
  category: string
  description: string
}

async function fetchComponentList(): Promise<ComponentMeta[]> {
  try {
    const res = await fetch(`${REGISTRY_API}/index.json`)
    if (!res.ok) return FALLBACK_COMPONENTS
    const data = (await res.json()) as { components: ComponentMeta[] }
    return data.components
  } catch {
    return FALLBACK_COMPONENTS
  }
}

function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
}

function isNativeMateProject(root: string): boolean {
  return existsSync(join(root, 'native-mate.json'))
}

function detectPackageManager(root: string): string {
  if (existsSync(join(root, 'bun.lockb'))) return 'bunx'
  if (existsSync(join(root, 'pnpm-lock.yaml'))) return 'pnpm dlx'
  if (existsSync(join(root, 'yarn.lock'))) return 'yarn dlx'
  return 'npx'
}

export function activate(context: vscode.ExtensionContext) {
  // ── native-mate: Add component ──────────────────────────────────
  const addCmd = vscode.commands.registerCommand('native-mate.addComponent', async () => {
    const root = getWorkspaceRoot()
    if (!root) return vscode.window.showErrorMessage('No workspace open.')

    if (!isNativeMateProject(root)) {
      const run = await vscode.window.showWarningMessage(
        'native-mate.json not found. Run init first?',
        'Run init', 'Cancel'
      )
      if (run !== 'Run init') return
      const pm = detectPackageManager(root)
      const terminal = vscode.window.createTerminal('native-mate')
      terminal.show()
      terminal.sendText(`${pm} native-mate init`)
      return
    }

    const components = await fetchComponentList()
    const picks = components.map((c) => ({
      label: c.name,
      description: c.category,
      detail: c.description,
    }))

    const selected = await vscode.window.showQuickPick(picks, {
      placeHolder: 'Select components to add',
      canPickMany: true,
      matchOnDescription: true,
      matchOnDetail: true,
    })

    if (!selected || selected.length === 0) return

    const names = selected.map((s) => s.label).join(' ')
    const pm = detectPackageManager(root)
    const terminal = vscode.window.createTerminal('native-mate')
    terminal.show()
    terminal.sendText(`${pm} native-mate add ${names}`)
  })

  // ── native-mate: Upgrade components ─────────────────────────────
  const upgradeCmd = vscode.commands.registerCommand('native-mate.upgradeComponents', async () => {
    const root = getWorkspaceRoot()
    if (!root) return vscode.window.showErrorMessage('No workspace open.')

    if (!isNativeMateProject(root)) {
      return vscode.window.showErrorMessage('native-mate.json not found. Run native-mate init first.')
    }

    const pm = detectPackageManager(root)
    const terminal = vscode.window.createTerminal('native-mate')
    terminal.show()
    terminal.sendText(`${pm} native-mate upgrade`)
  })

  // ── native-mate: Open Theme Studio ──────────────────────────────
  const themeCmd = vscode.commands.registerCommand('native-mate.openThemeStudio', async () => {
    const panel = vscode.window.createWebviewPanel(
      'nativeMateThemeStudio',
      'native-mate Theme Studio',
      vscode.ViewColumn.One,
      { enableScripts: true }
    )
    panel.webview.html = getThemeStudioHtml()
  })

  context.subscriptions.push(addCmd, upgradeCmd, themeCmd)

  // Status bar button
  const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusItem.text = '$(package) native-mate'
  statusItem.command = 'native-mate.addComponent'
  statusItem.tooltip = 'Add a native-mate component'

  const root = getWorkspaceRoot()
  if (root && isNativeMateProject(root)) {
    statusItem.show()
  }

  context.subscriptions.push(statusItem)
}

export function deactivate() {}

function getThemeStudioHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>native-mate Theme Studio</title>
  <style>
    body { font-family: var(--vscode-font-family); background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); padding: 24px; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    p { font-size: 12px; opacity: 0.6; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 500px; }
    .preset { border: 1px solid var(--vscode-panel-border); border-radius: 8px; padding: 12px; cursor: pointer; transition: border-color 0.15s; }
    .preset:hover { border-color: var(--vscode-focusBorder); }
    .preset.active { border-color: var(--vscode-button-background); }
    .preset-name { font-weight: 600; font-size: 13px; margin-bottom: 3px; }
    .preset-desc { font-size: 11px; opacity: 0.5; }
    .swatch { height: 6px; border-radius: 3px; margin-bottom: 8px; }
    .output { margin-top: 20px; background: var(--vscode-textBlockQuote-background); border-radius: 8px; padding: 16px; font-family: var(--vscode-editor-font-family); font-size: 12px; white-space: pre; }
  </style>
</head>
<body>
  <h1>Theme Studio</h1>
  <p>Pick a preset — copy the config to native-mate.json</p>
  <div class="grid">
    <div class="preset active" data-preset="zinc">
      <div class="swatch" style="background:linear-gradient(90deg,#18181b,#fafafa)"></div>
      <div class="preset-name">Zinc</div>
      <div class="preset-desc">Clean neutral grays</div>
    </div>
    <div class="preset" data-preset="slate">
      <div class="swatch" style="background:linear-gradient(90deg,#0f172a,#f8fafc)"></div>
      <div class="preset-name">Slate</div>
      <div class="preset-desc">Cool blue-gray tones</div>
    </div>
    <div class="preset" data-preset="rose">
      <div class="swatch" style="background:linear-gradient(90deg,#e11d48,#fb7185)"></div>
      <div class="preset-name">Rose</div>
      <div class="preset-desc">Warm rose accents</div>
    </div>
    <div class="preset" data-preset="midnight">
      <div class="swatch" style="background:linear-gradient(90deg,#030303,#a78bfa)"></div>
      <div class="preset-name">Midnight</div>
      <div class="preset-desc">Deep dark-mode first</div>
    </div>
  </div>
  <div class="output" id="output">${JSON.stringify({ preset: 'zinc', componentsDir: 'components/ui' }, null, 2)}</div>
  <script>
    let selected = 'zinc'
    document.querySelectorAll('.preset').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'))
        el.classList.add('active')
        selected = el.dataset.preset
        document.getElementById('output').textContent =
          JSON.stringify({ preset: selected, componentsDir: 'components/ui' }, null, 2)
      })
    })
  </script>
</body>
</html>`
}

const FALLBACK_COMPONENTS: ComponentMeta[] = [
  // Primitives
  { name: 'button',       category: 'primitives', description: '6 variants, 3 sizes, ButtonGroup, icon-only, pill, haptic, loading, spring animation' },
  { name: 'text',         category: 'primitives', description: 'Typed typography with size, weight, and color tokens' },
  { name: 'separator',    category: 'primitives', description: 'Horizontal or vertical divider' },
  // Forms
  { name: 'input',        category: 'forms', description: '3 sizes, prefix/suffix, floating label, password toggle, clearable (Ionicons), char count, shake on error, haptic' },
  { name: 'textarea',     category: 'forms', description: 'Auto-growing, char count, floating label, mic icon (Ionicons), mention detection, shake on error' },
  { name: 'checkbox',     category: 'forms', description: 'Indeterminate, sizes, custom color, label, error, CheckboxGroup, Ionicons checkmark, haptic' },
  { name: 'radio',        category: 'forms', description: 'Card style, description, sizes, horizontal group, error, disabled, haptic' },
  { name: 'switch',       category: 'forms', description: '3 sizes, label+description, custom color, loading spinner, labelPosition, haptic' },
  { name: 'slider',       category: 'forms', description: 'Single + Range, showValue, marks, custom color, disabled, spring thumb, haptic, reliable PanResponder' },
  { name: 'select',       category: 'forms', description: 'Searchable, multi-select with Checkbox chips, option groups, descriptions, clearable, keyboard-aware' },
  { name: 'otp-input',    category: 'forms', description: '3 variants (box/underline/rounded), secure, alphanumeric, cursor blink, shake on error, resend timer' },
  // Layout
  { name: 'card',         category: 'layout', description: 'CardHeader/CardContent/CardFooter, loading skeleton prop, image cover, elevated/outline/flat variants, pressable' },
  { name: 'accordion',    category: 'layout', description: 'Animated expand/collapse, single or multi-open, Ionicons chevron' },
  { name: 'tabs',         category: 'layout', description: 'Horizontal tabs with sliding indicator animation' },
  // Display
  { name: 'badge',        category: 'display', description: '6 variants + info, 3 sizes, solid/soft/outline, pulse dot, count 99+, icon, dismissible' },
  { name: 'avatar',       category: 'display', description: 'Image + auto-initials, 5 sizes, status dot, circle/square, AvatarGroup with overflow' },
  { name: 'tag',          category: 'display', description: 'Selectable chip, 5 variants, animated color, icon, 3 sizes, removable, TagGroup single/multi select' },
  { name: 'empty-state',  category: 'display', description: 'Icon + heading + description + action button' },
  // Overlay
  { name: 'sheet',        category: 'overlay', description: 'Bottom sheet with snap points, drag-to-close, keyboard-aware' },
  { name: 'modal',        category: 'overlay', description: 'Animated dialog, title, description, close button, footer actions, backdrop dismiss' },
  { name: 'action-sheet', category: 'overlay', description: 'iOS-style bottom sheet, handle, actions with destructive variant, cancel button, Ionicons' },
  { name: 'tooltip',      category: 'overlay', description: 'Text bubble on press-and-hold, 4 placements, arrow, delay, screen-level Modal' },
  { name: 'popover',      category: 'overlay', description: 'Interactive content bubble, 4 placements, arrow, backdrop dismiss, scrollable, screen-level Modal' },
  { name: 'alert',        category: 'overlay', description: '5 variants, Ionicons icon, dismissible, action button, description' },
  // Feedback
  { name: 'toast',        category: 'feedback', description: '4 variants, screen-level Modal, avatar, multiple actions, swipe dismiss (H+V), progress bar, persistent, useToast hook' },
  { name: 'progress',     category: 'feedback', description: 'Linear bar + circular ring, 3 sizes, showValue, indeterminate shimmer, custom color' },
  { name: 'skeleton',     category: 'feedback', description: 'Shimmer + pulse, SkeletonText (multi-line), SkeletonAvatar, SkeletonCard' },
]
