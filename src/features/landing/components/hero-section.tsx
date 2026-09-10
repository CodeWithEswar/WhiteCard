import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight01Icon, ShieldCheckIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import { RadialGridBackground } from '../../../components/backgrounds/radial-grid-background'
import { SectionGlow } from '../../../components/backgrounds/section-glow'
import { HeroProductComposition } from './hero-product-composition'
import { motionEase } from '../../../lib/motion'

export function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden text-center">
      {/* Background with radial fade and subtle glow */}
      <RadialGridBackground className="absolute inset-0 pointer-events-none" />
      <SectionGlow position="top" opacity="opacity-60" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Centered Copy Block (max-w 760-900px) */}
        <div className="max-w-[840px] mx-auto space-y-6">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: motionEase }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-xl border border-border/80 bg-muted/60 text-xs font-medium text-muted-foreground backdrop-blur-xs"
          >
            <AppIcon icon={ShieldCheckIcon} size={14} className="text-foreground" />
            <span>Personal Document Wallet • Private & Authenticated</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: motionEase }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]"
          >
            Your important documents.{' '}
            <span className="text-muted-foreground block sm:inline">
              One secure place.
            </span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: motionEase }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Keep government documents and student certificates organized, private, and ready when you need them.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.15, ease: motionEase }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              size="lg"
              render={<Link to="/auth" />}
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold text-sm gap-2 shadow-xs"
            >
              <span>Create your White Card</span>
              <AppIcon icon={ArrowRight01Icon} size={16} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              render={<a href="#product" />}
              className="w-full sm:w-auto h-11 px-5 rounded-xl font-medium text-sm gap-2 border-border/80 hover:bg-muted text-foreground"
            >
              <span>See how it works</span>
            </Button>
          </motion.div>

          {/* Trust Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[11px] text-muted-foreground/80 flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-1"
          >
            <span>No OCR extraction</span>
            <span className="text-border">•</span>
            <span>Scoped user storage</span>
            <span className="text-border">•</span>
            <span>Direct encrypted sharing</span>
            <span className="text-border">•</span>
            <span>10 Theme Presets</span>
          </motion.div>
        </div>

        {/* Hero Product Composition with entrance motion */}
        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.25, ease: motionEase }}
        >
          <HeroProductComposition />
        </motion.div>
      </div>
    </section>
  )
}
