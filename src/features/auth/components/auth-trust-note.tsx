import { ShieldCheckIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'

export function AuthTrustNote() {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1 select-none">
      <AppIcon icon={ShieldCheckIcon} size={15} className="text-emerald-500 shrink-0" />
      <span>Private account access • Scoped to your authenticated identity</span>
    </div>
  )
}
