import React, { useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

interface MarkdownCodeBlockProps {
  language?: string
  children?: React.ReactNode
  className?: string
  title?: string
}

// Friendly display name for code languages
const LANGUAGE_NAMES: Record<string, string> = {
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  py: 'Python',
  python: 'Python',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Zsh',
  ps1: 'PowerShell',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  xml: 'XML',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sql: 'SQL',
  rust: 'Rust',
  rs: 'Rust',
  go: 'Go',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  md: 'Markdown',
  markdown: 'Markdown',
  text: 'Text',
  txt: 'Text',
}

export function MarkdownCodeBlock({
  language: rawLang,
  children,
  className,
  title,
}: MarkdownCodeBlockProps) {
  const { copied, copy } = useCopyToClipboard({ timeout: 1500 })

  // Extract raw text from children
  const codeContent = useMemo(() => {
    return React.Children.toArray(children)
      .map((c) => (typeof c === 'string' ? c : ''))
      .join('')
      .replace(/\n$/, '') // remove trailing newline
  }, [children])

  const lines = useMemo(() => codeContent.split('\n'), [codeContent])
  const showLineNumbers = lines.length >= 4

  const langKey = (rawLang || '').toLowerCase().replace(/^language-/, '').trim()
  const displayLanguage = LANGUAGE_NAMES[langKey] || langKey.toUpperCase() || 'Code'

  // Prism highlighted tokens
  const highlightedHtml = useMemo(() => {
    if (!codeContent) return ''
    const prismLang = Prism.languages[langKey] || Prism.languages.typescript || Prism.languages.markup
    try {
      return Prism.highlight(codeContent, prismLang, langKey || 'text')
    } catch {
      return codeContent
    }
  }, [codeContent, langKey])

  return (
    <div
      className={cn(
        'my-4 rounded-xl border border-border/70 bg-card overflow-hidden text-xs font-mono select-text shadow-2xs',
        className
      )}
    >
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-border/60 bg-muted/40 text-muted-foreground select-none">
        <div className="flex items-center gap-2">
          {title ? (
            <span className="font-semibold text-foreground text-[11px] truncate max-w-[240px]">
              {title}
            </span>
          ) : (
            <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
              {displayLanguage}
            </span>
          )}
          {title && (
            <span className="text-[10px] uppercase tracking-wider px-1 py-0.2 rounded bg-muted text-muted-foreground">
              {displayLanguage}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => copy(codeContent)}
          className="h-6 px-2 rounded-md text-[11px] gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </Button>
      </div>

      {/* Code Content with optional line numbers */}
      <div className="overflow-x-auto p-3 text-foreground leading-relaxed">
        {showLineNumbers ? (
          <div className="flex min-w-full">
            <div className="select-none pr-3.5 text-right text-muted-foreground/40 border-r border-border/40 shrink-0 text-[11px] font-mono">
              {lines.map((_, i) => (
                <div key={i} className="leading-relaxed">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="pl-3.5 flex-1 min-w-0">
              <pre className="whitespace-pre overflow-x-auto leading-relaxed">
                <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
              </pre>
            </div>
          </div>
        ) : (
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
          </pre>
        )}
      </div>
    </div>
  )
}
