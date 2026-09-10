import { motion } from 'framer-motion'
import { ArrowDown01Icon, Certificate01Icon, File01Icon, LockKeyIcon, Passport01Icon, Pdf01Icon, ShieldCheckIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import { TagChip } from '../../tags/components/tag-chip'
import { useAppReducedMotion } from '../../../lib/motion'
import { SignInButton } from './sign-in-button'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'

const fade = (reduce: boolean, delay: number) => ({
  initial: reduce ? false : { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

export function CenteredHero() {
  const reduceMotion = useAppReducedMotion()
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 pattern-grid opacity-55 mask-radial-subtle" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[580px] accent-glow" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl text-center">
        {/* Official White Card App Logo Emblem */}
        <motion.div {...fade(reduceMotion, 0)} className="flex justify-center mb-6">
          <div className="p-2 px-3.5 rounded-xl border border-border/80 bg-surface/90 shadow-xs backdrop-blur inline-flex items-center gap-3">
            <WhiteCardLogo size={28} showWordmark={false} />
            <div className="h-4 w-px bg-border/80" />
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <AppIcon icon={ShieldCheckIcon} size={15} className="text-emerald-500" />
              <span>Private Document Vault</span>
            </div>
          </div>
        </motion.div>
        <motion.h1 {...fade(reduceMotion, 0.04)} className="mx-auto max-w-4xl text-balance text-5xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl">
          Your important documents.<br />One secure place.
        </motion.h1>
        <motion.p {...fade(reduceMotion, 0.08)} className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          Keep government documents and student certificates organized, private, and ready when you need them.
        </motion.p>
        <motion.div {...fade(reduceMotion, 0.12)} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SignInButton className="w-full sm:w-auto" />
          <Button render={<a href="#product" />} variant="outline" className="h-11 w-full rounded-xl px-5 text-sm font-semibold sm:w-auto">See how it works <AppIcon icon={ArrowDown01Icon} size={17} /></Button>
        </motion.div>
        <motion.p {...fade(reduceMotion, 0.15)} className="mt-5 text-sm text-muted-foreground">Private storage <span aria-hidden="true">•</span> Owner-controlled access <span aria-hidden="true">•</span> Direct share links</motion.p>
        <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, delay: 0.16 }} className="relative mx-auto mt-12 max-w-4xl rounded-xl border border-border bg-surface/80 p-3 shadow-md backdrop-blur sm:p-5">
          <div className="grid gap-3 rounded-xl border border-border/70 bg-background/70 p-3 text-left sm:grid-cols-2 sm:p-5">
            <VaultSpace icon={Passport01Icon} label="Government Documents" count="8 categories" rows={[["Passport.pdf", "Identity"], ["Driving_Licence.png", "Vehicle"]]} />
            <VaultSpace icon={Certificate01Icon} label="Student Certificates" count="7 categories" rows={[["Degree_Certificate.pdf", "Education"], ["Semester_Marksheets.zip", "Academic"]]} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl border border-border/70 bg-surface-muted/55 px-4 py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><AppIcon icon={Pdf01Icon} size={16} />PDF & images</span>
            <span className="flex items-center gap-2"><AppIcon icon={LockKeyIcon} size={16} />Private by default</span>
            <span className="flex items-center gap-2"><AppIcon icon={File01Icon} size={16} />Original files intact</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function VaultSpace({ icon, label, count, rows }: { icon: typeof Passport01Icon; label: string; count: string; rows: string[][] }) {
  return <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
    <div className="mb-5 flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><AppIcon icon={icon} size={20} /></span><div className="min-w-0"><h2 className="truncate text-base font-semibold">{label}</h2><p className="text-sm text-muted-foreground">{count}</p></div></div><AppIcon icon={LockKeyIcon} size={17} className="text-muted-foreground" /></div>
    <div className="space-y-2">{rows.map(([file, tag]) => <div key={file} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-muted/45 px-3 py-3"><span className="min-w-0 truncate text-sm font-medium">{file}</span><TagChip label={tag} variant="compact" /></div>)}</div>
  </article>
}
