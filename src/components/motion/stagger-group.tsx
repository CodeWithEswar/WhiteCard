import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { motionEase } from '../../lib/motion'

export interface StaggerGroupProps {
  children: React.ReactNode
  staggerDelay?: number
  delayChildren?: number
  className?: string
}

export function StaggerGroup({
  children,
  staggerDelay = 0.05,
  delayChildren = 0.04,
  className = '',
}: StaggerGroupProps) {
  const reduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : staggerDelay,
        delayChildren: reduceMotion ? 0 : delayChildren,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  yOffset?: number
}

export function StaggerItem({
  children,
  className = '',
  yOffset = 10,
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion()

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : yOffset,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.32,
        ease: motionEase,
      },
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
