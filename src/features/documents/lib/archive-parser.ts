import JSZip from 'jszip'
import {
  DEFAULT_ARCHIVE_SAFETY_LIMITS,
  normalizeSafePath,
  isSafeToPreview,
  isSuspiciousCompressionRatio,
  type ArchiveSafetyLimits,
} from './archive-security'
import { buildVirtualTree, type ArchiveTreeNode, type FlatArchiveEntry } from './archive-tree'
import { formatBytes } from '@/features/search/search.utils'

export interface ParsedArchive {
  zipInstance: JSZip
  rootTree: ArchiveTreeNode
  flatEntries: FlatArchiveEntry[]
  totalFiles: number
  totalDirs: number
  totalUncompressedBytes: number
  formattedTotalSize: string
  rootReadmePath?: string
  packageJsonPath?: string
  isCapped: boolean
}

// In-memory bounded cache for 5 most recently extracted text entries
const textCache = new Map<string, string>()
const MAX_CACHE_SIZE = 5

function addToCache(key: string, content: string) {
  if (textCache.size >= MAX_CACHE_SIZE) {
    const firstKey = textCache.keys().next().value
    if (firstKey) textCache.delete(firstKey)
  }
  textCache.set(key, content)
}

/**
 * Inspects a ZIP archive from an ArrayBuffer without eagerly extracting contents to memory.
 */
export async function parseArchiveBuffer(
  buffer: ArrayBuffer,
  limits: ArchiveSafetyLimits = DEFAULT_ARCHIVE_SAFETY_LIMITS
): Promise<ParsedArchive> {
  const compressedSize = buffer.byteLength

  if (compressedSize > limits.maxArchiveBytes) {
    throw new Error('ARCHIVE_TOO_LARGE')
  }

  try {
    const zip = await JSZip.loadAsync(buffer)
    const rawNames = Object.keys(zip.files)

    if (rawNames.length > limits.maxEntryCount) {
      throw new Error('TOO_MANY_ENTRIES')
    }

    const flatEntries: FlatArchiveEntry[] = []
    let totalFiles = 0
    let totalDirs = 0
    let totalUncompressed = 0
    let rootReadmePath: string | undefined
    let packageJsonPath: string | undefined

    for (const name of rawNames) {
      const file = zip.files[name]
      const safePath = normalizeSafePath(name)
      if (!safePath && !file.dir) continue

      const isDir = file.dir || name.endsWith('/')
      const size = (file as any)._data?.uncompressedSize || 0

      if (isDir) {
        totalDirs++
      } else {
        totalFiles++
        totalUncompressed += size

        // Detect root README
        const lower = safePath.toLowerCase()
        if (
          lower === 'readme.md' ||
          lower === 'readme.txt' ||
          lower === 'readme'
        ) {
          rootReadmePath = safePath
        }

        // Detect root package.json
        if (lower === 'package.json') {
          packageJsonPath = safePath
        }
      }

      const segments = safePath.split('/')
      flatEntries.push({
        path: safePath,
        name: segments[segments.length - 1] || safePath,
        dir: isDir,
        size,
      })
    }

    // Zip bomb check
    if (isSuspiciousCompressionRatio(compressedSize, totalUncompressed, limits)) {
      throw new Error('SUSPICIOUS_COMPRESSION_RATIO')
    }

    const rootTree = buildVirtualTree(flatEntries)

    return {
      zipInstance: zip,
      rootTree,
      flatEntries,
      totalFiles,
      totalDirs,
      totalUncompressedBytes: totalUncompressed,
      formattedTotalSize: formatBytes(totalUncompressed),
      rootReadmePath,
      packageJsonPath,
      isCapped: rawNames.length > limits.maxEntryCount,
    }
  } catch (err: any) {
    if (
      err.message === 'ARCHIVE_TOO_LARGE' ||
      err.message === 'TOO_MANY_ENTRIES' ||
      err.message === 'SUSPICIOUS_COMPRESSION_RATIO'
    ) {
      throw err
    }

    // Check for password protection
    if (err.message && err.message.toLowerCase().includes('encrypted')) {
      throw new Error('ENCRYPTED_ARCHIVE')
    }

    console.error('Failed to parse zip archive:', err)
    throw new Error('CORRUPTED_ARCHIVE')
  }
}

/**
 * Extracts a single entry as a UTF-8 text string with size safety check.
 */
export async function extractEntryAsText(
  zip: JSZip,
  path: string,
  limits: ArchiveSafetyLimits = DEFAULT_ARCHIVE_SAFETY_LIMITS
): Promise<string> {
  const cacheKey = `${path}`
  if (textCache.has(cacheKey)) {
    return textCache.get(cacheKey)!
  }

  // Find file in JSZip
  const file = zip.file(path) || Object.values(zip.files).find((f) => normalizeSafePath(f.name) === path)
  if (!file) {
    throw new Error('File not found in archive.')
  }

  const uncompressedSize = (file as any)._data?.uncompressedSize || 0
  if (!isSafeToPreview(uncompressedSize, limits)) {
    throw new Error('ENTRY_TOO_LARGE')
  }

  const content = await file.async('text')
  addToCache(cacheKey, content)
  return content
}

/**
 * Extracts a single entry as a Blob with mimeType.
 */
export async function extractEntryAsBlob(
  zip: JSZip,
  path: string,
  mimeType = 'application/octet-stream'
): Promise<Blob> {
  const file = zip.file(path) || Object.values(zip.files).find((f) => normalizeSafePath(f.name) === path)
  if (!file) {
    throw new Error('File not found in archive.')
  }

  const blob = await file.async('blob')
  return new Blob([blob], { type: mimeType })
}

/**
 * Extracts a single entry as ArrayBuffer.
 */
export async function extractEntryAsArrayBuffer(
  zip: JSZip,
  path: string
): Promise<ArrayBuffer> {
  const file = zip.file(path) || Object.values(zip.files).find((f) => normalizeSafePath(f.name) === path)
  if (!file) {
    throw new Error('File not found in archive.')
  }

  return file.async('arraybuffer')
}
