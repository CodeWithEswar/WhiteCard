import type { DocumentFilterOptions, DocumentFileType, DocumentSpace } from '../../../types/document'
import { TagSelector } from '../../tags/components/tag-selector'
import { Button } from '../../../components/ui/button'

interface DocumentFiltersProps {
  filters: DocumentFilterOptions
  onChange: (newFilters: DocumentFilterOptions) => void
  onReset: () => void
  showSpaceFilter?: boolean
  className?: string
  onApply?: () => void
}

const FILE_TYPES: { id: DocumentFileType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Files' },
  { id: 'pdf', label: 'PDFs' },
  { id: 'image', label: 'Images' },
  { id: 'zip', label: 'Archives (ZIP)' },
  { id: 'doc', label: 'Documents' },
  { id: 'sheet', label: 'Spreadsheets' },
]

export function DocumentFilters({
  filters,
  onChange,
  onReset,
  showSpaceFilter = true,
  className = '',
  onApply,
}: DocumentFiltersProps) {
  const handleSpaceChange = (space: DocumentSpace | 'all') => {
    onChange({ ...filters, space })
  }

  const handleFileTypeChange = (fileType: DocumentFileType | 'all') => {
    onChange({ ...filters, fileType })
  }

  const handleTagsChange = (tags: string[]) => {
    onChange({ ...filters, tags })
  }

  const hasActiveFilters =
    (filters.fileType && filters.fileType !== 'all') ||
    (filters.tags && filters.tags.length > 0) ||
    (showSpaceFilter && filters.space && filters.space !== 'all')

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Space Filter (optional if already on dedicated space page) */}
      {showSpaceFilter && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Vault Space
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Spaces' },
              { id: 'government', label: 'Government Documents' },
              { id: 'student', label: 'Student Certificates' },
            ].map((s) => {
              const active = (filters.space || 'all') === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSpaceChange(s.id as DocumentSpace | 'all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-border-strong'
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* File Format Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          File Format
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FILE_TYPES.map((ft) => {
            const active = (filters.fileType || 'all') === ft.id
            return (
              <button
                key={ft.id}
                type="button"
                onClick={() => handleFileTypeChange(ft.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-border-strong'
                }`}
              >
                {ft.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Tags Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Filter by Tags
        </label>
        <TagSelector
          selectedTags={filters.tags || []}
          onChange={handleTagsChange}
          allowMultiple={true}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <Button
          variant="ghost"
          size="sm"
          disabled={!hasActiveFilters}
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-foreground h-9 px-3 rounded-xl"
        >
          Reset Filters
        </Button>

        {onApply && (
          <Button
            size="sm"
            onClick={onApply}
            className="text-xs h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  )
}
