import { useState, useEffect } from 'react'

const SIDEBAR_COLLAPSED_KEY = 'white-card-sidebar-collapsed'
const SIDEBAR_EXPANDED_PARENTS_KEY = 'white-card-sidebar-expanded-parents'

export function useNavigationState() {
  // Desktop Sidebar Collapse (expanded 256px <-> collapsed 72px)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  // Collapsible parent spaces (Vault Home, Government, Student)
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_EXPANDED_PARENTS_KEY)
      return saved
        ? JSON.parse(saved)
        : {
            home: true,
            government: true,
            student: true,
          }
    } catch {
      return {
        home: true,
        government: true,
        student: true,
      }
    }
  })

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(next))
      } catch {
        // Ignore quota/storage errors
      }
      return next
    })
  }

  const toggleParent = (parentId: string) => {
    setExpandedParents((prev) => {
      const next = { ...prev, [parentId]: !prev[parentId] }
      try {
        localStorage.setItem(SIDEBAR_EXPANDED_PARENTS_KEY, JSON.stringify(next))
      } catch {
        // Ignore quota/storage errors
      }
      return next
    })
  }

  const ensureParentExpanded = (parentId: string) => {
    setExpandedParents((prev) => {
      if (prev[parentId]) return prev
      const next = { ...prev, [parentId]: true }
      try {
        localStorage.setItem(SIDEBAR_EXPANDED_PARENTS_KEY, JSON.stringify(next))
      } catch {
        // Ignore
      }
      return next
    })
  }

  return {
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed,
    expandedParents,
    toggleParent,
    ensureParentExpanded,
  }
}
