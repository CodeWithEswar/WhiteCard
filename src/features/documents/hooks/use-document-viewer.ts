import { useState, useCallback, useEffect } from 'react'

export interface DocumentViewerState {
  isDetailsOpen: boolean
  isFocusMode: boolean
  isEditingDetails: boolean
  activeTab: string
  lineWrap: boolean
  searchQuery: string
  openDetails: () => void
  closeDetails: () => void
  toggleDetails: () => void
  toggleFocusMode: () => void
  setFocusMode: (val: boolean) => void
  setIsEditingDetails: (val: boolean) => void
  setActiveTab: (tab: string) => void
  toggleLineWrap: () => void
  setSearchQuery: (query: string) => void
}

export function useDocumentViewer(): DocumentViewerState {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('default')
  const [lineWrap, setLineWrap] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Sync Focus Mode with body class, AppShell event, and document state
  useEffect(() => {
    document.body.classList.toggle('viewer-focus-mode', isFocusMode)
    window.dispatchEvent(
      new CustomEvent('viewer-focus-mode', { detail: isFocusMode })
    )

    return () => {
      document.body.classList.remove('viewer-focus-mode')
      window.dispatchEvent(
        new CustomEvent('viewer-focus-mode', { detail: false })
      )
    }
  }, [isFocusMode])

  // Sync with native browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFocusMode) {
        setIsFocusMode(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [isFocusMode])

  const openDetails = useCallback(() => {
    setIsDetailsOpen(true)
    setIsEditingDetails(false)
  }, [])

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false)
    setIsEditingDetails(false)
  }, [])

  const toggleDetails = useCallback(() => {
    setIsDetailsOpen((prev) => {
      if (prev) setIsEditingDetails(false)
      return !prev
    })
  }, [])

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode((prev) => {
      const next = !prev
      if (next) {
        // Attempt native fullscreen if available and permitted
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {
            // Application-level focus mode will handle chrome hiding seamlessly
          })
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {})
        }
      }
      return next
    })
  }, [])

  const setFocusMode = useCallback((val: boolean) => {
    setIsFocusMode(val)
    if (!val && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  const toggleLineWrap = useCallback(() => {
    setLineWrap((prev) => !prev)
  }, [])

  return {
    isDetailsOpen,
    isFocusMode,
    isEditingDetails,
    activeTab,
    lineWrap,
    searchQuery,
    openDetails,
    closeDetails,
    toggleDetails,
    toggleFocusMode,
    setFocusMode,
    setIsEditingDetails,
    setActiveTab,
    toggleLineWrap,
    setSearchQuery,
  }
}
