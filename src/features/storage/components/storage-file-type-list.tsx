import { AppIcon } from '@/components/icons/app-icon'
import { formatBytes } from '@/lib/files/format-bytes'
import { FILE_TYPE_CONFIG } from '@/lib/files/file-type'
import { StorageFileTypeChart } from './storage-file-type-chart'
import type { StorageFileTypeItem } from '../storage.types'

interface StorageFileTypeListProps {
  fileTypes: StorageFileTypeItem[]
  totalBytes: number
}

export function StorageFileTypeList({ fileTypes, totalBytes }: StorageFileTypeListProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-5">
      <div className="space-y-1">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          Composition
        </div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          File Type Breakdown
        </h3>
        <p className="text-xs text-muted-foreground">
          Distribution of stored storage grouped by file format.
        </p>
      </div>

      {/* Horizontal Bar Chart (Section 22 & 23) */}
      <div className="pt-1">
        <StorageFileTypeChart fileTypes={fileTypes} totalBytes={totalBytes} />
      </div>

      {/* Accessible Textual Table (Section 24) */}
      <div className="space-y-1.5 border-t border-border/60 pt-4">
        {fileTypes.map((item) => {
          const config = FILE_TYPE_CONFIG[item.key]
          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/30 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-lg bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground shrink-0">
                  <AppIcon icon={config.icon} size={14} />
                </div>
                <div className="min-w-0 truncate">
                  <span className="font-medium text-foreground truncate block">
                    {config.label}
                  </span>
                  <span className="text-[10.5px] font-mono text-muted-foreground">
                    {item.count} {item.count === 1 ? 'file' : 'files'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-right">
                <span className="font-semibold text-foreground">
                  {formatBytes(item.bytes)}
                </span>
                <span className="text-muted-foreground w-10 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
