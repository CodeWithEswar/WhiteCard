import { useState, useCallback } from 'react'

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
    setIsFocusMode((prev) => !prev)
  }, [])

  const setFocusMode = useCallback((val: boolean) => {
    setIsFocusMode(val)
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
