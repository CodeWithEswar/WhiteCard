import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UserCircleIcon,
  PaintBoardIcon,
  FolderSecurityIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  Logout01Icon,
  CheckmarkBadge01Icon,
  Key01Icon,
  Tag01Icon,
} from '@hugeicons/core-free-icons'
import { PageShell } from '../components/layout/page-shell'
import { ResponsivePageHeader } from '../components/layout/responsive-page-header'
import { AppearanceControl } from '../features/settings/components/appearance-control'
import { ThemePicker } from '../features/settings/components/theme-picker'
import { SettingsGroup } from '../features/settings/components/settings-group'
import { STANDARD_TAGS } from '../features/tags/components/tag-selector'
import { TagChip } from '../features/tags/components/tag-chip'
import { AppIcon } from '../components/icons/app-icon'
import { Switch } from '../components/ui/switch'
import { Button } from '../components/ui/button'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useAuth } from '@/features/auth/auth-provider'
import { purgePersistedQueryCache } from '@/lib/query-persistence'
import { useQueryClient } from '@tanstack/react-query'

export function SettingsPage() {
  const [autoRevoke, setAutoRevoke] = useState(true)
  const [checksumVerification, setChecksumVerification] = useState(true)
  const [localCaching, setLocalCaching] = useState(true)
  const [cacheCleared, setCacheCleared] = useState(false)

  const { displayName, email, avatarUrl, initials, isBootstrapping } = useCurrentUser()
  const { signOut } = useAuth()
  const queryClient = useQueryClient()

  const handleClearCache = () => {
    purgePersistedQueryCache()
    queryClient.invalidateQueries()
    setCacheCleared(true)
    setTimeout(() => setCacheCleared(false), 2500)
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <PageShell
      maxWidth="reading"
      header={
        <ResponsivePageHeader
          eyebrow="ACCOUNT"
          title="Vault Settings"
          description="Manage your profile, appearance, themes, tags, document preferences, and account controls."
        />
      }
    >

      {/* 1. Account Section */}
      <SettingsGroup
        title="Account & Ownership"
        items={[
          {
            id: 'account-owner',
            title: isBootstrapping ? 'Authenticating...' : (displayName || email || 'Vault Account'),
            description: email
              ? `Authenticated via Google Account (${email})`
              : 'Private account access authenticated via Google OAuth',
            icon: UserCircleIcon,
            action: (
              <div className="flex items-center gap-2">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || 'Avatar'}
                    className="size-6 rounded-xl object-cover border border-border"
                  />
                ) : initials ? (
                  <div className="size-6 rounded-xl bg-muted border border-border flex items-center justify-center text-[10px] font-bold font-mono">
                    {initials}
                  </div>
                ) : null}
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <AppIcon icon={CheckmarkBadge01Icon} size={13} />
                  Verified
                </span>
              </div>
            ),
          },
          {
            id: 'account-supabase',
            title: 'Vault Storage Engine',
            description: 'Private scoped object storage with client-side verification',
            icon: Key01Icon,
            action: (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-muted border border-border text-muted-foreground">
                Active
              </span>
            ),
          },
        ]}
      />

      {/* 2. Appearance Section */}
      <div className="space-y-3">
        <div className="px-1 space-y-0.5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Appearance Mode
          </h3>
          <p className="text-xs text-muted-foreground/80">
            Appearance mode operates independently of your selected accent theme.
          </p>
        </div>
        <div className="p-4 sm:p-5 rounded-xl border border-border/80 bg-surface shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              Color Mode
            </p>
            <p className="text-xs text-muted-foreground">
              Choose automatic system matching, high-clarity light, or deep obsidian dark.
            </p>
          </div>
          <AppearanceControl />
        </div>
      </div>

      {/* 3. 10 Theme Presets Grid */}
      <div className="space-y-3">
        <div className="px-1 space-y-0.5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <AppIcon icon={PaintBoardIcon} size={14} className="text-foreground" />
            <span>Theme Engine — 10 Professional Presets</span>
          </h3>
          <p className="text-xs text-muted-foreground/80">
            Selected theme alters focus rings, active indicators, and accents while preserving neutral readability.
          </p>
        </div>

        <ThemePicker />
      </div>

      {/* 4. Document Preferences */}
      <SettingsGroup
        title="Document Vault Preferences"
        items={[
          {
            id: 'pref-auto-revoke',
            title: 'Auto-expire Direct Links',
            description: 'Shared document links automatically deactivate after 7 days.',
            icon: FolderSecurityIcon,
            action: (
              <Switch
                checked={autoRevoke}
                onCheckedChange={setAutoRevoke}
              />
            ),
          },
          {
            id: 'pref-checksum',
            title: 'Strict SHA-256 Checksum Validation',
            description: 'Enforce cryptographic hash validation for all deposited documents.',
            icon: ShieldCheckIcon,
            action: (
              <Switch
                checked={checksumVerification}
                onCheckedChange={setChecksumVerification}
              />
            ),
          },
          {
            id: 'pref-cache',
            title: 'Local Vault Offline Cache',
            description: 'Store document metadata locally for instant retrieval when offline.',
            icon: Key01Icon,
            action: (
              <Switch
                checked={localCaching}
                onCheckedChange={setLocalCaching}
              />
            ),
          },
          {
            id: 'pref-clear-cache',
            title: 'Clear Local Storage & Query Cache',
            description: 'Purges persisted offline metadata queries. Your database documents remain intact.',
            icon: FolderSecurityIcon,
            action: (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearCache}
                className="text-xs h-7 px-2.5 rounded-xl"
              >
                {cacheCleared ? 'Cache Purged ✓' : 'Clear Cache'}
              </Button>
            ),
          },
        ]}
      />

      {/* 5. Tag Taxonomy */}
      <div className="space-y-3">
        <div className="px-1 space-y-0.5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <AppIcon icon={Tag01Icon} size={14} />
            <span>Allowed Tag Taxonomy</span>
          </h3>
          <p className="text-xs text-muted-foreground/80">
            Preset theme-safe tags for Government and Student documents.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-border/80 bg-surface shadow-xs space-y-3">
          <div className="flex flex-wrap gap-2">
            {STANDARD_TAGS.map((tag) => (
              <TagChip key={tag} label={tag} variant="default" />
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tags use restrained color dots to prevent visual clutter across document cards.
          </p>
        </div>
      </div>

      {/* 6. Security & Cryptography Info */}
      <SettingsGroup
        title="Security & Privacy Boundary"
        items={[
          {
            id: 'sec-privacy',
            title: 'Zero Third-Party Scraping',
            description: 'White Card never passes document contents to external AI models or advertisement brokers.',
            icon: ShieldCheckIcon,
          },
          {
            id: 'sec-version',
            title: 'White Card UI System',
            description: 'Version 1.0.0 — Production-grade vault frontend with Hugeicons & Framer Motion',
            icon: InformationCircleIcon,
          },
        ]}
      />

      {/* 7. Sign Out */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors text-xs font-semibold cursor-pointer"
        >
          <AppIcon icon={Logout01Icon} size={16} />
          <span>Sign Out from Vault</span>
        </button>
      </div>
    </PageShell>
  )
}
