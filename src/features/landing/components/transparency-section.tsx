import {
  Download01Icon,
  Edit01Icon,
  LinkBackwardIcon,
  Delete02Icon,
  Logout01Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { GridBackground } from '../../../components/backgrounds/grid-background'
import { Reveal } from '../../../components/motion/reveal'
import { StaggerGroup, StaggerItem } from '../../../components/motion/stagger-group'

const controls = [
  {
    icon: Download01Icon,
    title: 'Download original file',
    desc: 'Retrieve your exact original byte-for-byte files at any time without locks, conversions, or watermarks.',
  },
  {
    icon: Edit01Icon,
    title: 'Edit document details',
    desc: 'Update document titles, descriptions, categories, color tags, and expiration dates whenever needed.',
  },
  {
    icon: LinkBackwardIcon,
    title: 'Revoke share link',
    desc: 'Immediately terminate active public share links with one click while keeping your vault document intact.',
  },
  {
    icon: Delete02Icon,
    title: 'Delete document',
    desc: 'Permanently remove a document and its stored file from object storage with full cascade deletion.',
  },
  {
    icon: Logout01Icon,
    title: 'Sign out anytime',
    desc: 'End your authenticated session across your current browser or all signed-in devices at your discretion.',
  },
] as const

export function TransparencySection() {
  return (
    <section id="control" className="relative py-24 sm:py-32 overflow-hidden bg-muted/20 border-y border-border/70">
      {/* Very Light Grid Background */}
      <GridBackground size="micro" mask="radial" className="absolute inset-0 pointer-events-none opacity-25" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 11 • User Control & Transparency
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Your documents stay under your control.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              White Card gives you complete autonomy over your personal records. We respect file ownership without lock-ins, surveillance, or hidden data harvesting.
            </p>
          </Reveal>
        </div>

        {/* 5 Core User Controls */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {controls.map((c) => (
            <StaggerItem key={c.title}>
              <div className="h-full rounded-2xl border border-border/70 bg-card p-5 text-left space-y-3 shadow-2xs hover:border-border transition-colors flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit mb-3">
                    <AppIcon icon={c.icon} size={18} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                    {c.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Prominent OCR Transparency Declaration */}
        <Reveal delay={0.2} className="max-w-4xl mx-auto mt-12">
          <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-background p-5 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-muted text-foreground shrink-0">
              <AppIcon icon={CheckmarkCircle01Icon} size={24} className="text-foreground sm:hidden" />
              <AppIcon icon={CheckmarkCircle01Icon} size={26} className="text-foreground hidden sm:block" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider flex-wrap">
                <span>OCR Transparency Declaration</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  Factual Standard
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-foreground">
                White Card does not use OCR in the current product.
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Uploaded files are stored as files rather than automatically read to extract their contents. Titles, categories, tags, issued dates, expiry dates, and notes are managed by the user.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
