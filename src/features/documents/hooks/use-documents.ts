import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/features/auth/auth-provider'
import {
  fetchUserDocuments,
  fetchDocumentById,
  uploadDocumentToSupabase,
  updateDocumentInSupabase,
  deleteDocumentFromSupabase,
  createShareLinkInSupabase,
  revokeShareLinkInSupabase,
  fetchDocumentByShareTokenFromSupabase,
  recordDocumentView,
  recordDocumentDownload,
  executeDocumentDownload,
} from '../documents.api'
import type {
  VaultDocument,
  DocumentFilterOptions,
  UploadDocumentPayload,
} from '../../../types/document'

export function useDocuments(filters: DocumentFilterOptions = {}) {
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useQuery({
    queryKey: queryKeys.documents.list(userId, filters),
    staleTime: 30 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    queryFn: async (): Promise<VaultDocument[]> => {
      const allDocs = await fetchUserDocuments(userId)

      return allDocs
        .filter((doc) => {
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
        })
        .sort((a, b) => {
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
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useQuery({
    queryKey: queryKeys.documents.detail(userId, id || ''),
    staleTime: 30 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    queryFn: async (): Promise<VaultDocument | null> => {
      if (!id) return null
      return await fetchDocumentById(id, userId)
    },
    enabled: Boolean(id),
  })
}

export function useDocumentByShareToken(token?: string) {
  return useQuery({
    queryKey: ['documents', 'shared', token || ''],
    staleTime: 60 * 1000,
    gcTime: 1000 * 60 * 10,
    queryFn: async (): Promise<VaultDocument | null> => {
      if (!token) return null
      return await fetchDocumentByShareTokenFromSupabase(token)
    },
    enabled: Boolean(token),
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useMutation({
    mutationFn: async (payload: UploadDocumentPayload) => {
      return await uploadDocumentToSupabase(payload, userId)
    },
    onSuccess: (newDoc) => {
      if (newDoc) {
        queryClient.setQueryData(queryKeys.documents.detail(userId, newDoc.id), newDoc)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.storage.all })
    },
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<VaultDocument, 'id' | 'createdAt'>>
    }) => {
      const updated = await updateDocumentInSupabase(id, updates, userId)
      if (!updated) throw new Error('Document not found')
      return updated
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.detail(userId, updated.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.storage.all })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteDocumentFromSupabase(id, userId)
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: queryKeys.documents.all(userId) },
        (oldData: any) => {
          if (!Array.isArray(oldData)) return oldData
          return oldData.filter((doc) => doc.id !== deletedId)
        }
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.storage.all })
    },
  })
}

export function useCreateShareLink() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useMutation({
    mutationFn: async ({ id, daysValid }: { id: string; daysValid?: number }) => {
      const res = await createShareLinkInSupabase(id, userId, daysValid)
      if (!res) throw new Error('Failed to create direct share link')
      return res
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.detail(userId, id) })
    },
  })
}

export function useRevokeShareLink() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useMutation({
    mutationFn: async (id: string) => {
      return await revokeShareLinkInSupabase(id, userId)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.detail(userId, id) })
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

export function useRecordDocumentView() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useMutation({
    mutationFn: async (documentId: string) => {
      return await recordDocumentView(documentId, userId)
    },
    onSuccess: (newCount, documentId) => {
      // 1. Optimistically update all document list & detail queries in cache
      queryClient.setQueriesData(
        { queryKey: ['documents'] },
        (oldData: any) => {
          if (Array.isArray(oldData)) {
            return oldData.map((doc: VaultDocument) =>
              doc.id === documentId ? { ...doc, viewCount: newCount } : doc
            )
          }
          if (oldData && typeof oldData === 'object' && oldData.id === documentId) {
            return { ...oldData, viewCount: newCount }
          }
          return oldData
        }
      )
      // 2. Explicitly update detail query for user
      queryClient.setQueryData(
        queryKeys.documents.detail(userId, documentId),
        (oldDoc: VaultDocument | null | undefined) => {
          if (!oldDoc) return oldDoc
          return { ...oldDoc, viewCount: newCount }
        }
      )
      // 3. Invalidate dashboard summary
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary(userId) })
    },
  })
}

export function useRecordDocumentDownload() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useMutation({
    mutationFn: async (documentId: string) => {
      return await recordDocumentDownload(documentId, userId)
    },
    onSuccess: (newCount, documentId) => {
      // 1. Optimistically update all document list & detail queries in cache
      queryClient.setQueriesData(
        { queryKey: ['documents'] },
        (oldData: any) => {
          if (Array.isArray(oldData)) {
            return oldData.map((doc: VaultDocument) =>
              doc.id === documentId ? { ...doc, clickCount: newCount } : doc
            )
          }
          if (oldData && typeof oldData === 'object' && oldData.id === documentId) {
            return { ...oldData, clickCount: newCount }
          }
          return oldData
        }
      )
      // 2. Explicitly update detail query for user
      queryClient.setQueryData(
        queryKeys.documents.detail(userId, documentId),
        (oldDoc: VaultDocument | null | undefined) => {
          if (!oldDoc) return oldDoc
          return { ...oldDoc, clickCount: newCount }
        }
      )
      // 3. Invalidate dashboard summary
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary(userId) })
    },
  })
}

export function useDocumentDownload() {
  const recordDownload = useRecordDocumentDownload()
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  const download = async (doc: VaultDocument) => {
    try {
      // 1. Trigger the download immediately
      await executeDocumentDownload(doc, userId)
      // 2. Increment download count in database and cache
      recordDownload.mutate(doc.id)
    } catch (err) {
      console.error('Download execution error:', err)
    }
  }

  return {
    download,
    isDownloading: recordDownload.isPending,
  }
}

