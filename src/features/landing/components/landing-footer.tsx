import { Link } from 'react-router-dom'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'
import { useTheme } from '../../../providers/theme-provider'
import type { ThemeId } from '../../../types/theme'

export function LandingFooter() {
  const { theme, setTheme, allThemes } = useTheme()

  return (
    <footer className="relative z-20 w-full border-t border-border/80 bg-muted/40 text-xs text-muted-foreground select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-left">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center">
              <WhiteCardLogo size={26} showWordmark={true} />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              One organized place for important government documents and student certificates. Private by default.
            </p>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#spaces" className="hover:text-foreground transition-colors">
                  Government Documents
                </a>
              </li>
              <li>
                <a href="#spaces" className="hover:text-foreground transition-colors">
                  Student Certificates
                </a>
              </li>
              <li>
                <a href="#files" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
              Trust
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#security" className="hover:text-foreground transition-colors">
                  Security
                </a>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Account */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
              Account
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-foreground transition-colors">
                  Create White Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Appearance */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
              Appearance
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Theme Palette:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {allThemes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.label}
                  onClick={() => setTheme(t.id as ThemeId)}
                  className={`size-5 rounded-full border transition-all ${
                    theme === t.id
                      ? 'border-primary ring-2 ring-primary/40 scale-110'
                      : 'border-border/60 hover:scale-105'
                  }`}
                  style={{ backgroundColor: t.previewColor }}
                  aria-label={`Switch to ${t.label} theme`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} White Card. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
