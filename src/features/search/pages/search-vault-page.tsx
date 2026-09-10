import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AppThemeBackground } from '@/components/backgrounds/app-theme-background'
import { SearchVaultHeader } from '../components/search-vault-header'
import { SearchRail } from '../components/search-rail'
import { SearchFilterBar } from '../components/search-filter-bar'
import { SearchFilterSheet } from '../components/search-filter-sheet'
import { SearchActiveFilters } from '../components/search-active-filters'
import { SearchSortControl } from '../components/search-sort-control'
import { SearchViewSwitcher } from '../components/search-view-switcher'
import { SearchResultsHeader } from '../components/search-results-header'
import { SearchResultsGrid } from '../components/search-results-grid'
import { SearchResultsList } from '../components/search-results-list'
import { SearchEmptyState } from '../components/search-empty-state'
import { SearchNoResults } from '../components/search-no-results'
import { SearchErrorState } from '../components/search-error-state'
import { SearchSkeleton } from '../components/search-skeleton'
import { UploadDialog } from '@/features/upload/components/upload-dialog'
import { ShareDialog } from '@/features/sharing/components/share-dialog'
import { useSearchParamsState } from '../hooks/use-search-params-state'
import { useDocumentSearch } from '../hooks/use-document-search'
import { useSearchKeyboard } from '../hooks/use-search-keyboard'
import { fetchAvailableUserTags } from '../search.api'
import { getActiveFilterCount } from '../search.utils'
import { useAuth } from '@/features/auth/auth-provider'
import {
  useDeleteDocument,
  useDocumentDownload,
} from '@/features/documents/hooks/use-documents'
import type { SearchDocumentResult } from '../search.types'
import type { VaultDocument } from '@/types/document'
import { Button } from '@/components/ui/button'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'

