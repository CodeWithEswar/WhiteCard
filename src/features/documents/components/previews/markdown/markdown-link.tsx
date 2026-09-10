import React from 'react'
import { LinkSquare02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { isSafeUrl, isExternalUrl } from '@/features/documents/lib/markdown/markdown-url-policy'
import { cn } from '@/lib/utils'
import type { MarkdownContext } from '@/features/documents/lib/markdown/markdown-types'

interface MarkdownLinkProps {
  href?: string
  children?: React.ReactNode
  title?: string
  className?: string
  context?: MarkdownContext
}

export function MarkdownLink({
  href,
  children,
  title,
  className,
  context,
}: MarkdownLinkProps) {
  // Reject unsafe protocols (javascript:, vbscript:, etc.)
  if (!isSafeUrl(href)) {
    return <span className={cn('text-foreground underline', className)}>{children}</span>
  }

  const isExternal = isExternalUrl(href)
  const isAnchor = href?.startsWith('#')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAnchor && href) {
      e.preventDefault()
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (!isExternal && href && context?.kind === 'archive' && context.openArchiveEntry) {
      // Relative link inside archive
      e.preventDefault()
      context.openArchiveEntry(href)
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      title={title}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        'group text-primary underline underline-offset-3 hover:text-primary/80 font-medium inline-flex items-center gap-0.5 transition-colors cursor-pointer',
        className
      )}
    >
      <span>{children}</span>
      {isExternal && (
        <AppIcon
          icon={LinkSquare02Icon}
          size={11}
          className="inline opacity-0 group-hover:opacity-80 transition-opacity ml-0.5 shrink-0"
          aria-hidden="true"
        />
      )}
    </a>
  )
}
