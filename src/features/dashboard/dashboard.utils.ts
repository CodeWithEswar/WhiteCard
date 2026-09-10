/**
 * White Card — Dashboard Utilities
 * Pure formatting and date derivation helpers.
 */

export function getTimeOfDayGreeting(date = new Date()): string {
  const hours = date.getHours()
  if (hours < 12) {
    return 'Good morning'
  }
  if (hours < 17) {
    return 'Good afternoon'
  }
  return 'Good evening'
}

export function formatDocumentCount(count: number): string {
  if (count === 1) {
    return '1 document'
  }
  return `${count} documents`
}

export type ExpirySeverityLevel = 'expired' | 'urgent' | 'warning' | 'neutral'

export interface ExpiryStatus {
  level: ExpirySeverityLevel
  label: string
  daysRemaining: number
  isExpiringSoon: boolean // <= 30 days
  isExpired: boolean
}

export function getExpiryStatus(expiryDateStr?: string | null): ExpiryStatus | null {
  if (!expiryDateStr) return null

  const expiry = new Date(expiryDateStr)
  if (isNaN(expiry.getTime())) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiryDay = new Date(expiry)
  expiryDay.setHours(0, 0, 0, 0)

  const diffMs = expiryDay.getTime() - today.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      level: 'expired',
      label: 'Expired',
      daysRemaining: diffDays,
      isExpiringSoon: false,
      isExpired: true,
    }
  }

  if (diffDays === 0) {
    return {
      level: 'urgent',
      label: 'Expires today',
      daysRemaining: 0,
      isExpiringSoon: true,
      isExpired: false,
    }
  }

  if (diffDays <= 7) {
    return {
      level: 'urgent',
      label: `${diffDays} ${diffDays === 1 ? 'day' : 'days'} remaining`,
      daysRemaining: diffDays,
      isExpiringSoon: true,
      isExpired: false,
    }
  }

  if (diffDays <= 14) {
    return {
      level: 'warning',
      label: `${diffDays} days remaining`,
      daysRemaining: diffDays,
      isExpiringSoon: true,
      isExpired: false,
    }
  }

  if (diffDays <= 30) {
    return {
      level: 'neutral',
      label: `${diffDays} days remaining`,
      daysRemaining: diffDays,
      isExpiringSoon: true,
      isExpired: false,
    }
  }

  return {
    level: 'neutral',
    label: `${diffDays} days remaining`,
    daysRemaining: diffDays,
    isExpiringSoon: false,
    isExpired: false,
  }
}

export function formatDisplayDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  } catch {
    return dateStr
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d)
  } catch {
    return dateStr
  }
}

export function formatRelativeDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr

    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return formatDisplayDate(dateStr)
  } catch {
    return dateStr
  }
}
