import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'

export interface TocItem {
  id: string
  number: string
  title: string
}

export interface LegalTableOfContentsProps {
  items: TocItem[]
}

export function LegalTableOfContents({ items }: LegalTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -65% 0px' }
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const activeItem = items.find((item) => item.id === activeId) || items[0]

  return (
    <>
      {/* Desktop Sticky Table of Contents (240px) */}
      <aside className="hidden lg:block w-[240px] shrink-0">
        <div className="sticky top-24 space-y-3 pr-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            On this page
          </span>
          <nav aria-label="Table of contents" className="space-y-1 text-xs">
            {items.map((item) => {
              const isActive = activeId === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(item.id)
                  }}
                  className={`group relative flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-colors ${isActive
                    ? 'text-foreground font-semibold bg-muted/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                >
                  <span className="truncate pr-2">{item.title}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">
                    {item.number}
                  </span>

                  {/* Active Indicator with layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="active-toc-indicator"
                      className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Sticky Section Picker */}
      <div className="lg:hidden sticky top-[61px] z-30 bg-background/95 backdrop-blur-md border-b border-border/60 py-2.5 px-4 -mx-4 sm:-mx-6 mb-8">
        <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto">
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Section:
          </span>
          <div className="relative flex-1">
            <select
              value={activeId}
              onChange={(e) => scrollToSection(e.target.value)}
              className="w-full appearance-none bg-muted/40 border border-border/70 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.number} {item.title}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <AppIcon icon={ArrowDown01Icon} size={14} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
