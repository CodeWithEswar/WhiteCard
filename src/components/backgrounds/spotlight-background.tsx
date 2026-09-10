import React from 'react'

interface SpotlightBackgroundProps {
  className?: string
  children?: React.ReactNode
}

export function SpotlightBackground({
  className = '',
  children,
}: SpotlightBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Soft spotlight accent bloom */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full blur-3xl opacity-20 bg-accent"
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
