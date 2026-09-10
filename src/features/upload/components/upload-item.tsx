import { Cancel01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { DocumentTypeIcon } from '../../documents/components/document-type-icon'
import { AppIcon } from '../../../components/icons/app-icon'
import type { DocumentFileType } from '../../../types/document'

export interface UploadQueueItem {
  id: string
  file: File
  progress: number
  status: 'queued' | 'uploading' | 'completed' | 'error'
  error?: string
}

interface UploadItemProps {
  item: UploadQueueItem
  onRemove: (id: string) => void
}

function detectType(filename: string, mime: string): DocumentFileType {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  if (mime.includes('pdf') || ext === 'pdf') return 'pdf'
  if (mime.includes('image') || ['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'image'
  if (['zip', 'tar', 'gz'].includes(ext)) return 'zip'
  if (['doc', 'docx'].includes(ext)) return 'doc'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'sheet'
  return 'other'
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadItem({ item, onRemove }: UploadItemProps) {
  const fileType = detectType(item.file.name, item.file.type)

  return (
    <div className="flex flex-col p-3 rounded-xl border border-border bg-surface-muted/40 gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <DocumentTypeIcon type={fileType} size={16} showBadge={false} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground truncate" title={item.file.name}>
              {item.file.name}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">
              {formatSize(item.file.size)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.status === 'completed' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <AppIcon icon={Tick02Icon} size={11} />
              100%
            </span>
          )}

          {item.status === 'uploading' && (
            <span className="text-[11px] font-mono font-medium text-primary">
              {item.progress}%
            </span>
          )}

          {item.status === 'queued' && (
            <span className="text-[10px] font-medium text-muted-foreground bg-surface-muted px-1.5 py-0.5 rounded border border-border">
              Queued
            </span>
          )}

          {item.status !== 'uploading' && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label="Remove file"
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <AppIcon icon={Cancel01Icon} size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {item.status === 'uploading' && (
        <div className="w-full bg-surface-muted rounded-full h-1 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-150 rounded-full"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
