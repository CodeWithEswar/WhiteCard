import {
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_EXTENSIONS,
} from './upload.constants'
import type { DocumentFileType } from '@/types/document'

export function sanitizeSuggestedTitle(filename: string): string {
  if (!filename) return ''
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  const spaced = nameWithoutExt.replace(/[-_]+/g, ' ').trim()
  if (!spaced) return filename
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

export function detectFileType(filename: string, mime: string): DocumentFileType {
  const ext = ('.' + (filename.split('.').pop()?.toLowerCase() || '')).toLowerCase()
  const mimeLower = mime.toLowerCase()

  if (ext === '.pdf' || mimeLower.includes('pdf')) return 'pdf'
  if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext) || mimeLower.startsWith('image/')) return 'image'
  if (ext === '.zip' || mimeLower.includes('zip')) return 'zip'
  if (['.doc', '.docx'].includes(ext) || mimeLower.includes('word') || mimeLower.includes('officedocument.wordprocessingml')) return 'doc'
  if (['.xls', '.xlsx'].includes(ext) || mimeLower.includes('excel') || mimeLower.includes('spreadsheetml')) return 'sheet'

  return 'other'
}

export function validateFile(file: File): { valid: boolean; reason?: string } {
  if (!file) {
    return { valid: false, reason: 'No file provided.' }
  }

  if (file.size === 0) {
    return { valid: false, reason: 'This file is empty (0 bytes).' }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, reason: 'File exceeds the maximum allowed size of 50 MB.' }
  }

  const ext = ('.' + (file.name.split('.').pop()?.toLowerCase() || '')).toLowerCase()
  const isSupportedExt = SUPPORTED_EXTENSIONS.includes(ext as any)
  const isImageMime = file.type.startsWith('image/')
  const isPdfMime = file.type === 'application/pdf'
  const isZipMime = file.type.includes('zip')
  const isDocMime = file.type.includes('word') || file.type.includes('document')
  const isSheetMime = file.type.includes('excel') || file.type.includes('sheet')

  if (!isSupportedExt && !isImageMime && !isPdfMime && !isZipMime && !isDocMime && !isSheetMime) {
    return { valid: false, reason: `Files with extension "${ext}" are not supported.` }
  }

  return { valid: true }
}
