import type { DocumentSpace } from '../../../types/document'
import { TagSelector } from '../../tags/components/tag-selector'
import { Passport01Icon, Certificate01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'

export interface DocumentMetadataValues {
  space: DocumentSpace
  title: string
  category: string
  tags: string[]
  expiryDate: string
  notes: string
}

interface DocumentMetadataFormProps {
  values: DocumentMetadataValues
  onChange: (values: DocumentMetadataValues) => void
  suggestedTitle?: string
  className?: string
}

export function DocumentMetadataForm({
  values,
  onChange,
  className = '',
}: DocumentMetadataFormProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Required: Space Selection (Government vs Student) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Target Space <span className="text-destructive">*</span></span>
          <span className="text-[10px] text-muted-foreground font-normal">Required</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onChange({ ...values, space: 'government' })}
            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${values.space === 'government'
                ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                : 'border-border bg-surface hover:border-border-strong text-muted-foreground'
              }`}
          >
            <div
              className={`p-2 rounded-md border shrink-0 ${values.space === 'government'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface-muted text-foreground'
                }`}
            >
              <AppIcon icon={Passport01Icon} size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Government</p>
              <p className="text-[10px] text-muted-foreground">IDs, Licenses, Legal</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...values, space: 'student' })}
            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${values.space === 'student'
                ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                : 'border-border bg-surface hover:border-border-strong text-muted-foreground'
              }`}
          >
            <div
              className={`p-2 rounded-md border shrink-0 ${values.space === 'student'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface-muted text-foreground'
                }`}
            >
              <AppIcon icon={Certificate01Icon} size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Student</p>
              <p className="text-[10px] text-muted-foreground">Degrees, Marksheets</p>
            </div>
          </button>
        </div>
      </div>

      {/* Title Field (Optional override) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Document Title</span>
          <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
        </label>
        <input
          type="text"
          value={values.title}
          onChange={(e) => onChange({ ...values, title: e.target.value })}
          placeholder="E.g. Aadhaar Card, B.Tech Degree Certificate"
          className="w-full h-10 px-3 text-xs rounded-xl bg-surface border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none placeholder:text-muted-foreground/60 transition-all"
        />
      </div>

      {/* Category Field (Optional) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Category</span>
          <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
        </label>
        <input
          type="text"
          value={values.category}
          onChange={(e) => onChange({ ...values, category: e.target.value })}
          placeholder={
            values.space === 'government'
              ? 'Identity, Passport, Driving Licence, Tax...'
              : 'Degree, Transcript, Coursework, Certification...'
          }
          className="w-full h-10 px-3 text-xs rounded-xl bg-surface border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none placeholder:text-muted-foreground/60 transition-all"
        />
      </div>

      {/* Tags Selector (Optional) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Tags</span>
          <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
        </label>
        <TagSelector
          selectedTags={values.tags}
          onChange={(tags) => onChange({ ...values, tags })}
        />
      </div>

      {/* Expiry Date (Optional) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Expiry or Renewal Date</span>
          <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
        </label>
        <input
          type="date"
          value={values.expiryDate}
          onChange={(e) => onChange({ ...values, expiryDate: e.target.value })}
          className="w-full h-10 px-3 text-xs rounded-xl bg-surface border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none text-foreground transition-all"
        />
      </div>

      {/* Notes (Optional) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Private Notes</span>
          <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
        </label>
        <textarea
          rows={2}
          value={values.notes}
          onChange={(e) => onChange({ ...values, notes: e.target.value })}
          placeholder="Add memo, certificate ID or renewal instructions..."
          className="w-full p-3 text-xs rounded-xl bg-surface border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none placeholder:text-muted-foreground/60 resize-none transition-all"
        />
      </div>
    </div>
  )
}
