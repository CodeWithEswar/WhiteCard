import React from 'react'
import { MarkdownDocument } from '@/features/documents/components/previews/markdown/markdown-document'
import type { MarkdownContext } from '@/features/documents/lib/markdown/markdown-types'

export interface RichMarkdownRendererProps {
  content: string
  className?: string
  context?: MarkdownContext
}

/**
 * Universal GitHub-grade Markdown Renderer
 * Reused for standalone markdown documents, ZIP READMEs, and embedded descriptions.
 */
export function RichMarkdownRenderer({
  content,
  className,
  context,
}: RichMarkdownRendererProps) {
  return (
    <MarkdownDocument
      content={content}
      className={className}
      context={context}
    />
  )
}
