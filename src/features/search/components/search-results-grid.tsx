import { motion } from 'framer-motion'
import { SearchResultCard } from './search-result-card'
import type { SearchDocumentResult } from '../search.types'
import { useAppReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface SearchResultsGridProps {
  documents: SearchDocumentResult[]
  searchQuery?: string
  onSelect: (id: string) => void
  onShare?: (doc: SearchDocumentResult) => void
  onDownload?: (doc: SearchDocumentResult) => void
  onDelete?: (doc: SearchDocumentResult) => void
  className?: string
}

export function SearchResultsGrid({
  documents,
  searchQuery,
  onSelect,
  onShare,
  onDownload,
  onDelete,
  className,
}: SearchResultsGridProps) {
  const reduceMotion = useAppReducedMotion()

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 items-stretch',
        className
      )}
    >
      {documents.map((doc, idx) => (
        <motion.div
          key={doc.id}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.22,
            delay: reduceMotion ? 0 : Math.min(idx * 0.025, 0.25),
            ease: 'easeOut',
          }}
          className="h-full flex flex-col"
        >
          <SearchResultCard
            document={doc}
            searchQuery={searchQuery}
            onSelect={onSelect}
            onShare={onShare}
            onDownload={onDownload}
            onDelete={onDelete}
            className="h-full"
          />
        </motion.div>
      ))}
    </div>
  )
}
