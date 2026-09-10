export function DocumentViewerSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none animate-pulse">
      {/* Centered Document Page Frame */}
      <div className="w-full max-w-3xl h-[70dvh] rounded-2xl border border-border/60 bg-muted/20 flex flex-col justify-between p-8 shadow-xs">
        <div className="space-y-4">
          <div className="h-4 w-48 rounded-md bg-muted/60" />
          <div className="h-3 w-32 rounded-md bg-muted/40" />
          <div className="h-px bg-border/40 my-4" />
          <div className="space-y-2.5 pt-2">
            <div className="h-2.5 w-full rounded bg-muted/30" />
            <div className="h-2.5 w-5/6 rounded bg-muted/30" />
            <div className="h-2.5 w-4/6 rounded bg-muted/30" />
            <div className="h-2.5 w-full rounded bg-muted/30" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-border/40">
          <div className="h-3 w-20 rounded bg-muted/40" />
          <div className="h-3 w-16 rounded bg-muted/40" />
        </div>
      </div>
    </div>
  )
}
