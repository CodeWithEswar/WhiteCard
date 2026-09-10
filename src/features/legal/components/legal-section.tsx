import React from 'react'

export interface LegalSectionProps {
  id: string
  number: string
  title: string
  children: React.ReactNode
  className?: string
}

export function LegalSection({
  id,
  number,
  title,
  children,
  className = '',
}: LegalSectionProps) {
  return (
    <section
      id={id}
      data-section-id={id}
      className={`scroll-mt-28 space-y-3 py-6 border-b border-border/50 last:border-b-0 ${className}`}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-mono font-bold text-muted-foreground shrink-0">
          {number}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="text-[15px] sm:text-[16px] leading-[1.75] text-muted-foreground space-y-4 pt-1">
        {children}
      </div>
    </section>
  )
}
