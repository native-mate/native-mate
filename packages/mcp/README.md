# @native-mate/mcp

MCP (Model Context Protocol) server for [native-mate](https://github.com/native-mate/native-mate). Lets Claude, Cursor, and other AI tools browse, search, and install native-mate components.

## Setup

### Claude Code

```bash
claude mcp add native-mate -- npx -y @native-mate/mcp
```

### Claude Desktop

Edit config file:
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "native-mate": {
      "command": "npx",
      "args": ["-y", "@native-mate/mcp"]
    }
  }
}
```

### Cursor

Create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "native-mate": {
      "command": "npx",
      "args": ["-y", "@native-mate/mcp"]
    }
  }
}
```

### Windsurf / Continue / Zed

Same format — check their docs for the MCP config file location.

## Tools

| Tool | Description |
|---|---|
| `list_components` | List all components with names, categories, descriptions. Optional category filter. |
| `get_component` | Get full source code, types, and dependencies for a component. |
| `search_components` | Search components by name, description, or use-case. |
| `generate_theme_config` | Generate a `native-mate.json` config for a preset with optional overrides. |
| `get_add_command` | Get the exact CLI command to install components. |

## Example

Once connected, ask your AI assistant:

- "List all native-mate form components"
- "Get the source code for the toast component"
- "Search for components with haptic feedback"
- "Generate a theme config using the rose preset"
- "What's the command to add button, card, and input?"

## License

MIT
