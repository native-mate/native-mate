import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'MCP Server — Integrations' }

export default function McpPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">MCP Server</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        native-mate ships an MCP (Model Context Protocol) server that lets AI tools like
        Claude Code and Cursor browse, search, and add components directly from chat.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Setup with Claude Code</h2>
      <CodeBlock language="bash" code={`claude mcp add native-mate -- npx @native-mate/mcp`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        This registers the native-mate MCP server. Claude can now list, search, and fetch
        component source code during conversations.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Setup with Cursor</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Add to your <code className="text-zinc-300">.cursor/mcp.json</code>:
      </p>
      <CodeBlock language="json" filename=".cursor/mcp.json" code={`{
  "mcpServers": {
    "native-mate": {
      "command": "npx",
      "args": ["@native-mate/mcp"]
    }
  }
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Available tools</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Tool</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['list_components', 'List all available components, optionally filter by category'],
              ['get_component', 'Get full source code, dependencies, and version for a component'],
              ['search_components', 'Search components by description or use-case keyword'],
              ['generate_theme_config', 'Generate a native-mate.json config for a preset with optional overrides'],
              ['get_add_command', 'Get the exact CLI command to add specific components'],
            ].map(([tool, desc], i) => (
              <tr key={tool} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{tool}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Example usage</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Once the MCP server is connected, you can ask your AI assistant things like:
      </p>
      <ul className="space-y-2 text-sm text-zinc-400 list-disc pl-5">
        <li>&ldquo;Show me the source code for the Button component&rdquo;</li>
        <li>&ldquo;What components are available for forms?&rdquo;</li>
        <li>&ldquo;Search for components that handle modals or overlays&rdquo;</li>
        <li>&ldquo;Generate a midnight theme config with a custom primary color&rdquo;</li>
        <li>&ldquo;What command do I run to add card, input, and badge?&rdquo;</li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">How it works</h2>
      <p className="text-sm text-zinc-400">
        The MCP server uses the same GitHub-hosted registry as the CLI. It fetches component
        metadata and source code on demand via{' '}
        <code className="text-zinc-300">raw.githubusercontent.com</code>. No API keys or
        authentication required.
      </p>
    </article>
  )
}
