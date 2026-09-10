import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function AuthOrbitalGrid() {
  const reduceMotion = useReducedMotion()
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduceMotion) return

    // Desktop pointer movement focus (max 24px)
    const handleMouseMove = (e: MouseEvent) => {
      // Disable on touch devices
      if (window.matchMedia('(pointer: coarse)').matches) return

      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const deltaX = (e.clientX - centerX) / centerX
      const deltaY = (e.clientY - centerY) / centerY

      setPointerOffset({
        x: Math.round(deltaX * 24),
        y: Math.round(deltaY * 24),
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [reduceMotion])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Layer 1: Architectural Fine Grid with Radial Vignette */}
      <div className="absolute inset-0 pattern-grid opacity-35 mask-radial" />

      {/* Layer 2: Subtle Theme-Aware Moving Highlight */}
      <motion.div
        animate={
          reduceMotion
            ? {}
            : {
                x: pointerOffset.x,
                y: pointerOffset.y,
              }
        }
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]"
      />

      {/* Layer 3: Concentric Geometric Orbital Rings behind Auth Card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Ring 1 (520px) */}
        <div className="size-[520px] rounded-full border border-border/40 opacity-30" />

        {/* Ring 2 (720px) */}
        <div className="absolute size-[720px] rounded-full border border-border/25 opacity-20" />

        {/* Ring 3 (940px) */}
        <div className="absolute size-[940px] rounded-full border border-border/15 opacity-15" />

        {/* Coordinate Calibration Tick Marks */}
        <div className="absolute -top-[260px] h-3 w-px bg-border/80" />
        <div className="absolute -bottom-[260px] h-3 w-px bg-border/80" />
        <div className="absolute -left-[260px] w-3 h-px bg-border/80" />
        <div className="absolute -right-[260px] w-3 h-px bg-border/80" />
      </div>
    </div>
  )
}
