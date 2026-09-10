import { Link } from 'react-router-dom'
import {
  Passport01Icon,
  Certificate01Icon,
  ArrowRight01Icon,
  Pdf01Icon,
  Image01Icon,
  Zip01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { TagChip } from '../../tags/components/tag-chip'

export function SpacesShowcase() {
  return (
    <section id="spaces" className="py-20 sm:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Architectural Partition
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Two distinct spaces. Zero confusion.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Government IDs and academic credentials serve different life contexts. White Card maintains complete separation without mixing categories.
          </p>
        </div>

        {/* Split Grid: Government vs Student */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Panel 1: Government Documents */}
          <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-border/90 bg-surface shadow-xs space-y-6 text-left relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-surface-muted border border-border flex items-center justify-center text-foreground">
                  <AppIcon icon={Passport01Icon} size={24} />
                </div>
                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-surface-muted border border-border text-foreground">
                  Space 01
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Government Documents
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rigid, tamper-resistant document vault tailored for official civic IDs, vehicle registrations, and international passports.
                </p>
              </div>

              {/* Sample Categories */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['National Identity', 'Passport & Visas', 'Driving Licence', 'Tax & PAN', 'Vehicle Insurance'].map(
                  (c) => (
                    <span
                      key={c}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-surface-muted/80 border border-border/70 text-foreground/80"
                    >
                      {c}
                    </span>
                  )
                )}
              </div>

              {/* Mini Mock Document Cards */}
              <div className="space-y-2 pt-3">
                <div className="p-3 rounded-xl border border-border/70 bg-surface-muted/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AppIcon icon={Pdf01Icon} size={16} className="text-foreground" />
                    <span className="text-xs font-medium text-foreground truncate">
                      Passport_Republic_of_India.pdf
                    </span>
                  </div>
                  <TagChip label="Travel" variant="compact" />
                </div>

                <div className="p-3 rounded-xl border border-border/70 bg-surface-muted/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AppIcon icon={Image01Icon} size={16} className="text-foreground" />
                    <span className="text-xs font-medium text-foreground truncate">
                      Smart_Card_Driving_Licence.png
                    </span>
                  </div>
                  <TagChip label="Vehicle" variant="compact" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">Structured Hierarchy</span>
              <Link
                to="/app/government"
                className="text-xs font-semibold text-foreground flex items-center gap-1 hover:underline"
              >
                <span>Explore Government Space</span>
                <AppIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>
          </div>

          {/* Panel 2: Student Certificates */}
          <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-border/80 bg-surface/95 shadow-xs space-y-6 text-left relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-surface-muted border border-border flex items-center justify-center text-foreground">
                  <AppIcon icon={Certificate01Icon} size={24} />
                </div>
                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-surface-muted border border-border text-foreground">
                  Space 02
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Student Certificates
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Academic folio designed for degrees, consolidated transcripts, semester memos, and extracurricular credentials.
                </p>
              </div>

              {/* Sample Categories */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Degree Certificates', 'Semester Marks Memos', 'Coursework Archives', 'Internship Letters', 'Publications'].map(
                  (c) => (
                    <span
                      key={c}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-surface-muted/80 border border-border/70 text-foreground/80"
                    >
                      {c}
                    </span>
                  )
                )}
              </div>

              {/* Mini Mock Document Cards */}
              <div className="space-y-2 pt-3">
                <div className="p-3 rounded-xl border border-border/70 bg-surface-muted/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AppIcon icon={Pdf01Icon} size={16} className="text-foreground" />
                    <span className="text-xs font-medium text-foreground truncate">
                      BTech_Computer_Science_Degree.pdf
                    </span>
                  </div>
                  <TagChip label="Education" variant="compact" />
                </div>

                <div className="p-3 rounded-xl border border-border/70 bg-surface-muted/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AppIcon icon={Zip01Icon} size={16} className="text-foreground" />
                    <span className="text-xs font-medium text-foreground truncate">
                      Cloud_Architecture_Bundle.zip
                    </span>
                  </div>
                  <TagChip label="Personal" variant="compact" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">Academic Folio</span>
              <Link
                to="/app/student"
                className="text-xs font-semibold text-foreground flex items-center gap-1 hover:underline"
              >
                <span>Explore Student Space</span>
                <AppIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
