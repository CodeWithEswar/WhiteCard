import { useState, useMemo } from 'react'
import type { VaultDocument } from '@/types/document'
import { useArchivePreview } from '@/features/documents/hooks/use-archive-preview'
import { useArchiveNavigation } from '@/features/documents/hooks/use-archive-navigation'
import { useArchiveSearch } from '@/features/documents/hooks/use-archive-search'
import { getChildrenAtDirectory, type ArchiveTreeNode } from '@/features/documents/lib/archive-tree'
import { ArchiveHeader } from './archive-header'
import { ArchiveToolbar } from './archive-toolbar'
import { ArchiveFolderTree } from './archive-folder-tree'
import { ArchiveFileList } from './archive-file-list'
import { ArchiveFilePreviewRouter } from './archive-file-preview-router'
import { ArchiveSummary } from './archive-summary'
import { ArchiveLoading } from './archive-loading'
import { ArchiveError } from './archive-error'
import { ArchiveTooLargeState } from './archive-too-large-state'
import { useIsMobile } from '@/hooks/use-mobile'

export interface ArchivePreviewProps {
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
  const isMobile = useIsMobile()
  const [isTreeOpen, setIsTreeOpen] = useState(false)

  // 1. Parse archive buffer
  const { parsedArchive, isParsing, errorKind, readmeContent } = useArchivePreview(
    arrayBuffer,
    isLoading,
    onFetchContent
  )

  // 2. Navigation state
  const {
    currentPath,
    activeEntry,
    isAtRoot,
    breadcrumbs,
    navigateTo,
    navigateUp,
    openFile,
    closeFile,
  } = useArchiveNavigation(doc.originalFilename)

  // 3. Search state
  const {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    results: searchResults,
    isSearching,
    clearSearch,
  } = useArchiveSearch(parsedArchive?.flatEntries || [])

  // 4. Entries at current directory
  const currentEntries: ArchiveTreeNode[] = useMemo(() => {
    if (!parsedArchive) return []
    return getChildrenAtDirectory(parsedArchive.rootTree, currentPath)
  }, [parsedArchive, currentPath])

  // Convert search results into ArchiveTreeNodes if search is active
  const searchEntries: ArchiveTreeNode[] = useMemo(() => {
    if (!isSearching || !parsedArchive) return []
    return searchResults.map((res) => ({
      name: res.name,
      path: res.path,
      dir: res.dir,
      size: res.size,
      formattedSize: res.dir ? '-' : `${(res.size / 1024).toFixed(1)} KB`,
      children: [],
      directFileCount: 0,
      directDirCount: 0,
    }))
  }, [isSearching, searchResults, parsedArchive])

  // Loading state
  if (isParsing) {
    return <ArchiveLoading />
  }

  // Safety limits / Zip bomb state
  if (
    errorKind === 'TOO_LARGE' ||
    errorKind === 'TOO_MANY_ENTRIES' ||
    errorKind === 'SUSPICIOUS_COMPRESSION_RATIO'
  ) {
    return <ArchiveTooLargeState onDownloadOriginal={onDownload} />
  }

  // Error state
  if (errorKind || !parsedArchive) {
    return (
      <ArchiveError
        errorKind={errorKind || 'UNKNOWN'}
        onRetry={onFetchContent}
        onDownloadOriginal={onDownload}
      />
    )
  }

  const handleSelectNode = (node: ArchiveTreeNode) => {
    if (node.dir) {
      navigateTo(node.path)
      clearSearch()
    } else {
      openFile(node)
      clearSearch()
    }
  }

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-surface overflow-hidden select-none">
      {/* 1. Repository-like Header */}
      <ArchiveHeader
        archiveName={doc.originalFilename}
        totalFiles={parsedArchive.totalFiles}
        totalDirs={parsedArchive.totalDirs}
        uncompressedSize={parsedArchive.formattedTotalSize}
        compressedSize={doc.sizeFormatted}
        onDownloadOriginal={onDownload}
      />

      {/* 2. Control Toolbar (Breadcrumbs + Files Tree Toggle + Search) */}
      <ArchiveToolbar
        breadcrumbs={breadcrumbs}
        onNavigateBreadcrumb={(path) => {
          navigateTo(path)
          clearSearch()
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={clearSearch}
        searchMatchCount={searchEntries.length}
        isTreeOpen={isTreeOpen}
        onToggleTree={() => setIsTreeOpen((prev) => !prev)}
      />

      {/* 3. Main Repository Workspace Body */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Collapsible Folder Tree Rail / Mobile Sheet */}
        <ArchiveFolderTree
          rootTree={parsedArchive.rootTree}
          currentPath={currentPath}
          onSelectDirectory={(path) => {
            navigateTo(path)
            clearSearch()
          }}
          isOpen={isTreeOpen}
          onClose={() => setIsTreeOpen(false)}
          isMobile={isMobile}
        />

        {/* Content Viewer / File Browser */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {activeEntry ? (
            /* File Content Preview View */
            <ArchiveFilePreviewRouter
              zip={parsedArchive.zipInstance}
              node={activeEntry}
              onBackToDirectory={closeFile}
            />
          ) : isSearching ? (
            /* Search Results Listing */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 bg-surface-muted/30 border-b border-border/60 text-xs font-mono text-muted-foreground">
                Found {searchEntries.length} results for “{debouncedQuery}”
              </div>
              <ArchiveFileList
                entries={searchEntries}
                isRoot={false}
                onSelectNode={handleSelectNode}
                onNavigateUp={() => clearSearch()}
              />
            </div>
          ) : (
            /* Standard Directory File Browser */
            <div className="flex-1 flex flex-col overflow-y-auto">
              <ArchiveFileList
                entries={currentEntries}
                isRoot={isAtRoot}
                onSelectNode={handleSelectNode}
                onNavigateUp={navigateUp}
              />

              {/* Root Summary & README */}
              {isAtRoot && (
                <div className="px-4">
                  <ArchiveSummary
                    rootTree={parsedArchive.rootTree}
                    readmeContent={readmeContent}
                    readmePath={parsedArchive.rootReadmePath}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
