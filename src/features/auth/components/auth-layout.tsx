import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'
import { AppIcon } from '../../../components/icons/app-icon'
import { AuthThemeControl } from './auth-theme-control'
import { AuthOrbitalGrid } from './auth-orbital-grid'
import { checkCurrentSession } from '../auth.service'

export interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const navigate = useNavigate()
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    async function verify() {
      const hasSession = await checkCurrentSession()
      if (hasSession) {
        navigate('/app', { replace: true })
      } else {
        setCheckingSession(false)
      }
    }
    verify()
  }, [navigate])

  if (checkingSession) {
    return (
      <div className="min-h-[100svh] bg-background text-foreground flex items-center justify-center">
        <AuthOrbitalGrid />
        <div className="relative z-10 size-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-[100svh] bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 overflow-x-hidden">
      {/* Refined Ambient Background Grid & Rings */}
      <AuthOrbitalGrid />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Back to Home"
        >
          <WhiteCardLogo size={26} showWordmark={true} />
        </Link>

        <div className="flex items-center gap-3">
          <AuthThemeControl />

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-xl hover:bg-muted"
            aria-label="Back to Overview"
          >
            <AppIcon icon={ArrowLeft01Icon} size={15} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12">
        {children}
      </main>

      {/* Bottom Legal / Footer */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground select-none">
        <p>© {new Date().getFullYear()} White Card. All rights reserved.</p>
        <div className="flex items-center gap-5 font-medium">
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  )
}
