import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type FileUploadVariant = 'dropzone' | 'button' | 'compact'

export interface UploadFile {
  /** Unique file identifier */
  id: string
  /** File name */
  name: string
  /** File size in bytes */
  size: number
  /** MIME type */
  type: string
  /** Local URI for preview */
  uri?: string
  /** Upload progress 0-1 */
  progress?: number
  /** Error message if upload failed */
  error?: string
}

export interface FileUploadProps extends Omit<ViewProps, 'style'> {
  /** Called when files are selected */
  onFilesSelected?: (files: UploadFile[]) => void
  /** Maximum number of files */
  maxFiles?: number
  /** Maximum file size in bytes */
  maxSize?: number
  /** Accepted MIME types */
  accept?: string[]
  /** Allow multiple file selection */
  multiple?: boolean
  /** UI variant */
  variant?: FileUploadVariant
  /** Show file previews */
  showPreview?: boolean
  /** Controlled file list */
  files?: UploadFile[]
  /** Called when a file should be removed */
  onRemoveFile?: (fileId: string) => void
  /** Disable interactions */
  disabled?: boolean
  /** Custom placeholder text */
  placeholder?: string
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
