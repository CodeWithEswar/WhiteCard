import { useState, useMemo, useCallback } from 'react'
import type { ArchiveTreeNode } from '../lib/archive-tree'
import { normalizeSafePath } from '../lib/archive-security'

export interface BreadcrumbItem {
  label: string
  path: string
  isLast: boolean
  isRoot: boolean
}

export function useArchiveNavigation(archiveName: string) {
  const [currentPath, setCurrentPath] = useState<string>('')
  const [activeEntry, setActiveEntry] = useState<ArchiveTreeNode | null>(null)

  const isAtRoot = currentPath === '' && activeEntry === null

  // Build breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [
      {
        label: archiveName || 'Archive Root',
        path: '',
        isLast: currentPath === '' && activeEntry === null,
        isRoot: true,
      },
    ]

    const effectivePath = activeEntry ? activeEntry.path : currentPath
    if (!effectivePath) return items

    const segments = effectivePath.split('/')
    let runningPath = ''

    segments.forEach((seg, idx) => {
      runningPath = runningPath ? `${runningPath}/${seg}` : seg
      const isLast = idx === segments.length - 1
      items.push({
        label: seg,
        path: runningPath,
        isLast,
        isRoot: false,
      })
    })

    return items
  }, [archiveName, currentPath, activeEntry])

  const navigateTo = useCallback((targetPath: string) => {
    const safe = normalizeSafePath(targetPath)
    setCurrentPath(safe)
    setActiveEntry(null)
  }, [])

  const navigateUp = useCallback(() => {
    if (activeEntry) {
      // If currently inside a file view, return to its parent folder
      const parts = activeEntry.path.split('/')
      const parent = parts.slice(0, -1).join('/')
      setCurrentPath(parent)
      setActiveEntry(null)
      return
    }

    if (!currentPath) return
    const parts = currentPath.split('/')
    const parent = parts.slice(0, -1).join('/')
    setCurrentPath(parent)
    setActiveEntry(null)
  }, [activeEntry, currentPath])

  const navigateToRoot = useCallback(() => {
    setCurrentPath('')
    setActiveEntry(null)
  }, [])

  const openFile = useCallback((fileNode: ArchiveTreeNode) => {
    setActiveEntry(fileNode)
  }, [])

  const closeFile = useCallback(() => {
    setActiveEntry(null)
  }, [])

  return {
    currentPath,
    activeEntry,
    isAtRoot,
    breadcrumbs,
    navigateTo,
    navigateUp,
    navigateToRoot,
    openFile,
    closeFile,
  }
}
