// native-mate: markdown@0.1.0 | hash:PLACEHOLDER
import React, { useMemo } from 'react'
import { View, Pressable, Image } from 'react-native'
import { useTheme, Text, makeStyles, fontStyle, monoFontFamily } from '@native-mate/core'
import type { MarkdownProps } from './markdown.types'

const useStyles = makeStyles((theme) => ({
  container: {
    gap: 8,
  },
  paragraph: {
    fontSize: theme.typography.size.md,
    color: theme.colors.foreground,
    lineHeight: 24,
  },
  h1: {
    fontSize: 28,
    ...fontStyle(theme.typography, 'bold'),
    color: theme.colors.foreground,
    lineHeight: 34,
    marginTop: 16,
    marginBottom: 8,
  },
  h2: {
    fontSize: 24,
    ...fontStyle(theme.typography, 'bold'),
    color: theme.colors.foreground,
    lineHeight: 30,
    marginTop: 14,
    marginBottom: 6,
  },
  h3: {
    fontSize: 20,
    ...fontStyle(theme.typography, 'bold'),
    color: theme.colors.foreground,
    lineHeight: 26,
    marginTop: 12,
    marginBottom: 4,
  },
  h4: {
    fontSize: 18,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.foreground,
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 4,
  },
  h5: {
    fontSize: 16,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.foreground,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 2,
  },
  h6: {
    fontSize: 14,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.muted,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 2,
  },
  bold: {
    ...fontStyle(theme.typography, 'bold'),
  },
  italic: {
    fontStyle: 'italic',
  },
  inlineCode: {
    fontFamily: monoFontFamily(theme.typography),
    backgroundColor: theme.colors.background,
    color: theme.colors.foreground,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    fontSize: theme.typography.size.sm,
  },
  codeBlock: {
    backgroundColor: theme.colors.foreground + '0D',
    borderRadius: theme.radius.md,
    padding: 16,
    marginVertical: 4,
  },
  codeBlockDark: {
    backgroundColor: '#1E1E1E',
  },
  codeBlockText: {
    fontFamily: monoFontFamily(theme.typography),
    fontSize: theme.typography.size.sm,
    color: theme.colors.foreground,
    lineHeight: 20,
  },
  codeBlockTextDark: {
    color: '#D4D4D4',
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    paddingLeft: 14,
    paddingVertical: 4,
    marginVertical: 4,
    backgroundColor: theme.colors.primary + '08',
    borderRadius: 4,
  },
  blockquoteText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.foreground,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    paddingLeft: 8,
    gap: 8,
    marginVertical: 2,
  },
  listBullet: {
    fontSize: theme.typography.size.md,
    color: theme.colors.muted,
    lineHeight: 24,
    width: 16,
  },
  listItemText: {
    flex: 1,
    fontSize: theme.typography.size.md,
    color: theme.colors.foreground,
    lineHeight: 24,
  },
  hr: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },
  imageContainer: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginVertical: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
}))

interface ParsedBlock {
  type: 'heading' | 'paragraph' | 'code' | 'blockquote' | 'list' | 'hr' | 'image'
  level?: number
  content?: string
  items?: string[]
  ordered?: boolean
  alt?: string
  url?: string
  lang?: string
}

