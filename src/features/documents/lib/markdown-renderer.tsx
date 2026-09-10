import React, { useState } from 'react'
import {
  Copy01Icon,
  CheckmarkBadge01Icon,
  LinkSquare02Icon,
  InformationCircleIcon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { cn } from '@/lib/utils'

export interface RichMarkdownRendererProps {
  content: string
  className?: string
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`, ~~strike~~, [links](url)
 */
export function renderInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return []

  // Tokenize inline markdown
  const elements: React.ReactNode[] = []
  // Regex matches: links, code spans, bold-italic, bold, italic, strikethrough
  const regex =
    /(\[(.+?)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*|~~([^~]+)~~)/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index))
    }

    const fullMatch = match[0]
    const linkText = match[2]
    const linkUrl = match[3]
    const inlineCode = match[4]
    const boldItalic = match[5]
    const bold = match[6]
    const italic = match[7]
    const strike = match[8]

    if (linkUrl) {
      elements.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80 inline-flex items-center gap-0.5 font-medium"
        >
          <span>{linkText}</span>
          <AppIcon icon={LinkSquare02Icon} size={11} className="inline opacity-70" />
        </a>
      )
    } else if (inlineCode) {
      elements.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded-md bg-surface-muted border border-border/80 font-mono text-[12px] text-foreground font-medium"
        >
          {inlineCode}
        </code>
      )
    } else if (boldItalic) {
      elements.push(
        <strong key={match.index} className="font-bold italic text-foreground">
          {boldItalic}
        </strong>
      )
    } else if (bold) {
      elements.push(
        <strong key={match.index} className="font-bold text-foreground">
          {bold}
        </strong>
      )
    } else if (italic) {
      elements.push(
        <em key={match.index} className="italic text-foreground/90">
          {italic}
        </em>
      )
    } else if (strike) {
      elements.push(
        <del key={match.index} className="line-through text-muted-foreground">
          {strike}
        </del>
      )
    } else {
      elements.push(fullMatch)
    }

    lastIndex = match.index + fullMatch.length
  }

  // Push trailing text
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex))
  }

  return elements
}

interface CodeBlockProps {
  code: string
  language?: string
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="my-4 rounded-xl border border-border/80 bg-surface-elevated/70 overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-border/60 bg-surface-muted/50 text-[11px] font-mono text-muted-foreground select-none">
        <span className="uppercase font-semibold tracking-wider text-[10px]">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-surface-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Copy code"
        >
          <AppIcon
            icon={copied ? CheckmarkBadge01Icon : Copy01Icon}
            size={12}
            className={copied ? 'text-primary' : ''}
          />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[12.5px] font-mono leading-relaxed text-foreground select-text whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/**
 * Robust, safe GitHub-flavored markdown renderer
 */
export function RichMarkdownRenderer({ content, className }: RichMarkdownRendererProps) {
  if (!content || !content.trim()) {
    return (
      <div className="p-6 text-xs font-mono text-muted-foreground italic">
        No document content.
      </div>
    )
  }

  const rawLines = content.split(/\r?\n/)
  const renderedElements: React.ReactNode[] = []

  let i = 0
  const len = rawLines.length

  while (i < len) {
    const line = rawLines[i]
    const trimmed = line.trim()

    // Empty line
    if (!trimmed) {
      i++
      continue
    }

    // 1. Fenced Code Block: ```
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < len && !rawLines[i].trim().startsWith('```')) {
        codeLines.push(rawLines[i])
        i++
      }
      i++ // Skip closing ```
      renderedElements.push(
        <CodeBlock
          key={`code-${i}`}
          code={codeLines.join('\n')}
          language={language}
        />
      )
      continue
    }

    // 2. Headings (# H1 to ###### H6)
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ') ||
        trimmed.startsWith('#### ') || trimmed.startsWith('##### ') || trimmed.startsWith('###### ')) {
      const level = trimmed.indexOf(' ')
      const headingText = trimmed.slice(level + 1)
      const parsedChildren = renderInlineMarkdown(headingText)

      switch (level) {
        case 1:
          renderedElements.push(
            <h1
              key={`h1-${i}`}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground pb-2.5 mb-4 mt-6 border-b border-border/80 first:mt-0"
            >
              {parsedChildren}
            </h1>
          )
          break
        case 2:
          renderedElements.push(
            <h2
              key={`h2-${i}`}
              className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground pb-2 mb-3 mt-5 border-b border-border/60 first:mt-0"
            >
              {parsedChildren}
            </h2>
          )
          break
        case 3:
          renderedElements.push(
            <h3
              key={`h3-${i}`}
              className="text-lg font-semibold tracking-tight text-foreground mb-2 mt-4 first:mt-0"
            >
              {parsedChildren}
            </h3>
          )
          break
        case 4:
          renderedElements.push(
            <h4 key={`h4-${i}`} className="text-base font-semibold text-foreground mb-2 mt-3">
              {parsedChildren}
            </h4>
          )
          break
        default:
          renderedElements.push(
            <h5 key={`h5-${i}`} className="text-sm font-semibold text-foreground mb-1.5 mt-2">
              {parsedChildren}
            </h5>
          )
          break
      }
      i++
      continue
    }

    // 3. Horizontal Rule: ---, ***, ___
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      renderedElements.push(<hr key={`hr-${i}`} className="my-6 border-t border-border/80" />)
      i++
      continue
    }

    // 4. Blockquote & GitHub Alerts (> [!NOTE], > [!TIP], etc.)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < len && rawLines[i].trim().startsWith('>')) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s?/, ''))
        i++
      }

      const firstQuoteLine = quoteLines[0] || ''
      const isAlert = firstQuoteLine.startsWith('[!') && firstQuoteLine.endsWith(']')

      if (isAlert) {
        const alertType = firstQuoteLine.slice(2, -1).toUpperCase()
        const bodyLines = quoteLines.slice(1)
        const isWarning = alertType === 'WARNING' || alertType === 'CAUTION'

        renderedElements.push(
          <div
            key={`alert-${i}`}
            className={cn(
              'my-4 p-4 rounded-xl border flex gap-3 text-xs leading-relaxed',
              isWarning
                ? 'bg-amber-500/10 border-amber-500/30 text-foreground'
                : 'bg-primary/5 border-primary/20 text-foreground'
            )}
          >
            <AppIcon
              icon={isWarning ? AlertCircleIcon : InformationCircleIcon}
              size={18}
              className={isWarning ? 'text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' : 'text-primary shrink-0 mt-0.5'}
            />
            <div className="space-y-1 min-w-0">
              <span className="font-semibold uppercase tracking-wider text-[11px] block">
                {alertType}
              </span>
              <div>
                {bodyLines.map((l, bIdx) => (
                  <p key={bIdx}>{renderInlineMarkdown(l)}</p>
                ))}
              </div>
            </div>
          </div>
        )
      } else {
        renderedElements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-3 pl-4 border-l-3 border-border py-1 italic text-muted-foreground text-xs sm:text-sm leading-relaxed"
          >
            {quoteLines.map((l, qIdx) => (
              <p key={qIdx}>{renderInlineMarkdown(l)}</p>
            ))}
          </blockquote>
        )
      }
      continue
    }

    // 5. Tables: | Header | Header |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = []
      while (i < len && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
        tableLines.push(rawLines[i].trim())
        i++
      }

      if (tableLines.length >= 2) {
        const headers = tableLines[0]
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim())
        // Line 1 is usually the separator |-|-|-|
        const bodyRows = tableLines.slice(2).map((rowLine) =>
          rowLine
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim())
        )

        renderedElements.push(
          <div key={`table-${i}`} className="my-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-surface-muted/60 border-b border-border font-semibold text-foreground">
                <tr>
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="py-2 px-3 border-r border-border/50 last:border-r-0">
                      {renderInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-border/40 hover:bg-surface-elevated/30">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-1.5 px-3 border-r border-border/40 last:border-r-0 text-foreground/90">
                        {renderInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        continue
      }
    }

    // 6. Task Lists: - [ ] or - [x]
    if (/^[-*+]\s+\[[ xX]\]\s+/.test(trimmed)) {
      const taskItems: { checked: boolean; text: string }[] = []
      while (i < len && /^[-*+]\s+\[[ xX]\]\s+/.test(rawLines[i].trim())) {
        const lineItem = rawLines[i].trim()
        const isChecked = lineItem.slice(3, 4).toLowerCase() === 'x'
        const itemText = lineItem.replace(/^[-*+]\s+\[[ xX]\]\s+/, '')
        taskItems.push({ checked: isChecked, text: itemText })
        i++
      }

      renderedElements.push(
        <ul key={`tasks-${i}`} className="my-3 space-y-1.5 text-xs sm:text-sm">
          {taskItems.map((item, tIdx) => (
            <li key={tIdx} className="flex items-start gap-2 text-foreground">
              <input
                type="checkbox"
                checked={item.checked}
                readOnly
                className="mt-0.5 rounded border-border text-primary focus:ring-0 cursor-default"
              />
              <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                {renderInlineMarkdown(item.text)}
              </span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // 7. Unordered Lists: - item, * item, + item
    if (/^[-*+]\s+/.test(trimmed)) {
      const listItems: string[] = []
      while (i < len && /^[-*+]\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^[-*+]\s+/, ''))
        i++
      }

      renderedElements.push(
        <ul key={`ul-${i}`} className="my-3 list-disc pl-5 space-y-1 text-xs sm:text-sm text-foreground/90 leading-relaxed">
          {listItems.map((it, lIdx) => (
            <li key={lIdx}>{renderInlineMarkdown(it)}</li>
          ))}
        </ul>
      )
      continue
    }

    // 8. Ordered Lists: 1. item, 2. item
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = []
      while (i < len && /^\d+\.\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }

      renderedElements.push(
        <ol key={`ol-${i}`} className="my-3 list-decimal pl-5 space-y-1 text-xs sm:text-sm text-foreground/90 leading-relaxed">
          {listItems.map((it, lIdx) => (
            <li key={lIdx}>{renderInlineMarkdown(it)}</li>
          ))}
        </ol>
      )
      continue
    }

    // 9. Standard Paragraph
    renderedElements.push(
      <p key={`p-${i}`} className="my-2.5 text-xs sm:text-sm text-foreground/90 leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    )
    i++
  }

  return (
    <div className={cn('prose prose-neutral dark:prose-invert max-w-none space-y-1 select-text', className)}>
      {renderedElements}
    </div>
  )
}
