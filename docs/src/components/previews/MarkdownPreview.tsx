'use client'
import React from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { Markdown } from '../../../../packages/registry/components/markdown/markdown'

const SAMPLE = `# Release Notes

## v2.1.0

We shipped **big** improvements this release, with a focus on *performance*.

- Faster cold start times
- New \`useTheme\` hook
- Fixed carousel snapping on Android

> Upgrade as soon as possible — this release contains a security fix.

Read the [full changelog](https://example.com/changelog) for details.

\`\`\`ts
const value = compute(a, b)
\`\`\`
`

export default function MarkdownPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Full document" minHeight={260} code={`import { Markdown } from '~/components/ui/markdown'

const content = \`# Release Notes

## v2.1.0

We shipped **big** improvements this release, with a focus on *performance*.

- Faster cold start times
- New \\\`useTheme\\\` hook
- Fixed carousel snapping on Android

> Upgrade as soon as possible — this release contains a security fix.

Read the [full changelog](https://example.com/changelog) for details.

\\\`\\\`\\\`ts
const value = compute(a, b)
\\\`\\\`\\\`
\`

<Markdown content={content} linkHandler={(url) => Linking.openURL(url)} />`}>
        <View style={{ width: 380 }}>
          <Markdown content={SAMPLE} linkHandler={() => {}} />
        </View>
      </Preview>

      <Preview title="Headings" code={`<Markdown content={'# H1 Heading\\n## H2 Heading\\n### H3 Heading'} />`}>
        <View style={{ width: 380 }}>
          <Markdown content={'# H1 Heading\n## H2 Heading\n### H3 Heading'} />
        </View>
      </Preview>

      <Preview title="Lists" code={`<Markdown content={'- First item\\n- Second item\\n- Third item\\n\\n1. Step one\\n2. Step two'} />`}>
        <View style={{ width: 380 }}>
          <Markdown content={'- First item\n- Second item\n- Third item\n\n1. Step one\n2. Step two'} />
        </View>
      </Preview>

      <Preview title="Dark code theme" code={`<Markdown
  content={'\\\`\\\`\\\`js\\nconsole.log(\"hello\")\\n\\\`\\\`\\\`'}
  codeTheme="dark"
/>`}>
        <View style={{ width: 380 }}>
          <Markdown content={'```js\nconsole.log("hello")\n```'} codeTheme="dark" />
        </View>
      </Preview>

      <Preview title="Custom style overrides" code={`<Markdown
  content={'# Styled heading\\n\\nStyled paragraph text.'}
  markdownStyle={{ h1: { color: '#6366f1' }, paragraph: { fontStyle: 'italic' } }}
/>`}>
        <View style={{ width: 380 }}>
          <Markdown
            content={'# Styled heading\n\nStyled paragraph text.'}
            markdownStyle={{ h1: { color: '#6366f1' }, paragraph: { fontStyle: 'italic' } }}
          />
        </View>
      </Preview>
    </div>
  )
}
