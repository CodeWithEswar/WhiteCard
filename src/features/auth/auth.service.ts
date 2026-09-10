import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export interface AuthState {
  status: 'idle' | 'loading' | 'success' | 'error'
  errorMessage?: string
}

export async function signInWithGoogle(redirectTo?: string): Promise<{ error?: string }> {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return {
        error: 'Authentication service is not configured. Please provide Supabase credentials in your environment.',
      }
    }

    const callbackUrl = redirectTo || `${window.location.origin}/auth/callback`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return {}
  } catch (err: any) {
    return {
      error: err?.message || 'Unable to connect to Google authentication. Please try again.',
    }
  }
}

export async function checkCurrentSession(): Promise<boolean> {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return false
    }

    const { data } = await supabase.auth.getSession()
    return Boolean(data?.session)
  } catch {
    return false
  }
}
