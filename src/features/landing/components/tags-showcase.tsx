import { TagChip } from '../../tags/components/tag-chip'

export function TagsShowcase() {
  const tags = [
    { label: 'Identity', desc: 'Passports, National IDs, Social Security' },
    { label: 'Education', desc: 'Degree diplomas, marksheets, grade cards' },
    { label: 'Travel', desc: 'Visas, entry permits, transit itineraries' },
    { label: 'Vehicle', desc: 'Driving licences, registration, pollution certificates' },
    { label: 'Renewal', desc: 'Time-sensitive expiration and validity checks' },
    { label: 'Personal', desc: 'Medical records, family deeds, tax filings' },
  ]

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-10">
        {/* Section Heading */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Taxonomy & Tags
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Multi-dimensional organization
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Organize documents with restrained theme-safe tag chips. Filter instantaneously without deep folder structures.
          </p>
        </div>

        {/* Tags Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {tags.map((t) => (
            <div
              key={t.label}
              className="p-4 rounded-2xl border border-border/80 bg-surface/80 flex items-start gap-3 text-left"
            >
              <div className="pt-0.5">
                <TagChip label={t.label} variant="default" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
