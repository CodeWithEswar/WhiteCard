import { useEffect, useState, useMemo } from 'react'
import {
  Zip01Icon,
  Folder01Icon,
  File01Icon,
  Search01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { parseZipArchive, type ArchivePreviewData } from '../../preview.utils'
import type { VaultDocument } from '@/types/document'

interface ArchivePreviewProps {
  document: VaultDocument
  arrayBuffer: ArrayBuffer | null
  isLoading: boolean
  onFetchContent: () => void
  onDownload?: () => void
}

export function ArchivePreview({
  document: doc,
  arrayBuffer,
  isLoading,
  onFetchContent,
  onDownload,
}: ArchivePreviewProps) {
  const [archiveData, setArchiveData] = useState<ArchivePreviewData | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!arrayBuffer && !isLoading) {
      onFetchContent()
    }
  }, [arrayBuffer, isLoading, onFetchContent])

  useEffect(() => {
    if (arrayBuffer) {
      parseZipArchive(arrayBuffer)
        .then((data) => setArchiveData(data))
        .catch((err) => setParseError(err.message || 'Could not inspect archive.'))
    }
  }, [arrayBuffer])

  const filteredEntries = useMemo(() => {
    if (!archiveData) return []
    if (!search.trim()) return archiveData.entries
    const q = search.toLowerCase().trim()
    return archiveData.entries.filter((e) => e.name.toLowerCase().includes(q) || e.path.toLowerCase().includes(q))
  }, [archiveData, search])

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Reading archive directory...</span>
        </div>
      </div>
    )
  }

  if (parseError) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl border border-border/80 bg-card/80 space-y-4 shadow-sm">
          <div className="size-14 rounded-2xl border border-border bg-muted/40 flex items-center justify-center mx-auto text-foreground">
            <AppIcon icon={Zip01Icon} size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">ZIP Archive Inspection</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{parseError}</p>
          </div>
          {onDownload && (
            <Button size="sm" onClick={onDownload} className="h-9 px-4 rounded-xl text-xs gap-1.5">
              <AppIcon icon={Download01Icon} size={14} />
              <span>Download ZIP</span>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full max-w-4xl mx-auto flex flex-col rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden text-left my-auto max-h-[82dvh]">
      {/* Archive Header Summary */}
      <div className="p-4 border-b border-border/60 bg-muted/30 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-muted text-foreground border border-border/70">
              <AppIcon icon={Zip01Icon} size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground truncate max-w-[280px]">
                {doc.originalFilename}
              </h3>
              <p className="text-[10px] font-mono text-muted-foreground">
                {archiveData
                  ? `${archiveData.totalFiles} files • ${archiveData.totalDirs} folders • ${archiveData.formattedTotalSize} uncompressed`
                  : doc.sizeFormatted}
              </p>
            </div>
          </div>

          {onDownload && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDownload}
              className="h-8 px-3 rounded-xl text-xs gap-1.5 border-border/80"
            >
              <AppIcon icon={Download01Icon} size={13} />
              <span className="hidden sm:inline">Download Archive</span>
            </Button>
          )}
        </div>

        {/* Search within archive */}
        <div className="relative">
          <AppIcon
            icon={Search01Icon}
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter files in archive..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border/70 bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Entry List Viewport */}
      <div className="flex-1 overflow-auto p-2 divide-y divide-border/40">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground">
            No matching files in archive
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.path}
              className="py-2 px-3 hover:bg-muted/30 rounded-lg flex items-center justify-between gap-3 text-xs transition-colors"
              style={{ paddingLeft: `${Math.max(12, entry.depth * 20 + 12)}px` }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <AppIcon
                  icon={entry.dir ? Folder01Icon : File01Icon}
                  size={15}
                  className={entry.dir ? 'text-foreground' : 'text-muted-foreground'}
                />
                <span className={`font-mono text-[11px] truncate ${entry.dir ? 'font-semibold text-foreground' : 'text-foreground/90'}`}>
                  {entry.name}
                </span>
              </div>

              {!entry.dir && (
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {entry.formattedSize}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className="px-4 py-2 border-t border-border/60 bg-muted/20 text-[10px] text-muted-foreground font-mono flex items-center justify-between">
        <span>Client-side inspection • Zero server extraction</span>
        {archiveData?.isTruncated && <span>Capped at 500 items</span>}
      </div>
    </div>
  )
}
