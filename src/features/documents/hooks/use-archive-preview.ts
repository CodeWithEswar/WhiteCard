import { useState, useEffect } from 'react'
import { parseArchiveBuffer, extractEntryAsText, type ParsedArchive } from '../lib/archive-parser'

export type ArchiveErrorKind =
  | 'TOO_LARGE'
  | 'TOO_MANY_ENTRIES'
  | 'SUSPICIOUS_COMPRESSION_RATIO'
  | 'ENCRYPTED'
  | 'CORRUPTED'
  | 'UNKNOWN'

export function useArchivePreview(
  arrayBuffer: ArrayBuffer | null,
  isLoadingBytes: boolean,
  onFetchContent?: () => void
) {
  const [parsedArchive, setParsedArchive] = useState<ParsedArchive | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [errorKind, setErrorKind] = useState<ArchiveErrorKind | null>(null)
  const [readmeContent, setReadmeContent] = useState<string | null>(null)

  // Trigger fetch if buffer not loaded yet
  useEffect(() => {
    if (!arrayBuffer && !isLoadingBytes && onFetchContent) {
      onFetchContent()
    }
  }, [arrayBuffer, isLoadingBytes, onFetchContent])

  // Parse buffer when available
  useEffect(() => {
    if (!arrayBuffer) {
      setParsedArchive(null)
      setErrorKind(null)
      return
    }

    let isMounted = true
    setIsParsing(true)
    setErrorKind(null)

    parseArchiveBuffer(arrayBuffer)
      .then(async (archive) => {
        if (!isMounted) return
        setParsedArchive(archive)
        setIsParsing(false)

        // Load root README if present
        if (archive.rootReadmePath) {
          try {
            const readme = await extractEntryAsText(archive.zipInstance, archive.rootReadmePath)
            if (isMounted) setReadmeContent(readme)
          } catch {
            // Non-critical if README fails to parse
          }
        }
      })
      .catch((err: any) => {
        if (!isMounted) return
        setIsParsing(false)
        console.warn('Archive parse error:', err.message)

        if (err.message === 'ARCHIVE_TOO_LARGE') {
          setErrorKind('TOO_LARGE')
        } else if (err.message === 'TOO_MANY_ENTRIES') {
          setErrorKind('TOO_MANY_ENTRIES')
        } else if (err.message === 'SUSPICIOUS_COMPRESSION_RATIO') {
          setErrorKind('SUSPICIOUS_COMPRESSION_RATIO')
        } else if (err.message === 'ENCRYPTED_ARCHIVE') {
          setErrorKind('ENCRYPTED')
        } else {
          setErrorKind('CORRUPTED')
        }
      })

    return () => {
      isMounted = false
    }
  }, [arrayBuffer])

  return {
    parsedArchive,
    isParsing: isLoadingBytes || isParsing,
    errorKind,
    readmeContent,
  }
}
