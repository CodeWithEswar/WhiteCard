import React from 'react'

interface CrossPatternProps {
  className?: string
  children?: React.ReactNode
}

export function CrossPattern({ className = '', children }: CrossPatternProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 pointer-events-none pattern-crosses mask-radial opacity-60"
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
