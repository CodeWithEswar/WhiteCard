import React from 'react'

interface SidebarSectionProps {
  label: string
  children: React.ReactNode
  isCollapsed?: boolean
}

export function SidebarSection({ label, children, isCollapsed }: SidebarSectionProps) {
  return (
    <div className="space-y-1">
      {!isCollapsed && (
        <div className="px-3 pb-1 text-[11px] font-medium tracking-wider uppercase text-muted-foreground select-none">
          {label}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
