import JSZip from 'jszip'

export interface CsvPreviewData {
  headers: string[]
  rows: string[][]
  totalRows: number
  isTruncated: boolean
}

export interface ArchiveEntry {
  path: string
  name: string
  dir: boolean
  size: number
  formattedSize: string
  depth: number
}

export interface ArchivePreviewData {
  entries: ArchiveEntry[]
  totalFiles: number
  totalDirs: number
  totalUncompressedBytes: number
  formattedTotalSize: string
  isTruncated: boolean
}

/**
 * Parses raw CSV/TSV text into structured headers and bounded rows.
 */
export function parseCsvContent(text: string, maxRows = 100): CsvPreviewData {
  if (!text || !text.trim()) {
    return { headers: [], rows: [], totalRows: 0, isTruncated: false }
  }

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) {
    return { headers: [], rows: [], totalRows: 0, isTruncated: false }
  }

  // Detect delimiter: comma vs tab
  const firstLine = lines[0]
  const delimiter = firstLine.includes('\t') && !firstLine.includes(',') ? '\t' : ','

  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let insideQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === delimiter && !insideQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseLine(lines[0])
  const dataLines = lines.slice(1)
  const totalRows = dataLines.length

  const boundedLines = dataLines.slice(0, maxRows)
  const rows = boundedLines.map(parseLine)

  return {
    headers,
    rows,
    totalRows,
    isTruncated: totalRows > maxRows,
  }
}

/**
 * Inspects a ZIP archive client-side from an ArrayBuffer without extracting files to disk.
 */
export async function parseZipArchive(buffer: ArrayBuffer, maxEntries = 500): Promise<ArchivePreviewData> {
  try {
    const zip = await JSZip.loadAsync(buffer)
    const entries: ArchiveEntry[] = []
    let totalFiles = 0
    let totalDirs = 0
    let totalBytes = 0

    const rawNames = Object.keys(zip.files)
    const count = Math.min(rawNames.length, maxEntries)

    for (let i = 0; i < count; i++) {
      const name = rawNames[i]
      const file = zip.files[name]
      const isDir = file.dir
      const size = (file as any)._data?.uncompressedSize || 0

      if (isDir) {
        totalDirs++
      } else {
        totalFiles++
        totalBytes += size
      }

      const segments = name.replace(/\/$/, '').split('/')
      entries.push({
        path: name,
        name: segments[segments.length - 1] || name,
        dir: isDir,
        size,
        formattedSize: isDir ? '-' : formatBytes(size),
        depth: Math.max(0, segments.length - 1),
      })
    }

    // Sort entries: directories first, then alphabetically
    entries.sort((a, b) => {
      if (a.dir && !b.dir) return -1
      if (!a.dir && b.dir) return 1
      return a.path.localeCompare(b.path)
    })

    return {
      entries,
      totalFiles,
      totalDirs,
      totalUncompressedBytes: totalBytes,
      formattedTotalSize: formatBytes(totalBytes),
      isTruncated: rawNames.length > maxEntries,
    }
  } catch (err) {
    console.error('Failed to parse zip archive:', err)
    throw new Error('Could not inspect archive structure.')
  }
}

/**
 * Helper to format raw bytes into human readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Formats JSON string with safe indentation or returns raw if invalid.
 */
export function formatJsonText(text: string): { formatted: string; isValid: boolean } {
  try {
    const parsed = JSON.parse(text)
    return {
      formatted: JSON.stringify(parsed, null, 2),
      isValid: true,
    }
  } catch {
    return {
      formatted: text,
      isValid: false,
    }
  }
}
