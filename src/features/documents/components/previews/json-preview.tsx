import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  CodeIcon,
  Copy01Icon,
  Tick02Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Search01Icon,
  AlertCircleIcon,
  Download01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { VaultDocument } from '@/types/document'

interface JsonPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  onFetchContent: () => void
  onDownload?: () => void
  className?: string
}

// Interactive JSON Tree Node Component
interface JsonNodeProps {
  name?: string
  value: unknown
  depth?: number
  path?: string
  filterQuery?: string
  expandedKeys: Set<string>
  toggleExpand: (path: string) => void
  onCopyPath: (path: string) => void
}

function JsonNode({
  name,
  value,
  depth = 0,
  path = '$',
  filterQuery,
  expandedKeys,
  toggleExpand,
  onCopyPath,
}: JsonNodeProps) {
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value)
  const isArray = Array.isArray(value)
  const isComplex = isObject || isArray
  const isExpanded = expandedKeys.has(path)

  const entries = useMemo(() => {
    if (isArray) {
      return (value as unknown[]).map((v, i) => [String(i), v] as const)
    }
    if (isObject) {
      return Object.entries(value as Record<string, unknown>)
    }
    return []
  }, [isArray, isObject, value])

  const childCount = entries.length

  // Highlight matching text if query present
  const renderValue = (val: unknown) => {
    if (val === null) {
      return <span className="text-muted-foreground/80 italic font-mono">null</span>
    }
    if (typeof val === 'undefined') {
      return <span className="text-muted-foreground/70 italic font-mono">undefined</span>
    }
    if (typeof val === 'boolean') {
      return (
        <span className="text-primary font-semibold font-mono">
          {val ? 'true' : 'false'}
        </span>
      )
    }
    if (typeof val === 'number') {
      return <span className="text-blue-500 dark:text-blue-400 font-mono">{val}</span>
    }
    if (typeof val === 'string') {
      return (
        <span className="text-emerald-600 dark:text-emerald-400 font-mono break-all">
          &quot;{val}&quot;
        </span>
      )
    }
    return <span className="text-foreground font-mono">{String(val)}</span>
  }

  // Check if this node or any child matches filter query
  const matchesQuery = useMemo(() => {
    if (!filterQuery) return true
    const q = filterQuery.toLowerCase()
    if (name && name.toLowerCase().includes(q)) return true
    if (!isComplex && String(value).toLowerCase().includes(q)) return true
    return false
  }, [filterQuery, name, isComplex, value])

  if (filterQuery && !matchesQuery && !isComplex) {
    return null
  }

  return (
    <div className="text-xs font-mono select-text">
      <div
        className={cn(
          'group flex items-center gap-1.5 py-0.5 px-2 rounded-md hover:bg-muted/40 transition-colors',
          depth > 0 && 'ml-4 border-l border-border/40 pl-2'
        )}
      >
        {isComplex ? (
          <button
            type="button"
            onClick={() => toggleExpand(path)}
            className="size-4 -ml-1 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <AppIcon
              icon={isExpanded ? ArrowDown01Icon : ArrowRight01Icon}
              size={12}
            />
          </button>
        ) : (
          <span className="size-4 -ml-1 shrink-0" />
        )}

        {/* Key / Property Name */}
        {name !== undefined && (
          <span
            onClick={() => onCopyPath(path)}
            className="text-foreground/90 font-medium hover:underline cursor-pointer select-none"
            title={`Click to copy path: ${path}`}
          >
            {name}
            <span className="text-muted-foreground/60 mr-1">:</span>
          </span>
        )}

        {/* Value or Complex Summary */}
        {isComplex ? (
          <span
            onClick={() => toggleExpand(path)}
            className="text-muted-foreground text-[11px] cursor-pointer select-none font-mono"
          >
            {isArray ? `Array(${childCount})` : `Object(${childCount})`}
            {!isExpanded && (
              <span className="text-muted-foreground/60 ml-1.5">
                {isArray ? '[...]' : '{...}'}
              </span>
            )}
          </span>
        ) : (
          <div>{renderValue(value)}</div>
        )}
      </div>

      {/* Expanded Children */}
      {isComplex && isExpanded && (
        <div className="space-y-0.5">
          {entries.map(([childKey, childValue]) => {
            const childPath = isArray ? `${path}[${childKey}]` : `${path}.${childKey}`
            return (
              <JsonNode
                key={childKey}
                name={isArray ? undefined : childKey}
                value={childValue}
                depth={depth + 1}
                path={childPath}
                filterQuery={filterQuery}
                expandedKeys={expandedKeys}
                toggleExpand={toggleExpand}
                onCopyPath={onCopyPath}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export function JsonPreview({
  document: doc,
  content,
  isLoading,
  onFetchContent,
  onDownload,
  className,
}: JsonPreviewProps) {
  const [mode, setMode] = useState<'tree' | 'raw'>('tree')
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedPathToast, setCopiedPathToast] = useState<string | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['$']))

  useEffect(() => {
    if (!content && !isLoading) {
      onFetchContent()
    }
  }, [content, isLoading, onFetchContent])

  // Parse JSON data safely
  const { parsedJson, isValidJson, formattedRaw, parseError } = useMemo(() => {
    if (!content) {
      return { parsedJson: null, isValidJson: true, formattedRaw: '', parseError: null }
    }
    try {
      const parsed = JSON.parse(content)
      const formatted = JSON.stringify(parsed, null, 2)
      return { parsedJson: parsed, isValidJson: true, formattedRaw: formatted, parseError: null }
    } catch (err: any) {
      return {
        parsedJson: null,
        isValidJson: false,
        formattedRaw: content,
        parseError: err.message || 'Malformed JSON syntax',
      }
    }
  }, [content])

  // Automatically expand initial 2 levels on parse
  useEffect(() => {
    if (parsedJson !== null && typeof parsedJson === 'object') {
      const initialKeys = new Set<string>(['$'])
      if (Array.isArray(parsedJson)) {
        parsedJson.slice(0, 10).forEach((_, i) => initialKeys.add(`$[${i}]`))
      } else {
        Object.keys(parsedJson).slice(0, 15).forEach((key) => initialKeys.add(`$.${key}`))
      }
      setExpandedKeys(initialKeys)
    }
  }, [parsedJson])

  const toggleExpand = useCallback((path: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const handleExpandAll = () => {
    if (!parsedJson || typeof parsedJson !== 'object') return
    const all = new Set<string>(['$'])
    const recurse = (val: unknown, currPath: string) => {
      if (val !== null && typeof val === 'object') {
        all.add(currPath)
        if (Array.isArray(val)) {
          val.forEach((item, i) => recurse(item, `${currPath}[${i}]`))
        } else {
          Object.entries(val).forEach(([k, item]) => recurse(item, `${currPath}.${k}`))
        }
      }
    }
    recurse(parsedJson, '$')
    setExpandedKeys(all)
  }

  const handleCollapseAll = () => {
    setExpandedKeys(new Set(['$']))
  }

  const handleCopy = () => {
    const text = formattedRaw || content || ''
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path)
    setCopiedPathToast(`Copied ${path}`)
    setTimeout(() => setCopiedPathToast(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8 select-none">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Parsing JSON document…</span>
        </div>
      </div>
    )
  }

  // Graceful Invalid JSON Fallback (Prompt #20)
  if (!isValidJson && mode === 'tree') {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full p-8 rounded-3xl border border-destructive/30 bg-card/90 backdrop-blur-md space-y-5 shadow-sm">
          <div className="size-16 rounded-2xl border border-destructive/20 bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
            <AppIcon icon={AlertCircleIcon} size={32} />
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
              Invalid JSON
            </span>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Syntax Parsing Error
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {doc.originalFilename} • {doc.sizeFormatted}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-left font-mono text-[11px] text-muted-foreground break-all">
            {parseError || 'Unexpected token or invalid JSON structure.'}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode('raw')}
              className="flex-1 h-9 rounded-xl text-xs font-semibold gap-1.5 border-border"
            >
              <AppIcon icon={File01Icon} size={14} />
              <span>View as Raw Text</span>
            </Button>

            {onDownload && (
              <Button
                size="sm"
                onClick={onDownload}
                className="flex-1 h-9 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
              >
                <AppIcon icon={Download01Icon} size={14} />
                <span>Download</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full flex-1 flex flex-col rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden text-left my-auto max-h-[84dvh]',
        className
      )}
    >
      {/* JSON Viewer Header */}
      <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={CodeIcon} size={15} className="text-primary shrink-0" />
          <span className="font-mono text-[11px] truncate max-w-[200px] text-foreground font-semibold">
            {doc.originalFilename}
          </span>
          <span
            className={cn(
              'text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0',
              isValidJson
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'
            )}
          >
            {isValidJson ? 'JSON' : 'Raw Text'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-lg border border-border/70 bg-surface text-xs font-mono">
            <button
              type="button"
              onClick={() => setMode('tree')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors text-[11px] font-medium',
                mode === 'tree'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Tree
            </button>
            <button
              type="button"
              onClick={() => setMode('raw')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors text-[11px] font-medium',
                mode === 'raw'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Raw
            </button>
          </div>

          {mode === 'tree' && isValidJson && (
            <>
              <button
                type="button"
                onClick={handleExpandAll}
                className="px-2 py-1 rounded-lg border border-border text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden sm:inline-block"
                title="Expand all nodes"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="px-2 py-1 rounded-lg border border-border text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden sm:inline-block"
                title="Collapse all nodes"
              >
                Collapse
              </button>
            </>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-lg text-xs gap-1 border-border"
          >
            <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} />
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </Button>

          {onDownload && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-2.5 rounded-lg text-xs gap-1 border-border"
              title="Download original JSON"
            >
              <AppIcon icon={Download01Icon} size={12} />
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar for Tree mode */}
      {mode === 'tree' && isValidJson && (
        <div className="px-4 py-2 border-b border-border/50 bg-surface/50 flex items-center gap-2">
          <AppIcon icon={Search01Icon} size={14} className="text-muted-foreground shrink-0" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter keys or values in tree…"
            className="h-7 text-xs font-mono bg-transparent border-none shadow-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[11px] font-mono text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Path Toast */}
      {copiedPathToast && (
        <div className="px-4 py-1.5 bg-primary/10 border-b border-primary/20 text-primary text-[11px] font-mono transition-all">
          {copiedPathToast}
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs text-foreground bg-card">
        {mode === 'tree' && isValidJson ? (
          <div className="space-y-0.5">
            <JsonNode
              value={parsedJson}
              path="$"
              filterQuery={searchQuery}
              expandedKeys={expandedKeys}
              toggleExpand={toggleExpand}
              onCopyPath={handleCopyPath}
            />
          </div>
        ) : (
          <pre className="whitespace-pre overflow-x-auto leading-relaxed font-mono text-xs select-text">
            <code>{formattedRaw || content}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
