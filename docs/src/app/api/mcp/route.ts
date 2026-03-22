import { NextRequest } from 'next/server'

// ── Registry client ─────────────────────────────────────────────────────────

const GITHUB_FALLBACK = 'https://raw.githubusercontent.com/native-mate/native-mate/main/packages/registry/dist/registry'

interface RegistryFile { path: string; content: string; hash: string }
interface RegistryComponent {
  name: string; version: string; description: string; files: RegistryFile[]
  dependencies: { npm: string[]; components: string[] }
}
interface ComponentIndex { name: string; version: string; description: string; category: string }

async function fetchIndex(): Promise<ComponentIndex[]> {
  const res = await fetch(`${GITHUB_FALLBACK}/index.json`, { next: { revalidate: 300 } })
  if (!res.ok) return []
  const data = (await res.json()) as { components: ComponentIndex[] }
  return data.components
}

async function fetchComponent(name: string): Promise<RegistryComponent> {
  const res = await fetch(`${GITHUB_FALLBACK}/${name}/latest.json`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`Component "${name}" not found`)
  return res.json() as Promise<RegistryComponent>
}

// ── Tool definitions ────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'list_components',
    description: 'List all available native-mate components with names, categories, and descriptions.',
    inputSchema: { type: 'object', properties: { category: { type: 'string', description: 'Optional category filter (primitives, forms, layout, display, overlay, feedback)' } } },
  },
  {
    name: 'get_component',
    description: 'Get full source code, dependencies, and version for a native-mate component.',
    inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Component name, e.g. "button", "card", "sheet"' } }, required: ['name'] },
  },
  {
    name: 'search_components',
    description: 'Search native-mate components by keyword.',
    inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'Search query' } }, required: ['query'] },
  },
  {
    name: 'generate_theme_config',
    description: 'Generate a native-mate.json config for a preset with optional overrides.',
    inputSchema: {
      type: 'object',
      properties: {
        preset: { type: 'string', enum: ['zinc', 'slate', 'rose', 'midnight'] },
        overrides: { type: 'object', description: 'Color token overrides' },
        componentsDir: { type: 'string', description: 'Default: components/ui' },
      },
      required: ['preset'],
    },
  },
  {
    name: 'get_add_command',
    description: 'Get the CLI command to add components.',
    inputSchema: { type: 'object', properties: { components: { type: 'array', items: { type: 'string' } } }, required: ['components'] },
  },
]

// ── Tool handlers ───────────────────────────────────────────────────────────

async function handleToolCall(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
  if (name === 'list_components') {
    const index = await fetchIndex()
    const filtered = args?.category ? index.filter((c) => c.category === args.category) : index
    const text = filtered.map((c) => `• ${c.name} (${c.category}) v${c.version}\n  ${c.description}`).join('\n')
    return { content: [{ type: 'text', text: text || 'No components found.' }] }
  }

  if (name === 'get_component') {
    try {
      const component = await fetchComponent(args?.name as string)
      const files = component.files.map((f) => `### ${f.path}\n\`\`\`tsx\n${f.content}\n\`\`\``).join('\n\n')
      const text = [
        `## ${component.name} v${component.version}`, component.description, '',
        component.dependencies.npm.length > 0 ? `**npm deps:** ${component.dependencies.npm.join(', ')}` : '**npm deps:** none',
        component.dependencies.components.length > 0 ? `**component deps:** ${component.dependencies.components.join(', ')}` : '',
        '', files,
      ].filter(Boolean).join('\n')
      return { content: [{ type: 'text', text }] }
    } catch (err: unknown) {
      return { content: [{ type: 'text', text: `Error: ${(err as Error).message}` }], isError: true }
    }
  }

  if (name === 'search_components') {
    const query = (args?.query as string).toLowerCase()
    const index = await fetchIndex()
    const results = index.filter((c) => c.name.includes(query) || c.description.toLowerCase().includes(query) || c.category.includes(query))
    if (results.length === 0) return { content: [{ type: 'text', text: `No components matched "${args?.query}".` }] }
    return { content: [{ type: 'text', text: results.map((c) => `• ${c.name} (${c.category}) — ${c.description}`).join('\n') }] }
  }

  if (name === 'generate_theme_config') {
    const config: Record<string, unknown> = { preset: args?.preset, componentsDir: (args?.componentsDir as string) ?? 'components/ui' }
    const overrides = args?.overrides as Record<string, string> | undefined
    if (overrides && Object.keys(overrides).length > 0) config.tokens = { colors: overrides }
    return { content: [{ type: 'text', text: ['```json', JSON.stringify(config, null, 2), '```', '', 'Save as `native-mate.json` in your project root.'].join('\n') }] }
  }

  if (name === 'get_add_command') {
    const components = args?.components as string[]
    if (!components?.length) return { content: [{ type: 'text', text: 'No components specified.' }] }
    return { content: [{ type: 'text', text: `Run:\n\n\`\`\`bash\nnpx @native-mate/cli add ${components.join(' ')}\n\`\`\`` }] }
  }

  return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true }
}

