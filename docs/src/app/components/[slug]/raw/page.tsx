import { notFound } from 'next/navigation'
import { COMPONENT_DOCS } from '../page'

export async function generateStaticParams() {
  return Object.keys(COMPONENT_DOCS).map((slug) => ({ slug }))
}

function buildMarkdown(slug: string): string {
  const doc = COMPONENT_DOCS[slug]
  if (!doc) return ''

  const lines: string[] = []

  lines.push(`# ${doc.name}`)
  lines.push('')
  lines.push(`> ${doc.description}`)
  lines.push('')
  lines.push(`**Category:** ${doc.category}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  lines.push('## Installation')
  lines.push('')
  lines.push('```bash')
  lines.push(doc.addCommand)
  lines.push('```')
  lines.push('')

  if (doc.npmDeps.length > 0) {
    lines.push(`**npm deps:** ${doc.npmDeps.join(', ')}`)
    lines.push('')
  }
  if (doc.componentDeps.length > 0) {
    lines.push(`**Component deps:** ${doc.componentDeps.join(', ')}`)
    lines.push('')
  }

  lines.push('## Usage')
  lines.push('')
  lines.push('```tsx')
  lines.push(doc.usageCode)
  lines.push('```')
  lines.push('')

  lines.push('## Props')
  lines.push('')
  lines.push('| Prop | Type | Default | Description |')
  lines.push('|------|------|---------|-------------|')
  for (const prop of doc.props) {
    const def = prop.default ?? '—'
    const type = prop.type.replace(/\|/g, '\\|')
    lines.push(`| \`${prop.name}\` | \`${type}\` | \`${def}\` | ${prop.description} |`)
  }
  lines.push('')

  if (doc.exampleCode) {
    lines.push('## Example')
    lines.push('')
    lines.push('```tsx')
    lines.push(doc.exampleCode)
    lines.push('```')
    lines.push('')
  }

  if (doc.accessibility && doc.accessibility.length > 0) {
    lines.push('## Accessibility')
    lines.push('')
    for (const a of doc.accessibility) {
      lines.push(`- **${a.feature}**: ${a.detail}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

export const metadata = { robots: 'noindex' }

export default async function RawPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = COMPONENT_DOCS[slug]
  if (!doc) notFound()

  const markdown = buildMarkdown(slug)

  return (
    <pre
      style={{
        background: '#0a0a0a',
        color: '#e4e4e7',
        fontFamily: "'Fira Code', 'Cascadia Code', ui-monospace, monospace",
        fontSize: 13,
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        padding: '2rem 2.5rem',
        maxWidth: 860,
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      {markdown}
    </pre>
  )
}
