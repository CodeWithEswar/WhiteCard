import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Passport01Icon,
  Certificate01Icon,
  Edit01Icon,
  Download01Icon,
  Link01Icon,
  Calendar03Icon,
  ArrowLeft02Icon,
  CheckmarkCircle01Icon,
  Note01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { DocumentMetadataGroup, DocumentMetadataRow } from '../metadata/document-metadata-group'
import { DocumentFileInformation } from '../metadata/document-file-information'
import { DocumentTagList } from '../metadata/document-tag-list'
import { DocumentSharingStatus } from '../metadata/document-sharing-status'
import { DocumentDangerZone } from '../metadata/document-danger-zone'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  GOVERNMENT_CATEGORIES,
  STUDENT_CATEGORIES,
} from '@/features/upload/upload.constants'
import type { VaultDocument } from '@/types/document'

interface DocumentDetailsContentProps {
  document: VaultDocument
  isEditing: boolean
  onToggleEdit: (isEditing: boolean) => void
  onSaveUpdates: (updates: {
    title: string
    category: string
    notes: string
    expiryDate: string | null
  }) => Promise<void>
  onOpenShare: () => void
  onDownload?: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function DocumentDetailsContent({
  document: doc,
  isEditing,
  onToggleEdit,
  onSaveUpdates,
  onOpenShare,
  onDownload,
  onDelete,
  isDeleting,
}: DocumentDetailsContentProps) {
  const isGov = doc.space === 'government'

  // Edit state
  const [editTitle, setEditTitle] = useState(doc.title)
  const [editCategory, setEditCategory] = useState(doc.category)
  const [editNotes, setEditNotes] = useState(doc.notes || '')
  const [editExpiry, setEditExpiry] = useState(
    doc.expiryDate ? new Date(doc.expiryDate).toISOString().split('T')[0] : ''
  )
  const [isSaving, setIsSaving] = useState(false)

  const categories = useMemo(() => {
    const baseList = doc.space === 'student' ? STUDENT_CATEGORIES : GOVERNMENT_CATEGORIES
    const all = [...baseList]
    if (editCategory && !all.includes(editCategory as any)) {
      return [editCategory, ...all]
    }
    return all
  }, [doc.space, editCategory])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTitle.trim()) return
    setIsSaving(true)
    try {
      await onSaveUpdates({
        title: editTitle.trim(),
        category: editCategory,
        notes: editNotes.trim(),
        expiryDate: editExpiry ? new Date(editExpiry).toISOString() : null,
      })
      onToggleEdit(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto px-5 py-6 space-y-6 text-left">
      <AnimatePresence mode="wait">
        {isEditing ? (
          /* IN-SHEET EDIT MODE (Prompt #67 & #68) */
          <motion.form
            key="edit-mode"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleSave}
            className="space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <button
                type="button"
                onClick={() => onToggleEdit(false)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                <AppIcon icon={ArrowLeft02Icon} size={14} />
                <span>Back to Details</span>
              </button>
              <span className="text-xs font-semibold text-foreground">Edit Metadata</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Document Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Category</label>
                <Select value={editCategory} onValueChange={(val) => val && setEditCategory(val)}>
                  <SelectTrigger className="w-full h-9 rounded-xl border-border bg-card text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isGov && (
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Expiration Date</label>
                  <DatePicker
                    value={editExpiry}
                    onChange={setEditExpiry}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Private Notes / Memo</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  placeholder="Personal references, application notes, renewal instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onToggleEdit(false)}
                className="flex-1 h-9 rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || !editTitle.trim()}
                className="flex-1 h-9 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
              >
                <AppIcon icon={CheckmarkCircle01Icon} size={14} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </motion.form>
        ) : (
          /* STANDARD DETAILS INSPECTION MODE */
          <motion.div
            key="details-mode"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            {/* Identity Summary Header (Prompt #14) */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-border/60">
              <div className="size-12 rounded-2xl bg-muted border border-border/80 flex items-center justify-center text-foreground shrink-0 shadow-2xs">
                <AppIcon icon={isGov ? Passport01Icon : Certificate01Icon} size={22} />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-muted/60 text-muted-foreground border border-border/60">
                    {doc.space}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {doc.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground tracking-tight truncate" title={doc.title}>
                  {doc.title}
                </h3>
                <p className="text-[11px] text-muted-foreground font-mono truncate">
                  {doc.fileType.toUpperCase()} • {doc.sizeFormatted}
                </p>
              </div>
            </div>

            {/* OVERVIEW SECTION */}
            <DocumentMetadataGroup title="Vault Overview">
              <DocumentMetadataRow
                label="Space"
                value={<span className="capitalize">{doc.space}</span>}
                icon={<AppIcon icon={isGov ? Passport01Icon : Certificate01Icon} size={14} />}
              />
              <DocumentMetadataRow
                label="Category"
                value={doc.category}
              />
              <div className="p-3 space-y-1.5 text-left">
                <span className="text-xs text-muted-foreground font-medium block">
                  Tags ({doc.tags.length})
                </span>
                <DocumentTagList tags={doc.tags} />
              </div>
            </DocumentMetadataGroup>

            {/* DATES SECTION */}
            {doc.expiryDate && (
              <DocumentMetadataGroup title="Document Dates & Validity">
                <DocumentMetadataRow
                  label="Expires On"
                  value={
                    <span>
                      {new Date(doc.expiryDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  }
                  icon={<AppIcon icon={Calendar03Icon} size={14} />}
                  hint={
                    new Date(doc.expiryDate) < new Date()
                      ? 'Expired'
                      : `${Math.ceil((new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining`
                  }
                />
              </DocumentMetadataGroup>
            )}

            {/* SHARING SECTION */}
            <DocumentSharingStatus
              document={doc}
              onOpenShareDialog={onOpenShare}
            />

            {/* FILE DETAILS SECTION */}
            <DocumentFileInformation document={doc} />

            {/* PRIVATE NOTES SECTION */}
            {doc.notes && (
              <DocumentMetadataGroup title="Private Notes">
                <div className="p-3.5 text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                  <div className="flex items-center gap-1 text-foreground font-semibold mb-1">
                    <AppIcon icon={Note01Icon} size={13} />
                    <span>Memo</span>
                  </div>
                  {doc.notes}
                </div>
              </DocumentMetadataGroup>
            )}

            {/* PRIMARY ACTIONS GROUP */}
            <div className="space-y-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onToggleEdit(true)}
                className="w-full h-9 rounded-xl text-xs font-medium gap-1.5 border-border/80 hover:bg-muted text-foreground"
              >
                <AppIcon icon={Edit01Icon} size={14} />
                <span>Edit Document Details</span>
              </Button>

              <div className="grid grid-cols-2 gap-2">
                {onDownload && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onDownload}
                    className="h-9 rounded-xl text-xs font-medium gap-1.5 border-border/80"
                  >
                    <AppIcon icon={Download01Icon} size={14} />
                    <span>Download</span>
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={onOpenShare}
                  className="h-9 rounded-xl text-xs font-medium gap-1.5 border-border/80"
                >
                  <AppIcon icon={Link01Icon} size={14} />
                  <span>Share Link</span>
                </Button>
              </div>
            </div>

            {/* DANGER ZONE (Delete Document) */}
            <DocumentDangerZone
              document={doc}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
