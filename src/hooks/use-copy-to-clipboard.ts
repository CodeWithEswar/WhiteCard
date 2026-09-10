import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseCopyToClipboardOptions {
  timeout?: number
}

export function useCopyToClipboard({ timeout = 1600 }: UseCopyToClipboardOptions = {}) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false

      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)

        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
          setCopied(false)
          timerRef.current = null
        }, timeout)

        return true
      } catch (err) {
        console.warn('Failed to copy to clipboard:', err)
        setCopied(false)
        return false
      }
    },
    [timeout]
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return { copied, copy }
}
