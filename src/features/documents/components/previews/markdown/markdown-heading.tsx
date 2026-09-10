import React, { useState } from 'react'
import { Link01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { slugify } from '@/features/documents/lib/markdown/markdown-slug'
import { cn } from '@/lib/utils'

interface MarkdownHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  id?: string
  className?: string
}

export function MarkdownHeading({
  level,
  children,
  id: customId,
  className,
}: MarkdownHeadingProps) {
  const [copied, setCopied] = useState(false)

  // Extract raw text for deterministic slug if id not provided
  const textContent = React.Children.toArray(children)
    .map((child) => (typeof child === 'string' || typeof child === 'number' ? String(child) : ''))
    .join('')
    .trim()

  const headingId = customId || slugify(textContent)

  const handleCopyAnchor = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!headingId) return

    const hash = `#${headingId}`
    const url = new URL(window.location.href)
    url.hash = hash
    history.replaceState(null, '', url.toString())

    navigator.clipboard.writeText(url.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)

    // Scroll smoothly into view
    const elem = document.getElementById(headingId)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const anchorButton = (
    <a
      href={`#${headingId}`}
      onClick={handleCopyAnchor}
      className="inline-flex items-center justify-center size-5 ml-1.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity text-muted-foreground hover:text-foreground rounded p-0.5"
      aria-label={`Copy link to section: ${textContent}`}
      title={copied ? 'Link copied' : 'Click to copy anchor'}
    >
      <AppIcon icon={copied ? Tick02Icon : Link01Icon} size={14} />
    </a>
  )

  const commonClasses = 'group font-semibold text-foreground tracking-tight scroll-mt-24 select-text'

  switch (level) {
    case 1:
      return (
        <h1
          id={headingId}
          className={cn(
            commonClasses,
            'text-2xl sm:text-3xl font-bold pb-2.5 mb-4 mt-7 border-b border-border/70 first:mt-0',
            className
          )}
        >
          <span>{children}</span>
          {anchorButton}
        </h1>
      )
    case 2:
      return (
        <h2
          id={headingId}
          className={cn(
            commonClasses,
            'text-xl sm:text-2xl font-bold pb-2 mb-3.5 mt-6 border-b border-border/60 first:mt-0',
            className
          )}
        >
          <span>{children}</span>
          {anchorButton}
        </h2>
      )
    case 3:
      return (
        <h3
          id={headingId}
          className={cn(commonClasses, 'text-lg sm:text-xl font-semibold mb-3 mt-5 first:mt-0', className)}
        >
          <span>{children}</span>
          {anchorButton}
        </h3>
      )
    case 4:
      return (
        <h4
          id={headingId}
          className={cn(commonClasses, 'text-base sm:text-lg font-semibold mb-2 mt-4 first:mt-0', className)}
        >
          <span>{children}</span>
          {anchorButton}
        </h4>
      )
    case 5:
      return (
        <h5
          id={headingId}
          className={cn(commonClasses, 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-3 first:mt-0', className)}
        >
          <span>{children}</span>
          {anchorButton}
        </h5>
      )
    case 6:
    default:
      return (
        <h6
          id={headingId}
          className={cn(commonClasses, 'text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 mt-3 first:mt-0', className)}
        >
          <span>{children}</span>
          {anchorButton}
        </h6>
      )
  }
}
