import {
  Pdf01Icon,
  Image01Icon,
  Zip01Icon,
  Table01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { detectFileType } from '../upload.utils'

interface UploadFileIconProps {
  filename: string
  mimeType: string
  size?: number
  className?: string
}

export function UploadFileIcon({
  filename,
  mimeType,
  size = 18,
  className = '',
}: UploadFileIconProps) {
  const type = detectFileType(filename, mimeType)

  let icon = File01Icon

  switch (type) {
    case 'pdf':
      icon = Pdf01Icon
      break
    case 'image':
      icon = Image01Icon
      break
    case 'zip':
      icon = Zip01Icon
      break
    case 'sheet':
      icon = Table01Icon
      break
    case 'doc':
      icon = File01Icon
      break
    default:
      icon = File01Icon
  }

  return (
    <div
      className={`size-10 rounded-xl border border-border/80 bg-muted/40 text-foreground flex items-center justify-center shrink-0 ${className}`}
    >
      <AppIcon icon={icon} size={size} />
    </div>
  )
}
