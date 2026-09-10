import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

export const motionDurations = {
  fast: 0.16,
  normal: 0.26,
  slow: 0.4,
}

export const motionEase = [0.22, 1, 0.36, 1] as const

export const motionEasings = {
  standard: motionEase,
  decelerate: [0, 0, 0.2, 1] as const,
  accelerate: [0.4, 0, 1, 1] as const,
  gentleSpring: { type: 'spring', stiffness: 380, damping: 30 } as const,
  dockSpring: { type: 'spring', stiffness: 420, damping: 32 } as const,
}

export function useAppReducedMotion(): boolean {
  const shouldReduce = useFramerReducedMotion()
  return Boolean(shouldReduce)
}

export const pageTransitionVariants = {
  initial: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : 6,
  }),
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.normal,
      ease: motionEase,
    },
  },
  exit: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : -4,
    transition: {
      duration: motionDurations.fast,
      ease: motionEasings.accelerate,
    },
  }),
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.normal,
      ease: motionEase,
    },
  },
}
