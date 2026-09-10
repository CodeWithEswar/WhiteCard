import React from 'react'

interface DocumentMetadataGroupProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function DocumentMetadataGroup({
  title,
  children,
  className = '',
}: DocumentMetadataGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <div className="rounded-xl border border-border/70 bg-card/60 divide-y divide-border/60 text-xs">
        {children}
      </div>
    </div>
  )
}

interface DocumentMetadataRowProps {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  hint?: string
  className?: string
}

export function DocumentMetadataRow({
  label,
  value,
  icon,
  hint,
  className = '',
}: DocumentMetadataRowProps) {
  return (
    <div className={`flex items-start justify-between gap-3 p-3 text-left ${className}`}>
      <div className="space-y-0.5 shrink-0">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
          {icon}
          <span>{label}</span>
        </div>
        {hint && <p className="text-[10px] text-muted-foreground font-mono">{hint}</p>}
      </div>
      <div className="text-right text-xs font-semibold text-foreground min-w-0 max-w-[65%] truncate">
        {value}
      </div>
    </div>
  )
}
