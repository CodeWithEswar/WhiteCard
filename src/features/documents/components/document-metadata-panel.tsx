import {
  Passport01Icon,
  Certificate01Icon,
  Calendar03Icon,
  Clock01Icon,
  HardDriveIcon,
  Edit01Icon,
  Alert02Icon,
  File01Icon,
  ViewIcon,
  Download01Icon,
  Link01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { TagChip } from '@/features/tags/components/tag-chip'
import { formatBytes } from '@/lib/files/format-bytes'
import { formatDisplayDate, getExpiryStatus } from '@/features/dashboard/dashboard.utils'
import type { VaultDocument } from '@/types/document'

interface DocumentMetadataPanelProps {
  document: VaultDocument
  onEditClick: () => void
}

export function DocumentMetadataPanel({
  document: doc,
  onEditClick,
}: DocumentMetadataPanelProps) {
  const isGov = doc.space === 'government'
  const expiryStatus = getExpiryStatus(doc.expiryDate)

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-xs space-y-5 text-xs">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-foreground">
            Document Details
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Vault metadata and security record
          </p>
        </div>

        <button
          type="button"
          onClick={onEditClick}
          className="px-2.5 py-1 rounded-lg border border-border/80 bg-muted/30 hover:bg-muted font-medium text-xs text-foreground flex items-center gap-1.5 transition-colors"
        >
          <AppIcon icon={Edit01Icon} size={12} />
          <span>Edit</span>
        </button>
      </div>

      {/* Primary Key-Values */}
      <div className="space-y-3.5">
        {/* Space */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground font-medium text-[11px] uppercase tracking-wider">
            Space
          </span>
          <span className="font-semibold text-foreground flex items-center gap-1.5 capitalize">
            <AppIcon icon={isGov ? Passport01Icon : Certificate01Icon} size={14} className="text-muted-foreground" />
            {doc.space} Documents
          </span>
        </div>

        {/* Category */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground font-medium text-[11px] uppercase tracking-wider">
            Category
          </span>
          <span className="font-medium text-foreground">
            {doc.category || (isGov ? 'Government ID' : 'Academic Record')}
          </span>
        </div>

        {/* Original Filename */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground font-medium text-[11px] uppercase tracking-wider">
            Original File
          </span>
          <span
            className="font-mono text-[11px] text-foreground truncate max-w-[180px]"
            title={doc.originalFilename}
          >
            {doc.originalFilename}
          </span>
        </div>

        {/* File Size */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground font-medium text-[11px] uppercase tracking-wider">
            File Size
          </span>
          <span className="font-mono font-semibold text-foreground flex items-center gap-1">
            <AppIcon icon={HardDriveIcon} size={13} className="text-muted-foreground" />
            {formatBytes(doc.sizeBytes)}
          </span>
        </div>

        {/* Uploaded Date */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground font-medium text-[11px] uppercase tracking-wider">
            Uploaded
          </span>
          <span className="text-foreground flex items-center gap-1">
            <AppIcon icon={Clock01Icon} size={13} className="text-muted-foreground" />
            {formatDisplayDate(doc.createdAt)}
          </span>
        </div>

        {/* Expiry Date (shown only when real) */}
        {doc.expiryDate && (
          <div className="flex items-start justify-between gap-3 pt-1 border-t border-border/50">
            <span className="text-muted-foreground font-medium text-[11px] uppercase tracking-wider">
              Expiry Date
            </span>
            <div className="text-right space-y-0.5">
              <span className="font-medium text-foreground flex items-center justify-end gap-1">
                <AppIcon icon={Calendar03Icon} size={13} className="text-muted-foreground" />
                {formatDisplayDate(doc.expiryDate)}
              </span>
              {expiryStatus && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full border ${
                    expiryStatus.level === 'urgent' || expiryStatus.level === 'expired'
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200'
                      : 'border-border bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <AppIcon icon={Alert02Icon} size={10} />
                  {expiryStatus.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tags List */}
      {doc.tags && doc.tags.length > 0 && (
        <div className="pt-3 border-t border-border/60 space-y-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Tags ({doc.tags.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {doc.tags.map((tag) => (
              <TagChip key={tag} label={tag} variant="default" />
            ))}
          </div>
        </div>
      )}

      {/* Activity & Engagement Metrics */}
      <div className="pt-3 border-t border-border/60 space-y-2.5">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
          Activity & Metrics
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <AppIcon icon={ViewIcon} size={14} />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-foreground">
                {doc.viewCount ?? 0}
              </div>
              <div className="text-[10px] text-muted-foreground">Total Views</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <AppIcon icon={Download01Icon} size={14} />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-foreground">
                {doc.clickCount ?? 0}
              </div>
              <div className="text-[10px] text-muted-foreground">Downloads</div>
            </div>
          </div>
        </div>

        {doc.sharedDirectLink && (
          <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-[11px] space-y-1">
            <div className="flex items-center justify-between font-medium text-foreground">
              <span className="flex items-center gap-1">
                <AppIcon icon={Link01Icon} size={12} className="text-primary" />
                Direct Link Active
              </span>
              <span className="text-[10px] text-primary">
                Expires {new Date(doc.sharedDirectLink.expiresAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
              <span>{doc.sharedDirectLink.viewCount ?? 0} link views</span>
              <span>•</span>
              <span>{doc.sharedDirectLink.clickCount ?? 0} link downloads</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
