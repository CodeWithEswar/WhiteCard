import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export interface AuthCardProps {
  children: React.ReactNode
  className?: string
}

export function AuthCard({ children, className = '' }: AuthCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : 18,
        scale: reduceMotion ? 1 : 0.985,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative w-full max-w-[440px] rounded-md border border-border/80 bg-card/90 p-6 sm:p-9 shadow-xl shadow-black/5 backdrop-blur-xl space-y-6 ${className}`}
    >
      {/* Subtle identity top line accent */}
      <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none">
        <div className="w-12 h-[2px] bg-primary/40 rounded-full" />
      </div>

      {/* Subtle corner calibration tick marks */}
      <div className="absolute top-2.5 left-2.5 size-1.5 border-t border-l border-border/60 pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 size-1.5 border-t border-r border-border/60 pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 size-1.5 border-b border-l border-border/60 pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 size-1.5 border-b border-r border-border/60 pointer-events-none" />

      {children}
    </motion.div>
  )
}
