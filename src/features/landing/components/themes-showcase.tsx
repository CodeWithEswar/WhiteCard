import { useRef } from 'react'
import {
  Sun01Icon,
  Moon02Icon,
  Tick02Icon,
  PaintBoardIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { GridBackground } from '../../../components/backgrounds/grid-background'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'
import { useTheme } from '../../../providers/theme-provider'
import type { ThemeId } from '../../../types/theme'

export function ThemesShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme, setTheme, appearance, setAppearance, allThemes, isDark } = useTheme()

  return (
    <section
      ref={sectionRef}
      id="themes"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background Parallax Layer: Fine grid */}
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
              Section 09 • Themes & Personalization
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Make White Card feel like yours.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Select from 10 carefully tuned semantic theme palettes in Light, Dark, or System mode. Zinc Monochrome is active by default.
            </p>
          </Reveal>

          {/* Mode Switcher */}
          <Reveal delay={0.16}>
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl border border-border/70 bg-card shadow-2xs mt-2">
              <button
                type="button"
                onClick={() => setAppearance('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  appearance === 'light'
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  appearance === 'dark'
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  appearance === 'system'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span>System</span>
              </button>
            </div>
          </Reveal>
        </div>

        {/* 10 Theme Semantic Preview Cards (5x2 Desktop, 3 cols Tablet, 2 cols Mobile) */}
        <Reveal delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 max-w-5xl mx-auto">
            {allThemes.map((t) => {
              const isSelected = theme === t.id
              const colors = isDark ? t.dark : t.light
              const pageBg = isDark ? '#09090b' : '#f9fafb'
              const surfaceBg = colors.surface || (isDark ? '#18181b' : '#ffffff')
              const borderColor = colors.border || (isDark ? '#27272a' : '#e5e7eb')

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as ThemeId)}
                  className={`relative p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 group flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/30 shadow-md bg-card'
                      : 'border-border/70 hover:border-border bg-card/60 hover:bg-card'
                  }`}
                  aria-label={`Select ${t.label} theme`}
                  aria-pressed={isSelected}
                >
                  {/* Semantic Mini Layout Preview */}
                  <div
                    className="w-full h-20 sm:h-24 rounded-xl border p-2 flex flex-col justify-between overflow-hidden relative shadow-2xs"
                    style={{
                      backgroundColor: pageBg,
                      borderColor: borderColor,
                    }}
                  >
                    {/* Simulated Surface Window */}
                    <div
                      className="rounded-lg p-1.5 border flex items-center justify-between"
                      style={{
                        backgroundColor: surfaceBg,
                        borderColor: borderColor,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="size-2 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                        <div
                          className="h-1.5 w-10 rounded-full"
                          style={{ backgroundColor: borderColor }}
                        />
                      </div>
                      <div
                        className="size-2 rounded-full opacity-60"
                        style={{ backgroundColor: colors.accent }}
                      />
                    </div>

                    {/* Tiny text line and button preview */}
                    <div className="space-y-1">
                      <div
                        className="h-1 w-14 rounded-full opacity-75"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <div className="flex items-center justify-between pt-0.5">
                        <div
                          className="h-1 w-8 rounded-full"
                          style={{ backgroundColor: borderColor }}
                        />
                        <div
                          className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.primaryForeground,
                          }}
                        >
                          Tag
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Label & Active State */}
                  <div className="pt-2 sm:pt-2.5 flex items-center justify-between w-full min-w-0">
                    <div className="min-w-0 pr-1">
                      <p className="text-xs font-bold text-foreground tracking-tight truncate">
                        {t.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">
                        {t.id === 'zinc' ? 'Default' : 'Semantic'}
                      </p>
                    </div>

                    {isSelected ? (
                      <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
                        <AppIcon icon={Tick02Icon} size={12} />
                      </div>
                    ) : (
                      <div
                        className="size-4 rounded-full border border-border/80 group-hover:scale-110 transition-transform shrink-0"
                        style={{ backgroundColor: t.previewColor }}
                      />
                    )}
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
