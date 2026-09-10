import {
  Search01Icon,
  Pdf01Icon,
  CheckmarkCircle01Icon,
  Sorting05Icon,
  Tag01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Reveal } from '../../../components/motion/reveal'

const tags = [
  { name: 'Identity' },
  { name: 'Travel' },
  { name: 'Education' },
  { name: 'Vehicle' },
  { name: 'Renewal' },
  { name: 'Personal' },
] as const

const mockResults = [
  {
    title: 'Identity Document.pdf',
    space: 'Government',
    tag: 'Identity',
    size: '2.4 MB',
    date: 'Updated 2 days ago',
  },
  {
    title: 'Degree Certificate.pdf',
    space: 'Student',
    tag: 'Education',
    size: '3.8 MB',
    date: 'Updated last week',
  },
  {
    title: 'Vehicle Insurance.pdf',
    space: 'Government',
    tag: 'Vehicle',
    size: '1.2 MB',
    date: 'Updated 3 weeks ago',
  },
] as const

export function OrganizationShowcase() {
  return (
    <section id="organization" className="relative py-24 sm:py-32 overflow-hidden bg-muted/10 border-y border-border/70">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 06 • Organization & Search
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Find the right document without digging through folders.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Combine search, color tags, space filters, and metadata sort to locate any document in seconds without maintaining complex hierarchical folders.
            </p>
          </Reveal>
        </div>

        {/* Small Interactive-Looking but Static Composition */}
        <div className="max-w-4xl mx-auto">
          <Reveal delay={0.16}>
            <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-8 shadow-sm space-y-4 sm:space-y-6 text-left">
              {/* Search Field & Sort */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 flex items-center gap-2.5 sm:gap-3 bg-muted/40 border border-border/70 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-foreground">
                    <AppIcon icon={Search01Icon} size={16} className="text-muted-foreground shrink-0 sm:hidden" />
                    <AppIcon icon={Search01Icon} size={18} className="text-muted-foreground shrink-0 hidden sm:block" />
                    <span className="text-muted-foreground truncate">Search documents...</span>
                    <span className="text-muted-foreground text-[11px] sm:text-xs font-mono ml-auto shrink-0 pl-1">
                      3 matches
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-3 rounded-xl border border-border/70 bg-muted/20 text-xs font-medium text-muted-foreground">
                    <AppIcon icon={Sorting05Icon} size={15} />
                    <span>Sort: Recently updated</span>
                  </div>
                </div>

                {/* Filter Pills: [Government] [Student] [PDF] [Identity] */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                  <span className="text-[10.5px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-0.5 sm:mr-1">
                    Filters:
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-primary text-primary-foreground text-[11px] sm:text-xs font-medium shrink-0 shadow-2xs">
                    Government
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground text-[11px] sm:text-xs shrink-0">
                    Student
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground text-[11px] sm:text-xs shrink-0">
                    PDF
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground text-[11px] sm:text-xs shrink-0">
                    Identity
                  </span>
                </div>
              </div>

              {/* Tag Showcase Ribbon (Stacks cleanly on mobile) */}
              <div className="pt-2.5 pb-2 border-y border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-[11px] font-mono text-muted-foreground shrink-0 flex items-center gap-1.5">
                  <AppIcon icon={Tag01Icon} size={13} />
                  Accessible tags:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((t) => (
                    <span
                      key={t.name}
                      className="text-[10.5px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-md border border-border/70 bg-muted/60 text-foreground"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exact 3 Documents Preview (Inline on mobile) */}
              <div className="space-y-2 sm:space-y-2.5">
                {mockResults.map((doc) => (
                  <div
                    key={doc.title}
                    className="p-3 sm:p-4 rounded-xl border border-border/70 bg-muted/20 flex items-center justify-between gap-2.5 sm:gap-4"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-card border border-border/70 text-foreground shrink-0 shadow-2xs">
                        <AppIcon icon={Pdf01Icon} size={16} className="sm:hidden" />
                        <AppIcon icon={Pdf01Icon} size={18} className="hidden sm:block" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight truncate">
                          {doc.title}
                        </h4>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[11px] text-muted-foreground mt-0.5 font-mono truncate">
                          <span>{doc.space}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span className="hidden xs:inline">•</span>
                          <span className="hidden xs:inline">{doc.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="text-[10.5px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-md border border-border/70 bg-muted/60 text-foreground">
                        {doc.tag}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                        <AppIcon icon={CheckmarkCircle01Icon} size={13} className="text-foreground" />
                        Stored
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
