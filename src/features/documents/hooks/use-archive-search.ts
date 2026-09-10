import { useState, useMemo, useEffect } from 'react'
import type { FlatArchiveEntry } from '../lib/archive-tree'

export function useArchiveSearch(flatEntries: FlatArchiveEntry[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase())
    }, 150)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const results = useMemo(() => {
    if (!debouncedQuery) return []

    return flatEntries
      .filter((entry) => {
        const pathLower = entry.path.toLowerCase()
        const nameLower = entry.name.toLowerCase()
        return pathLower.includes(debouncedQuery) || nameLower.includes(debouncedQuery)
      })
      .slice(0, 50) // Cap results for rapid responsiveness
  }, [flatEntries, debouncedQuery])

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    results,
    isSearching: searchQuery !== '' && debouncedQuery !== '',
    clearSearch: () => setSearchQuery(''),
  }
}
