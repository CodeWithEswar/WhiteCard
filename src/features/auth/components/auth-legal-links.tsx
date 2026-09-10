import { Link } from 'react-router-dom'

export function AuthLegalLinks() {
  return (
    <p className="text-[11px] leading-relaxed text-muted-foreground text-center select-none pt-1">
      By continuing, you agree to the{' '}
      <Link
        to="/terms"
        className="text-foreground underline underline-offset-3 hover:text-primary transition-colors font-medium"
      >
        Terms of Service
      </Link>{' '}
      and acknowledge the{' '}
      <Link
        to="/privacy"
        className="text-foreground underline underline-offset-3 hover:text-primary transition-colors font-medium"
      >
        Privacy Policy
      </Link>
      .
    </p>
  )
}
