import {
  Search01Icon,
  Tag01Icon,
  FilterIcon,
  Pdf01Icon,
  CheckmarkCircle01Icon,
  Sorting05Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Reveal } from '../../../components/motion/reveal'

const tags = [
  { name: 'Identity', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { name: 'Education', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { name: 'Travel', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  { name: 'Vehicle', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  { name: 'Renewal', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  { name: 'Personal', color: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20' },
] as const

const mockResults = [
  {
    title: 'Identity Document.pdf',
    space: 'Government',
    tag: 'Identity',
    size: '1.8 MB',
    date: 'Updated 2 days ago',
  },
  {
    title: 'Travel Record.pdf',
    space: 'Government',
    tag: 'Travel',
    size: '940 KB',
    date: 'Updated last week',
  },
  {
    title: 'Degree Certificate.pdf',
    space: 'Student',
    tag: 'Education',
    size: '3.2 MB',
    date: 'Updated 1 month ago',
  },
] as const

export function OrganizationSection() {
  return (
    <section id="organization" className="relative py-24 sm:py-32 overflow-hidden bg-muted/10 border-y border-border/70">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 08 • Instant Retrieval
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Find the right document without digging through folders.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Combine search, color tags, space filters, and metadata sort to locate any document in seconds without complex hierarchical directory trees.
            </p>
          </Reveal>
        </div>

        {/* Clean Search & Tag Filter Composition (Stationary) */}
        <div className="max-w-4xl mx-auto">
          <Reveal delay={0.16}>
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6 text-left">
              {/* Search Bar & Filter Controls */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 bg-muted/40 border border-border/70 rounded-xl px-4 py-3 text-sm text-foreground">
                    <AppIcon icon={Search01Icon} size={18} className="text-muted-foreground" />
                    <span className="text-foreground font-medium">Identity</span>
                    <span className="text-muted-foreground text-xs font-mono ml-auto">
                      3 matches
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-3 rounded-xl border border-border/70 bg-muted/20 text-xs font-medium text-muted-foreground">
                    <AppIcon icon={Sorting05Icon} size={15} />
                    <span>Sort: Recently updated</span>
                  </div>
                </div>

                {/* Filter Chips Ribbon */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
                    Filters:
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-primary text-primary-foreground font-medium shrink-0">
                    All Spaces
                  </span>
                  <span className="px-3 py-1 rounded-xl border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground shrink-0">
                    Government
                  </span>
                  <span className="px-3 py-1 rounded-xl border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground shrink-0">
                    Student
                  </span>
                  <span className="px-3 py-1 rounded-xl border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground shrink-0">
                    PDF Only
                  </span>
                </div>
              </div>

              {/* Tag Chips Row */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <AppIcon icon={Tag01Icon} size={14} className="text-muted-foreground" />
                  Color Tag System
                </span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t.name}
                      className={`text-xs font-medium px-3 py-1 rounded-full border ${t.color}`}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Document Results List */}
              <div className="space-y-2.5 pt-2 border-t border-border/50">
                <span className="text-xs font-semibold text-foreground">
                  Filtered Results
                </span>
                <div className="space-y-2">
                  {mockResults.map((doc) => (
                    <div
                      key={doc.title}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                          <AppIcon icon={Pdf01Icon} size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">
                            {doc.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                            <span>{doc.space} Space</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.date}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted border border-border/70 text-foreground">
                        {doc.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
