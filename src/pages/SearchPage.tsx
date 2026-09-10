import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search01Icon,
  Cancel01Icon,
  Passport01Icon,
  Certificate01Icon,
} from '@hugeicons/core-free-icons'
import { PageContainer } from '../components/layout/page-container'
import { TagChip } from '../features/tags/components/tag-chip'
import { DocumentGrid } from '../features/documents/components/document-grid'
import { AppIcon } from '../components/icons/app-icon'
import {
  useDocuments,
  useDeleteDocument,
} from '../features/documents/hooks/use-documents'
import type { VaultDocument } from '../types/document'

export function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [spaceFilter, setSpaceFilter] = useState<'all' | 'government' | 'student'>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  const deleteMutation = useDeleteDocument()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const { data: documents = [] } = useDocuments({
    search: query,
    space: spaceFilter,
    tags: selectedTag ? [selectedTag] : undefined,
  })

  const popularTags = [
    'Identity',
    'Education',
    'Travel',
    'Vehicle',
    'Renewal',
    'Personal',
  ]

  const handleDelete = (doc: VaultDocument) => {
    if (confirm(`Remove "${doc.title}"?`)) {
      deleteMutation.mutate(doc.id)
    }
  }

  const handleDownload = (doc: VaultDocument) => {
    if (doc.fileUrl && doc.fileUrl !== '#') {
      const a = document.createElement('a')
      a.href = doc.fileUrl
      a.download = doc.originalFilename
      a.click()
    }
  }

  return (
    <PageContainer maxWidth="normal" className="space-y-6">
      {/* Sticky Top Search Header */}
      <div className="space-y-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Vault Search
        </h1>
        <p className="text-xs text-muted-foreground">
          Locate documents across Government and Student spaces instantaneously.
        </p>

        {/* Large Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
            <AppIcon icon={Search01Icon} size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, original filename, category, or notes..."
            className="w-full h-12 pl-11 pr-10 rounded-2xl bg-surface border border-border focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none text-sm text-foreground placeholder:text-muted-foreground/60 shadow-xs transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <AppIcon icon={Cancel01Icon} size={16} />
            </button>
          )}
        </div>

        {/* Filter Chips: Spaces & Popular Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSpaceFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              spaceFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            All Spaces
          </button>
          <button
            type="button"
            onClick={() => setSpaceFilter('government')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              spaceFilter === 'government'
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <AppIcon icon={Passport01Icon} size={13} />
            <span>Government</span>
          </button>
          <button
            type="button"
            onClick={() => setSpaceFilter('student')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              spaceFilter === 'student'
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <AppIcon icon={Certificate01Icon} size={13} />
            <span>Student</span>
          </button>

          <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

          {popularTags.map((tag) => {
            const isSelected = selectedTag === tag
            return (
              <TagChip
                key={tag}
                label={tag}
                variant={isSelected ? 'selected' : 'filter'}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
              />
            )
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 pt-2 border-t border-border/50">
        <span className="text-xs font-mono font-medium text-muted-foreground">
          {documents.length} document{documents.length === 1 ? '' : 's'} found
        </span>
        {(query || selectedTag || spaceFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setSelectedTag(null)
              setSpaceFilter('all')
            }}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results List / Grid */}
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
    </PageContainer>
  )
}
