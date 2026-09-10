import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { MarkdownHeading } from './markdown-heading'
import { MarkdownCodeBlock } from './markdown-code-block'
import { MarkdownInlineCode } from './markdown-inline-code'
import {
  MarkdownTable,
  MarkdownTableHead,
  MarkdownTableBody,
  MarkdownTableRow,
  MarkdownTableCell,
} from './markdown-table'
import { MarkdownBlockquote } from './markdown-blockquote'
import { MarkdownImage } from './markdown-image'
import { MarkdownLink } from './markdown-link'
import { MarkdownTaskItem } from './markdown-task-item'
import { MarkdownDetails, MarkdownSummary } from './markdown-details'
import { MarkdownKbd } from './markdown-kbd'
import { MarkdownBadge } from './markdown-badge'
import { markdownSanitizeSchema } from '@/features/documents/lib/markdown/markdown-sanitize'
import { slugify } from '@/features/documents/lib/markdown/markdown-slug'
import { cn } from '@/lib/utils'
import type { MarkdownContext, HeadingItem } from '@/features/documents/lib/markdown/markdown-types'

interface MarkdownDocumentProps {
  content: string
  context?: MarkdownContext
  onHeadingsExtracted?: (headings: HeadingItem[]) => void
  className?: string
}

export function MarkdownDocument({
  content,
  context,
  onHeadingsExtracted,
  className,
}: MarkdownDocumentProps) {
  // Extract headings for Table of Contents
  useMemo(() => {
    if (!onHeadingsExtracted) return
    const headings: HeadingItem[] = []
    const lines = content.split(/\r?\n/)
    const seenSlugs = new Map<string, number>()

    for (const line of lines) {
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const rawTitle = match[2].trim().replace(/[*_~`]/g, '')
        let baseSlug = slugify(rawTitle) || 'heading'
        const count = seenSlugs.get(baseSlug) || 0
        seenSlugs.set(baseSlug, count + 1)
        const id = count === 0 ? baseSlug : `${baseSlug}-${count}`

        headings.push({
          id,
          title: rawTitle,
          level,
        })
      }
    }

    onHeadingsExtracted(headings)
  }, [content, onHeadingsExtracted])

  // Custom component map for react-markdown
  const components = useMemo(() => {
    return {
      h1: ({ node, ...props }: any) => <MarkdownHeading level={1} {...props} />,
      h2: ({ node, ...props }: any) => <MarkdownHeading level={2} {...props} />,
      h3: ({ node, ...props }: any) => <MarkdownHeading level={3} {...props} />,
      h4: ({ node, ...props }: any) => <MarkdownHeading level={4} {...props} />,
      h5: ({ node, ...props }: any) => <MarkdownHeading level={5} {...props} />,
      h6: ({ node, ...props }: any) => <MarkdownHeading level={6} {...props} />,

      pre: ({ node, children, ...props }: any) => {
        // Look inside <pre><code>...</code></pre>
        const child = React.Children.toArray(children)[0]
        if (React.isValidElement(child) && (child.props as any)) {
          const className = (child.props as any).className || ''
          const match = /language-(\w+)/.exec(className || '')
          return (
            <MarkdownCodeBlock
              language={match ? match[1] : undefined}
              title={props.title}
            >
              {(child.props as any).children}
            </MarkdownCodeBlock>
          )
        }
        return <MarkdownCodeBlock>{children}</MarkdownCodeBlock>
      },

      code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '')
        if (!inline && match) {
          return (
            <MarkdownCodeBlock language={match[1]} {...props}>
              {children}
            </MarkdownCodeBlock>
          )
        }
        return <MarkdownInlineCode className={className}>{children}</MarkdownInlineCode>
      },

      table: ({ node, ...props }: any) => <MarkdownTable {...props} />,
      thead: ({ node, ...props }: any) => <MarkdownTableHead {...props} />,
      tbody: ({ node, ...props }: any) => <MarkdownTableBody {...props} />,
      tr: ({ node, ...props }: any) => <MarkdownTableRow {...props} />,
      th: ({ node, ...props }: any) => <MarkdownTableCell isHeader {...props} />,
      td: ({ node, ...props }: any) => <MarkdownTableCell {...props} />,

      blockquote: ({ node, ...props }: any) => <MarkdownBlockquote {...props} />,

      li: ({ node, checked, children, className, ...props }: any) => {
        if (typeof checked === 'boolean') {
          return <MarkdownTaskItem checked={checked}>{children}</MarkdownTaskItem>
        }
        return (
          <li className={cn('leading-relaxed my-0.5', className)} {...props}>
            {children}
          </li>
        )
      },

      a: ({ node, href, children, title, ...props }: any) => (
        <MarkdownLink href={href} title={title} context={context} {...props}>
          {children}
        </MarkdownLink>
      ),

      img: ({ node, src, alt, title, ...props }: any) => (
        <MarkdownImage src={src} alt={alt} title={title} context={context} {...props} />
      ),

      details: ({ node, ...props }: any) => <MarkdownDetails {...props} />,
      summary: ({ node, ...props }: any) => <MarkdownSummary {...props} />,

      kbd: ({ node, ...props }: any) => <MarkdownKbd {...props} />,

      span: ({ node, className, children, ...props }: any) => {
        const brand = props['data-brand']
        if (brand) {
          return (
            <MarkdownBadge
              brand={brand}
              label={typeof children === 'string' ? children : brand}
              className={className}
            >
              {children}
            </MarkdownBadge>
          )
        }
        return <span className={className} {...props}>{children}</span>
      },

      div: ({ node, align, className, children, ...props }: any) => {
        const alignClass =
          align === 'center'
            ? 'text-center flex flex-col items-center justify-center'
            : align === 'right'
            ? 'text-right'
            : ''
        return (
          <div className={cn(alignClass, className)} {...props}>
            {children}
          </div>
        )
      },

      hr: () => <hr className="my-6 border-border/70" />,

      p: ({ node, align, className, children, ...props }: any) => {
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : ''
        return (
          <p className={cn('my-3 text-sm leading-relaxed text-foreground select-text', alignClass, className)} {...props}>
            {children}
          </p>
        )
      },

      ul: ({ node, className, ...props }: any) => (
        <ul className={cn('my-3 pl-6 list-disc text-sm space-y-1 select-text', className)} {...props} />
      ),

      ol: ({ node, className, ...props }: any) => (
        <ol className={cn('my-3 pl-6 list-decimal text-sm space-y-1 select-text', className)} {...props} />
      ),

      del: ({ node, className, ...props }: any) => (
        <del className={cn('line-through text-muted-foreground', className)} {...props} />
      ),

      sub: ({ node, ...props }: any) => <sub className="text-[0.75em]" {...props} />,
      sup: ({ node, ...props }: any) => <sup className="text-[0.75em]" {...props} />,
    }
  }, [context])

  return (
    <article
      className={cn(
        'w-full max-w-[1012px] mx-auto px-5 sm:px-10 py-8 text-foreground text-sm leading-relaxed font-sans select-text',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSanitizeSchema]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
