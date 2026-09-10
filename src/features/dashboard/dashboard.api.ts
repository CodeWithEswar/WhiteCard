import { fetchUserDocuments } from '@/features/documents/documents.api'
import type {
  DashboardSummary,
  TagSummary,
  FileTypeDistributionItem,
  VaultHealthSummary,
  VaultTimelineItem,
} from './dashboard.types'
import { resolveTagColor } from '@/config/tag-colors'

/**
 * Aggregates vault documents into a single truthful, cache-first summary for the dashboard.
 * Zero fake metrics, zero artificial quota.
 */
export async function fetchDashboardSummary(userId?: string): Promise<DashboardSummary> {
  const allDocs = await fetchUserDocuments(userId)

  const govDocs = allDocs.filter((d) => d.space === 'government')
  const studentDocs = allDocs.filter((d) => d.space === 'student')

  const now = new Date()
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
  const reviewWindowEnd = todayMidnight + thirtyDaysMs

  // Expiring soon: only records where expires_on >= today and <= 30 days
  const expiringDocuments = allDocs
    .filter((d) => {
      if (!d.expiryDate) return false
      const expiryTime = new Date(d.expiryDate).getTime()
      if (isNaN(expiryTime)) return false
      return expiryTime >= todayMidnight && expiryTime <= reviewWindowEnd
    })
    .sort((a, b) => {
      const timeA = new Date(a.expiryDate!).getTime()
      const timeB = new Date(b.expiryDate!).getTime()
      return timeA - timeB
    })

  const govExpiringCount = govDocs.filter((d) => {
    if (!d.expiryDate) return false
    const t = new Date(d.expiryDate).getTime()
    return t >= todayMidnight && t <= reviewWindowEnd
  }).length

  // Expired documents count
  const expiredDocsCount = allDocs.filter((d) => {
    if (!d.expiryDate) return false
    const t = new Date(d.expiryDate).getTime()
    return t < todayMidnight
  }).length

  // Vault health metrics
  const expiringDocsCount = expiringDocuments.length
  const validCount = Math.max(0, allDocs.length - expiringDocsCount - expiredDocsCount)
  const healthPercentage =
    allDocs.length > 0 ? Math.round((validCount / allDocs.length) * 100) : 100

  const health: VaultHealthSummary = {
    validCount,
    expiringCount: expiringDocsCount,
    expiredCount: expiredDocsCount,
    healthPercentage,
  }

  // Vault timeline over past 6 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const timeline: VaultTimelineItem[] = []
  const currentMonthIdx = now.getMonth()
  const currentYear = now.getFullYear()

  let runningTotal = 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonthIdx - i, 1)
    const mLabel = monthNames[d.getMonth()]
    const targetYear = d.getFullYear()
    const targetMonth = d.getMonth()

    const countInMonth = allDocs.filter((doc) => {
      const docDate = new Date(doc.createdAt)
      return docDate.getFullYear() === targetYear && docDate.getMonth() === targetMonth
    }).length

    runningTotal += countInMonth
    timeline.push({
      month: mLabel,
      count: countInMonth,
      cumulative: runningTotal,
    })
  }

  // Recent documents: sorted by updatedAt/createdAt descending (6-8 items)
  const recentDocuments = [...allDocs]
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime()
      const timeB = new Date(b.updatedAt || b.createdAt).getTime()
      return timeB - timeA
    })
    .slice(0, 8)

  // Storage byte calculations (exact byte sum)
  const govBytes = govDocs.reduce((acc, doc) => acc + (doc.sizeBytes || 0), 0)
  const studentBytes = studentDocs.reduce((acc, doc) => acc + (doc.sizeBytes || 0), 0)
  const totalBytes = govBytes + studentBytes

  // File type distribution
  const typeMap: Record<string, { label: string; color: string; count: number }> = {
    pdf: { label: 'PDF Docs', color: 'var(--primary)', count: 0 },
    image: { label: 'Images', color: 'var(--color-chart-2, var(--muted-foreground))', count: 0 },
    zip: { label: 'Archives', color: 'oklch(0.55 0.18 145)', count: 0 },
    doc: { label: 'Office Docs', color: 'oklch(0.65 0.18 70)', count: 0 },
    sheet: { label: 'Sheets', color: 'oklch(0.48 0.15 250)', count: 0 },
    other: { label: 'Other', color: 'oklch(0.5 0.1 300)', count: 0 },
  }

  allDocs.forEach((doc) => {
    const key = doc.fileType || 'other'
    if (typeMap[key]) {
      typeMap[key].count += 1
    } else {
      typeMap.other.count += 1
    }
  })

  const fileTypes: FileTypeDistributionItem[] = Object.entries(typeMap)
    .filter(([, v]) => v.count > 0)
    .map(([k, v]) => ({
      type: k,
      label: v.label,
      count: v.count,
      color: v.color,
    }))

  // Aggregate user tags with real document counts
  const tagCountMap = new Map<string, number>()
  allDocs.forEach((doc) => {
    doc.tags?.forEach((tag) => {
      const trimmed = tag.trim()
      if (trimmed) {
        tagCountMap.set(trimmed, (tagCountMap.get(trimmed) || 0) + 1)
      }
    })
  })

  const tags: TagSummary[] = Array.from(tagCountMap.entries())
    .map(([label, count]) => {
      const tagConfig = resolveTagColor(label)
      return {
        id: label.toLowerCase(),
        label,
        count,
        colorDot: tagConfig.dot,
      }
    })
    .sort((a, b) => b.count - a.count)

  return {
    government: {
      space: 'government',
      count: govDocs.length,
      bytes: govBytes,
      expiringCount: govExpiringCount,
      latestDoc: govDocs[0] || null,
    },
    student: {
      space: 'student',
      count: studentDocs.length,
      bytes: studentBytes,
      latestDoc: studentDocs[0] || null,
    },
    recentDocuments,
    expiringDocuments,
    tags,
    totalBytes,
    totalCount: allDocs.length,
    fileTypes,
    health,
    timeline,
  }
}
