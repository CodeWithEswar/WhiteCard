import { TextPreview } from './text-preview'
import type { VaultDocument } from '@/types/document'

interface CodePreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  lineWrap: boolean
  onFetchContent: () => void
}

export function CodePreview({
  document,
  content,
  isLoading,
  lineWrap,
  onFetchContent,
}: CodePreviewProps) {
  return (
    <TextPreview
      document={document}
      content={content}
      isLoading={isLoading}
      lineWrap={lineWrap}
      onFetchContent={onFetchContent}
    />
  )
}
