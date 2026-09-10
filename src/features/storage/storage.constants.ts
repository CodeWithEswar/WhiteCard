import type { NormalizedFileType } from '@/lib/files/file-type'

export const STORAGE_FILE_TYPE_ORDER: NormalizedFileType[] = [
  'pdf',
  'image',
  'archive',
  'document',
  'spreadsheet',
  'other',
]

export const STORAGE_SPACE_CONFIG = {
  government: {
    label: 'Government Documents',
    shortLabel: 'Government',
    colorKey: 'var(--space-government)',
    mutedColorKey: 'var(--space-government-muted)',
    href: '/app/government',
  },
  student: {
    label: 'Student Certificates',
    shortLabel: 'Student',
    colorKey: 'var(--space-student)',
    mutedColorKey: 'var(--space-student-muted)',
    href: '/app/student',
  },
} as const
