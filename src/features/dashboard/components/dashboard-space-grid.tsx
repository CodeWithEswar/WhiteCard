import type { SpaceSummary } from '../dashboard.types'
import { DashboardSpaceCard } from './dashboard-space-card'

interface DashboardSpaceGridProps {
  government: SpaceSummary
  student: SpaceSummary
}

export function DashboardSpaceGrid({ government, student }: DashboardSpaceGridProps) {
  return (
    <section aria-label="Primary Vault Spaces" className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <DashboardSpaceCard summary={government} />
      <DashboardSpaceCard summary={student} />
    </section>
  )
}
