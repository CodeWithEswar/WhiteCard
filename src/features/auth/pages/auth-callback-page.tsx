import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Loading03Icon, Alert02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'
import { Button } from '../../../components/ui/button'
import { AuthLayout } from '../components/auth-layout'
import { AuthCard } from '../components/auth-card'
import { supabase, isSupabaseConfigured } from '../../../lib/supabase'
import { PageMeta } from '../../../components/seo/page-meta'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [statusText, setStatusText] = useState('Connecting your account…')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleAuth() {
      if (!isSupabaseConfigured || !supabase) {
        navigate('/app', { replace: true })
        return
      }

      try {
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (data?.session) {
          setStatusText('Opening your White Card…')
          setTimeout(() => {
            navigate('/app', { replace: true })
          }, 500)
        } else {
          // Listen for token resolution
          const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
              setStatusText('Opening your White Card…')
              navigate('/app', { replace: true })
            }
          })

          const timeout = setTimeout(() => {
            navigate('/app', { replace: true })
          }, 2000)

          return () => {
            listener.subscription.unsubscribe()
            clearTimeout(timeout)
          }
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err)
        setError(err?.message || "We couldn't complete sign-in. Please try again.")
      }
    }

    handleAuth()
  }, [navigate])

  return (
    <>
      <PageMeta
        title="Signing In — White Card"
        description="Authenticating your White Card session."
        noIndex={true}
        noFollow={false}
      />

      <AuthLayout>
        <AuthCard className="text-center space-y-6">
          <div className="flex justify-center">
            <WhiteCardLogo size={36} showWordmark={false} />
          </div>

          {error ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-2 text-left">
                <div className="flex items-center gap-2 font-semibold">
                  <AppIcon icon={Alert02Icon} size={16} />
                  <span>Authentication Issue</span>
                </div>
                <p>{error}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  onClick={() => navigate('/login', { replace: true })}
                  className="w-full h-10 text-xs font-semibold"
                >
                  Try again
                </Button>
                <Button
                  variant="outline"
                  render={<Link to="/" />}
                  className="w-full h-10 text-xs font-medium"
                >
                  Back to home
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex justify-center text-primary animate-spin">
                <AppIcon icon={Loading03Icon} size={28} />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-foreground tracking-tight">
                  {statusText}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Validating your authenticated session…
                </p>
              </div>
            </div>
          )}
        </AuthCard>
      </AuthLayout>
    </>
  )
}
