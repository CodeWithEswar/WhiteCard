import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AuthLayout } from '../components/auth-layout'
import { AuthCard } from '../components/auth-card'
import { AuthBrand } from '../components/auth-brand'
import { GoogleAuthButton } from '../components/google-auth-button'
import { AuthLegalLinks } from '../components/auth-legal-links'
import { PageMeta } from '../../../components/seo/page-meta'

export function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  return (
    <>
      <PageMeta
        title="Access — White Card"
        description="Sign in or get started with your Google account to access your private White Card document wallet."
        noIndex={true}
        noFollow={false}
      />

      <AuthLayout>
        <AuthCard>
          <AuthBrand />

          {/* Inner Content Animation */}
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 text-center"
          >
            {/* Header copy */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground">
                Secure Access
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Your important documents deserve one secure place.
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Sign in or get started with your Google account to access your private document vault.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 text-xs rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-left">
                {error}
              </div>
            )}

            {/* Google Authentication Button */}
            <div className="pt-1">
              <GoogleAuthButton
                label="Continue with Google"
                onError={(err) => setError(err)}
              />
            </div>

            {/* Legal Disclaimers */}
            <AuthLegalLinks />
          </motion.div>
        </AuthCard>
      </AuthLayout>
    </>
  )
}
