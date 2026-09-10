import React from 'react'
import { MarkdownCallout } from './markdown-callout'
import { cn } from '@/lib/utils'
import type { MarkdownCalloutType } from '@/features/documents/lib/markdown/markdown-types'

interface MarkdownBlockquoteProps {
  children?: React.ReactNode
  className?: string
}

export function MarkdownBlockquote({ children, className }: MarkdownBlockquoteProps) {
  // Check if first paragraph starts with [!NOTE], [!TIP], etc.
  let calloutType: MarkdownCalloutType | null = null
  let calloutChildren: React.ReactNode = children

  // Inspect React children
  const childrenArray = React.Children.toArray(children)
  if (childrenArray.length > 0) {
    const firstChild = childrenArray[0]
    if (React.isValidElement(firstChild) && (firstChild.props as any)?.children) {
      const pChildren = React.Children.toArray((firstChild.props as any).children)
      if (typeof pChildren[0] === 'string') {
        const text = pChildren[0].trim()
        const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i)
        if (match) {
          calloutType = match[1].toLowerCase() as MarkdownCalloutType
          const remainingText = match[2]

          // Build modified first paragraph without [!TYPE]
          const modifiedPChildren = remainingText
            ? [remainingText, ...pChildren.slice(1)]
            : pChildren.slice(1)

          const modifiedFirstChild = React.cloneElement(firstChild as React.ReactElement<any>, {
            children: modifiedPChildren,
          })

          calloutChildren = [modifiedFirstChild, ...childrenArray.slice(1)]
        }
      }
    }
  }

  if (calloutType) {
    return (
      <MarkdownCallout type={calloutType} className={className}>
        {calloutChildren}
      </MarkdownCallout>
    )
  }

  return (
    <blockquote
      className={cn(
        'border-l-3 border-border/80 pl-4 py-1 my-3 text-muted-foreground italic text-xs leading-relaxed select-text [&>p]:m-0',
        className
      )}
    >
      {children}
    </blockquote>
  )
}
