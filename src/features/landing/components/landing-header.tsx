import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu01Icon,
  Moon02Icon,
  Sun01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../components/ui/sheet'
import { useTheme } from '../../../providers/theme-provider'

const navItems = [
  { label: 'Product', href: '#product', id: 'product' },
  { label: 'Spaces', href: '#spaces', id: 'spaces' },
  { label: 'Privacy', href: '#privacy', id: 'privacy' },
  { label: 'Features', href: '#files', id: 'files' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
]

export function LandingHeader() {
  const { isDark, setAppearance } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )

    navItems.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div
        className={`relative mx-auto flex h-[68px] max-w-[1280px] items-center justify-between rounded-xl border px-4 transition-all duration-200 sm:px-6 ${scrolled
          ? 'border-border/80 bg-background/85 shadow-sm backdrop-blur-md'
          : 'border-border/40 bg-background/40 backdrop-blur-sm'
          }`}
      >
        {/* Left: Brand */}
        <Link
          to="/"
          aria-label="White Card Home"
          className="flex items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
        >
          <WhiteCardLogo size={28} showWordmark={true} />
        </Link>

        {/* Center: Desktop Navigation (Distinctly Centered) */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-xs font-medium transition-colors rounded-xl ${isActive
                  ? 'text-foreground font-semibold bg-muted/70'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            onClick={() => setAppearance(isDark ? 'light' : 'dark')}
            className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={17} />
          </Button>

          {/* Single Primary Action Button (Proper 40px Height) */}
          <Button
            type="button"
            render={<Link to="/auth" />}
            className="hidden sm:inline-flex h-10 px-4 text-xs font-semibold rounded-xl shadow-xs gap-1.5"
          >
            <span>Create White Card</span>
            <AppIcon icon={ArrowRight01Icon} size={14} />
          </Button>

          {/* Mobile Sheet Menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-xl text-muted-foreground hover:text-foreground md:hidden"
                  aria-label="Open navigation menu"
                >
                  <AppIcon icon={Menu01Icon} size={20} />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[min(90vw,360px)] border-border bg-background flex flex-col justify-between p-6">
              <div>
                <SheetHeader className="border-b border-border/70 pb-4 text-left">
                  <div className="flex items-center">
                    <WhiteCardLogo size={28} showWordmark={true} />
                    <SheetTitle className="sr-only">White Card</SheetTitle>
                  </div>
                  <SheetDescription className="text-xs text-muted-foreground">
                    Personal document wallet for government documents & student certificates.
                  </SheetDescription>
                </SheetHeader>

                {/* Mobile Links */}
                <nav aria-label="Mobile navigation" className="flex flex-col gap-1 py-4">
                  {navItems.map((item) => (
                    <SheetClose
                      key={item.label}
                      render={
                        <a
                          href={item.href}
                          className="flex min-h-12 items-center rounded-xl px-3 text-sm font-medium text-foreground hover:bg-muted"
                        >
                          {item.label}
                        </a>
                      }
                    />
                  ))}
                  <div className="my-2 h-px bg-border/60" />
                  <SheetClose
                    render={
                      <Link
                        to="/privacy"
                        className="flex min-h-11 items-center rounded-xl px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Privacy Policy
                      </Link>
                    }
                  />
                  <SheetClose
                    render={
                      <Link
                        to="/terms"
                        className="flex min-h-11 items-center rounded-xl px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Terms of Service
                      </Link>
                    }
                  />
                </nav>
              </div>

              {/* Mobile Actions */}
              <div className="border-t border-border/70 pt-4 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-medium text-muted-foreground">Appearance</span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAppearance(isDark ? 'light' : 'dark')}
                      className="h-8 text-xs gap-1.5"
                    >
                      <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={14} />
                      <span>{isDark ? 'Light' : 'Dark'}</span>
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <SheetClose
                    render={
                      <Button
                        render={<Link to="/auth" />}
                        className="w-full h-11 text-xs font-semibold rounded-xl shadow-xs"
                      >
                        Open White Card
                      </Button>
                    }
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
