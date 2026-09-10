import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { motionEase } from '../../lib/motion'

export interface RevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  className?: string
  width?: 'fit' | 'full'
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.38,
  yOffset = 16,
  className = '',
  width = 'full',
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : yOffset,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-40px',
      }}
      transition={{
        duration,
        delay,
        ease: motionEase,
      }}
      className={`${width === 'full' ? 'w-full' : 'w-auto'} ${className}`}
    >
      {children}
    </motion.div>
  )
}
