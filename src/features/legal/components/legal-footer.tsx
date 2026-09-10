import { Link } from 'react-router-dom'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'

export function LegalFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/20 py-8 px-4 sm:px-6 text-xs text-muted-foreground">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/">
            <WhiteCardLogo size={22} showWordmark={true} />
          </Link>
          <span className="text-border">|</span>
          <p>© {new Date().getFullYear()} White Card. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
