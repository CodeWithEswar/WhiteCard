import {
  ShieldCheckIcon,
  UserCheck01Icon,
  Clock01Icon,
  Link01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'

export function SecuritySection() {
  const pillars = [
    {
      icon: ShieldCheckIcon,
      title: 'Private by default',
      desc: 'Files are encrypted on deposit and indexed locally. Your documents are never exposed to search engines or public directories.',
    },
    {
      icon: UserCheck01Icon,
      title: 'Owner-controlled access',
      desc: 'Only authenticated session tokens can request document byte streams. No administrative override backdoors exist.',
    },
    {
      icon: Clock01Icon,
      title: 'Temporary signed previews',
      desc: 'Pre-signed URLs are valid for 7 days maximum and expire automatically, preventing perpetual digital footprints.',
    },
    {
      icon: Link01Icon,
      title: 'Direct links can be revoked',
      desc: 'Shared document links can be instantly terminated with one click from your dashboard, breaking recipient access immediately.',
    },
  ]

  return (
    <section id="security" className="py-20 sm:py-28 relative bg-surface-muted/20 border-t border-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Vault Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Security through quiet discipline
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            No marketing theatrics. Just clear, owner-enforced boundaries protecting civic documents and degrees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="p-6 sm:p-7 rounded-3xl border border-border/80 bg-surface shadow-xs space-y-3 text-left pattern-grid-micro"
            >
              <div className="size-11 rounded-2xl bg-surface-muted border border-border flex items-center justify-center text-foreground shadow-2xs">
                <AppIcon icon={p.icon} size={22} />
              </div>
              <h3 className="text-base font-bold text-foreground tracking-tight">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
