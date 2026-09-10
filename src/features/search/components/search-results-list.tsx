import { motion } from 'framer-motion'
import { SearchResultRow } from './search-result-row'
import type { SearchDocumentResult } from '../search.types'
import { useAppReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface SearchResultsListProps {
  documents: SearchDocumentResult[]
  searchQuery?: string
  onSelect: (id: string) => void
  onShare?: (doc: SearchDocumentResult) => void
  onDownload?: (doc: SearchDocumentResult) => void
  onDelete?: (doc: SearchDocumentResult) => void
  className?: string
}

export function SearchResultsList({
  documents,
  searchQuery,
  onSelect,
  onShare,
  onDownload,
  onDelete,
  className,
}: SearchResultsListProps) {
  const reduceMotion = useAppReducedMotion()

  return (
    <div
      className={cn(
        'rounded-2xl border border-border/80 bg-surface divide-y divide-border/60 overflow-hidden shadow-2xs',
        className
      )}
    >
      {/* Desktop Column Sub-header */}
      <div className="hidden sm:flex items-center justify-between px-4 py-2 bg-surface-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none border-b border-border/60">
        <div className="flex-1">Document</div>
        <div className="flex items-center gap-5 shrink-0">
          <div className="w-36 text-left">Tags</div>
          <div className="w-12 text-right">Format</div>
          <div className="w-18 text-right">Size</div>
          <div className="w-24 text-right">Uploaded</div>
          <div className="w-7 text-right">Action</div>
        </div>
      </div>

      {documents.map((doc, idx) => (
        <motion.div
          key={doc.id}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.18,
            delay: reduceMotion ? 0 : Math.min(idx * 0.02, 0.2),
          }}
        >
          <SearchResultRow
            document={doc}
            searchQuery={searchQuery}
            onSelect={onSelect}
            onShare={onShare}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  )
}
