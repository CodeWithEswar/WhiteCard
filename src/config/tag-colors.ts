/**
 * White Card — Accessible Document Tag Color System
 * 
 * Document tags are strictly independent of application theme presets.
 * Every tag must always render an accessible text label alongside the color dot.
 */

export type TagColorKey =
  | 'zinc'
  | 'blue'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan'

export interface TagColorConfig {
  key: TagColorKey
  label: string
  semanticMeaning: string
  dot: string
  bg: string
  border: string
  text: string
}

export const TAG_COLORS: Record<TagColorKey, TagColorConfig> = {
  zinc: {
    key: 'zinc',
    label: 'General',
    semanticMeaning: 'General / neutral reference records',
    dot: 'bg-zinc-500 dark:bg-zinc-400',
    bg: 'bg-zinc-500/10 dark:bg-zinc-400/10',
    border: 'border-zinc-500/25 dark:border-zinc-400/25',
    text: 'text-zinc-800 dark:text-zinc-200',
  },
  blue: {
    key: 'blue',
    label: 'Identity',
    semanticMeaning: 'Identity / official government IDs',
    dot: 'bg-blue-500 dark:bg-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-400/10',
    border: 'border-blue-500/25 dark:border-blue-400/25',
    text: 'text-blue-900 dark:text-blue-200',
  },
  violet: {
    key: 'violet',
    label: 'Education',
    semanticMeaning: 'Academic / certificates / degrees',
    dot: 'bg-violet-500 dark:bg-violet-400',
    bg: 'bg-violet-500/10 dark:bg-violet-400/10',
    border: 'border-violet-500/25 dark:border-violet-400/25',
    text: 'text-violet-900 dark:text-violet-200',
  },
  emerald: {
    key: 'emerald',
    label: 'Completed',
    semanticMeaning: 'Verified / active / completed',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    border: 'border-emerald-500/25 dark:border-emerald-400/25',
    text: 'text-emerald-900 dark:text-emerald-200',
  },
  amber: {
    key: 'amber',
    label: 'Renewal',
    semanticMeaning: 'Renewal required / expiry attention',
    dot: 'bg-amber-500 dark:bg-amber-400',
    bg: 'bg-amber-500/10 dark:bg-amber-400/10',
    border: 'border-amber-500/25 dark:border-amber-400/25',
    text: 'text-amber-950 dark:text-amber-200',
  },
  rose: {
    key: 'rose',
    label: 'Personal',
    semanticMeaning: 'Critical / sensitive personal records',
    dot: 'bg-rose-500 dark:bg-rose-400',
    bg: 'bg-rose-500/10 dark:bg-rose-400/10',
    border: 'border-rose-500/25 dark:border-rose-400/25',
    text: 'text-rose-900 dark:text-rose-200',
  },
  cyan: {
    key: 'cyan',
    label: 'Travel',
    semanticMeaning: 'Travel / visas / immigration mobility',
    dot: 'bg-cyan-500 dark:bg-cyan-400',
    bg: 'bg-cyan-500/10 dark:bg-cyan-400/10',
    border: 'border-cyan-500/25 dark:border-cyan-400/25',
    text: 'text-cyan-900 dark:text-cyan-200',
  },
}

/**
 * Resolves a tag label string to a matching TagColorConfig.
 * Matches exact tag name, lowercase, or maps common aliases.
 */
export function resolveTagColor(tagName: string): TagColorConfig {
  const normalized = tagName.trim().toLowerCase()

  if (normalized in TAG_COLORS) {
    return TAG_COLORS[normalized as TagColorKey]
  }

  // Alias lookups for common vault tags
  if (normalized.includes('id') || normalized.includes('passport') || normalized.includes('license') || normalized.includes('licence') || normalized.includes('official')) {
    return TAG_COLORS.blue
  }
  if (normalized.includes('degree') || normalized.includes('academic') || normalized.includes('cert') || normalized.includes('education') || normalized.includes('transcript')) {
    return TAG_COLORS.violet
  }
  if (normalized.includes('travel') || normalized.includes('visa') || normalized.includes('immigration')) {
    return TAG_COLORS.cyan
  }
  if (normalized.includes('vehicle') || normalized.includes('renew') || normalized.includes('expir')) {
    return TAG_COLORS.amber
  }
  if (normalized.includes('tax') || normalized.includes('personal') || normalized.includes('medical') || normalized.includes('insurance')) {
    return TAG_COLORS.rose
  }
  if (normalized.includes('active') || normalized.includes('valid') || normalized.includes('verified')) {
    return TAG_COLORS.emerald
  }

  return TAG_COLORS.zinc
}