function parseMarkdown(content: string): ParsedBlock[] {
  const lines = content.split('\n')
  const blocks: ParsedBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, content: headingMatch[2].trim() })
      i++
      continue
    }

    // Code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({ type: 'code', content: codeLines.join('\n'), lang })
      i++ // skip closing ```
      continue
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      blocks.push({ type: 'blockquote', content: quoteLines.join('\n') })
      continue
    }

    // Image
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (imageMatch) {
      blocks.push({ type: 'image', alt: imageMatch[1], url: imageMatch[2] })
      i++
      continue
    }

    // Unordered list
    if (/^\s*[-*+]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s/, '').trim())
        i++
      }
      blocks.push({ type: 'list', items, ordered: false })
      continue
    }

    // Ordered list
    if (/^\s*\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s/, '').trim())
        i++
      }
      blocks.push({ type: 'list', items, ordered: true })
      continue
    }

    // Paragraph (collect consecutive non-empty lines)
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,6}\s|```|>\s|[-*+]\s|\d+\.\s|(-{3,}|\*{3,}|_{3,})\s*$)/.test(lines[i].trim())) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', content: paraLines.join(' ') })
    }
  }

  return blocks
}

function InlineText({
  content,
  baseStyle,
  linkHandler,
  linkStyle,
  boldStyle,
  italicStyle,
  codeStyle,
}: {
  content: string
  baseStyle: any
  linkHandler?: (url: string) => void
  linkStyle: any
  boldStyle: any
  italicStyle: any
  codeStyle: any
}) {
  // Parse inline elements: **bold**, *italic*, `code`, [link](url)
  const parts: React.ReactNode[] = []
  let remaining = content
  let keyIndex = 0

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    // Italic
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/)
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/)
    // Link
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)

    // Find the earliest match
    type MatchInfo = { match: RegExpMatchArray; type: 'bold' | 'italic' | 'code' | 'link' }
    const matches: MatchInfo[] = []
    if (boldMatch?.index != null) matches.push({ match: boldMatch, type: 'bold' })
    if (italicMatch?.index != null) matches.push({ match: italicMatch, type: 'italic' })
    if (codeMatch?.index != null) matches.push({ match: codeMatch, type: 'code' })
    if (linkMatch?.index != null) matches.push({ match: linkMatch, type: 'link' })

    if (matches.length === 0) {
      parts.push(
        <Text key={keyIndex++} variant="body" style={baseStyle}>
          {remaining}
        </Text>,
      )
      break
    }

    matches.sort((a, b) => (a.match.index ?? 0) - (b.match.index ?? 0))
    const earliest = matches[0]
    const matchIndex = earliest.match.index ?? 0

    // Text before match
    if (matchIndex > 0) {
      parts.push(
        <Text key={keyIndex++} variant="body" style={baseStyle}>
          {remaining.slice(0, matchIndex)}
        </Text>,
      )
    }

    switch (earliest.type) {
      case 'bold':
        parts.push(
          <Text key={keyIndex++} variant="body" style={[baseStyle, boldStyle]}>
            {earliest.match[1]}
          </Text>,
        )
        break
      case 'italic':
        parts.push(
          <Text key={keyIndex++} variant="body" style={[baseStyle, italicStyle]}>
            {earliest.match[1]}
          </Text>,
        )
        break
      case 'code':
        parts.push(
          <Text key={keyIndex++} variant="body" style={[codeStyle]}>
            {earliest.match[1]}
          </Text>,
        )
        break
      case 'link':
        parts.push(
          <Text
            key={keyIndex++}
            variant="body"
            style={[baseStyle, linkStyle]}
            onPress={() => linkHandler?.(earliest.match[2])}
            accessibilityRole="link"
            accessibilityLabel={earliest.match[1]}
          >
            {earliest.match[1]}
          </Text>,
        )
        break
    }

    remaining = remaining.slice(matchIndex + earliest.match[0].length)
  }

  return <Text variant="body" style={baseStyle}>{parts}</Text>
}

export const Markdown: React.FC<MarkdownProps> = ({
  content,
  markdownStyle = {},
  linkHandler,
  codeTheme = 'light',
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const blocks = useMemo(() => parseMarkdown(content), [content])

  const isDarkCode = codeTheme === 'dark' || theme.colorScheme === 'dark'

  const renderBlock = (block: ParsedBlock, index: number) => {
    switch (block.type) {
      case 'heading': {
        const headingKey = `h${block.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
        const headingStyle = styles[headingKey]
        return (
          <Text
            key={index}
            variant="title"
            style={[headingStyle, markdownStyle[headingKey]]}
            accessibilityRole="header"
          >
            {block.content}
          </Text>
        )
      }

      case 'paragraph':
        return (
          <InlineText
            key={index}
            content={block.content ?? ''}
            baseStyle={[styles.paragraph, markdownStyle.paragraph]}
            linkHandler={linkHandler}
            linkStyle={[styles.link, markdownStyle.link]}
            boldStyle={[styles.bold, markdownStyle.bold]}
            italicStyle={[styles.italic, markdownStyle.italic]}
            codeStyle={[styles.inlineCode, markdownStyle.code]}
          />
        )

      case 'code':
        return (
          <View
            key={index}
            style={[
              styles.codeBlock,
              isDarkCode && styles.codeBlockDark,
              markdownStyle.codeBlock,
            ]}
            accessibilityRole="text"
            accessibilityLabel={`Code block${block.lang ? `, ${block.lang}` : ''}`}
          >
            <Text
              variant="body"
              style={[
                styles.codeBlockText,
                isDarkCode && styles.codeBlockTextDark,
                markdownStyle.codeBlockText,
              ]}
            >
              {block.content}
            </Text>
          </View>
        )

      case 'blockquote':
        return (
          <View
            key={index}
            style={[styles.blockquote, markdownStyle.blockquote]}
          >
            <InlineText
              content={block.content ?? ''}
              baseStyle={[styles.blockquoteText, markdownStyle.blockquoteText]}
              linkHandler={linkHandler}
              linkStyle={[styles.link, markdownStyle.link]}
              boldStyle={[styles.bold, markdownStyle.bold]}
              italicStyle={[styles.italic, markdownStyle.italic]}
              codeStyle={[styles.inlineCode, markdownStyle.code]}
            />
          </View>
        )

      case 'list':
        return (
          <View key={index} style={{ gap: 2 }}>
            {(block.items ?? []).map((item, i) => (
              <View key={i} style={[styles.listItem, markdownStyle.listItem]}>
                <Text variant="body" style={styles.listBullet}>
                  {block.ordered ? `${i + 1}.` : '\u2022'}
                </Text>
                <InlineText
                  content={item}
                  baseStyle={[styles.listItemText, markdownStyle.listItemText]}
                  linkHandler={linkHandler}
                  linkStyle={[styles.link, markdownStyle.link]}
                  boldStyle={[styles.bold, markdownStyle.bold]}
                  italicStyle={[styles.italic, markdownStyle.italic]}
                  codeStyle={[styles.inlineCode, markdownStyle.code]}
                />
              </View>
            ))}
          </View>
        )

      case 'hr':
        return <View key={index} style={[styles.hr, markdownStyle.hr]} />

      case 'image':
        return (
          <View key={index} style={[styles.imageContainer, markdownStyle.image]}>
            <Image
              source={{ uri: block.url }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={block.alt ?? 'Image'}
            />
          </View>
        )

      default:
        return null
    }
  }

  return (
    <View style={[styles.container, style]} {...rest}>
      {blocks.map(renderBlock)}
    </View>
  )
}
