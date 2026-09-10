import { formatBytes } from '@/lib/files/format-bytes'
import { FILE_TYPE_CONFIG } from '@/lib/files/file-type'
import type {
  StorageBreakdown,
  StorageFileTypeItem,
  LargestStorageDocument,
  StorageInsight,
} from './storage.types'

export function calculatePercentage(part: number, total: number, decimals = 0): number {
  if (!total || total <= 0 || !part || part <= 0) return 0
  const val = (part / total) * 100
  return Number(val.toFixed(decimals))
}

/**
 * Generates 2-3 truthful, data-backed insights from the storage breakdown.
 * No filler, fake scores, or guesses.
 */
export function generateStorageInsights(
  totalBytes: number,
  spaces: StorageBreakdown['spaces'],
  fileTypes: StorageFileTypeItem[],
  largestDocs: LargestStorageDocument[]
): StorageInsight[] {
  if (totalBytes <= 0) return []

  const insights: StorageInsight[] = []

  // 1. Dominant Space Insight
  if (spaces.government.bytes > 0 && spaces.government.percentage >= 55) {
    insights.push({
      id: 'space-gov-dominant',
      title: 'Government Documents Lead Storage',
      value: `${spaces.government.percentage}%`,
      description: `${formatBytes(spaces.government.bytes)} across ${spaces.government.count} documents in your Government Vault.`,
      iconType: 'government',
    })
  } else if (spaces.student.bytes > 0 && spaces.student.percentage >= 55) {
    insights.push({
      id: 'space-student-dominant',
      title: 'Student Certificates Lead Storage',
      value: `${spaces.student.percentage}%`,
      description: `${formatBytes(spaces.student.bytes)} across ${spaces.student.count} documents in your Student Vault.`,
      iconType: 'student',
    })
  }

  // 2. Dominant File Type Insight
  const sortedFileTypes = [...fileTypes].sort((a, b) => b.bytes - a.bytes)
  const topFileType = sortedFileTypes[0]
  if (topFileType && topFileType.bytes > 0 && topFileType.percentage >= 20) {
    const meta = FILE_TYPE_CONFIG[topFileType.key]
    insights.push({
      id: `filetype-${topFileType.key}-top`,
      title: `${meta.label} use the most storage`,
      value: formatBytes(topFileType.bytes),
      description: `${topFileType.percentage}% of all vault storage is stored in ${meta.label.toLowerCase()}.`,
      iconType: topFileType.key === 'archive' ? 'archive' : 'primary',
    })
  }

  // 3. Largest Document Insight
  const largestDoc = largestDocs[0]
  if (largestDoc && largestDoc.sizeBytes > 0 && insights.length < 3) {
    insights.push({
      id: 'largest-file-single',
      title: `Largest: ${largestDoc.title}`,
      value: formatBytes(largestDoc.sizeBytes),
      description: `Stored under ${largestDoc.space === 'government' ? 'Government' : 'Student'} space (${largestDoc.originalFilename}).`,
      iconType: 'primary',
    })
  }

  // 4. Archive file insight if meaningful
  const archiveGroup = fileTypes.find((f) => f.key === 'archive')
  if (
    archiveGroup &&
    archiveGroup.bytes > 10 * 1024 * 1024 &&
    archiveGroup.count > 0 &&
    insights.length < 3 &&
    !insights.some((i) => i.iconType === 'archive')
  ) {
    insights.push({
      id: 'archive-heavy',
      title: 'Compressed Archives Present',
      value: formatBytes(archiveGroup.bytes),
      description: `${archiveGroup.count} archive files consume ${formatBytes(archiveGroup.bytes)}.`,
      iconType: 'archive',
    })
  }

  return insights.slice(0, 3)
}
