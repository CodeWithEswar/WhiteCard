export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB
export const MAX_BATCH_FILES = 10

export const SUPPORTED_EXTENSIONS = [
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.zip',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
] as const

export const ACCEPT_STRING = SUPPORTED_EXTENSIONS.join(',')

export const GOVERNMENT_CATEGORIES = [
  'Identity',
  'Passport',
  'Driving Licence',
  'Vehicle',
  'Insurance',
  'Tax & Finance',
  'Other',
] as const

export const STUDENT_CATEGORIES = [
  'Degree',
  'Academic Transcript',
  'Marksheet',
  'Course Certificate',
  'Student ID',
  'Achievement',
  'Other',
] as const
