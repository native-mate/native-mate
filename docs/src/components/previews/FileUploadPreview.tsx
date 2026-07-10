'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { FileUpload } from '../../../../packages/registry/components/file-upload/file-upload'
import type { UploadFile } from '../../../../packages/registry/components/file-upload/file-upload.types'

const SAMPLE_FILES: UploadFile[] = [
  { id: '1', name: 'invoice-march.pdf', size: 245_000, type: 'application/pdf', progress: 1 },
  { id: '2', name: 'team-photo.png', size: 1_240_000, type: 'image/png', progress: 0.65 },
  { id: '3', name: 'notes.txt', size: 4_200, type: 'text/plain', error: 'File type not allowed' },
]

export default function FileUploadPreview() {
  const [files, setFiles] = useState<UploadFile[]>(SAMPLE_FILES)

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))

  return (
    <div className="space-y-10">
      <Preview title="Dropzone variant" code={`import { FileUpload } from '~/components/ui/file-upload'

<FileUpload
  variant="dropzone"
  accept={['image/png', 'image/jpeg']}
  maxSize={5 * 1024 * 1024}
  maxFiles={3}
  onFilesSelected={(files) => console.log(files)}
/>`} minHeight={220}>
        <View style={{ width: 340 }}>
          <FileUpload
            variant="dropzone"
            accept={['image/png', 'image/jpeg']}
            maxSize={5 * 1024 * 1024}
            maxFiles={3}
            onFilesSelected={() => {}}
          />
        </View>
      </Preview>

      <Preview title="Button variant" code={`<FileUpload variant="button" placeholder="Upload document" onFilesSelected={() => {}} />`}>
        <View style={{ width: 260 }}>
          <FileUpload variant="button" placeholder="Upload document" onFilesSelected={() => {}} />
        </View>
      </Preview>

      <Preview title="Compact variant" code={`<FileUpload variant="compact" placeholder="Attach receipt" onFilesSelected={() => {}} />`}>
        <View style={{ width: 260 }}>
          <FileUpload variant="compact" placeholder="Attach receipt" onFilesSelected={() => {}} />
        </View>
      </Preview>

      <Preview title="With file previews" code={`const [files, setFiles] = useState<UploadFile[]>([
  { id: '1', name: 'invoice-march.pdf', size: 245000, type: 'application/pdf', progress: 1 },
  { id: '2', name: 'team-photo.png', size: 1240000, type: 'image/png', progress: 0.65 },
  { id: '3', name: 'notes.txt', size: 4200, type: 'text/plain', error: 'File type not allowed' },
])

<FileUpload
  variant="compact"
  files={files}
  onRemoveFile={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
/>`} minHeight={260}>
        <View style={{ width: 340 }}>
          <FileUpload
            variant="compact"
            files={files}
            onRemoveFile={removeFile}
            onFilesSelected={() => {}}
          />
        </View>
      </Preview>

      <Preview title="Disabled" code={`<FileUpload variant="dropzone" disabled placeholder="Uploads paused" onFilesSelected={() => {}} />`}>
        <View style={{ width: 300 }}>
          <FileUpload variant="dropzone" disabled placeholder="Uploads paused" onFilesSelected={() => {}} />
        </View>
      </Preview>
    </div>
  )
}
