import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'

export type IconType = IconSvgElement

interface AppIconProps {
  icon: IconSvgElement
  size?: number | string
  className?: string
  color?: string
  strokeWidth?: number
  'aria-hidden'?: boolean | 'true' | 'false'
}

export function AppIcon({
  icon,
  size = 18,
  className = '',
  color,
  strokeWidth = 1.5,
  'aria-hidden': ariaHidden = true,
}: AppIconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      className={`shrink-0 ${className}`}
      color={color}
      strokeWidth={strokeWidth}
      aria-hidden={ariaHidden}
    />
  )
}
