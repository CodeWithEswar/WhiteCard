import React from 'react'

interface DocumentViewerCanvasProps {
  children: React.ReactNode
  className?: string
}

export function DocumentViewerCanvas({
  children,
  className = '',
}: DocumentViewerCanvasProps) {
  return (
    <div
      className={`relative flex-1 w-full h-[calc(100dvh-64px)] sm:h-[calc(100dvh-68px)] bg-muted/15 overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Precision Document Registration Marks (Prompt #134, aria-hidden) */}
      <div className="absolute top-3 left-3 size-2.5 border-t border-l border-border/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-3 right-3 size-2.5 border-t border-r border-border/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-3 left-3 size-2.5 border-b border-l border-border/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-3 right-3 size-2.5 border-b border-r border-border/40 pointer-events-none" aria-hidden="true" />

      {/* Viewing Canvas Stage */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </div>
  )
}
