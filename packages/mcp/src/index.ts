#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { fetchIndex, fetchComponent } from './registry'

const server = new Server(
  { name: 'native-mate', version: '0.1.0' },
  { capabilities: { tools: {} } }
)

// ──────────────────────────────────────────────
// Tool definitions
// ──────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_components',
      description:
        'List all available native-mate components with their names, categories, and descriptions.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Optional: filter by category (primitives, forms, layout, display, overlay, feedback)',
          },
        },
      },
    },
    {
      name: 'get_component',
      description:
        'Get full details for a native-mate component including its source code, dependencies, and version.',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Component name, e.g. "button", "card", "sheet"',
          },
        },
        required: ['name'],
      },
    },
    {
      name: 'search_components',
      description: 'Search native-mate components by description or use-case.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query, e.g. "animated", "input", "modal"',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'generate_theme_config',
      description:
        'Generate a native-mate.json configuration for a given preset and optional color overrides.',
      inputSchema: {
        type: 'object',
        properties: {
          preset: {
            type: 'string',
            enum: ['zinc', 'slate', 'rose', 'midnight'],
            description: 'Theme preset name',
          },
          overrides: {
            type: 'object',
            description: 'Optional color token overrides, e.g. { "primary": "#6366f1" }',
          },
          componentsDir: {
            type: 'string',
            description: 'Where components should be installed. Default: "components/ui"',
          },
        },
        required: ['preset'],
      },
    },
    {
      name: 'get_add_command',
      description:
        'Get the exact CLI command to add one or more native-mate components to a project.',
      inputSchema: {
        type: 'object',
        properties: {
          components: {
            type: 'array',
            items: { type: 'string' },
            description: 'Component names to install',
          },
        },
        required: ['components'],
      },
    },
  ],
}))

// ──────────────────────────────────────────────
// Tool handlers
// ──────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (name === 'list_components') {
    const index = await fetchIndex()
    const filtered = args?.category
      ? index.filter((c) => c.category === args.category)
      : index

    const text = filtered
      .map((c) => `• ${c.name} (${c.category}) v${c.version}\n  ${c.description}`)
      .join('\n')

    return { content: [{ type: 'text', text: text || 'No components found.' }] }
  }

  if (name === 'get_component') {
    const componentName = args?.name as string
    try {
      const component = await fetchComponent(componentName)
      const files = component.files
        .map((f) => `### ${f.path}\n\`\`\`tsx\n${f.content}\n\`\`\``)
        .join('\n\n')
      const text = [
        `## ${component.name} v${component.version}`,
        component.description,
        '',
        component.dependencies.npm.length > 0
          ? `**npm deps:** ${component.dependencies.npm.join(', ')}`
          : '**npm deps:** none',
        component.dependencies.components.length > 0
          ? `**component deps:** ${component.dependencies.components.join(', ')}`
          : '',
        '',
        files,
      ]
        .filter(Boolean)
        .join('\n')
      return { content: [{ type: 'text', text }] }
    } catch (err: unknown) {
      return {
        content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
        isError: true,
      }
    }
  }

  if (name === 'search_components') {
    const query = (args?.query as string).toLowerCase()
    const index = await fetchIndex()
    const results = index.filter(
      (c) =>
        c.name.includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.category.includes(query)
    )
    if (results.length === 0) {
      return { content: [{ type: 'text', text: `No components matched "${args?.query}".` }] }
    }
    const text = results
      .map((c) => `• ${c.name} (${c.category}) — ${c.description}`)
      .join('\n')
    return { content: [{ type: 'text', text }] }
  }

  if (name === 'generate_theme_config') {
    const preset = args?.preset as string
    const componentsDir = (args?.componentsDir as string) ?? 'components/ui'
    const overrides = args?.overrides as Record<string, string> | undefined

    const config: Record<string, unknown> = { preset, componentsDir }
    if (overrides && Object.keys(overrides).length > 0) {
      config.tokens = { colors: overrides }
    }

    const text = [
      '```json',
      JSON.stringify(config, null, 2),
      '```',
      '',
      `Save this as \`native-mate.json\` in your project root.`,
    ].join('\n')

    return { content: [{ type: 'text', text }] }
  }

  if (name === 'get_add_command') {
    const components = args?.components as string[]
    if (!components || components.length === 0) {
      return { content: [{ type: 'text', text: 'No components specified.' }] }
    }
    const cmd = `npx @native-mate/cli add ${components.join(' ')}`
    const text = [
      `Run this command in your project root:`,
      '',
      '```bash',
      cmd,
      '```',
    ].join('\n')
    return { content: [{ type: 'text', text }] }
  }

  return {
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    isError: true,
  }
})

// ──────────────────────────────────────────────
// Start
// ──────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('native-mate MCP server running on stdio')
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
