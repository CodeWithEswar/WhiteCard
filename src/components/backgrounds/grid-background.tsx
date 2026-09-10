import React from 'react'

interface GridBackgroundProps {
  className?: string
  mask?: 'radial' | 'subtle' | 'none'
  size?: 'normal' | 'micro'
  children?: React.ReactNode
}

export function GridBackground({
  className = '',
  mask = 'radial',
  size = 'normal',
  children,
}: GridBackgroundProps) {
  const patternClass = size === 'micro' ? 'pattern-grid-micro' : 'pattern-grid'
  const maskClass =
    mask === 'radial'
      ? 'mask-radial'
      : mask === 'subtle'
      ? 'mask-radial-subtle'
      : ''

  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 pointer-events-none ${patternClass} ${maskClass}`}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
