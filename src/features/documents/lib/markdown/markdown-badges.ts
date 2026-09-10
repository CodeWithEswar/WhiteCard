export function isBadgeUrl(url?: string | null): boolean {
  if (!url) return false
  const lower = url.toLowerCase()

  return (
    lower.includes('shields.io') ||
    lower.includes('badge.svg') ||
    lower.includes('badgen.net') ||
    lower.includes('github.com/') && lower.includes('/workflows/') && lower.includes('badge') ||
    lower.includes('img.shields.io')
  )
}
