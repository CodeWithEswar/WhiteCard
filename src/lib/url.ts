/**
 * Helper to construct canonical and Open Graph absolute URLs.
 * Uses VITE_APP_URL when configured, falling back to window.location.origin or production domain.
 */
export function absoluteUrl(path = '/'): string {
  const envUrl = import.meta.env.VITE_APP_URL
  const fallback = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://whitecard.vault'

  const base = envUrl && envUrl.trim() !== '' ? envUrl.trim() : fallback

  try {
    return new URL(path, base).toString()
  } catch {
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  }
}
