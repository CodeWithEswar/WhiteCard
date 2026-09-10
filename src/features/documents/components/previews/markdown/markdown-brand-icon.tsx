import { getBrandMeta } from '@/features/documents/lib/markdown/markdown-brand-icons'
import { cn } from '@/lib/utils'

interface MarkdownBrandIconProps {
  brand: string
  size?: number
  className?: string
}

export function MarkdownBrandIcon({ brand, size = 15, className }: MarkdownBrandIconProps) {
  const meta = getBrandMeta(brand)
  if (!meta) return null

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={meta.color === 'currentColor' ? 'currentColor' : meta.color}
      className={cn('inline-block shrink-0', className)}
      aria-hidden="true"
    >
      <path d={meta.svgPath} />
    </svg>
  )
}
