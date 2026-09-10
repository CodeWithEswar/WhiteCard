import { useRef } from 'react'
import {
  PaintBoardIcon,
  Sun01Icon,
  Moon02Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { GridBackground } from '../../../components/backgrounds/grid-background'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'
import { useTheme } from '../../../providers/theme-provider'
import type { ThemeId } from '../../../types/theme'

export function ThemesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, setTheme, appearance, setAppearance, allThemes, isDark } = useTheme()

  return (
    <section
      ref={sectionRef}
      id="themes"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background Parallax Layer: Fine grid moving slowly */}
      <ParallaxLayer
        targetRef={sectionRef}
        speed={0.08}
        distance={16}
        className="absolute inset-0 pointer-events-none opacity-40"
        ariaHidden
        disabledOnMobile
      >
        <GridBackground size="micro" mask="radial" className="w-full h-full" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 09 • Visual Personalization
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Make White Card feel like yours.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Choose from 10 carefully balanced semantic themes in light, dark, or system appearance. Zinc Monochrome is active by default.
            </p>
          </Reveal>

          {/* Mode Switcher */}
          <Reveal delay={0.16}>
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl border border-border/70 bg-card shadow-2xs mt-2">
              <button
                type="button"
                onClick={() => setAppearance('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${appearance === 'light'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <AppIcon icon={Sun01Icon} size={13} />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setAppearance('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${appearance === 'dark'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <AppIcon icon={Moon02Icon} size={13} />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setAppearance('system')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${appearance === 'system'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <span>System</span>
              </button>
            </div>
          </Reveal>
        </div>

        {/* 10 Theme Preview Cards (5x2 Desktop, 3 cols Tablet, 2 cols Mobile) */}
        <Reveal delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 max-w-5xl mx-auto">
            {allThemes.map((t) => {
              const isSelected = theme === t.id
              const colors = isDark ? t.dark : t.light

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as ThemeId)}
                  className={`relative rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 shadow-2xs group flex flex-col justify-between ${isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-card'
                    : 'border-border/70 bg-card hover:border-border'
                    }`}
                >
                  <div className="space-y-3 w-full">
                    {/* Palette Swatches Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="size-3 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: t.previewColor }}
                        />
                        <span
                          className="size-2.5 rounded-full shrink-0 opacity-70"
                          style={{ backgroundColor: colors.accent }}
                        />
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
                          <AppIcon icon={Tick02Icon} size={11} />
                          Active
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-foreground tracking-tight">
                        {t.label}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  {/* Micro UI Simulation inside card */}
                  <div className="mt-4 pt-3 border-t border-border/50 w-full flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                    <span className="truncate">{t.id}</span>
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: t.previewColor }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
