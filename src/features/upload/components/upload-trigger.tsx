import { useState } from 'react'
import { Upload01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { UploadDialog } from './upload-dialog'
import type { DocumentSpace } from '@/types/document'

interface UploadTriggerProps {
  defaultSpace?: DocumentSpace
  label?: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function UploadTrigger({
  defaultSpace = 'government',
  label = 'Upload Document',
  className = '',
  variant = 'default',
  size = 'default',
}: UploadTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={`gap-2 text-xs font-medium rounded-xl ${className}`}
      >
        <AppIcon icon={Upload01Icon} size={15} />
        {label && <span>{label}</span>}
      </Button>

      <UploadDialog
        open={open}
        onOpenChange={setOpen}
        defaultSpace={defaultSpace}
      />
    </>
  )
}
