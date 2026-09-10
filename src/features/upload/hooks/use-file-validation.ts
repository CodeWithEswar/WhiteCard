import { useCallback } from 'react'
import { validateFile } from '../upload.utils'
import type { UploadValidationError } from '../upload.types'

export function useFileValidation() {
  const filterFiles = useCallback((files: File[]): { valid: File[]; errors: UploadValidationError[] } => {
    const valid: File[] = []
    const errors: UploadValidationError[] = []

    files.forEach((file) => {
      const result = validateFile(file)
      if (result.valid) {
        valid.push(file)
      } else {
        errors.push({
          filename: file.name,
          reason: result.reason || 'File failed validation.',
        })
      }
    })

    return { valid, errors }
  }, [])

  return { filterFiles }
}
