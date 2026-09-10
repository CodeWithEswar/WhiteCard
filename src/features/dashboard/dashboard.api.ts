import { fetchUserDocuments } from '@/features/documents/documents.api'
import type { DashboardSummary, TagSummary } from './dashboard.types'
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
  }
}
