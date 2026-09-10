/**
 * Centralized byte formatting utility for White Card storage metrics and file sizes.
 * Converts byte counts into human-readable strings (e.g. 768 KB, 12.4 MB, 1.2 GB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  if (i === 0) {
    return `${bytes} ${sizes[i]}`
  }

  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
  return `${value} ${sizes[i]}`
}
