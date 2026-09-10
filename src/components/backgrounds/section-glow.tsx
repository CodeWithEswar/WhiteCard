import React from 'react'

export interface SectionGlowProps {
  className?: string
  position?: 'top' | 'center' | 'bottom'
  opacity?: string
}

export function SectionGlow({
  className = '',
  position = 'center',
  opacity = 'opacity-40',
}: SectionGlowProps) {
  const positionClasses = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  }[position]

  return (
    <div
      className={`absolute pointer-events-none ${positionClasses} ${opacity} ${className}`}
      aria-hidden="true"
    >
      <div className="w-[480px] sm:w-[680px] h-[240px] sm:h-[340px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
    </div>
  )
}
