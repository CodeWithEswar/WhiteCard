import { motion } from 'framer-motion'
import {
  Upload01Icon,
  Pdf01Icon,
  Image01Icon,
  Zip01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'

export function UploadShowcase() {
  const queueItems = [
    {
      name: 'Passport_Scan_Color.pdf',
      size: '2.4 MB',
      progress: 100,
      status: 'completed',
      icon: Pdf01Icon,
    },
    {
      name: 'Degree_Certificate_Original.jpg',
      size: '4.8 MB',
      progress: 72,
      status: 'uploading',
      icon: Image01Icon,
    },
    {
      name: 'Academic_Transcripts_Archive.zip',
      size: '18.6 MB',
      progress: 0,
      status: 'queued',
      icon: Zip01Icon,
    },
  ]

  return (
    <section id="upload" className="py-16 sm:py-24 bg-surface-muted/30 border-y border-border/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Fast Ingestion
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Deposit files in seconds
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Drop PDFs, high-resolution scans, and multi-file archives. Progress transitions fluidly with live status.
          </p>
        </div>

        {/* Interactive-looking Upload Container */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-surface shadow-md space-y-6 text-left">
          {/* Mock Dropzone banner */}
          <div className="p-6 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center pattern-grid-micro bg-surface-muted/30">
            <div className="size-11 rounded-xl bg-surface border border-border flex items-center justify-center mb-2.5 text-foreground">
              <AppIcon icon={Upload01Icon} size={20} />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              Drop files here or click to browse
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              PDF, images, ZIP archives and documents up to 50MB
            </p>
          </div>

          {/* Animated Queue List */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground block px-1">
              Active Upload Queue
            </span>

            <div className="space-y-2.5">
              {queueItems.map((item) => (
                <div
                  key={item.name}
                  className="p-3.5 px-4 rounded-xl border border-border/80 bg-surface-muted/40 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-8 rounded-md bg-surface border border-border flex items-center justify-center text-foreground shrink-0">
                        <AppIcon icon={item.icon} size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {item.size}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {item.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <AppIcon icon={Tick02Icon} size={12} />
                          100% Complete
                        </span>
                      )}

                      {item.status === 'uploading' && (
                        <span className="text-xs font-mono font-semibold text-primary">
                          {item.progress}%
                        </span>
                      )}

                      {item.status === 'queued' && (
                        <span className="text-[10px] font-medium text-muted-foreground bg-surface-muted px-2 py-0.5 rounded border border-border">
                          Queued
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {item.status !== 'queued' && (
                    <div className="w-full bg-surface-muted rounded-full h-1 overflow-hidden">
                      <motion.div
                        className="bg-primary h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
