import React from 'react'

interface RadialGridBackgroundProps {
  className?: string
  glow?: boolean
  children?: React.ReactNode
}

export function RadialGridBackground({
  className = '',
  glow = true,
  children,
}: RadialGridBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none pattern-grid mask-radial"
        aria-hidden="true"
      />

      {/* Subtle theme accent glow */}
      {glow && (
        <div
          className="absolute inset-0 pointer-events-none accent-glow"
          aria-hidden="true"
        />
      )}

      {children}
    </div>
  )
}
