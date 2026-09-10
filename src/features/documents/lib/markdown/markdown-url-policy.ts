export function isSafeUrl(url?: string | null): boolean {
  if (!url) return false
  const trimmed = url.trim().toLowerCase()

  // Reject dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('data:text/html') ||
    trimmed.startsWith('data:application/')
  ) {
    return false
  }

  // Safe anchor links
  if (trimmed.startsWith('#')) return true

  // Safe image data URIs
  if (trimmed.startsWith('data:image/')) return true

  // Standard safe protocols
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return true
  }

  // Relative links (e.g. ./docs/setup.md)
  if (trimmed.startsWith('./') || trimmed.startsWith('../') || trimmed.startsWith('/')) {
    return true
  }

  return false
}

export function isExternalUrl(url?: string | null): boolean {
  if (!url) return false
  const trimmed = url.trim().toLowerCase()
  return trimmed.startsWith('https://') || trimmed.startsWith('http://')
}
