interface WhiteCardLogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
  showBadge?: boolean
  wordmarkClassName?: string
}

export function WhiteCardLogo({
  className = '',
  size = 28,
  showWordmark = true,
  showBadge = false,
  wordmarkClassName = '',
}: WhiteCardLogoProps) {
  return (
    <div className={`inline-flex items-center ${showWordmark ? 'gap-2.5' : 'justify-center'} select-none ${className}`}>
      {/* Official White Card Geometric App Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-label="White Card Logo"
      >
        {/* Base Rounded Card Silhouette */}
        <rect
          x="6"
          y="8"
          width="52"
          height="48"
          rx="12"
          className="fill-foreground transition-colors"
        />

        {/* Clipped / Folded Document Corner */}
        <path
          d="M42 8L58 24H47C44.2386 24 42 21.7614 42 19V8Z"
          className="fill-muted-foreground opacity-65 transition-opacity"
        />

        {/* Minimalist Geometric "W" Card Slot Monogram */}
        <path
          d="M17 26L22.5 38L27 28L31.5 38L37 26"
          className="stroke-background"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Precision Vault Status Index Dot */}
        <circle
          cx="48"
          cy="38"
          r="3.5"
          className="fill-background"
        />
      </svg>

      {showWordmark && (
        <div className={`flex flex-col tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap ${wordmarkClassName}`}>
          <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5 whitespace-nowrap">
            White Card
            {showBadge && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border border-border/80 text-muted-foreground bg-surface-muted/60">
                Vault
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  )
}
