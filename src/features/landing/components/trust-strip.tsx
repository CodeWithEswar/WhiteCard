import {
  ShieldCheckIcon,
  GoogleIcon,
  Link01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { StaggerGroup, StaggerItem } from '../../../components/motion/stagger-group'

const trustPillars = [
  {
    icon: ShieldCheckIcon,
    title: 'Private by default',
    desc: 'Scoped to your authenticated account',
  },
  {
    icon: GoogleIcon,
    title: 'Google sign-in',
    desc: 'Direct OAuth without separate passwords',
  },
  {
    icon: Link01Icon,
    title: 'Owner-controlled sharing',
    desc: 'Expiring links you can revoke anytime',
  },
  {
    icon: File01Icon,
    title: 'Original files preserved',
    desc: 'Stored as uploaded, no OCR or alteration',
  },
] as const

export function TrustStrip() {
  return (
    <section
      id="trust-strip"
      aria-label="Core Trust Pillars"
      className="border-y border-border/70 bg-muted/20 py-6 sm:py-8"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/60">
          {trustPillars.map((item, index) => (
            <StaggerItem
              key={item.title}
              className={`flex items-center gap-3.5 py-4 sm:py-2 ${index % 2 === 1 ? 'pl-4 sm:pl-6' : 'pr-4 sm:pr-6'
                } md:px-6`}
            >
              <div className="p-2.5 rounded-xl bg-background border border-border/70 text-foreground shrink-0 shadow-2xs">
                <AppIcon icon={item.icon} size={18} />
              </div>
              <div className="text-left">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  {item.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
