import type { QueryKey } from '@tanstack/react-query'

/**
 * Sensitive query keywords that MUST NEVER be serialized or persisted to disk.
 * Signed URLs expire quickly, tokens are ephemeral or secret, and upload states
 * are transient memory states.
 */
const SENSITIVE_QUERY_SEGMENTS = new Set([
  'preview-url',
  'signed-url',
  'download-url',
  'share-token',
  'token',
  'upload-state',
  'oauth',
  'access-token',
  'refresh-token',
  'session',
])

/**
 * Returns true if the query key or any of its segments contains sensitive,
 * transient, or credential-bearing identifiers.
 */
export function isSensitiveQuery(queryKey: QueryKey): boolean {
  if (!Array.isArray(queryKey) || queryKey.length === 0) {
    return true
  }

  for (const part of queryKey) {
    if (typeof part === 'string') {
      const lower = part.toLowerCase()
      if (SENSITIVE_QUERY_SEGMENTS.has(lower)) {
        return true
      }
      if (
        lower.includes('token') ||
        lower.includes('secret') ||
        lower.includes('signed') ||
        lower.includes('preview-url') ||
        lower.includes('download-url')
      ) {
        return true
      }
    } else if (typeof part === 'object' && part !== null) {
      const stringified = JSON.stringify(part).toLowerCase()
      if (
        stringified.includes('token') ||
        stringified.includes('secret') ||
        stringified.includes('signed') ||
        stringified.includes('previewurl')
      ) {
        return true
      }
    }
  }

  return false
}

/**
 * Safe query prefixes that are intentionally approved for local persistence
 * to deliver an immediate, zero-flicker reload experience.
 */
const SAFE_PERSISTABLE_PREFIXES = new Set([
  'profile',
  'preferences',
  'documents',
  'vault-stats',
  'tags',
])

/**
 * Determines whether a TanStack Query query should be dehydrated to localStorage.
 */
export function isPersistableQuery(queryKey: QueryKey): boolean {
  if (isSensitiveQuery(queryKey)) {
    return false
  }

  const rootPrefix = String(queryKey[0]).toLowerCase()
  return SAFE_PERSISTABLE_PREFIXES.has(rootPrefix)
}
