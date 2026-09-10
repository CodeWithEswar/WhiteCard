import {
  Pdf01Icon,
  Image01Icon,
  Zip01Icon,
  Table01Icon,
  File01Icon,
  DocumentCodeIcon,
  CheckmarkCircle01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { GridBackground } from '../../../components/backgrounds/grid-background'
import { Reveal } from '../../../components/motion/reveal'
import { StaggerGroup, StaggerItem } from '../../../components/motion/stagger-group'

const formats = [
  {
    badge: 'PDF',
    name: 'PDF Documents',
    ext: '.pdf',
    desc: 'Passports, identity cards, degrees, transcripts & scanned forms',
    icon: Pdf01Icon,
  },
  {
    badge: 'IMG',
    name: 'High-Res Images',
    ext: '.png, .jpg, .webp',
    desc: 'Government identity cards, certificate photos & document photos',
    icon: Image01Icon,
  },
  {
    badge: 'ZIP',
    name: 'ZIP Archives',
    ext: '.zip',
    desc: 'Multi-semester bundles, project archives & historical records',
    icon: Zip01Icon,
  },
  {
    badge: 'DOC',
    name: 'Office Documents',
    ext: '.doc, .docx',
    desc: 'Letters of recommendation, resumes & official statements',
    icon: File01Icon,
  },
  {
    badge: 'XLS',
    name: 'Spreadsheets',
    ext: '.xlsx, .csv',
    desc: 'Expense logs, mark sheets, grade audits & financial tables',
    icon: Table01Icon,
  },
  {
    badge: 'TXT',
    name: 'Text & Plain Notes',
    ext: '.txt, .md',
    desc: 'Reference notes, application drafts & plain documentation',
    icon: DocumentCodeIcon,
  },
] as const

export function FileTypesSection() {
  return (
    <section id="files" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Fine Grid Background */}
      <GridBackground size="micro" mask="radial" className="absolute inset-0 pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 04 • Universal Storage Format
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Keep the original files you already use.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Files remain in their original format for download. White Card stores your exact uploads without compression, alteration, or automatic text extraction.
            </p>
          </Reveal>
        </div>

        {/* Structured 6-Grid Ribbon */}
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 max-w-5xl mx-auto">
          {formats.map((f) => (
            <StaggerItem key={f.badge}>
              <div className="h-full rounded-2xl border border-border/70 bg-card p-4 flex flex-col justify-between hover:border-border transition-colors text-left shadow-2xs group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <AppIcon icon={f.icon} size={20} />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {f.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground tracking-tight">
                      {f.name}
                    </h3>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {f.ext}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed line-clamp-2">
                  {f.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Explicit OCR Transparency Callout Bar */}
        <Reveal delay={0.2} className="max-w-3xl mx-auto mt-12">
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <AppIcon icon={CheckmarkCircle01Icon} size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">
                  Original Download Fidelity
                </h4>
                <p className="text-xs text-muted-foreground">
                  Downloads are byte-identical to your uploads. No OCR is performed in the current product.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground px-3 py-1.5 rounded-md bg-background border border-border/60 shrink-0">
              <AppIcon icon={Download01Icon} size={13} />
              <span>Byte-Exact Retention</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
