import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import { isSupabaseConfigured, supabase } from '../../../lib/supabase'

interface SignInButtonProps {
  className?: string
  compact?: boolean
}

export function SignInButton({ className = '', compact = false }: SignInButtonProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    if (!isSupabaseConfigured || !supabase) {
      navigate('/app')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    })
    if (error) setLoading(false)
  }

  return (
    <Button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      className={`h-11 rounded-xl px-5 text-sm font-semibold shadow-xs ${className}`}
    >
      <AppIcon icon={GoogleIcon} size={18} aria-hidden />
      <span>{loading ? 'Opening Google…' : compact ? 'Continue' : 'Continue with Google'}</span>
    </Button>
  )
}