export function SearchVaultPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const userId = user?.id || 'anon'
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 1. Search State synchronized with URL
  const {
    state,
    setQuery,
    setSpace,
    setCategory,
    setFileType,
    toggleTag,
    setDatePreset,
    setExpires,
    setSort,
    setView,
    setPage,
    clearAllFilters,
  } = useSearchParamsState()

  // 2. Global shortcut listener (/ and Cmd+K)
  useSearchKeyboard(searchInputRef)

  // 3. Available user tags query
  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags', userId, 'search-options'],
    queryFn: () => fetchAvailableUserTags(userId),
    staleTime: 60 * 1000,
  })

  // 4. TanStack Query document search with debouncing
  const {
    documents,
    totalCount,
    totalPages,
    currentPage,
    isSearching,
    isLoading,
    isError,
    refetch,
    debouncedQuery,
  } = useDocumentSearch(state)

  // 5. Document actions (delete, download, share, upload)
  const deleteMutation = useDeleteDocument()
  const { download } = useDocumentDownload()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [shareDoc, setShareDoc] = useState<VaultDocument | null>(null)
  const [shareOpen, setShareOpen] = useState(false)

  const handleSelectDocument = (id: string) => {
    navigate(`/app/document/${id}`)
  }

  const handleShare = (doc: SearchDocumentResult) => {
    // Convert SearchDocumentResult to VaultDocument shape for ShareDialog
    const vaultDoc: VaultDocument = {
      id: doc.id,
      title: doc.title,
      originalFilename: doc.originalFilename,
      fileType: doc.fileType,
      mimeType: doc.mimeType,
      space: doc.space,
      category: doc.category || '',
      sizeBytes: doc.sizeBytes,
      sizeFormatted: doc.sizeFormatted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      expiryDate: doc.expiresOn,
      tags: doc.tags,
      notes: doc.notes,
    }
    setShareDoc(vaultDoc)
    setShareOpen(true)
  }

  const handleDownload = (doc: SearchDocumentResult) => {
    const vaultDoc: VaultDocument = {
      id: doc.id,
      title: doc.title,
      originalFilename: doc.originalFilename,
      fileType: doc.fileType,
      mimeType: doc.mimeType,
      space: doc.space,
      category: doc.category || '',
      sizeBytes: doc.sizeBytes,
      sizeFormatted: doc.sizeFormatted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      expiryDate: doc.expiresOn,
      tags: doc.tags,
      notes: doc.notes,
    }
    download(vaultDoc)
  }

  const handleDelete = (doc: SearchDocumentResult) => {
    if (window.confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      deleteMutation.mutate(doc.id)
    }
  }

  // Active filter count and boolean checks
  const activeFilterCount = getActiveFilterCount(state)
  const hasNarrowingFilters = activeFilterCount > 0
  const isEntireVaultEmpty =
    !state.q && state.space === 'all' && !hasNarrowingFilters && totalCount === 0 && !isLoading

  return (
    <div className="relative min-h-screen text-foreground">
      {/* Background System */}
      <AppThemeBackground variant="app" />

      {/* Top subtle localized theme glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-56 opacity-50 dark:opacity-30 blur-3xl -z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--theme-glow-soft) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-32 sm:pb-20">
        {/* 1. Page Header */}
        <SearchVaultHeader onOpenUpload={() => setUploadOpen(true)} />

        {/* 2. Unified Search Rail (Command Bar + Scope Switcher) */}
        <div className="pt-1 pb-2">
          <SearchRail
            query={state.q}
            onQueryChange={setQuery}
            scope={state.space}
            onScopeChange={setSpace}
            inputRef={searchInputRef}
            isSearching={isSearching}
          />
        </div>

        {/* 3. Desktop Filter Toolbar */}
        <SearchFilterBar
          state={state}
          availableTags={availableTags}
          onCategoryChange={setCategory}
          onFileTypeChange={setFileType}
          onToggleTag={toggleTag}
          onDatePresetChange={setDatePreset}
          onExpiryChange={setExpires}
          onSortChange={setSort}
          onViewChange={setView}
        />

        {/* 4. Mobile Controls Row (Filter Sheet Trigger, Sort, View Switcher) */}
        <div className="flex md:hidden items-center justify-between gap-2 pt-2.5 pb-1">
          <SearchFilterSheet
            state={state}
            availableTags={availableTags}
            totalResultsCount={totalCount}
            onApplyFilters={(draft) => {
              if (draft.space !== undefined) setSpace(draft.space)
              if (draft.category !== undefined) setCategory(draft.category)
              if (draft.fileType !== undefined) setFileType(draft.fileType)
              if (draft.datePreset !== undefined) setDatePreset(draft.datePreset)
              if (draft.expires !== undefined) setExpires(draft.expires)
              if (draft.sort !== undefined) setSort(draft.sort)
              if (draft.tags !== undefined) {
                // Apply difference
                draft.tags.forEach((t) => {
                  if (!state.tags.includes(t)) toggleTag(t)
                })
                state.tags.forEach((t) => {
                  if (!draft.tags?.includes(t)) toggleTag(t)
                })
              }
            }}
            onResetFilters={clearAllFilters}
          />

          <div className="flex items-center gap-1.5">
            <SearchSortControl value={state.sort} onChange={setSort} compact />
            <SearchViewSwitcher view={state.view} onChange={setView} />
          </div>
        </div>

        {/* 5. Active Filter Tokens Strip */}
        <SearchActiveFilters
          state={state}
          onRemoveSpace={() => setSpace('all')}
          onRemoveCategory={() => setCategory(undefined)}
          onRemoveFileType={() => setFileType(undefined)}
          onRemoveTag={(t) => toggleTag(t)}
          onRemoveDate={() => setDatePreset('all')}
          onRemoveExpiry={() => setExpires('all')}
          onClearAll={clearAllFilters}
        />

        {/* 6. Results Summary Header */}
        <SearchResultsHeader
          totalCount={totalCount}
          query={debouncedQuery}
          space={state.space}
          category={state.category}
          tag={state.tags[0]}
          isSearching={isSearching}
        />

        {/* 7. Results Content Area */}
        <div className="pt-4">
          {isLoading && documents.length === 0 ? (
            <SearchSkeleton viewMode={state.view} count={12} />
          ) : isError && documents.length === 0 ? (
            <SearchErrorState onRetry={() => refetch()} />
          ) : isEntireVaultEmpty ? (
            <SearchEmptyState onOpenUpload={() => setUploadOpen(true)} />
          ) : totalCount === 0 ? (
            <SearchNoResults
              query={debouncedQuery}
              hasFilters={hasNarrowingFilters}
              onClearFilters={clearAllFilters}
              onClearSearch={() => setQuery('')}
            />
          ) : (
            <div className="space-y-4">
              {isError && (
                <SearchErrorState onRetry={() => refetch()} hasCachedResults />
              )}

              {state.view === 'list' ? (
                <SearchResultsList
                  documents={documents}
                  searchQuery={debouncedQuery}
                  onSelect={handleSelectDocument}
                  onShare={handleShare}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              ) : (
                <SearchResultsGrid
                  documents={documents}
                  searchQuery={debouncedQuery}
                  onSelect={handleSelectDocument}
                  onShare={handleShare}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              )}

              {/* 8. Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-border/50 select-none">
                  <div className="text-xs text-muted-foreground">
                    Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
                    <span className="font-medium text-foreground">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setPage(Math.max(1, currentPage - 1))}
                      className="h-8 px-3 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium gap-1 disabled:opacity-40"
                    >
                      <AppIcon icon={ArrowLeft01Icon} size={14} />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                      className="h-8 px-3 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium gap-1 disabled:opacity-40"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <AppIcon icon={ArrowRight01Icon} size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        defaultSpace={state.space !== 'all' ? state.space : 'government'}
      />

      {/* Share Dialog */}
      <ShareDialog
        document={shareDoc}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </div>
  )
}
