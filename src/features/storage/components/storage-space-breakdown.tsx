import {
  Passport01Icon,
  Certificate01Icon,
} from '@hugeicons/core-free-icons'
import { StorageSpaceRow } from './storage-space-row'
import type { StorageSpaceBreakdown as SpaceData } from '../storage.types'

interface StorageSpaceBreakdownProps {
  government: SpaceData
  student: SpaceData
}

export function StorageSpaceBreakdown({ government, student }: StorageSpaceBreakdownProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-5 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          Spaces
        </div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          Space Distribution
        </h3>
        <p className="text-xs text-muted-foreground">
          Storage volume divided across your core vault spaces.
        </p>
      </div>

      <div className="space-y-3">
        <StorageSpaceRow
          label="Government Documents"
          count={government.count}
          bytes={government.bytes}
          percentage={government.percentage}
          icon={Passport01Icon}
          colorClass="bg-muted/70 border border-border/80 text-foreground"
          meterColor="var(--foreground)"
          dotClass="bg-foreground"
          href="/app/government"
        />

        <StorageSpaceRow
          label="Student Certificates"
          count={student.count}
          bytes={student.bytes}
          percentage={student.percentage}
          icon={Certificate01Icon}
          colorClass="bg-muted/70 border border-border/80 text-muted-foreground"
          meterColor="var(--muted-foreground)"
          dotClass="bg-muted-foreground/60 border border-border"
          href="/app/student"
        />
      </div>

      <div className="text-[11px] text-muted-foreground/75 border-t border-border/50 pt-3 flex items-center justify-between">
        <span>Both spaces are encrypted & isolated</span>
        <span className="font-mono text-[10.5px]">2 spaces</span>
      </div>
    </div>
  )
}
