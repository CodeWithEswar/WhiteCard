import { supabase, isSupabaseConfigured, vaultStore } from '@/lib/supabase'
import { formatBytes } from '@/lib/files/format-bytes'
import { normalizeFileType, FILE_TYPE_CONFIG } from '@/lib/files/file-type'
import { fetchUserDocuments } from '@/features/documents/documents.api'
import {
  calculatePercentage,
  generateStorageInsights,
} from './storage.utils'
import { STORAGE_FILE_TYPE_ORDER } from './storage.constants'
import type {
  StorageBreakdown,
  StorageFileTypeItem,
  LargestStorageDocument,
} from './storage.types'

/**
 * Computes storage breakdown client-side from VaultDocument list
 * (used as a fallback if RPC is not available or local store is active).
 */
function computeBreakdownFromDocs(docs: any[]): StorageBreakdown {
  const activeDocs = docs.filter((d) => d.status !== 'deleted')
  const totalDocuments = activeDocs.length
  let totalBytes = 0
  let govBytes = 0
  let govCount = 0
  let studentBytes = 0
  let studentCount = 0

  const fileTypeMap = new Map<string, { count: number; bytes: number }>()
  STORAGE_FILE_TYPE_ORDER.forEach((key) => {
    fileTypeMap.set(key, { count: 0, bytes: 0 })
  })

  activeDocs.forEach((d) => {
    const size = Number(d.sizeBytes || 0)
    totalBytes += size

    if (d.space === 'government') {
      govBytes += size
      govCount += 1
    } else {
      studentBytes += size
      studentCount += 1
    }

    const typeKey = normalizeFileType(d.originalFilename || d.title, d.mimeType)
    const entry = fileTypeMap.get(typeKey) || { count: 0, bytes: 0 }
    entry.count += 1
    entry.bytes += size
    fileTypeMap.set(typeKey, entry)
  })

  // Format File Types
  const fileTypes: StorageFileTypeItem[] = STORAGE_FILE_TYPE_ORDER.map((key) => {
    const entry = fileTypeMap.get(key) || { count: 0, bytes: 0 }
    return {
      key,
      label: FILE_TYPE_CONFIG[key].label,
      count: entry.count,
      bytes: entry.bytes,
      percentage: calculatePercentage(entry.bytes, totalBytes),
    }
  }).filter((item) => item.count > 0) // Only include types that exist

  // Largest Documents (top 10)
  const sorted = [...activeDocs].sort((a, b) => (b.sizeBytes || 0) - (a.sizeBytes || 0)).slice(0, 10)
  const topSize = sorted[0]?.sizeBytes || 1

  const largestDocuments: LargestStorageDocument[] = sorted.map((d) => ({
    id: d.id,
    title: d.title,
    originalFilename: d.originalFilename || d.title,
    mimeType: d.mimeType || 'application/octet-stream',
    sizeBytes: d.sizeBytes || 0,
    space: d.space,
    category: d.category || null,
    createdAt: d.createdAt,
    relativePercentage: Math.max(8, Math.round(((d.sizeBytes || 0) / topSize) * 100)),
  }))

  const spaces = {
    government: {
      count: govCount,
      bytes: govBytes,
      percentage: calculatePercentage(govBytes, totalBytes),
    },
    student: {
      count: studentCount,
      bytes: studentBytes,
      percentage: calculatePercentage(studentBytes, totalBytes),
    },
  }

  const insights = generateStorageInsights(totalBytes, spaces, fileTypes, largestDocuments)

  return {
    totalBytes,
    totalDocuments,
    totalBytesFormatted: formatBytes(totalBytes),
    spaces,
    fileTypes,
    largestDocuments,
    insights,
    quotaBytes: null,
  }
}

/**
 * Fetches storage breakdown for authenticated user.
 * Tries Supabase RPC `get_storage_breakdown` first, with graceful local fallback.
 */
export async function getStorageBreakdown(userId?: string): Promise<StorageBreakdown> {
  const client = supabase
  if (!isSupabaseConfigured || !client || !userId || userId === 'anon') {
    const localDocs = vaultStore.getDocuments()
    return computeBreakdownFromDocs(localDocs)
  }

  try {
    // 1. Attempt server-side RPC
    const { data: rpcData, error: rpcError } = await client.rpc('get_storage_breakdown')

    if (!rpcError && rpcData) {
      const data = typeof rpcData === 'string' ? JSON.parse(rpcData) : rpcData
      const totalBytes = Number(data.totalBytes || 0)
      const totalDocs = Number(data.totalDocuments || 0)
      const govBytes = Number(data.governmentBytes || 0)
      const govCount = Number(data.governmentCount || 0)
      const studentBytes = Number(data.studentBytes || 0)
      const studentCount = Number(data.studentCount || 0)

      const rawFileTypes = Array.isArray(data.fileTypes) ? data.fileTypes : []
      const fileTypes: StorageFileTypeItem[] = rawFileTypes.map((f: any) => {
        const key = f.type_key || f.key || 'other'
        const meta = FILE_TYPE_CONFIG[key as keyof typeof FILE_TYPE_CONFIG] || FILE_TYPE_CONFIG.other
        const bytes = Number(f.type_bytes || f.bytes || 0)
        return {
          key: meta.key,
          label: meta.label,
          count: Number(f.type_count || f.count || 0),
          bytes,
          percentage: calculatePercentage(bytes, totalBytes),
        }
      }).filter((item: any) => item.count > 0)

      const rawLargest = Array.isArray(data.largestDocuments) ? data.largestDocuments : []
      const topSize = rawLargest[0]?.sizeBytes || 1
      const largestDocuments: LargestStorageDocument[] = rawLargest.map((d: any) => ({
        id: d.id,
        title: d.title,
        originalFilename: d.originalFilename || d.title,
        mimeType: d.mimeType || 'application/octet-stream',
        sizeBytes: Number(d.sizeBytes || 0),
        space: d.space,
        category: d.category || null,
        createdAt: d.createdAt,
        relativePercentage: Math.max(8, Math.round((Number(d.sizeBytes || 0) / topSize) * 100)),
      }))

      const spaces = {
        government: {
          count: govCount,
          bytes: govBytes,
          percentage: calculatePercentage(govBytes, totalBytes),
        },
        student: {
          count: studentCount,
          bytes: studentBytes,
          percentage: calculatePercentage(studentBytes, totalBytes),
        },
      }

      const insights = generateStorageInsights(totalBytes, spaces, fileTypes, largestDocuments)

      return {
        totalBytes,
        totalDocuments: totalDocs,
        totalBytesFormatted: formatBytes(totalBytes),
        spaces,
        fileTypes,
        largestDocuments,
        insights,
        quotaBytes: null,
      }
    }
  } catch (err) {
    console.warn('RPC get_storage_breakdown failed, falling back to direct doc aggregation:', err)
  }

  // 2. Direct fallback using fetchUserDocuments
  const docs = await fetchUserDocuments(userId)
  return computeBreakdownFromDocs(docs)
}
