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
    title: 'Private storage',
    desc: 'Scoped to your authenticated account',
  },
  {
    icon: GoogleIcon,
    title: 'Google sign-in',
    desc: 'Direct authentication without new passwords',
  },
  {
    icon: Link01Icon,
    title: 'Owner-controlled sharing',
    desc: 'Expiring links you can revoke anytime',
  },
  {
    icon: File01Icon,
    title: 'Original files preserved',
    desc: 'Exact byte-for-byte retention as uploaded',
  },
] as const

export function TrustStrip() {
  return (
    <section
      id="trust-strip"
      aria-label="Core Trust Signals"
      className="border-y border-border/70 bg-muted/20 py-6 sm:py-8"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {trustPillars.map((item, index) => (
            <StaggerItem
              key={item.title}
              className={`flex items-center gap-3.5 py-3 sm:py-2 px-2 sm:px-4 md:px-6 ${
                index % 2 === 1 ? 'sm:pl-4 md:pl-6' : 'sm:pr-4 md:pr-6'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-background border border-border/70 text-foreground shrink-0 shadow-2xs">
                <AppIcon icon={item.icon} size={18} />
              </div>
              <div className="text-left min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
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
