import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading03Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../components/icons/app-icon'
import { WhiteCardLogo } from '../components/brand/white-card-logo'
import { supabase } from '../lib/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [statusText, setStatusText] = useState('Verifying secure session...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function processAuth() {
      if (!supabase) {
        navigate('/app', { replace: true })
        return
      }

      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (data.session) {
          setStatusText('Vault authenticated. Initializing your spaces...')
          setTimeout(() => {
            navigate('/app', { replace: true })
          }, 600)
        } else {
          // Listen for onAuthStateChange in case hash tokens are still exchanging
          const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              if (session) {
                navigate('/app', { replace: true })
              }
            }
          )

          // Fallback timeout
          const timer = setTimeout(() => {
            navigate('/app', { replace: true })
          }, 2000)

          return () => {
            authListener.subscription.unsubscribe()
            clearTimeout(timer)
          }
        }
      } catch (err: any) {
        console.error('OAuth callback failed:', err)
        setError(err.message || 'Authentication failed. Please try again.')
      }
    }

    processAuth()
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground selection:bg-primary/20">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <WhiteCardLogo size={44} />
        </div>

        {error ? (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm space-y-3">
            <p className="font-semibold">Authentication Error</p>
            <p className="text-xs">{error}</p>
            <button
              onClick={() => navigate('/auth', { replace: true })}
              className="px-4 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold cursor-pointer"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center text-primary animate-spin">
              <AppIcon icon={Loading03Icon} size={28} />
            </div>
            <h2 className="text-base font-semibold tracking-tight">{statusText}</h2>
            <p className="text-xs text-muted-foreground">
              Establishing end-to-end encrypted session with your personal vault...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
