import { supabase, isSupabaseConfigured, vaultStore } from '@/lib/supabase'
import type {
  DocumentSearchParams,
  SearchDocumentResult,
  SearchQueryResult,
} from './search.types'
import { detectFileType } from '@/features/documents/documents.api'
import { formatBytes, normalizeSearchQuery } from './search.utils'
import type { DocumentFileType, DocumentSpace } from '@/types/document'

/**
 * Searches vault documents matching the provided parameters.
 * Operates purely over metadata. Never requests signed URLs for search cards.
 */
export async function searchVaultDocuments(
  userId: string,
  params: DocumentSearchParams = {}
): Promise<SearchQueryResult> {
  const page = Math.max(1, params.page || 1)
  const pageSize = Math.max(1, params.pageSize || 24)

  // 1. If Supabase is offline, unconfigured, or guest session, use local vaultStore
  if (!isSupabaseConfigured || !supabase || !userId || userId === 'anon') {
    return searchLocalDocuments(params, page, pageSize)
  }

  try {
    // 2. Fetch metadata from Supabase
    let query = supabase
      .from('documents')
      .select(
        `
        id,
        title,
        original_name,
        space,
        category,
        mime_type,
        size_bytes,
        created_at,
        updated_at,
        issued_on,
        expires_on,
        notes,
        view_count,
        click_count,
        document_tags (
          tags (
            id,
            name,
            color_key
          )
        )
      `,
        { count: 'exact' }
      )
      .eq('user_id', userId)
      .eq('status', 'active')

    // Filter by Space
    if (params.space && params.space !== 'all') {
      query = query.eq('space', params.space)
    }

    // Filter by Category
    if (params.category && params.category.trim() !== '') {
      query = query.eq('category', params.category)
    }

    // Filter by Dates
    if (params.uploadedFrom) {
      query = query.gte('created_at', params.uploadedFrom)
    }
    if (params.uploadedTo) {
      // End of day
      const toDate = new Date(params.uploadedTo)
      toDate.setHours(23, 59, 59, 999)
      query = query.lte('created_at', toDate.toISOString())
    }
    if (params.issuedFrom) {
      query = query.gte('issued_on', params.issuedFrom)
    }
    if (params.issuedTo) {
      query = query.lte('issued_on', params.issuedTo)
    }

    // Filter by Expiry
    if (params.expires && params.expires !== 'all') {
      const todayIso = new Date().toISOString().split('T')[0]
      if (params.expires === '7d') {
        const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        query = query.gte('expires_on', todayIso).lte('expires_on', in7Days)
      } else if (params.expires === '30d') {
        const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        query = query.gte('expires_on', todayIso).lte('expires_on', in30Days)
      } else if (params.expires === 'expired') {
        query = query.lt('expires_on', todayIso)
      } else if (params.expires === 'none') {
        query = query.is('expires_on', null)
      }
    }

    const { data: dbDocs, error } = await query

    if (error) {
      console.warn('Supabase search documents query error, falling back to local:', error)
      return searchLocalDocuments(params, page, pageSize)
    }

    if (!dbDocs || dbDocs.length === 0) {
      return {
        documents: [],
        totalCount: 0,
        page,
        pageSize,
        totalPages: 0,
        hasMore: false,
      }
    }

    // Map DB rows to SearchDocumentResult
    const mapped: SearchDocumentResult[] = dbDocs.map((row: any) => {
      const tags: string[] = []
      const tagSummaries: { id?: string; name: string; colorKey?: string }[] = []

      if (Array.isArray(row.document_tags)) {
        for (const dt of row.document_tags) {
          if (dt?.tags?.name) {
            tags.push(dt.tags.name)
            tagSummaries.push({
              id: dt.tags.id,
              name: dt.tags.name,
              colorKey: dt.tags.color_key,
            })
          }
        }
      }

      const sizeBytes = Number(row.size_bytes) || 0
      const fileType = detectFileType(row.original_name || '', row.mime_type || '')

      return {
        id: row.id,
        title: row.title || 'Untitled Document',
        originalFilename: row.original_name || 'file',
        space: row.space as DocumentSpace,
        category: row.category || (row.space === 'government' ? 'Government ID' : 'Certificate'),
        mimeType: row.mime_type || 'application/octet-stream',
        fileType,
        sizeBytes,
        sizeFormatted: formatBytes(sizeBytes),
        createdAt: row.created_at,
        updatedAt: row.updated_at || row.created_at,
        issuedOn: row.issued_on || null,
        expiresOn: row.expires_on || null,
        expiryDate: row.expires_on || null,
        tags,
        tagSummaries,
        notes: row.notes || undefined,
        viewCount: row.view_count || 0,
        clickCount: row.click_count || 0,
      }
    })

    // Apply client-side in-memory filtering for FileType, Tags, and Text Query
    // (This guarantees 100% precision regardless of Supabase join nuances)
    const filtered = filterAndSortDocuments(mapped, params)

    const totalCount = filtered.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const startIndex = (page - 1) * pageSize
    const paginatedDocs = filtered.slice(startIndex, startIndex + pageSize)

    return {
      documents: paginatedDocs,
      totalCount,
      page,
      pageSize,
      totalPages,
      hasMore: page < totalPages,
    }
  } catch (err) {
    console.error('Search query unexpected error:', err)
    return searchLocalDocuments(params, page, pageSize)
  }
}

/**
 * Searches local documents from vaultStore when offline or unauthenticated
 */
