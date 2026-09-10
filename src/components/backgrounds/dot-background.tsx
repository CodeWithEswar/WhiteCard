import React from 'react'

interface DotBackgroundProps {
  className?: string
  mask?: boolean
  children?: React.ReactNode
}

export function DotBackground({
  className = '',
  mask = true,
  children,
}: DotBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 pointer-events-none pattern-dots ${
          mask ? 'mask-radial' : ''
        }`}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
