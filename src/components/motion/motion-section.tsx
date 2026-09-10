import React, { forwardRef } from 'react'

export interface MotionSectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string
  className?: string
  children: React.ReactNode
}

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>(
  ({ id, className = '', children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={`relative overflow-hidden ${className}`}
        {...props}
      >
        {children}
      </section>
    )
  }
)

MotionSection.displayName = 'MotionSection'
