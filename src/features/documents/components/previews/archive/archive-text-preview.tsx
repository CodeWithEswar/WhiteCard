import { cn } from '@/lib/utils'

export interface ArchiveTextPreviewProps {
  content: string
  isWrapped?: boolean
  className?: string
}

export function ArchiveTextPreview({
  content,
  isWrapped = false,
  className,
}: ArchiveTextPreviewProps) {
  return (
    <div
      className={cn(
        'w-full flex-1 overflow-auto p-4 font-mono text-xs text-foreground bg-surface select-text',
        isWrapped ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
        className
      )}
    >
      {content || 'Empty file'}
    </div>
  )
}
