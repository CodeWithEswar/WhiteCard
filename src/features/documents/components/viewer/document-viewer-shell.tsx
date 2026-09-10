import React from 'react'

interface DocumentViewerShellProps {
  isFocusMode: boolean
  children: React.ReactNode
  className?: string
}

export function DocumentViewerShell({
  isFocusMode,
  children,
  className = '',
}: DocumentViewerShellProps) {
  return (
    <main
      aria-label="Document viewer workspace"
      className={`relative w-full h-[100dvh] overflow-hidden flex flex-col bg-background text-foreground select-none ${
        isFocusMode ? 'fixed inset-0 z-50' : ''
      } ${className}`}
    >
      {children}
    </main>
  )
}
