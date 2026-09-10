import { useState, useEffect, useCallback, useRef } from 'react'
import { MarkdownToolbar } from './markdown-toolbar'
import { MarkdownDocument } from './markdown-document'
import { MarkdownLoading } from './markdown-loading'
import { MarkdownEmpty } from './markdown-empty'
import { MarkdownErrorBoundary } from './markdown-error'
import { ArchiveCodePreview } from '../archive/archive-code-preview'
import { cn } from '@/lib/utils'
import type { MarkdownMode, HeadingItem, MarkdownContext } from '@/features/documents/lib/markdown/markdown-types'
import type { VaultDocument } from '@/types/document'

export interface MarkdownPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  lineWrap?: boolean
  onFetchContent: () => void
  onDownload?: () => void
  className?: string
  context?: MarkdownContext
}

export function MarkdownPreview({
  document: doc,
  content,
  isLoading,
  lineWrap = true,
  onFetchContent,
  className,
  context,
}: MarkdownPreviewProps) {
  const [mode, setMode] = useState<MarkdownMode>('rendered')
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMatchIndex, setActiveMatchIndex] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)

  const contentRef = useRef<HTMLDivElement>(null)

  // Fix fetch loop bug (Prompt #80 & #81): only fetch when content is strictly null
  useEffect(() => {
    if (content === null && !isLoading) {
      onFetchContent()
    }
  }, [content, isLoading, onFetchContent])

  const handleHeadingsExtracted = useCallback((extracted: HeadingItem[]) => {
    setHeadings(extracted)
  }, [])

  // Highlight search matches within rendered container
  useEffect(() => {
    if (!searchQuery.trim() || !contentRef.current || mode !== 'rendered') {
      setTotalMatches(0)
      setActiveMatchIndex(0)
      return
    }

    // Search query match count
    const container = contentRef.current
    const text = container.innerText || ''
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = text.match(regex)
    setTotalMatches(matches ? matches.length : 0)
    setActiveMatchIndex(0)
  }, [searchQuery, mode, content])

  const handlePrevMatch = () => {
    if (totalMatches <= 1) return
    setActiveMatchIndex((prev) => (prev > 0 ? prev - 1 : totalMatches - 1))
  }

  const handleNextMatch = () => {
    if (totalMatches <= 1) return
    setActiveMatchIndex((prev) => (prev < totalMatches - 1 ? prev + 1 : 0))
  }

  if (isLoading && content === null) {
    return (
      <div className="w-full h-full flex flex-col overflow-y-auto bg-surface">
        <MarkdownLoading />
      </div>
    )
  }

  return (
    <div className={cn('w-full h-full flex flex-col min-h-0 bg-surface text-foreground overflow-hidden', className)}>
      {/* Sticky Compact Document Toolbar */}
      <MarkdownToolbar
        document={doc}
        mode={mode}
        onModeChange={setMode}
        content={content || ''}
        headings={headings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeMatchIndex={activeMatchIndex}
        totalMatches={totalMatches}
        onPrevMatch={handlePrevMatch}
        onNextMatch={handleNextMatch}
      />

      {/* Main Viewport */}
      <div className="flex-1 min-h-0 overflow-y-auto" ref={contentRef}>
        {mode === 'rendered' ? (
          content === '' ? (
            <MarkdownEmpty />
          ) : (
            <MarkdownErrorBoundary onViewSource={() => setMode('source')}>
              <MarkdownDocument
                content={content || ''}
                context={context}
                onHeadingsExtracted={handleHeadingsExtracted}
              />
            </MarkdownErrorBoundary>
          )
        ) : (
          <div className="h-full flex flex-col overflow-hidden">
            <ArchiveCodePreview
              filename={doc.originalFilename}
              content={content || ''}
              isRaw={false}
              isWrapped={lineWrap}
            />
          </div>
        )}
      </div>
    </div>
  )
}
