import { useState, useEffect } from 'react'
import type JSZip from 'jszip'
import type { ArchiveTreeNode } from '@/features/documents/lib/archive-tree'
import { resolveArchiveFileType } from '@/features/documents/lib/archive-file-types'
import { extractEntryAsText } from '@/features/documents/lib/archive-parser'
import { ArchiveCodePreview } from './archive-code-preview'
import { ArchiveTextPreview } from './archive-text-preview'
import { ArchiveImagePreview } from './archive-image-preview'
import { ArchiveCodeHeader } from './archive-code-header'
import { useArchiveCodeViewer } from '@/features/documents/hooks/use-archive-code-viewer'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { Download01Icon } from '@hugeicons/core-free-icons'

export interface ArchiveFilePreviewRouterProps {
  zip: JSZip
  node: ArchiveTreeNode
  onBackToDirectory: () => void
  className?: string
}

export function ArchiveFilePreviewRouter({
  zip,
  node,
  onBackToDirectory,
  className,
}: ArchiveFilePreviewRouterProps) {
  const typeInfo = resolveArchiveFileType(node.name, node.dir)
  const { isRaw, isWrapped, hasCopied, isDownloading, toggleRaw, toggleWrap, copyCode, downloadFile } =
    useArchiveCodeViewer(zip)

  const [textContent, setTextContent] = useState<string | null>(null)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [contentError, setContentError] = useState<string | null>(null)

  const isTextual =
    typeInfo.kind === 'code' ||
    typeInfo.kind === 'text' ||
    typeInfo.kind === 'markdown' ||
    typeInfo.kind === 'json' ||
    typeInfo.kind === 'csv'

  useEffect(() => {
    if (!isTextual) return

    let isMounted = true
    setIsLoadingContent(true)
    setContentError(null)

    extractEntryAsText(zip, node.path)
      .then((text: string) => {
        if (!isMounted) return
        setTextContent(text)
        setIsLoadingContent(false)
      })
      .catch((err: any) => {
        if (!isMounted) return
        setIsLoadingContent(false)
        if (err.message === 'ENTRY_TOO_LARGE') {
          setContentError('This file exceeds the 5 MB in-browser preview limit.')
        } else {
          setContentError('Could not decode file content.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [zip, node.path, isTextual])

  const lineCount = textContent ? textContent.split(/\r?\n/).length : undefined

  return (
    <div className="w-full flex-1 flex flex-col bg-surface overflow-hidden">
      {/* Sticky Code / File Bar */}
      <ArchiveCodeHeader
        filename={node.name}
        lineCount={lineCount}
        formattedSize={node.formattedSize}
        badgeText={typeInfo.badgeText}
        isRaw={isRaw}
        isWrapped={isWrapped}
        hasCopied={hasCopied}
        isDownloading={isDownloading}
        onToggleRaw={toggleRaw}
        onToggleWrap={toggleWrap}
        onCopy={() => copyCode(textContent || '')}
        onDownloadFile={() => downloadFile(node.path, node.name, typeInfo.mimeType)}
        onBackToDirectory={onBackToDirectory}
      />

      {/* Content Rendering Body */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isLoadingContent ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2 select-none">
            <div className="size-6 rounded-full border-2 border-border border-t-primary animate-spin" />
            <span className="text-xs text-muted-foreground font-mono">
              Preparing {node.name}…
            </span>
          </div>
        ) : contentError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 select-none">
            <div className="size-12 rounded-2xl border border-border bg-surface-muted flex items-center justify-center text-muted-foreground">
              <AppIcon icon={typeInfo.icon} size={22} />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-semibold text-foreground">{node.name}</h4>
              <p className="text-xs text-muted-foreground">{contentError}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadFile(node.path, node.name, typeInfo.mimeType)}
              className="h-8 px-3 rounded-xl text-xs gap-1.5"
            >
              <AppIcon icon={Download01Icon} size={14} />
              <span>Download File</span>
            </Button>
          </div>
        ) : typeInfo.kind === 'image' ? (
          <ArchiveImagePreview zip={zip} path={node.path} filename={node.name} />
        ) : typeInfo.kind === 'text' ? (
          <ArchiveTextPreview content={textContent || ''} isWrapped={isWrapped} />
        ) : isTextual ? (
          <ArchiveCodePreview
            filename={node.name}
            content={textContent || ''}
            isRaw={isRaw}
            isWrapped={isWrapped}
          />
        ) : (
          // Unsupported Binary File Fallback
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 select-none">
            <div className="size-14 rounded-2xl border border-border bg-surface-muted flex items-center justify-center text-muted-foreground shadow-2xs">
              <AppIcon icon={typeInfo.icon} size={26} />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-semibold text-foreground">{node.name}</h4>
              <p className="text-xs text-muted-foreground font-mono">
                {typeInfo.label} • {node.formattedSize}
              </p>
              <p className="text-xs text-muted-foreground pt-1">
                This file cannot be rendered inside White Card.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={isDownloading}
              onClick={() => downloadFile(node.path, node.name, typeInfo.mimeType)}
              className="h-9 px-4 rounded-xl text-xs font-medium gap-1.5 shadow-2xs"
            >
              <AppIcon icon={Download01Icon} size={14} />
              <span>Download File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
