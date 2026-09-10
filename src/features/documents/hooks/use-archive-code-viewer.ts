import { useState, useCallback } from 'react'
import type JSZip from 'jszip'
import { extractEntryAsBlob } from '../lib/archive-parser'

export function useArchiveCodeViewer(zip: JSZip | null) {
  const [isRaw, setIsRaw] = useState(false)
  const [isWrapped, setIsWrapped] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const toggleRaw = useCallback(() => setIsRaw((prev) => !prev), [])
  const toggleWrap = useCallback(() => setIsWrapped((prev) => !prev), [])

  const copyCode = useCallback(async (content: string) => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setHasCopied(true)
      setTimeout(() => setHasCopied(false), 1500)
    } catch {
      // Fallback if clipboard API fails
      const textarea = document.createElement('textarea')
      textarea.value = content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setHasCopied(true)
      setTimeout(() => setHasCopied(false), 1500)
    }
  }, [])

  const downloadFile = useCallback(
    async (path: string, fileName: string, mimeType?: string) => {
      if (!zip) return
      setIsDownloading(true)
      try {
        const blob = await extractEntryAsBlob(zip, path, mimeType)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } catch (err) {
        console.error('Failed to download archive entry:', err)
      } finally {
        setIsDownloading(false)
      }
    },
    [zip]
  )

  return {
    isRaw,
    isWrapped,
    hasCopied,
    isDownloading,
    toggleRaw,
    toggleWrap,
    copyCode,
    downloadFile,
  }
}
