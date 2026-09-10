import { Tick02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import type { UploadStage } from '../upload.types'

interface UploadStageIndicatorProps {
  currentStage: UploadStage
}

const STAGES: { key: UploadStage; label: string; stepNumber: number }[] = [
  { key: 'files', label: 'Files', stepNumber: 1 },
  { key: 'metadata', label: 'Metadata', stepNumber: 2 },
  { key: 'complete', label: 'Complete', stepNumber: 3 },
]

export function UploadStageIndicator({ currentStage }: UploadStageIndicatorProps) {
  const currentStep = STAGES.find((s) => s.key === currentStage)?.stepNumber || 1

  return (
    <div>
      {/* Desktop Indicator: Horizontal Stepper */}
      <div className="hidden sm:flex items-center justify-between max-w-sm mx-auto py-1">
        {STAGES.map((s, idx) => {
          const isDone = currentStep > s.stepNumber
          const isActive = currentStep === s.stepNumber

          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={`size-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? <AppIcon icon={Tick02Icon} size={13} /> : s.stepNumber}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-foreground font-semibold'
                      : isDone
                      ? 'text-foreground/80'
                      : 'text-muted-foreground'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {/* Connecting line */}
              {idx < STAGES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-3 rounded-full transition-colors ${
                    currentStep > s.stepNumber ? 'bg-emerald-600' : 'bg-border/80'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Indicator: Compact Text Header */}
      <div className="sm:hidden flex items-center justify-between text-xs py-0.5 text-muted-foreground">
        <span className="font-mono text-[11px] font-semibold text-primary">
          Step {currentStep} of 3
        </span>
        <span className="font-medium text-foreground">
          {STAGES.find((s) => s.key === currentStage)?.label}
        </span>
      </div>
    </div>
  )
}
