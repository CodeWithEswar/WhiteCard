import React from 'react'
import { cn } from '@/lib/utils'

export type AppThemeBackgroundVariant = 'app' | 'landing' | 'auth' | 'legal'

export interface AppThemeBackgroundProps {
  variant?: AppThemeBackgroundVariant
  grid?: boolean
  glow?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * AppThemeBackground — Atmospheric, Theme-Aware Background System
 * 
 * Dynamically reacts to the active theme preset (Zinc, Graphite, Slate, Stone,
 * Blue, Indigo, Violet, Emerald, Amber, Rose) and appearance mode (Light/Dark).
 * Uses lightweight pure CSS radial gradients and pattern masks (no Canvas/WebGL).
 */
export function AppThemeBackground({
  variant = 'app',
  grid = variant === 'auth',
  glow = true,
  className = '',
  children,
}: AppThemeBackgroundProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none overflow-hidden select-none z-0',
        className
      )}
      aria-hidden="true"
    >
      {/* 1. Base Root Page Tint Layer */}
      <div className="absolute inset-0 bg-page-background transition-colors duration-200" />

      {glow && variant === 'landing' && (
        <>
          {/* Hero spotlight glow */}
          <div
            className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1200px] h-[750px] rounded-full opacity-90 blur-3xl transition-all duration-300"
            style={{
              background:
                'radial-gradient(ellipse at center, var(--theme-glow) 0%, var(--theme-glow-soft) 40%, transparent 70%)',
            }}
          />
        </>
      )}

      {glow && variant === 'auth' && (
        <>
          {/* Centered orbital card glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] rounded-full opacity-85 blur-3xl transition-all duration-300"
            style={{
              background:
                'radial-gradient(ellipse at center, var(--theme-glow) 0%, var(--theme-glow-soft) 50%, transparent 75%)',
            }}
          />
        </>
      )}

      {glow && variant === 'legal' && (
        <>
          {/* Very faint reading glow restricted to the upper header area */}
          <div
            className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full opacity-35 blur-3xl transition-all duration-300"
            style={{
              background:
                'radial-gradient(ellipse at center, var(--theme-glow-soft) 0%, transparent 65%)',
            }}
          />
        </>
      )}

      {/* 3. Architectural Grid Lines */}
      {grid && variant !== 'legal' && variant !== 'app' && (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-200 pointer-events-none',
            variant === 'landing' && 'opacity-95 mask-radial',
            variant === 'auth' && 'opacity-90 mask-radial-subtle'
          )}
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: variant === 'auth' ? '24px 24px' : '28px 28px',
          }}
        />
      )}

      {children}
    </div>
  )
}
