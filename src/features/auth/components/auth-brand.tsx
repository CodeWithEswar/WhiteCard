import { motion, useReducedMotion } from 'framer-motion'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'

export function AuthBrand() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center mb-6"
    >
      <div className="p-2.5 rounded-xl border border-border/70 bg-muted/40 shadow-xs backdrop-blur-sm">
        <WhiteCardLogo size={32} showWordmark={false} />
      </div>
    </motion.div>
  )
}
