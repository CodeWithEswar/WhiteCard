export function MarkdownLoading() {
  return (
    <div className="w-full max-w-[980px] mx-auto p-6 sm:p-10 space-y-6 animate-pulse select-none">
      {/* Title skeleton */}
      <div className="space-y-2 pb-3 border-b border-border/50">
        <div className="h-8 w-2/3 bg-muted/60 rounded-lg" />
        <div className="h-4 w-1/3 bg-muted/40 rounded-md" />
      </div>

      {/* Badges row */}
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-muted/50 rounded-md" />
        <div className="h-6 w-24 bg-muted/50 rounded-md" />
        <div className="h-6 w-16 bg-muted/50 rounded-md" />
      </div>

      {/* Paragraphs */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted/40 rounded" />
        <div className="h-4 w-5/6 bg-muted/40 rounded" />
        <div className="h-4 w-4/6 bg-muted/40 rounded" />
      </div>

      {/* Code block skeleton */}
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-2">
        <div className="h-3 w-1/4 bg-muted/50 rounded" />
        <div className="h-3 w-3/4 bg-muted/40 rounded" />
        <div className="h-3 w-1/2 bg-muted/40 rounded" />
      </div>

      {/* Subheading */}
      <div className="h-6 w-1/3 bg-muted/50 rounded-lg pt-4" />

      {/* List items */}
      <div className="space-y-2 pl-4">
        <div className="h-3.5 w-1/2 bg-muted/40 rounded" />
        <div className="h-3.5 w-2/3 bg-muted/40 rounded" />
        <div className="h-3.5 w-1/3 bg-muted/40 rounded" />
      </div>

      <div className="text-center pt-4">
        <span className="text-xs text-muted-foreground font-mono">Preparing Markdown…</span>
      </div>
    </div>
  )
}
