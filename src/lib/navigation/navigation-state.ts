import { useSyncExternalStore } from 'react'

const SIDEBAR_COLLAPSED_KEY = 'white-card-sidebar-collapsed'
const SIDEBAR_EXPANDED_PARENTS_KEY = 'white-card-sidebar-expanded-parents'

interface NavigationStoreState {
  isCollapsed: boolean
  expandedParents: Record<string, boolean>
}

function getInitialCollapsed(): boolean {
  try {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    return saved ? JSON.parse(saved) : false
  } catch {
    return false
  }
}

function getInitialExpandedParents(): Record<string, boolean> {
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
}

// Canonical singleton state shared synchronously between DesktopSidebar, AppTopbar, etc.
let state: NavigationStoreState = {
  isCollapsed: getInitialCollapsed(),
  expandedParents: getInitialExpandedParents(),
}

const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return state
}

export function useNavigationState() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const setIsCollapsed = (collapsed: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof collapsed === 'function' ? collapsed(state.isCollapsed) : collapsed
    if (state.isCollapsed === next) return
    state = { ...state, isCollapsed: next }
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(next))
    } catch {
      // Ignore quota errors
    }
    notify()
  }

  const toggleCollapsed = () => {
    setIsCollapsed(!state.isCollapsed)
  }

  const toggleParent = (parentId: string) => {
    const next = {
      ...state.expandedParents,
      [parentId]: !state.expandedParents[parentId],
    }
    state = { ...state, expandedParents: next }
    try {
      localStorage.setItem(SIDEBAR_EXPANDED_PARENTS_KEY, JSON.stringify(next))
    } catch {
      // Ignore quota errors
    }
    notify()
  }

  const ensureParentExpanded = (parentId: string) => {
    if (state.expandedParents[parentId]) return
    const next = {
      ...state.expandedParents,
      [parentId]: true,
    }
    state = { ...state, expandedParents: next }
    try {
      localStorage.setItem(SIDEBAR_EXPANDED_PARENTS_KEY, JSON.stringify(next))
    } catch {
      // Ignore quota errors
    }
    notify()
  }

  return {
    isCollapsed: store.isCollapsed,
    setIsCollapsed,
    toggleCollapsed,
    expandedParents: store.expandedParents,
    toggleParent,
    ensureParentExpanded,
  }
}
