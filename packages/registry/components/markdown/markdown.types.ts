import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle, TextStyle } from 'react-native'

export interface MarkdownStyles {
  h1?: TextStyle
  h2?: TextStyle
  h3?: TextStyle
  h4?: TextStyle
  h5?: TextStyle
  h6?: TextStyle
  paragraph?: TextStyle
  bold?: TextStyle
  italic?: TextStyle
  code?: TextStyle
  codeBlock?: ViewStyle
  codeBlockText?: TextStyle
  link?: TextStyle
  blockquote?: ViewStyle
  blockquoteText?: TextStyle
  listItem?: ViewStyle
  listItemText?: TextStyle
  image?: ViewStyle
  hr?: ViewStyle
}

export interface MarkdownProps extends Omit<ViewProps, 'style'> {
  /** Markdown content string */
  content: string
  /** Custom style overrides for markdown elements */
  markdownStyle?: MarkdownStyles
  /** Handler for link presses, receives the URL */
  linkHandler?: (url: string) => void
  /** Theme for code blocks */
  codeTheme?: 'light' | 'dark'
  style?: StyleProp<ViewStyle>
}
