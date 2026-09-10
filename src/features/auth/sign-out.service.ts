import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { queryClient } from '@/lib/query-client'
import { purgePersistedQueryCache } from '@/lib/query-persistence'

/**
 * Coordinated sign out procedure that cancels in-flight queries,
 * purges in-memory and persisted caches, signs out from Supabase,
 * and ensures zero identity or document leakage between accounts.
 */
export async function executeSignOut(): Promise<void> {
  try {
    // 1. Cancel in-flight network requests
    await queryClient.cancelQueries()

    // 2. Clear all query cache in memory
    queryClient.clear()

    // 3. Purge persisted cache in localStorage
    purgePersistedQueryCache()

    // 4. Clear any local user preferences
    try {
      localStorage.removeItem('white-card-sidebar-expanded-parents')
    } catch {
      // Ignore
    }

    // 5. Sign out from Supabase
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
  } catch (err) {
    console.warn('Sign out execution warning:', err)
  }
}
