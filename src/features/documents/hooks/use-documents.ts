import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vaultStore } from '../../../lib/supabase'
import type {
  VaultDocument,
  DocumentFilterOptions,
  UploadDocumentPayload,
} from '../../../types/document'

export const DOCUMENT_KEYS = {
  all: ['documents'] as const,
  list: (filters: DocumentFilterOptions) => ['documents', 'list', filters] as const,
  detail: (id: string) => ['documents', 'detail', id] as const,
  shared: (token: string) => ['documents', 'shared', token] as const,
}

export function useDocuments(filters: DocumentFilterOptions = {}) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.list(filters),
    queryFn: async (): Promise<VaultDocument[]> => {
      const allDocs = vaultStore.getDocuments()

      return allDocs.filter((doc) => {
        // Filter by Space
        if (filters.space && filters.space !== 'all' && doc.space !== filters.space) {
          return false
        }

        // Filter by File Type
        if (filters.fileType && filters.fileType !== 'all' && doc.fileType !== filters.fileType) {
          return false
        }

        // Filter by Tags
        if (filters.tags && filters.tags.length > 0) {
          const hasMatchingTag = filters.tags.some((t) => doc.tags.includes(t))
          if (!hasMatchingTag) return false
        }

        // Filter by Search Query (title, original filename, category, notes, tags)
        if (filters.search && filters.search.trim() !== '') {
          const q = filters.search.toLowerCase().trim()
          const matchesTitle = doc.title.toLowerCase().includes(q)
          const matchesFilename = doc.originalFilename.toLowerCase().includes(q)
          const matchesCategory = doc.category.toLowerCase().includes(q)
          const matchesTag = doc.tags.some((t) => t.toLowerCase().includes(q))
          const matchesNotes = doc.notes?.toLowerCase().includes(q) || false
          if (!matchesTitle && !matchesFilename && !matchesCategory && !matchesTag && !matchesNotes) {
            return false
          }
        }

        return true
      }).sort((a, b) => {
        if (filters.sortBy === 'updated_asc') {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        }
        if (filters.sortBy === 'name_asc') {
          return a.title.localeCompare(b.title)
        }
        if (filters.sortBy === 'size_desc') {
          return b.sizeBytes - a.sizeBytes
        }
        // default: updated_desc
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
    },
  })
}

export function useDocument(id?: string) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.detail(id || ''),
    queryFn: async (): Promise<VaultDocument | null> => {
      if (!id) return null
      const doc = vaultStore.getDocumentById(id)
      return doc || null
    },
    enabled: Boolean(id),
  })
}

export function useDocumentByShareToken(token?: string) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.shared(token || ''),
    queryFn: async (): Promise<VaultDocument | null> => {
      if (!token) return null
      const doc = vaultStore.getDocumentByShareToken(token)
      return doc || null
    },
    enabled: Boolean(token),
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UploadDocumentPayload) => {
      return await vaultStore.addDocument(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all })
    },
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<VaultDocument, 'id' | 'createdAt'>>
    }) => {
      const updated = vaultStore.updateDocument(id, updates)
      if (!updated) throw new Error('Document not found')
      return updated
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.detail(updated.id) })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return vaultStore.deleteDocument(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all })
    },
  })
}

export function useCreateShareLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, daysValid }: { id: string; daysValid?: number }) => {
      const res = vaultStore.createShareLink(id, daysValid)
      if (!res) throw new Error('Failed to create direct share link')
      return res
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.detail(id) })
    },
  })
}

export function useRevokeShareLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return vaultStore.revokeShareLink(id)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.detail(id) })
    },
  })
}

export function useVaultStats() {
  const { data: documents = [] } = useDocuments()

  const govDocs = documents.filter((d) => d.space === 'government')
  const studentDocs = documents.filter((d) => d.space === 'student')

  const now = Date.now()
  const thirtyDaysMs = 30 * 24 * 3600 * 1000

  const expiringDocs = documents.filter((d) => {
    if (!d.expiryDate) return false
    const expiryTime = new Date(d.expiryDate).getTime()
    return expiryTime > now && expiryTime - now < thirtyDaysMs
  })

  const totalBytes = documents.reduce((acc, d) => acc + d.sizeBytes, 0)

  const formatTotalSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return {
    totalCount: documents.length,
    govCount: govDocs.length,
    studentCount: studentDocs.length,
    expiringCount: expiringDocs.length,
    expiringDocs,
    recentDocs: [...documents].slice(0, 5),
    totalStorageFormatted: formatTotalSize(totalBytes),
    totalBytes,
  }
}
