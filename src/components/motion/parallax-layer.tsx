import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'

export interface ParallaxLayerProps {
  children?: React.ReactNode
  speed?: number
  distance?: number
  direction?: 'vertical' | 'horizontal'
  className?: string
  disabledOnMobile?: boolean
  targetRef?: React.RefObject<HTMLElement | null>
  ariaHidden?: boolean
}

export function ParallaxLayer({
  children,
  speed = 0.1,
  distance,
  direction = 'vertical',
  className = '',
  disabledOnMobile = false,
  targetRef,
  ariaHidden = false,
}: ParallaxLayerProps) {
  const localRef = useRef<HTMLDivElement>(null)
  const ref = targetRef || localRef
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Distance calculation: speed defaults to multiplier if distance not explicitly supplied
  // Standard recommended range: 20px - 40px
  const baseDistance = distance ?? Math.round(speed * 180)
  // Scale down translation on mobile by 50% or suppress completely
  const activeDistance = disabledOnMobile && isMobile
    ? 0
    : isMobile
    ? Math.round(baseDistance * 0.45)
    : baseDistance

  const rawOffset = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || activeDistance === 0
      ? [0, 0]
      : [activeDistance, -activeDistance]
  )

  const smoothOffset = useSpring(rawOffset, {
    stiffness: 300,
    damping: 35,
    mass: 0.8,
  })

  const style =
    direction === 'vertical'
      ? { y: smoothOffset }
      : { x: smoothOffset }

  return (
    <motion.div
      ref={localRef}
      style={style}
      className={className}
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      {children}
    </motion.div>
  )
}
