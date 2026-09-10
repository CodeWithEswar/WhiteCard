import React from 'react'
import { LegalHeader } from './legal-header'
import { LegalFooter } from './legal-footer'
import { AppThemeBackground } from '../../../components/backgrounds/app-theme-background'

export interface LegalLayoutProps {
  title: string
  lastUpdated: string
  subtitle?: string
  children: React.ReactNode
}

export function LegalLayout({
  title,
  lastUpdated,
  subtitle,
  children,
}: LegalLayoutProps) {
  return (
    <div className="relative min-h-screen bg-page-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      <AppThemeBackground variant="legal" />
      <LegalHeader />

      <main className="relative flex-1">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Article Header (Stationary, editorial) */}
          <div className="mb-12 space-y-3 text-left">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Official Legal Documentation
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono">
              Last updated: {lastUpdated}
            </p>
            {subtitle && (
              <p className="text-base text-muted-foreground leading-relaxed pt-2">
                {subtitle}
              </p>
            )}
          </div>

          {/* Main Article Content (Uncluttered, centered reading layout) */}
          <article className="w-full text-left">
            {children}
          </article>
        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
