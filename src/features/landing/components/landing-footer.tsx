import { Link } from 'react-router-dom'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'
import { useTheme } from '../../../providers/theme-provider'
import type { ThemeId } from '../../../types/theme'

export function LandingFooter() {
  const { theme, setTheme, allThemes } = useTheme()

  return (
    <footer className="border-t border-border/70 bg-muted/20 text-xs text-muted-foreground select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center">
              <WhiteCardLogo size={26} showWordmark={true} />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              A private digital document wallet for organizing government documents and student certificates in their original format.
            </p>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Product</h4>
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
                  Supported Formats
                </a>
              </li>
              <li>
                <a href="#organization" className="hover:text-foreground transition-colors">
                  Tags & Search
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Trust</h4>
            <ul className="space-y-2">
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
              <li>
                <a href="#privacy" className="hover:text-foreground transition-colors">
                  Private by Default
                </a>
              </li>
              <li>
                <a href="#control" className="hover:text-foreground transition-colors">
                  User Control & Deletion
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Account */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/auth" className="hover:text-foreground transition-colors">
                  Access White Card
                </Link>
              </li>
              <li>
                <a href="#authentication" className="hover:text-foreground transition-colors">
                  Google Authentication
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Appearance */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Appearance</h4>
            <p className="text-[11px] text-muted-foreground">
              Select an accent palette:
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
                      ? 'border-primary ring-2 ring-primary/30 scale-110'
                      : 'border-border/60 hover:scale-105'
                  }`}
                  style={{ backgroundColor: t.previewColor }}
                  aria-label={`Switch to ${t.label} theme`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
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
