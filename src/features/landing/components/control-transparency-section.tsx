import {
  Download01Icon,
  Edit01Icon,
  LinkBackwardIcon,
  Delete02Icon,
  Logout01Icon,
  Alert02Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Reveal } from '../../../components/motion/reveal'
import { StaggerGroup, StaggerItem } from '../../../components/motion/stagger-group'

const controls = [
  {
    icon: Download01Icon,
    title: 'Download your original file',
    desc: 'Retrieve byte-exact copies anytime without proprietary locks or forced export formats.',
  },
  {
    icon: Edit01Icon,
    title: 'Edit document metadata',
    desc: 'Update document titles, descriptions, categories, and color tags as your needs evolve.',
  },
  {
    icon: LinkBackwardIcon,
    title: 'Revoke a share link',
    desc: 'Immediately invalidate any active public share token without deleting your vault copy.',
  },
  {
    icon: Delete02Icon,
    title: 'Delete a document',
    desc: 'Permanently remove a document and its storage file with full cascade deletion.',
  },
  {
    icon: Logout01Icon,
    title: 'Sign out anytime',
    desc: 'Terminate your authenticated session across current or all active browser devices.',
  },
] as const

export function ControlTransparencySection() {
  return (
    <section id="control" className="relative py-24 sm:py-32 overflow-hidden bg-muted/20 border-y border-border/70">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 11 • Ownership & Transparency
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Your documents stay under your control.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              White Card gives you complete autonomy over your personal records. We respect file ownership without lock-ins, surveillance, or hidden data extraction.
            </p>
          </Reveal>
        </div>

        {/* 5 Core User Controls */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {controls.map((c) => (
            <StaggerItem key={c.title}>
              <div className="h-full rounded-2xl border border-border/70 bg-card p-5 text-left space-y-3 shadow-2xs hover:border-border transition-colors">
                <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit">
                  <AppIcon icon={c.icon} size={18} />
                </div>
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Explicit OCR Transparency Callout */}
        <Reveal delay={0.2} className="max-w-4xl mx-auto mt-12">
          <div className="rounded-3xl border border-border/80 bg-background p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 text-left">
            <div className="p-3.5 rounded-2xl bg-muted text-foreground shrink-0">
              <AppIcon icon={CheckmarkCircle01Icon} size={26} className="text-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
                <span>OCR Transparency Declaration</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  Factual standard
                </span>
              </div>
              <h4 className="text-base font-bold text-foreground">
                White Card does not perform OCR in the current product.
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Files are stored as uploaded files. White Card does not automatically read document text, train machine learning models, or extract document contents in the current version.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
