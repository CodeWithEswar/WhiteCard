import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return null
    }

    const user = authData.user
    const email = user.email || 'Private Account'
    let name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      (user.email ? user.email.split('@')[0] : 'Personal Vault')
    let avatar: string | undefined =
      user.user_metadata?.avatar_url || user.user_metadata?.picture

    // 1. Fetch avatar_url and display_name from public.profiles table
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      if (!profileError && profile) {
        if (profile.avatar_url) {
          avatar = profile.avatar_url
        }
        if (profile.display_name) {
          name = profile.display_name
        }
      } else if (!profile && !profileError) {
        // Automatically ensure row exists in profiles with current auth data
        await supabase.from('profiles').insert({
          id: user.id,
          display_name: name,
          avatar_url: avatar || null,
        })
      }
    } catch (profileErr) {
      console.warn('Failed to read from public.profiles:', profileErr)
    }

    // 2. Resolve relative storage paths if avatar is stored in a bucket
    if (
      avatar &&
      !avatar.startsWith('http://') &&
      !avatar.startsWith('https://') &&
      !avatar.startsWith('data:')
    ) {
      try {
        const bucket = avatar.startsWith('documents/') ? 'documents' : 'avatars'
        const cleanPath = avatar.replace(/^(documents|avatars)\//, '')
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(cleanPath)
        if (urlData?.publicUrl) {
          avatar = urlData.publicUrl
        }
      } catch {
        // Keep existing string
      }
    }

    return {
      id: user.id,
      email,
      name,
      avatar,
    }
  } catch (err) {
    console.error('Error fetching user profile:', err)
    return null
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function load() {
      const p = await fetchUserProfile()
      if (isMounted) {
        setProfile(p)
        setLoading(false)
      }
    }

    load()

    if (!isSupabaseConfigured || !supabase) return

    // Re-fetch on auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        load()
      } else if (isMounted) {
        setProfile(null)
      }
    })

    // Listen to real-time updates on public.profiles table with unique channel name
    const channelId = `profiles_realtime_${Math.random().toString(36).substring(2, 9)}`
    let channel: any = null
    try {
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
          },
          () => {
            load()
          }
        )
        .subscribe()
    } catch (err) {
      console.warn('Realtime subscription error:', err)
    }

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
      if (channel && supabase) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  return { profile, loading, refresh: fetchUserProfile }
}

export function getInitials(name?: string): string {
  if (!name || name === 'Personal Vault') return 'WC'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}
