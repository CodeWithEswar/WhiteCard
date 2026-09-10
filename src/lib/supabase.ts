import { createClient } from '@supabase/supabase-js'
import type { VaultDocument, UploadDocumentPayload, DocumentFileType } from '../types/document'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const VAULT_STORAGE_KEY = 'whitecard_vault_documents_v1'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function detectFileType(filename: string, mime: string): DocumentFileType {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  if (mime.includes('pdf') || ext === 'pdf') return 'pdf'
  if (mime.includes('image') || ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext)) return 'image'
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) return 'zip'
  if (['doc', 'docx', 'odt', 'txt', 'rtf'].includes(ext)) return 'doc'
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return 'sheet'
  return 'other'
}

// Clean starter vault state (zero fake documents)
const INITIAL_DOCUMENTS: VaultDocument[] = []

// Local Vault Storage API
export const vaultStore = {
  getDocuments: (): VaultDocument[] => {
    try {
      const stored = localStorage.getItem(VAULT_STORAGE_KEY)
      if (!stored) {
        return []
      }
      const parsed = JSON.parse(stored)
      // Filter out any legacy dummy/mock starter documents (doc-gov-*, doc-stu-*)
      if (Array.isArray(parsed)) {
        const realDocs = parsed.filter(
          (d: any) => !d.id?.startsWith('doc-gov-') && !d.id?.startsWith('doc-stu-')
        )
        // If legacy items were purged, update localStorage to keep it clean
        if (realDocs.length !== parsed.length) {
          localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(realDocs))
        }
        return realDocs
      }
      return []
    } catch {
      return []
    }
  },

  getDocumentById: (id: string): VaultDocument | undefined => {
    const docs = vaultStore.getDocuments()
    return docs.find((d) => d.id === id)
  },

  getDocumentByShareToken: (token: string): VaultDocument | undefined => {
    const docs = vaultStore.getDocuments()
    return docs.find((d) => d.sharedDirectLink?.token === token)
  },

  addDocument: async (payload: UploadDocumentPayload): Promise<VaultDocument> => {
    const docs = vaultStore.getDocuments()
    const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const now = new Date().toISOString()
    const fileType = detectFileType(payload.file.name, payload.file.type)

    const newDoc: VaultDocument = {
      id,
      title: payload.title?.trim() || payload.file.name.replace(/\.[^/.]+$/, ''),
      originalFilename: payload.file.name,
      fileType,
      mimeType: payload.file.type || 'application/octet-stream',
      space: payload.space,
      category: payload.category?.trim() || (payload.space === 'government' ? 'Government ID' : 'Academic Record'),
      viewCount: 0,
      clickCount: 0,
      sizeBytes: payload.file.size,
      sizeFormatted: formatFileSize(payload.file.size),
      createdAt: now,
      updatedAt: now,
      expiryDate: payload.expiryDate || null,
      tags: payload.tags && payload.tags.length > 0 ? payload.tags : [payload.space === 'government' ? 'Identity' : 'Education'],
      notes: payload.notes?.trim() || '',
      fileUrl: URL.createObjectURL(payload.file),
    }

    const updated = [newDoc, ...docs]
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated))
    return newDoc
  },

  incrementViewCount: (id: string): void => {
    const doc = vaultStore.getDocumentById(id)
    if (doc) {
      vaultStore.updateDocument(id, {
        viewCount: (doc.viewCount || 0) + 1,
        sharedDirectLink: doc.sharedDirectLink
          ? {
              ...doc.sharedDirectLink,
              viewCount: (doc.sharedDirectLink.viewCount || 0) + 1,
            }
          : undefined,
      })
    }
  },

  incrementClickCount: (id: string): void => {
    const doc = vaultStore.getDocumentById(id)
    if (doc) {
      vaultStore.updateDocument(id, {
        clickCount: (doc.clickCount || 0) + 1,
        sharedDirectLink: doc.sharedDirectLink
          ? {
              ...doc.sharedDirectLink,
              clickCount: (doc.sharedDirectLink.clickCount || 0) + 1,
            }
          : undefined,
      })
    }
  },

  updateDocument: (
    id: string,
    updates: Partial<Omit<VaultDocument, 'id' | 'createdAt'>>
  ): VaultDocument | null => {
    const docs = vaultStore.getDocuments()
    const index = docs.findIndex((d) => d.id === id)
    if (index === -1) return null

    const updatedDoc: VaultDocument = {
      ...docs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    docs[index] = updatedDoc
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(docs))
    return updatedDoc
  },

  deleteDocument: (id: string): boolean => {
    const docs = vaultStore.getDocuments()
    const filtered = docs.filter((d) => d.id !== id)
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(filtered))
    return true
  },

  createShareLink: (id: string, daysValid = 7): { token: string; expiresAt: string } | null => {
    const doc = vaultStore.getDocumentById(id)
    if (!doc) return null

    const token = `wc_shr_${Math.random().toString(36).substring(2, 10)}`
    const expiresAt = new Date(Date.now() + daysValid * 24 * 3600 * 1000).toISOString()
    const now = new Date().toISOString()

    vaultStore.updateDocument(id, {
      sharedDirectLink: {
        token,
        expiresAt,
        createdAt: now,
      },
    })

    return { token, expiresAt }
  },

  revokeShareLink: (id: string): boolean => {
    vaultStore.updateDocument(id, {
      sharedDirectLink: null,
    })
    return true
  },
}
