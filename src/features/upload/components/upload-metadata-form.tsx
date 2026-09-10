import { useState } from 'react'
import {
  Passport01Icon,
  Certificate01Icon,
  Tag01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { TagChip } from '@/features/tags/components/tag-chip'
import {
  GOVERNMENT_CATEGORIES,
  STUDENT_CATEGORIES,
} from '../upload.constants'
import type { UploadItemMetadata } from '../upload.types'
import type { DocumentSpace } from '@/types/document'

interface UploadMetadataFormProps {
  metadata: UploadItemMetadata
  originalFilename: string
  onChange: (updates: Partial<UploadItemMetadata>) => void
  disabled?: boolean
}

const COMMON_TAGS: Record<DocumentSpace, string[]> = {
  government: ['Identity', 'Official', 'Vehicle', 'Travel', 'Tax', 'Insurance'],
  student: ['Degree', 'Academic', 'University', 'Marksheet', 'Certificate', 'Transcript'],
}

export function UploadMetadataForm({
  metadata,
  originalFilename,
  onChange,
  disabled = false,
}: UploadMetadataFormProps) {
  const [customTagInput, setCustomTagInput] = useState('')

  const isGov = metadata.space === 'government'
  const categories = isGov ? GOVERNMENT_CATEGORIES : STUDENT_CATEGORIES
  const commonTags = COMMON_TAGS[metadata.space]

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || metadata.tags.includes(trimmed)) return
    onChange({ tags: [...metadata.tags, trimmed] })
    setCustomTagInput('')
  }

  const handleRemoveTag = (tag: string) => {
    onChange({ tags: metadata.tags.filter((t) => t !== tag) })
  }

  const handleSpaceChange = (space: DocumentSpace) => {
    const newCategory = space === 'government' ? 'Identity' : 'Degree'
    onChange({ space, category: newCategory })
  }

  return (
    <div className="space-y-4 text-xs">
      {/* Space Selector: Government vs Student */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Vault Space
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSpaceChange('government')}
            disabled={disabled}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              isGov
                ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs ring-1 ring-primary/30'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <div className={`size-7 rounded-lg border flex items-center justify-center ${isGov ? 'border-primary/40 bg-primary/20 text-foreground' : 'border-border bg-muted'}`}>
              <AppIcon icon={Passport01Icon} size={15} />
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight">Government</p>
              <p className="text-[10.5px] text-muted-foreground font-normal">IDs & official files</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSpaceChange('student')}
            disabled={disabled}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              !isGov
                ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs ring-1 ring-primary/30'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <div className={`size-7 rounded-lg border flex items-center justify-center ${!isGov ? 'border-primary/40 bg-primary/20 text-foreground' : 'border-border bg-muted'}`}>
              <AppIcon icon={Certificate01Icon} size={15} />
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight">Student</p>
              <p className="text-[10.5px] text-muted-foreground font-normal">Degrees & transcripts</p>
            </div>
          </button>
        </div>
      </div>

      {/* Title & Category: 2-column on desktop, 1-column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Display Title
          </label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Document title"
            disabled={disabled}
            className="w-full h-9 px-3 rounded-xl border border-border bg-card text-foreground text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring transition-all placeholder:text-muted-foreground/60"
          />
          <p className="text-[10.5px] text-muted-foreground truncate" title={originalFilename}>
            File: {originalFilename}
          </p>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Category
          </label>
          <select
            value={metadata.category}
            onChange={(e) => onChange({ category: e.target.value })}
            disabled={disabled}
            className="w-full h-9 px-3 rounded-xl border border-border bg-card text-foreground text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring transition-all"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Issued & Expiry Dates: 2-column on desktop, 1-column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Issue Date <span className="font-normal lowercase text-muted-foreground/80">(optional)</span>
          </label>
          <input
            type="date"
            value={metadata.issuedDate || ''}
            onChange={(e) => onChange({ issuedDate: e.target.value })}
            disabled={disabled}
            className="w-full h-9 px-3 rounded-xl border border-border bg-card text-foreground text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Expiry Date {isGov && <span className="text-amber-600 dark:text-amber-400 font-semibold">• renewal</span>}</span>
            <span className="font-normal lowercase text-muted-foreground/80">(optional)</span>
          </label>
          <input
            type="date"
            value={metadata.expiryDate || ''}
            onChange={(e) => onChange({ expiryDate: e.target.value })}
            disabled={disabled}
            className={`w-full h-9 px-3 rounded-xl border text-foreground text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring transition-all bg-card ${
              isGov && metadata.expiryDate ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-border'
            }`}
          />
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <AppIcon icon={Tag01Icon} size={13} />
            <span>Document Tags</span>
          </label>
          <span className="text-[10.5px] text-muted-foreground">{metadata.tags.length} selected</span>
        </div>

        {/* Selected Tags list */}
        {metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-muted/20 border border-border/70 min-h-8">
            {metadata.tags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                variant="default"
                removable={!disabled}
                onRemove={() => handleRemoveTag(tag)}
              />
            ))}
          </div>
        )}

        {/* Suggested Quick Tags & Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddTag(customTagInput)
              }
            }}
            placeholder="Add a tag and press Enter"
            disabled={disabled}
            className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/60"
          />
          <button
            type="button"
            onClick={() => handleAddTag(customTagInput)}
            disabled={!customTagInput.trim() || disabled}
            className="h-8 px-3 rounded-lg border border-border bg-muted hover:bg-muted/80 font-medium text-xs text-foreground disabled:opacity-40 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-muted-foreground mr-1">Suggestions:</span>
          {commonTags
            .filter((t) => !metadata.tags.includes(t))
            .slice(0, 5)
            .map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleAddTag(t)}
                disabled={disabled}
                className="px-2 py-0.5 rounded-md border border-border/70 bg-card hover:bg-muted text-[10.5px] text-muted-foreground hover:text-foreground transition-colors"
              >
                + {t}
              </button>
            ))}
        </div>
      </div>

      {/* Notes Field */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Private Notes <span className="font-normal lowercase text-muted-foreground/80">(optional)</span>
        </label>
        <textarea
          value={metadata.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Add any reference notes, policy numbers, or personal reminders..."
          disabled={disabled}
          rows={2}
          className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring transition-all resize-none placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  )
}
