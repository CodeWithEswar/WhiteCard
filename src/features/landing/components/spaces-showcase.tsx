import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Passport01Icon,
  Certificate01Icon,
  ArrowRight01Icon,
  Pdf01Icon,
  Image01Icon,
  Zip01Icon,
  Shield01Icon,
  Calendar03Icon,
  Building03Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Reveal } from '../../../components/motion/reveal'

const governmentExamples = [
  'Identity records',
  'Passport',
  'Driving licence',
  'Vehicle records',
  'Insurance',
  'Tax documents',
  'Other official files',
]

const studentExamples = [
  'Marksheets',
  'Degree certificates',
  'Transcripts',
  'Course certificates',
  'Student records',
  'Achievement certificates',
]

export function SpacesShowcase() {
  const [hoveredSide, setHoveredSide] = useState<'gov' | 'student' | null>(null)

  return (
    <section id="spaces" className="py-24 sm:py-32 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-[760px] mx-auto space-y-4">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 03 • Two Vault Spaces
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Two distinct spaces. Zero confusion.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Government IDs and academic credentials belong to different life contexts. White Card maintains clear structural isolation between official civic files and academic achievements.
            </p>
          </Reveal>
        </div>

        {/* Split Grid: Government vs Student */}
        <Reveal delay={0.18}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Panel 1: Government Documents */}
            <div
              onMouseEnter={() => setHoveredSide('gov')}
              onMouseLeave={() => setHoveredSide(null)}
              className={`flex flex-col justify-between p-6 sm:p-8 rounded-3xl border transition-all duration-200 bg-card shadow-sm space-y-6 text-left ${
                hoveredSide === 'gov'
                  ? 'border-border opacity-100 ring-1 ring-border/80'
                  : hoveredSide === 'student'
                  ? 'border-border/60 opacity-80'
                  : 'border-border/80 opacity-100'
              }`}
            >
              <div
                className={`space-y-4 transition-transform duration-200 ${
                  hoveredSide === 'gov' ? 'translate-y-[-2px]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-muted border border-border/80 flex items-center justify-center text-foreground">
                    <AppIcon icon={Passport01Icon} size={22} />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-muted border border-border/70 text-foreground">
                    Space 01
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    <AppIcon icon={Shield01Icon} size={18} className="text-muted-foreground" />
                    Government Documents
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Dedicated vault for national IDs, passports, permits, vehicle registrations, and civic documentation with clear validity and expiry tracking.
                  </p>
                </div>

                {/* Example Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {governmentExamples.map((ex) => (
                    <span
                      key={ex}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-muted/50 border border-border/60 text-muted-foreground"
                    >
                      {ex}
                    </span>
                  ))}
                </div>

                {/* Mock Document Cards */}
                <div className="space-y-2 pt-2">
                  <div className="p-2.5 sm:p-3 rounded-xl border border-border/70 bg-muted/25 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <AppIcon icon={Pdf01Icon} size={16} className="text-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          Passport_Document.pdf
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 truncate">
                          <AppIcon icon={Calendar03Icon} size={10} className="shrink-0" />
                          <span>Expires 2033</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted border border-border/60 text-foreground shrink-0">
                      Identity
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl border border-border/70 bg-muted/25 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <AppIcon icon={Image01Icon} size={16} className="text-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          Driving_Licence_Front.png
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 truncate">
                          <AppIcon icon={Calendar03Icon} size={10} className="shrink-0" />
                          <span>Expires 2028</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted border border-border/60 text-foreground shrink-0">
                      Vehicle
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">Civic & State Records</span>
                <Link
                  to="/app/government"
                  className="font-semibold text-foreground flex items-center gap-1 hover:underline"
                >
                  <span>Explore Government</span>
                  <AppIcon icon={ArrowRight01Icon} size={13} />
                </Link>
              </div>
            </div>

            {/* Panel 2: Student Certificates */}
            <div
              onMouseEnter={() => setHoveredSide('student')}
              onMouseLeave={() => setHoveredSide(null)}
              className={`flex flex-col justify-between p-6 sm:p-8 rounded-3xl border transition-all duration-200 bg-card shadow-sm space-y-6 text-left ${
                hoveredSide === 'student'
                  ? 'border-border opacity-100 ring-1 ring-border/80'
                  : hoveredSide === 'gov'
                  ? 'border-border/60 opacity-80'
                  : 'border-border/80 opacity-100'
              }`}
            >
              <div
                className={`space-y-4 transition-transform duration-200 ${
                  hoveredSide === 'student' ? 'translate-y-[-2px]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-muted border border-border/80 flex items-center justify-center text-foreground">
                    <AppIcon icon={Certificate01Icon} size={22} />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-muted border border-border/70 text-foreground">
                    Space 02
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    <AppIcon icon={Certificate01Icon} size={18} className="text-muted-foreground" />
                    Student Certificates
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    A calm academic archive for degree parchments, transcripts, semester marksheets, and institutional diplomas organized with issuing year metadata.
                  </p>
                </div>

                {/* Example Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {studentExamples.map((ex) => (
                    <span
                      key={ex}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-muted/50 border border-border/60 text-muted-foreground"
                    >
                      {ex}
                    </span>
                  ))}
                </div>

                {/* Mock Document Cards */}
                <div className="space-y-2 pt-2">
                  <div className="p-2.5 sm:p-3 rounded-xl border border-border/70 bg-muted/25 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <AppIcon icon={Pdf01Icon} size={16} className="text-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          Degree_Certificate_Official.pdf
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 truncate">
                          <AppIcon icon={Building03Icon} size={10} className="shrink-0" />
                          <span>Conferred 2024</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted border border-border/60 text-foreground shrink-0">
                      Degree
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-xl border border-border/70 bg-muted/25 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <AppIcon icon={Zip01Icon} size={16} className="text-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          Cumulative_Transcripts.zip
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 truncate">
                          <AppIcon icon={Building03Icon} size={10} className="shrink-0" />
                          <span>8 Semesters</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted border border-border/60 text-foreground shrink-0">
                      Transcript
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">Academic Credentials</span>
                <Link
                  to="/app/student"
                  className="font-semibold text-foreground flex items-center gap-1 hover:underline"
                >
                  <span>Explore Student</span>
                  <AppIcon icon={ArrowRight01Icon} size={13} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
