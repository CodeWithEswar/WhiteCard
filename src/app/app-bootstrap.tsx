import { type ReactNode } from 'react'
import { useIsRestoring } from '@tanstack/react-query'
import { AppBootstrapSkeleton } from '@/components/feedback/app-bootstrap-skeleton'

interface AppBootstrapProps {
  children: ReactNode
}

/**
 * Coordinates application bootstrap and cache restoration.
 * While TanStack Query is actively deserializing and hydrating the persisted
 * cache from localStorage, renders the matching shell skeleton so no component
 * ever mounts against an empty, unhydrated query cache.
 */
export function AppBootstrap({ children }: AppBootstrapProps) {
  const isCacheRestoring = useIsRestoring()

  if (isCacheRestoring) {
    return <AppBootstrapSkeleton />
  }

  return <>{children}</>
}
