import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

// ── Registry client ─────────────────────────────────────────────────────────

const GITHUB_FALLBACK = 'https://raw.githubusercontent.com/native-mate/native-mate/main/packages/registry/dist/registry'

interface RegistryFile { path: string; content: string; hash: string }
interface RegistryComponent {
  name: string; version: string; description: string; files: RegistryFile[]
  dependencies: { npm: string[]; components: string[] }
}
interface ComponentIndex { name: string; version: string; description: string; category: string }

async function fetchIndex(): Promise<ComponentIndex[]> {
  const res = await fetch(`${GITHUB_FALLBACK}/index.json`)
  if (!res.ok) return []
  const data = (await res.json()) as { components: ComponentIndex[] }
  return data.components
}

async function fetchComponent(name: string): Promise<RegistryComponent> {
  const res = await fetch(`${GITHUB_FALLBACK}/${name}/latest.json`)
  if (!res.ok) throw new Error(`Component "${name}" not found`)
  return res.json() as Promise<RegistryComponent>
}

// ── MCP Server factory ──────────────────────────────────────────────────────

function createServer(): Server {
  const server = new Server(
    { name: 'native-mate', version: '0.1.0' },
    { capabilities: { tools: {} } }
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'list_components',
        description: 'List all available native-mate components with names, categories, and descriptions.',
        inputSchema: { type: 'object' as const, properties: { category: { type: 'string', description: 'Optional category filter' } } },
      },
      {
        name: 'get_component',
        description: 'Get full source code, dependencies, and version for a native-mate component.',
        inputSchema: { type: 'object' as const, properties: { name: { type: 'string', description: 'Component name' } }, required: ['name'] },
      },
      {
        name: 'search_components',
        description: 'Search native-mate components by keyword.',
        inputSchema: { type: 'object' as const, properties: { query: { type: 'string', description: 'Search query' } }, required: ['query'] },
      },
      {
        name: 'generate_theme_config',
        description: 'Generate a native-mate.json config for a preset with optional overrides.',
        inputSchema: {
          type: 'object' as const,
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
        inputSchema: { type: 'object' as const, properties: { components: { type: 'array', items: { type: 'string' } } }, required: ['components'] },
      },
    ],
  }))

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params

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
      return { content: [{ type: 'text', text: `Run:\n\n\`\`\`bash\nnpx native-mate add ${components.join(' ')}\n\`\`\`` }] }
    }

    return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true }
  })

  return server
}

// ── Next.js Route Handlers ──────────────────────────────────────────────────

// Need Node.js runtime for MCP SDK (uses streams)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({
    name: 'native-mate',
    version: '0.1.0',
    description: 'MCP server for native-mate — list, add, and search React Native components',
    tools: ['list_components', 'get_component', 'search_components', 'generate_theme_config', 'get_add_command'],
  })
}

export async function POST(req: Request) {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
    })

    const server = createServer()
    await server.connect(transport)

    const body = await req.text()

    // Create a minimal IncomingMessage-like object
    const { Readable } = await import('stream')
    const readable = new Readable()
    readable.push(body)
    readable.push(null)

    const fakeReq = Object.assign(readable, {
      method: 'POST',
      url: '/api/mcp',
      headers: Object.fromEntries(req.headers.entries()),
    })

    // Collect the response
    const chunks: Buffer[] = []
    let statusCode = 200
    const responseHeaders: Record<string, string> = {}

    const fakeRes = {
      writeHead(code: number, headers?: Record<string, string>) {
        statusCode = code
        if (headers) Object.assign(responseHeaders, headers)
        return fakeRes
      },
      setHeader(name: string, value: string) {
        responseHeaders[name] = value
        return fakeRes
      },
      getHeader(name: string) { return responseHeaders[name] },
      write(chunk: string | Buffer) {
        chunks.push(Buffer.from(chunk))
        return true
      },
      end(chunk?: string | Buffer) {
        if (chunk) chunks.push(Buffer.from(chunk))
      },
      on() { return fakeRes },
      once() { return fakeRes },
      emit() { return false },
      flushHeaders() {},
    }

    await transport.handleRequest(fakeReq as any, fakeRes as any)

    const responseBody = Buffer.concat(chunks).toString()
    return new Response(responseBody, {
      status: statusCode,
      headers: {
        'Content-Type': responseHeaders['Content-Type'] || responseHeaders['content-type'] || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'mcp-session-id',
        ...(responseHeaders['mcp-session-id'] ? { 'mcp-session-id': responseHeaders['mcp-session-id'] } : {}),
      },
    })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, mcp-session-id',
      'Access-Control-Expose-Headers': 'mcp-session-id',
    },
  })
}

export async function DELETE() {
  return new Response('Session closed', { status: 200 })
}
