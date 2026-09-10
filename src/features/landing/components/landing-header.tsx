import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu01Icon,
  Moon02Icon,
  Sun01Icon,
  ArrowRight01Icon,
  PaintBoardIcon,
  SecurityCheckIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { useTheme } from '../../../providers/theme-provider'
import type { ThemeId } from '../../../types/theme'

const navItems = [
  { label: 'Product', href: '#product', id: 'product' },
  { label: 'Security', href: '#security', id: 'security' },
  { label: 'Features', href: '#files', id: 'files' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
]

export function LandingHeader() {
  const { theme, setTheme, allThemes, isDark, appearance, setAppearance } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
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
      { rootMargin: '-20% 0px -60% 0px' }
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
        className={`relative mx-auto flex h-[68px] max-w-[1280px] items-center justify-between rounded-xl border px-4 transition-all duration-200 sm:px-6 ${
          scrolled
            ? 'border-border/80 bg-background/85 shadow-sm backdrop-blur-xl'
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

        {/* Center: Desktop Navigation */}
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
                className={`relative px-3.5 py-1.5 text-xs font-medium transition-colors rounded-xl ${
                  isActive
                    ? 'text-foreground font-semibold bg-muted/70'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Right Actions: Theme, Sign In, Create White Card */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Dropdown (Desktop & Mobile) */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Customize theme and appearance"
                  className="size-9 sm:size-10 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <AppIcon icon={PaintBoardIcon} size={17} />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl">
              <DropdownMenuLabel className="text-xs font-semibold px-2 py-1 text-muted-foreground">
                Appearance
              </DropdownMenuLabel>
              <div className="grid grid-cols-3 gap-1 p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={appearance === 'light' ? 'default' : 'outline'}
                  onClick={() => setAppearance('light')}
                  className="h-7 text-[11px] px-2 rounded-lg gap-1"
                >
                  <AppIcon icon={Sun01Icon} size={12} />
                  Light
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={appearance === 'dark' ? 'default' : 'outline'}
                  onClick={() => setAppearance('dark')}
                  className="h-7 text-[11px] px-2 rounded-lg gap-1"
                >
                  <AppIcon icon={Moon02Icon} size={12} />
                  Dark
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={appearance === 'system' ? 'default' : 'outline'}
                  onClick={() => setAppearance('system')}
                  className="h-7 text-[11px] px-2 rounded-lg"
                >
                  Auto
                </Button>
              </div>

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuLabel className="text-xs font-semibold px-2 py-1 text-muted-foreground">
                Accent Theme
              </DropdownMenuLabel>
              <div className="grid grid-cols-5 gap-1.5 p-1.5">
                {allThemes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    title={t.label}
                    onClick={() => setTheme(t.id as ThemeId)}
                    className={`size-6 rounded-full border transition-all ${
                      theme === t.id
                        ? 'border-primary ring-2 ring-primary/40 scale-110'
                        : 'border-border/60 hover:scale-105'
                    }`}
                    style={{ backgroundColor: t.previewColor }}
                    aria-label={`Switch to ${t.label} theme`}
                  />
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Single Primary Action Button */}
          <Button
            type="button"
            render={<Link to="/signup" />}
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
                    <SheetTitle className="sr-only">White Card Menu</SheetTitle>
                  </div>
                  <SheetDescription className="text-xs text-muted-foreground mt-1">
                    Personal vault for government documents and student certificates.
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
                          className="flex min-h-[48px] items-center rounded-xl px-3 text-sm font-medium text-foreground hover:bg-muted"
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
                        className="flex min-h-[44px] items-center rounded-xl px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Privacy Policy
                      </Link>
                    }
                  />
                  <SheetClose
                    render={
                      <Link
                        to="/terms"
                        className="flex min-h-[44px] items-center rounded-xl px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
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
                      className="h-8 text-xs gap-1.5 rounded-xl"
                    >
                      <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={14} />
                      <span>{isDark ? 'Light' : 'Dark'}</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <SheetClose
                    render={
                      <Button
                        variant="outline"
                        render={<Link to="/login" />}
                        className="h-11 text-xs font-semibold rounded-xl"
                      >
                        Sign In
                      </Button>
                    }
                  />
                  <SheetClose
                    render={
                      <Button
                        render={<Link to="/signup" />}
                        className="h-11 text-xs font-semibold rounded-xl shadow-xs"
                      >
                        Create White Card
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