// ── JSON-RPC handler ────────────────────────────────────────────────────────

interface JsonRpcRequest {
  jsonrpc: string
  id?: string | number
  method: string
  params?: Record<string, unknown>
}

function jsonRpcResponse(id: string | number | undefined, result: unknown) {
  return { jsonrpc: '2.0', id: id ?? null, result }
}

function jsonRpcError(id: string | number | undefined, code: number, message: string) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } }
}

async function handleRpcRequest(request: JsonRpcRequest) {
  const { method, params, id } = request

  if (method === 'initialize') {
    return jsonRpcResponse(id, {
      protocolVersion: '2025-03-26',
      capabilities: { tools: {} },
      serverInfo: { name: 'native-mate', version: '0.1.0' },
    })
  }

  if (method === 'notifications/initialized') {
    return null // notification, no response
  }

  if (method === 'tools/list') {
    return jsonRpcResponse(id, { tools: TOOLS })
  }

  if (method === 'tools/call') {
    const toolName = params?.name as string
    const toolArgs = (params?.arguments ?? {}) as Record<string, unknown>
    const result = await handleToolCall(toolName, toolArgs)
    return jsonRpcResponse(id, result)
  }

  if (method === 'ping') {
    return jsonRpcResponse(id, {})
  }

  return jsonRpcError(id, -32601, `Method not found: ${method}`)
}

// ── Next.js Route Handlers ──────────────────────────────────────────────────

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, mcp-session-id',
  'Access-Control-Expose-Headers': 'mcp-session-id',
}

export async function GET() {
  return Response.json({
    name: 'native-mate',
    version: '0.1.0',
    description: 'MCP server for native-mate — list, add, and search React Native components',
    tools: TOOLS.map((t) => t.name),
  }, { headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const sessionId = req.headers.get('mcp-session-id') || crypto.randomUUID()

    // Handle batch requests (array of JSON-RPC messages)
    if (Array.isArray(body)) {
      const results = await Promise.all(body.map(handleRpcRequest))
      const responses = results.filter(Boolean)
      return Response.json(responses.length === 1 ? responses[0] : responses, {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'mcp-session-id': sessionId },
      })
    }

    // Single request
    const result = await handleRpcRequest(body)
    if (result === null) {
      // Notification — no response body needed
      return new Response(null, { status: 202, headers: { ...CORS_HEADERS, 'mcp-session-id': sessionId } })
    }

    return Response.json(result, {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'mcp-session-id': sessionId },
    })
  } catch (err) {
    return Response.json(jsonRpcError(null, -32700, `Parse error: ${String(err)}`), {
      status: 400,
      headers: CORS_HEADERS,
    })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function DELETE() {
  return new Response('Session closed', { status: 200, headers: CORS_HEADERS })
}
