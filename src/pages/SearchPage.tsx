import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search01Icon,
  Cancel01Icon,
  Passport01Icon,
  Certificate01Icon,
} from '@hugeicons/core-free-icons'
import { PageShell } from '../components/layout/page-shell'
import { ResponsivePageHeader } from '../components/layout/responsive-page-header'
import { PageHeaderMeta } from '../components/layout/page-header-meta'
import { TagChip } from '../features/tags/components/tag-chip'
import { DocumentGrid } from '../features/documents/components/document-grid'
import { AppIcon } from '../components/icons/app-icon'
import {
  useDocuments,
  useDeleteDocument,
  useDocumentDownload,
} from '../features/documents/hooks/use-documents'
import type { VaultDocument } from '../types/document'

export function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [spaceFilter, setSpaceFilter] = useState<'all' | 'government' | 'student'>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  const deleteMutation = useDeleteDocument()
  const { download } = useDocumentDownload()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const { data: documents = [] } = useDocuments({
    search: query,
    space: spaceFilter,
    tags: selectedTag ? [selectedTag] : undefined,
  })

  const popularTags = [
    'Passport',
    'Driving',
    'Education',
    'Degree',
    'Identity',
    'Renewal',
    'Personal',
  ]

  const handleDelete = (doc: VaultDocument) => {
    if (confirm(`Remove "${doc.title}"?`)) {
      deleteMutation.mutate(doc.id)
    }
  }

  const handleDownload = (doc: VaultDocument) => {
    download(doc)
  }

  return (
    <PageShell
      maxWidth="default"
      header={
        <ResponsivePageHeader
          eyebrow="SEARCH"
          title="Search Vault"
          description="Find documents across Government and Student spaces instantaneously."
          metadata={
            query.trim() || selectedTag || spaceFilter !== 'all' ? (
              <PageHeaderMeta count={documents.length} countLabel="results found" />
            ) : undefined
          }
        />
      }
    >
      <div className="space-y-4">
        {/* Large Integrated Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <AppIcon icon={Search01Icon} size={17} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, original filename, category, or notes..."
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface border border-border focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 shadow-2xs transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <AppIcon icon={Cancel01Icon} size={15} />
            </button>
          )}
        </div>

        {/* Filter Chips: Spaces & Popular Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 select-none">
          <button
            type="button"
            onClick={() => setSpaceFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              spaceFilter === 'all'
                ? 'bg-primary text-primary-foreground shadow-2xs font-semibold'
                : 'bg-muted/40 border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/70'
            }`}
          >
            All Spaces
          </button>
          <button
            type="button"
            onClick={() => setSpaceFilter('government')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              spaceFilter === 'government'
                ? 'bg-primary text-primary-foreground shadow-2xs font-semibold'
                : 'bg-muted/40 border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/70'
            }`}
          >
            <AppIcon icon={Passport01Icon} size={13} />
            <span>Government</span>
          </button>
          <button
            type="button"
            onClick={() => setSpaceFilter('student')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              spaceFilter === 'student'
                ? 'bg-primary text-primary-foreground shadow-2xs font-semibold'
                : 'bg-muted/40 border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/70'
            }`}
          >
            <AppIcon icon={Certificate01Icon} size={13} />
            <span>Student</span>
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {popularTags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              variant={selectedTag === tag ? 'selected' : 'filter'}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            />
          ))}

          {(selectedTag || spaceFilter !== 'all' || query) && (
            <button
              type="button"
              onClick={() => {
                setSelectedTag(null)
                setSpaceFilter('all')
                setQuery('')
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline pl-2"
            >
              Reset all
            </button>
          )}
        </div>
      </div>

      {/* Results List / Grid */}
      <div className="pt-4">
        <DocumentGrid
          documents={documents}
          viewMode="grid"
          onSelect={(id) => navigate(`/app/documents/${id}`)}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isFiltered={Boolean(query || selectedTag || spaceFilter !== 'all')}
          onClearFilters={() => {
            setQuery('')
            setSelectedTag(null)
            setSpaceFilter('all')
          }}
        />
      </div>
    </PageShell>
  )
}
