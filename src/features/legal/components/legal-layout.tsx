import React from 'react'
import { LegalHeader } from './legal-header'
import { LegalFooter } from './legal-footer'
import { LegalTableOfContents, type TocItem } from './legal-table-of-contents'
import { AppThemeBackground } from '../../../components/backgrounds/app-theme-background'

export interface LegalLayoutProps {
  title: string
  lastUpdated: string
  subtitle?: string
  tocItems: TocItem[]
  children: React.ReactNode
}

export function LegalLayout({
  title,
  lastUpdated,
  subtitle,
  tocItems,
  children,
}: LegalLayoutProps) {
  return (
    <div className="relative min-h-screen bg-page-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      <AppThemeBackground variant="legal" />
      <LegalHeader />

      <main className="relative flex-1">

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Article Header (Stationary, editorial) */}
          <div className="max-w-3xl mb-12 space-y-3 text-left">
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

          {/* Two-Column Layout on Large Desktop (Article + Sticky TOC) */}
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Main Article Content (760–860px) */}
            <article className="flex-1 w-full max-w-[820px] text-left">
              {children}
            </article>

            {/* Sticky TOC Sidebar */}
            <LegalTableOfContents items={tocItems} />
          </div>
        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