function searchLocalDocuments(
  params: DocumentSearchParams,
  page: number,
  pageSize: number
): SearchQueryResult {
  const localDocs = vaultStore.getDocuments()

  const mapped: SearchDocumentResult[] = localDocs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    originalFilename: doc.originalFilename,
    space: doc.space,
    category: doc.category,
    mimeType: doc.mimeType,
    fileType: doc.fileType,
    sizeBytes: doc.sizeBytes,
    sizeFormatted: doc.sizeFormatted || formatBytes(doc.sizeBytes),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    expiresOn: doc.expiryDate || null,
    expiryDate: doc.expiryDate || null,
    tags: doc.tags || [],
    notes: doc.notes,
    viewCount: doc.viewCount || 0,
    clickCount: doc.clickCount || 0,
  }))

  const filtered = filterAndSortDocuments(mapped, params)
  const totalCount = filtered.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedDocs = filtered.slice(startIndex, startIndex + pageSize)

  return {
    documents: paginatedDocs,
    totalCount,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  }
}

/**
 * Filters and sorts search documents in memory
 */
function filterAndSortDocuments(
  docs: SearchDocumentResult[],
  params: DocumentSearchParams
): SearchDocumentResult[] {
  const query = normalizeSearchQuery(params.q)
  const requiredTags = params.tags || []

  return docs
    .filter((doc) => {
      // 1. Space
      if (params.space && params.space !== 'all' && doc.space !== params.space) {
        return false
      }

      // 2. Category
      if (params.category && params.category.trim() !== '') {
        if (doc.category?.toLowerCase() !== params.category.toLowerCase()) {
          return false
        }
      }

      // 3. File Type
      if (params.fileType && params.fileType !== 'other') {
        if (doc.fileType !== params.fileType) return false
      } else if (params.fileType === 'other') {
        if (['pdf', 'image', 'zip', 'doc', 'sheet'].includes(doc.fileType)) return false
      }

      // 4. Tags (must include all requested tags, or any if specified)
      if (requiredTags.length > 0) {
        const hasAllTags = requiredTags.every((reqTag) =>
          doc.tags.some((t) => t.toLowerCase() === reqTag.toLowerCase())
        )
        if (!hasAllTags) return false
      }

      // 5. Expiry Filter
      if (params.expires && params.expires !== 'all') {
        const now = Date.now()
        const expiryTime = doc.expiresOn ? new Date(doc.expiresOn).getTime() : null

        if (params.expires === 'none') {
          if (doc.expiresOn) return false
        } else if (!expiryTime || isNaN(expiryTime)) {
          return false
        } else if (params.expires === 'expired') {
          if (expiryTime >= now) return false
        } else if (params.expires === '7d') {
          const in7Days = now + 7 * 24 * 60 * 60 * 1000
          if (expiryTime < now || expiryTime > in7Days) return false
        } else if (params.expires === '30d') {
          const in30Days = now + 30 * 24 * 60 * 60 * 1000
          if (expiryTime < now || expiryTime > in30Days) return false
        }
      }

      // 6. Free text query (matches title, original filename, category, tags, or notes)
      if (query) {
        const titleMatch = doc.title.toLowerCase().includes(query)
        const filenameMatch = doc.originalFilename.toLowerCase().includes(query)
        const categoryMatch = doc.category?.toLowerCase().includes(query) || false
        const tagMatch = doc.tags.some((t) => t.toLowerCase().includes(query))
        const notesMatch = doc.notes?.toLowerCase().includes(query) || false

        if (!titleMatch && !filenameMatch && !categoryMatch && !tagMatch && !notesMatch) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      const sort = params.sort || 'recent'

      switch (sort) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

        case 'name_asc':
          return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })

        case 'name_desc':
          return b.title.localeCompare(a.title, undefined, { sensitivity: 'base' })

        case 'size_desc':
          return b.sizeBytes - a.sizeBytes

        case 'size_asc':
          return a.sizeBytes - b.sizeBytes

        case 'expiry_soon': {
          const now = Date.now()
          const timeA = a.expiresOn ? new Date(a.expiresOn).getTime() : Infinity
          const timeB = b.expiresOn ? new Date(b.expiresOn).getTime() : Infinity

          // Prioritize non-expired upcoming dates
          const diffA = timeA >= now ? timeA - now : Infinity + 1
          const diffB = timeB >= now ? timeB - now : Infinity + 1
          return diffA - diffB
        }

        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
}

/**
 * Fetches all available user tags (combines user's tags from Supabase/vaultStore)
 */
export async function fetchAvailableUserTags(
  userId: string
): Promise<{ id?: string; name: string; colorKey?: string }[]> {
  const fallbackTags = [
    { name: 'Identity', colorKey: 'blue' },
    { name: 'Education', colorKey: 'violet' },
    { name: 'Travel', colorKey: 'cyan' },
    { name: 'Vehicle', colorKey: 'amber' },
    { name: 'Renewal', colorKey: 'amber' },
    { name: 'Personal', colorKey: 'rose' },
  ]

  if (!isSupabaseConfigured || !supabase || !userId || userId === 'anon') {
    const localDocs = vaultStore.getDocuments()
    const tagMap = new Map<string, { id?: string; name: string; colorKey?: string }>()
    fallbackTags.forEach((t) => tagMap.set(t.name.toLowerCase(), t))
    localDocs.forEach((d) => {
      d.tags?.forEach((t) => {
        if (!tagMap.has(t.toLowerCase())) {
          tagMap.set(t.toLowerCase(), { name: t })
        }
      })
    })
    return Array.from(tagMap.values())
  }

  try {
    const { data, error } = await supabase
      .from('tags')
      .select('id, name, color_key')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error || !data || data.length === 0) {
      return fallbackTags
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      colorKey: row.color_key,
    }))
  } catch {
    return fallbackTags
  }
}

