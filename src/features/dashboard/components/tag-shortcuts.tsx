import { useNavigate, Link } from 'react-router-dom'
import { Tag01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { TagSummary } from '../dashboard.types'
import { AppIcon } from '@/components/icons/app-icon'
import { resolveTagColor } from '@/config/tag-colors'

interface TagShortcutsProps {
  tags: TagSummary[]
}

export function TagShortcuts({ tags }: TagShortcutsProps) {
  const navigate = useNavigate()

  return (
    <section aria-label="Browse by Tag" className="space-y-3">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 px-0.5">
        <div>
          <div className="flex items-center gap-2">
            <AppIcon icon={Tag01Icon} size={16} className="text-muted-foreground" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Browse by Tag
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quickly filter your documents by organization labels.
          </p>
        </div>

        <Link
          to="/app/search"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 py-1"
        >
          <span>All tags</span>
          <AppIcon icon={ArrowRight01Icon} size={13} />
        </Link>
      </div>

      {/* Tags Flow or Clean Empty State */}
      {tags.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-border bg-card/60 text-xs text-muted-foreground flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">No tags yet</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Create tags when organizing or uploading your documents.
            </p>
          </div>
          <Link
            to="/app/search"
            className="text-xs font-medium text-primary hover:underline"
          >
            Search Documents
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 pt-0.5">
          {tags.map((tag) => {
            const config = resolveTagColor(tag.label)
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => navigate(`/app/search?tag=${encodeURIComponent(tag.label)}`)}
                className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring hover:opacity-90 ${config.bg} ${config.text} ${config.border}`}
              >
                <span className={`size-2 rounded-full shrink-0 ${tag.colorDot || config.dot}`} aria-hidden="true" />
                <span>{tag.label}</span>
                <span className="text-[10px] font-mono opacity-70 px-1.5 py-0.2 rounded-full bg-background/50 border border-current/20">
                  {tag.count}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
