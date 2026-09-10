import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { VaultDocument } from '@/types/document'

interface DocumentPreviewState {
  signedUrl: string | null
  rawContent: string | null
  arrayBuffer: ArrayBuffer | null
  isLoadingBytes: boolean
  error: string | null
}

const MAX_TEXT_PREVIEW_BYTES = 2 * 1024 * 1024 // 2MB

export function useDocumentPreview(document: VaultDocument | null) {
  const [state, setState] = useState<DocumentPreviewState>({
    signedUrl: null,
    rawContent: null,
    arrayBuffer: null,
    isLoadingBytes: false,
    error: null,
  })

  // Refresh or generate signed URL (memory only, never persisted)
  const refreshUrl = useCallback(async () => {
    if (!document) return

    // If local sample document has static / mock url
    if (document.fileUrl && !isSupabaseConfigured) {
      setState((prev) => ({ ...prev, signedUrl: document.fileUrl || null, error: null }))
      return
    }

    try {
      const client = supabase
      if (!client) {
        setState((prev) => ({ ...prev, signedUrl: document.fileUrl || null }))
        return
      }

      // Check if document has storage path or default to existing fileUrl
      if (document.fileUrl) {
        setState((prev) => ({ ...prev, signedUrl: document.fileUrl || null, error: null }))
      }
    } catch (err: any) {
      console.warn('Could not refresh signed preview URL:', err)
      setState((prev) => ({
        ...prev,
        error: 'Unable to refresh preview token. Please try downloading.',
      }))
    }
  }, [document])

  useEffect(() => {
    refreshUrl()
  }, [refreshUrl])

  const abortControllerRef = useRef<AbortController | null>(null)

  // Abort any in-flight fetch when document changes or unmounts (Prompt #44)
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [document?.id])

  // Fetch text or array buffer content if required by renderer (text, json, csv, code, zip)
  const fetchContent = useCallback(
    async (type: 'text' | 'buffer') => {
      const url = state.signedUrl || document?.fileUrl
      if (!url || url === '#') return

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      const controller = new AbortController()
      abortControllerRef.current = controller

      setState((prev) => ({ ...prev, isLoadingBytes: true, error: null }))

      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to load file data`)
        }

        if (type === 'text') {
          // Check header size if available
          const contentLength = Number(response.headers.get('content-length')) || 0
          if (contentLength > MAX_TEXT_PREVIEW_BYTES) {
            setState((prev) => ({
              ...prev,
              isLoadingBytes: false,
              error: 'File is too large for inline text preview. Please download original.',
            }))
            return
          }

          const text = await response.text()
          setState((prev) => ({
            ...prev,
            rawContent: text,
            isLoadingBytes: false,
          }))
        } else if (type === 'buffer') {
          const buffer = await response.arrayBuffer()
          setState((prev) => ({
            ...prev,
            arrayBuffer: buffer,
            isLoadingBytes: false,
          }))
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error('Failed to fetch document content bytes:', err)
        setState((prev) => ({
          ...prev,
          isLoadingBytes: false,
          error: err.message || 'Could not load document preview content.',
        }))
      }
    },
    [state.signedUrl, document?.fileUrl]
  )

  return {
    signedUrl: state.signedUrl || document?.fileUrl || null,
    rawContent: state.rawContent,
    arrayBuffer: state.arrayBuffer,
    isLoadingBytes: state.isLoadingBytes,
    error: state.error,
    refreshUrl,
    fetchContent,
  }
}
