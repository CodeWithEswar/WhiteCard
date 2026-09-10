import React, { useState, useEffect } from 'react'
import { Image01Icon, AlertCircleIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { isBadgeUrl } from '@/features/documents/lib/markdown/markdown-badges'
import { cn } from '@/lib/utils'
import type { MarkdownContext } from '@/features/documents/lib/markdown/markdown-types'

interface MarkdownImageProps {
  src?: string
  alt?: string
  title?: string
  className?: string
  context?: MarkdownContext
}

export function MarkdownImage({
  src,
  alt,
  title,
  className,
  context,
}: MarkdownImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(src || null)
  const [hasError, setHasError] = useState(false)
  const [isLoadingRelative, setIsLoadingRelative] = useState(false)

  const isBadge = isBadgeUrl(src)

  // Resolve relative image if in archive context
  useEffect(() => {
    if (!src) return

    const isRelative = src.startsWith('./') || src.startsWith('../') || (!src.startsWith('http') && !src.startsWith('data:'))

    if (isRelative && context?.kind === 'archive' && context.resolveRelativePath) {
      let isMounted = true
      setIsLoadingRelative(true)

      Promise.resolve(context.resolveRelativePath(src))
        .then((resolved) => {
          if (isMounted && resolved) {
            setResolvedSrc(resolved)
          }
        })
        .catch(() => {
          if (isMounted) setHasError(true)
        })
        .finally(() => {
          if (isMounted) setIsLoadingRelative(false)
        })

      return () => {
        isMounted = false
      }
    } else if (isRelative && context?.kind !== 'archive') {
      // Standalone relative image is unavailable
      setHasError(true)
    }
  }, [src, context])

  // Badge image rendering (e.g. shields.io)
  if (isBadge) {
    if (hasError) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/60 bg-muted/40 text-[10px] font-mono text-muted-foreground mr-1.5 align-middle">
          {alt || 'badge'}
        </span>
      )
    }

    return (
      <img
        src={resolvedSrc || src}
        alt={alt || 'Badge'}
        title={title}
        onError={() => setHasError(true)}
        className={cn('inline-block align-middle my-0.5 mr-1.5 h-5 w-auto max-w-none select-none', className)}
        loading="lazy"
      />
    )
  }

  // Broken or relative image unavailable fallback
  if (hasError || !src) {
    const filename = src ? src.split('/').pop() : 'image'
    return (
      <div className="my-4 p-4 rounded-xl border border-border/70 bg-card/60 flex items-center gap-3 text-left max-w-md select-none">
        <div className="size-10 rounded-lg border border-border bg-muted/40 flex items-center justify-center text-muted-foreground shrink-0">
          <AppIcon icon={Image01Icon} size={20} />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-xs font-semibold text-foreground truncate">
            {alt ? `${alt} (Image unavailable)` : 'Image unavailable'}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono truncate">
            {filename}
          </p>
        </div>
      </div>
    )
  }

  if (isLoadingRelative) {
    return (
      <div className="my-4 h-24 rounded-xl border border-border/60 bg-muted/20 animate-pulse flex items-center justify-center text-xs text-muted-foreground font-mono">
        Loading image…
      </div>
    )
  }

  return (
    <span className="block my-4 select-none">
      <img
        src={resolvedSrc || src}
        alt={alt || ''}
        title={title}
        onError={() => setHasError(true)}
        className={cn(
          'max-w-full h-auto rounded-xl border border-border/60 shadow-2xs transition-transform duration-150',
          className
        )}
        loading="lazy"
      />
      {title && (
        <span className="block text-center text-xs text-muted-foreground mt-1.5 font-mono">
          {title}
        </span>
      )}
    </span>
  )
}
