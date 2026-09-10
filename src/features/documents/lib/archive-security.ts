export interface ArchiveSafetyLimits {
  maxArchiveBytes: number
  maxEntryCount: number
  maxSinglePreviewBytes: number
  maxTotalPreviewBytes: number
  maxCompressionRatio: number
}

export const DEFAULT_ARCHIVE_SAFETY_LIMITS: ArchiveSafetyLimits = {
  maxArchiveBytes: 100 * 1024 * 1024, // 100 MB
  maxEntryCount: 5000,
  maxSinglePreviewBytes: 5 * 1024 * 1024, // 5 MB
  maxTotalPreviewBytes: 25 * 1024 * 1024, // 25 MB
  maxCompressionRatio: 100, // 100:1 ratio guard against zip bombs
}

/**
 * Normalizes an internal archive path and neutralizes path traversal sequences.
 * Prevents directory traversal attacks (../, absolute paths, drive letters).
 */
export function normalizeSafePath(rawPath: string): string {
  if (!rawPath) return ''

  // Replace backslashes with forward slashes and strip null bytes
  let clean = rawPath.replace(/\\/g, '/').replace(/\0/g, '').trim()

  // Remove drive letters (e.g. C:)
  clean = clean.replace(/^[a-zA-Z]:/, '')

  // Remove leading slashes
  clean = clean.replace(/^\/+/, '')

  // Split path segments and filter out dangerous sequences
  const segments = clean.split('/')
  const safeSegments: string[] = []

  for (const seg of segments) {
    if (!seg || seg === '.') continue
    if (seg === '..') {
      // Don't allow escaping virtual root
      if (safeSegments.length > 0) {
        safeSegments.pop()
      }
      continue
    }
    safeSegments.push(seg)
  }

  return safeSegments.join('/')
}

/**
 * Validates whether an entry's uncompressed size is within safe in-browser preview limits.
 */
export function isSafeToPreview(
  sizeBytes: number,
  limits: ArchiveSafetyLimits = DEFAULT_ARCHIVE_SAFETY_LIMITS
): boolean {
  return sizeBytes <= limits.maxSinglePreviewBytes
}

/**
 * Checks for suspicious compression ratios indicating potential zip bombs.
 */
export function isSuspiciousCompressionRatio(
  compressedBytes: number,
  uncompressedBytes: number,
  limits: ArchiveSafetyLimits = DEFAULT_ARCHIVE_SAFETY_LIMITS
): boolean {
  if (compressedBytes <= 0) return false
  const ratio = uncompressedBytes / compressedBytes
  return ratio > limits.maxCompressionRatio
}
