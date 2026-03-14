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
  { name: 'button', category: 'primitives', description: 'Tap interactions with variants and loading state' },
  { name: 'input', category: 'forms', description: 'Text input with label, error, prefix/suffix' },
  { name: 'card', category: 'layout', description: 'Container with header, content, footer slots' },
  { name: 'badge', category: 'display', description: '5 semantic variants + dot indicator' },
  { name: 'avatar', category: 'display', description: 'Image, initials, status dot, group stack' },
  { name: 'sheet', category: 'overlay', description: 'Bottom sheet with snap points' },
  { name: 'dialog', category: 'overlay', description: 'Modal with accessible focus management' },
  { name: 'toast', category: 'feedback', description: 'Auto-dismissing notification' },
  { name: 'select', category: 'forms', description: 'Bottom-sheet select, searchable' },
  { name: 'accordion', category: 'layout', description: 'Animated height expansion' },
  { name: 'tabs', category: 'layout', description: 'Horizontal tabs with sliding indicator' },
  { name: 'progress', category: 'feedback', description: 'Linear bar and circular ring' },
  { name: 'checkbox', category: 'forms', description: 'Animated checkbox with indeterminate state' },
  { name: 'switch', category: 'forms', description: 'Toggle switch with Reanimated transition' },
  { name: 'slider', category: 'forms', description: 'Range slider with haptic feedback' },
]
