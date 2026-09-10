import {
  Upload01Icon,
  Pdf01Icon,
  Image01Icon,
  ZipIcon,
  Doc01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

interface StorageEmptyStateProps {
  onUploadClick: () => void
}

export function StorageEmptyState({ onUploadClick }: StorageEmptyStateProps) {
  const formats = [
    { icon: Pdf01Icon, label: 'PDF Documents' },
    { icon: Image01Icon, label: 'Photos & Scans' },
    { icon: ZipIcon, label: 'ZIP Archives' },
    { icon: Doc01Icon, label: 'Word & Text' },
  ]

  return (
    <div className="space-y-6">
      {/* Empty Hero */}
      <div className="rounded-3xl border border-dashed border-border/90 bg-card/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto shadow-xs">
        <div className="size-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
          <AppIcon icon={Upload01Icon} size={26} />
        </div>

        <div className="space-y-1.5 max-w-md">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Storage starts with your first document
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Upload a government identity document or student certificate to begin building your encrypted White Card vault.
          </p>
        </div>

        <Button
          onClick={onUploadClick}
          className="gap-2 h-9.5 px-5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs mt-2 cursor-pointer"
        >
          <AppIcon icon={Upload01Icon} size={15} />
          <span>Upload Document</span>
        </Button>
      </div>

      {/* Supported Formats Info Strip */}
      <div className="p-5 rounded-2xl border border-border/70 bg-card max-w-2xl mx-auto">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground text-center mb-3">
          Supported Document Categories
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {formats.map((f) => (
            <div
              key={f.label}
              className="p-3 rounded-xl bg-muted/20 border border-border/50 flex flex-col items-center justify-center gap-1.5"
            >
              <AppIcon icon={f.icon} size={18} className="text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
