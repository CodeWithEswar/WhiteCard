import {
  Upload01Icon,
  Pdf01Icon,
  Zip01Icon,
  CheckmarkCircle01Icon,
  Tag01Icon,
  Folder01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Reveal } from '../../../components/motion/reveal'
import { StaggerGroup, StaggerItem } from '../../../components/motion/stagger-group'

const queueItems = [
  {
    name: 'Identity Document.pdf',
    size: '2.4 MB',
    stage: 'Complete',
    icon: Pdf01Icon,
    statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    name: 'Transcript.pdf',
    size: '3.1 MB',
    stage: 'Saving details',
    icon: Pdf01Icon,
    statusColor: 'text-primary bg-primary/10 border-primary/20',
  },
  {
    name: 'Records.zip',
    size: '14.8 MB',
    stage: 'Uploading',
    icon: Zip01Icon,
    statusColor: 'text-muted-foreground bg-muted border-border/80',
  },
] as const

const stages = [
  { step: '1', title: 'Preparing', desc: 'Client checksum and file type validation' },
  { step: '2', title: 'Uploading', desc: 'Secure direct transmission to private vault storage' },
  { step: '3', title: 'Saving details', desc: 'Attaching user title, category, tags, and dates' },
  { step: '4', title: 'Complete', desc: 'Instantly indexed and accessible in your vault' },
] as const

export function UploadDemo() {
  return (
    <section id="upload" className="py-24 sm:py-32 relative bg-muted/20 border-y border-border/70 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-[760px] mx-auto space-y-4">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 04 • Honest Upload Experience
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Straightforward, transparent uploads.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Drag and drop single files or multi-file batches. White Card reports truthful upload stages without fake numeric percentages or endless synthetic simulations.
            </p>
          </Reveal>
        </div>

        {/* Upload Showcase Panel */}
        <Reveal delay={0.18}>
          <div className="max-w-4xl mx-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-8 text-left">
            {/* Conceptual Dropzone */}
            <div className="p-6 sm:p-8 rounded-2xl border border-dashed border-border/90 flex flex-col items-center justify-center text-center pattern-grid-micro bg-muted/30">
              <div className="size-12 rounded-2xl bg-card border border-border/80 flex items-center justify-center mb-3 text-foreground shadow-2xs">
                <AppIcon icon={Upload01Icon} size={22} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                Drop documents here or click to browse
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                Select single files or multiple documents at once. Supports PDFs, images, ZIP archives, and office records up to 50MB.
              </p>
            </div>

            {/* Conceptual Queue List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Document Queue
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  3 items
                </span>
              </div>

              <div className="space-y-2.5">
                {queueItems.map((item) => (
                  <div
                    key={item.name}
                    className="p-3 sm:p-4 rounded-xl border border-border/70 bg-muted/20 flex items-center justify-between gap-2.5 sm:gap-4"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="size-8 sm:size-9 rounded-xl bg-card border border-border/70 flex items-center justify-center text-foreground shrink-0 shadow-2xs">
                        <AppIcon icon={item.icon} size={16} className="sm:hidden" />
                        <AppIcon icon={item.icon} size={18} className="hidden sm:block" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono truncate">
                          {item.size}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-border/80 bg-muted/70 text-foreground"
                      >
                        {item.stage === 'Complete' && (
                          <AppIcon icon={CheckmarkCircle01Icon} size={13} />
                        )}
                        <span>{item.stage}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Truthful 4-Stage Lifecycle Explanation */}
            <div className="pt-4 border-t border-border/60 space-y-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground block px-1">
                Truthful Pipeline Stages
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {stages.map((st) => (
                  <div
                    key={st.step}
                    className="p-3.5 rounded-xl border border-border/60 bg-muted/15 space-y-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-5 rounded-full bg-muted border border-border/70 flex items-center justify-center text-[10px] font-mono font-bold text-foreground">
                        {st.step}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {st.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed pl-7">
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
