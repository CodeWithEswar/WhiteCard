import { Link, useLocation } from 'react-router-dom'
import {
  ArrowLeft01Icon,
  Moon02Icon,
  Sun01Icon,
} from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import { useTheme } from '../../../providers/theme-provider'

export function LegalHeader() {
  const { isDark, setAppearance } = useTheme()
  const location = useLocation()
  const isPrivacy = location.pathname.includes('privacy')

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md px-4 sm:px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Back Link & Brand */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors p-1 rounded-xl hover:bg-muted"
            aria-label="Back to Home"
          >
            <AppIcon icon={ArrowLeft01Icon} size={16} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <div className="h-4 w-px bg-border/80 hidden sm:block" />

          <Link to="/" className="flex items-center">
            <WhiteCardLogo size={26} showWordmark={true} />
          </Link>
        </div>

        {/* Center: Privacy / Terms Switcher (Desktop) */}
        <div className="hidden md:flex items-center p-1 rounded-xl border border-border/70 bg-muted/40 text-xs font-medium">
          <Link
            to="/privacy"
            className={`px-3 py-1 rounded-xl transition-all ${isPrivacy
              ? 'bg-background text-foreground font-semibold shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className={`px-3 py-1 rounded-xl transition-all ${!isPrivacy
              ? 'bg-background text-foreground font-semibold shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Terms of Service
          </Link>
        </div>

        {/* Right: Appearance Mode Toggle & Sign In */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            onClick={() => setAppearance(isDark ? 'light' : 'dark')}
            className="size-8 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={15} />
          </Button>

          {/* Sign In Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            render={<Link to="/auth" />}
            className="h-8 px-3 text-xs font-medium rounded-xl"
          >
            Sign In
          </Button>
        </div>
      </div>
    </header>
  )
}
