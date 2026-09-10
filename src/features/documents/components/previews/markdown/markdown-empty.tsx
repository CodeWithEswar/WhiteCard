import { File01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'

export function MarkdownEmpty() {
  return (
    <div className="w-full flex-1 flex items-center justify-center p-8 text-center select-none">
      <div className="max-w-md p-6 rounded-2xl border border-border/70 bg-card/60 space-y-2">
        <div className="size-12 rounded-xl border border-border bg-muted/40 flex items-center justify-center mx-auto text-muted-foreground">
          <AppIcon icon={File01Icon} size={24} />
        </div>
        <p className="text-xs font-semibold text-foreground">This Markdown file is empty.</p>
        <p className="text-[11px] text-muted-foreground font-mono">
          The document contains no characters or lines.
        </p>
      </div>
    </div>
  )
}
