import type { ShareExpiryOption } from '../sharing.types'

interface ShareExpirySelectorProps {
  value: ShareExpiryOption
  onChange: (value: ShareExpiryOption) => void
  disabled?: boolean
}

const EXPIRY_OPTIONS: { days: ShareExpiryOption; label: string; desc: string }[] = [
  { days: 1, label: '24 hours', desc: 'Short-term reference' },
  { days: 7, label: '7 days', desc: 'Standard review window' },
  { days: 30, label: '30 days', desc: 'Extended verification' },
]

export function ShareExpirySelector({
  value,
  onChange,
  disabled = false,
}: ShareExpirySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
        Link Expiration
      </label>
      <div className="grid grid-cols-3 gap-2">
        {EXPIRY_OPTIONS.map((opt) => {
          const isSelected = value === opt.days
          return (
            <button
              key={opt.days}
              type="button"
              onClick={() => onChange(opt.days)}
              disabled={disabled}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs ring-1 ring-primary/30'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              <p className="text-xs font-semibold leading-tight">{opt.label}</p>
              <p className="text-[10px] text-muted-foreground font-normal mt-0.5">{opt.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
