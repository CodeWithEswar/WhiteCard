import type { IconSvgElement } from '@hugeicons/react'
import {
  File01Icon,
  Pdf01Icon,
  Image01Icon,
  ZipIcon,
  Doc01Icon,
  Doc02Icon,
} from '@hugeicons/core-free-icons'

export type NormalizedFileType =
  | 'pdf'
  | 'image'
  | 'archive'
  | 'document'
  | 'spreadsheet'
  | 'other'

export interface FileTypeMeta {
  key: NormalizedFileType
  label: string
  icon: IconSvgElement
  description: string
}

export const FILE_TYPE_CONFIG: Record<NormalizedFileType, FileTypeMeta> = {
  pdf: {
    key: 'pdf',
    label: 'PDF Documents',
    icon: Pdf01Icon,
    description: 'Government IDs, certificates, forms and portable documents',
  },
  image: {
    key: 'image',
    label: 'Photos & Scans',
    icon: Image01Icon,
    description: 'JPG, PNG, WebP scans and photo proofs',
  },
  archive: {
    key: 'archive',
    label: 'Archive Bundles',
    icon: ZipIcon,
    description: 'ZIP, TAR, GZ compressed bundles and backups',
  },
  document: {
    key: 'document',
    label: 'Word & Text',
    icon: Doc01Icon,
    description: 'Word documents, notes, memos and RTF files',
  },
  spreadsheet: {
    key: 'spreadsheet',
    label: 'Spreadsheets',
    icon: Doc02Icon,
    description: 'Excel sheets, mark lists, CSVs and tables',
  },
  other: {
    key: 'other',
    label: 'Other Files',
    icon: File01Icon,
    description: 'Miscellaneous file types and attachments',
  },
}

/**
 * Normalizes a document's filename extension and MIME type into a canonical White Card file group.
 */
export function normalizeFileType(
  filename?: string | null,
  mimeType?: string | null
): NormalizedFileType {
  const ext = filename ? filename.split('.').pop()?.toLowerCase() || '' : ''
  const mime = mimeType ? mimeType.toLowerCase() : ''

  if (mime.includes('pdf') || ext === 'pdf') {
    return 'pdf'
  }

  if (
    mime.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'tiff', 'heic', 'avif'].includes(ext)
  ) {
    return 'image'
  }

  if (
    mime.includes('zip') ||
    mime.includes('compressed') ||
    mime.includes('tar') ||
    mime.includes('gzip') ||
    ['zip', 'tar', 'gz', 'rar', '7z', 'bz2'].includes(ext)
  ) {
    return 'archive'
  }

  if (
    mime.includes('word') ||
    mime.includes('officedocument.wordprocessingml') ||
    mime.includes('msword') ||
    mime.includes('text/plain') ||
    mime.includes('rtf') ||
    ['doc', 'docx', 'txt', 'rtf', 'odt', 'md'].includes(ext)
  ) {
    return 'document'
  }

  if (
    mime.includes('excel') ||
    mime.includes('spreadsheet') ||
    mime.includes('csv') ||
    ['xls', 'xlsx', 'csv', 'ods', 'tsv'].includes(ext)
  ) {
    return 'spreadsheet'
  }

  return 'other'
}
