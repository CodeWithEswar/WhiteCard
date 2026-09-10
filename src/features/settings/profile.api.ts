import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface UserProfileData {
  id: string
  email: string
  name: string
  avatar?: string
}

/**
 * Fetches the user profile from Supabase Auth and public.profiles table.
 * If userId is provided, it fetches specifically for that user.
 */
export async function getMyProfile(userId?: string): Promise<UserProfileData | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return null
    }

    const user = authData.user
    if (userId && user.id !== userId) {
      return null
    }

    const email = user.email || ''
    let name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      (email ? email.split('@')[0] : '')
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
        // Ensure initial row exists
        await supabase.from('profiles').insert({
          id: user.id,
          display_name: name || null,
          avatar_url: avatar || null,
        })
      }
    } catch (profileErr) {
      console.warn('Failed to query public.profiles:', profileErr)
    }

    // 2. Resolve relative storage paths
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
        // Keep existing
      }
    }

    return {
      id: user.id,
      email,
      name,
      avatar,
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    return null
  }
}

/**
 * Updates display name and avatar in public.profiles.
 */
export async function updateMyProfile(
  userId: string,
  updates: { display_name?: string; avatar_url?: string }
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    return !error
  } catch {
    return false
  }
}
