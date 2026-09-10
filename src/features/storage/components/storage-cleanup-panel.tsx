import { Link } from 'react-router-dom'
import {
  Search01Icon,
  ZipIcon,
  Passport01Icon,
  Certificate01Icon,
  ArrowRight01Icon,
  ShieldCheckIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'

export function StorageCleanupPanel() {
  const actions = [
    {
      title: 'Review Largest Documents',
      description: 'Sort your entire vault by file size to identify heavy documents.',
      icon: Search01Icon,
      href: '/app/search?sortBy=size_desc',
      badge: 'Size Sort',
    },
    {
      title: 'Inspect Compressed Archives',
      description: 'Filter ZIP, TAR, and GZ packages stored across your spaces.',
      icon: ZipIcon,
      href: '/app/search?fileType=zip',
      badge: 'Archives',
    },
    {
      title: 'Audit Government Vault',
      description: 'Browse official documents, passports, licences, and identity cards.',
      icon: Passport01Icon,
      href: '/app/government',
      badge: 'Government',
    },
    {
      title: 'Audit Student Certificates',
      description: 'Examine academic marksheets, degree diplomas, and transcripts.',
      icon: Certificate01Icon,
      href: '/app/student',
      badge: 'Student',
    },
  ]

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
      <div className="space-y-0.5">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          Maintenance
        </div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          Review & Audit
        </h3>
        <p className="text-xs text-muted-foreground">
          Explore targeted views of your vault to keep storage organized.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {actions.map((act) => (
          <Link
            key={act.title}
            to={act.href}
            className="group p-4 rounded-xl border border-border/70 bg-muted/15 hover:bg-muted/30 hover:border-border transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="size-8 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center text-foreground shrink-0 group-hover:border-primary/50 transition-colors">
                <AppIcon icon={act.icon} size={16} />
              </div>
              <span className="text-[10.5px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted/40 border border-border/50">
                {act.badge}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                <span>{act.title}</span>
                <AppIcon
                  icon={ArrowRight01Icon}
                  size={12}
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary shrink-0"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {act.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80 border-t border-border/50 pt-3">
        <AppIcon icon={ShieldCheckIcon} size={14} className="text-muted-foreground shrink-0" />
        <span>
          White Card prioritizes permanent preservation. No automatic or bulk deletions.
        </span>
      </div>
    </div>
  )
}
