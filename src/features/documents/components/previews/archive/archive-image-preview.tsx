import { useState, useEffect } from 'react'
import type JSZip from 'jszip'
import { extractEntryAsBlob } from '@/features/documents/lib/archive-parser'
import { resolveArchiveFileType } from '@/features/documents/lib/archive-file-types'
import { cn } from '@/lib/utils'

export interface ArchiveImagePreviewProps {
  zip: JSZip
  path: string
  filename: string
  className?: string
}

export function ArchiveImagePreview({
  zip,
  path,
  filename,
  className,
}: ArchiveImagePreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let currentUrl: string | null = null
    setIsLoading(true)
    setError(null)

    const typeInfo = resolveArchiveFileType(filename)

    extractEntryAsBlob(zip, path, typeInfo.mimeType)
      .then((blob: Blob) => {
        currentUrl = URL.createObjectURL(blob)
        setBlobUrl(currentUrl)
        setIsLoading(false)
      })
      .catch((err: any) => {
        console.error('Failed to load archive image:', err)
        setError('Could not render image entry.')
        setIsLoading(false)
      })

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
    }
  }, [zip, path, filename])

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-8">
        <div className="size-6 rounded-full border-2 border-border border-t-primary animate-spin" />
      </div>
    )
  }

  if (error || !blobUrl) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-8 text-xs text-muted-foreground">
        {error || 'Failed to render image preview.'}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full flex-1 flex items-center justify-center p-6 bg-surface-muted/20 overflow-auto select-none',
        className
      )}
    >
      <img
        src={blobUrl}
        alt={filename}
        className="max-w-full max-h-[75vh] object-contain rounded-xl border border-border shadow-xs"
      />
    </div>
  )
}
