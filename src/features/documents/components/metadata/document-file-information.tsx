import {
  File01Icon,
  FileCodeIcon,
  Calendar03Icon,
  HardDriveIcon,
  Layers01Icon,
  EyeIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { DocumentMetadataGroup, DocumentMetadataRow } from './document-metadata-group'
import { getHumanReadableFileType, resolvePreviewStrategy } from '@/config/document-preview'
import type { VaultDocument } from '@/types/document'

interface DocumentFileInformationProps {
  document: VaultDocument
}

export function DocumentFileInformation({ document }: DocumentFileInformationProps) {
  const formattedDate = document.createdAt
    ? new Date(document.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown'

  const humanType = getHumanReadableFileType({
    mimeType: document.mimeType,
    filename: document.originalFilename,
  })

  const strategy = resolvePreviewStrategy({
    mimeType: document.mimeType,
    filename: document.originalFilename,
  })

  const isDownloadOnly = strategy === 'generic'

  return (
    <DocumentMetadataGroup title="Document File Information">
      <DocumentMetadataRow
        label="Original File"
        value={
          <span
            className="font-mono text-[11px] truncate block text-foreground"
            title={document.originalFilename}
          >
            {document.originalFilename}
          </span>
        }
        icon={<AppIcon icon={File01Icon} size={14} />}
      />

      <DocumentMetadataRow
        label="File Format"
        value={
          <span className="text-[11px] font-medium text-foreground">
            {humanType}
          </span>
        }
        icon={<AppIcon icon={Layers01Icon} size={14} />}
      />

      <DocumentMetadataRow
        label="Preview Status"
        value={
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isDownloadOnly
                ? 'bg-muted text-muted-foreground border-border'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            }`}
          >
            {isDownloadOnly ? 'Download Only' : 'Browser Preview'}
          </span>
        }
        icon={<AppIcon icon={EyeIcon} size={14} />}
      />

      <DocumentMetadataRow
        label="File Size"
        value={<span className="font-mono text-[11px]">{document.sizeFormatted || `${document.sizeBytes} B`}</span>}
        icon={<AppIcon icon={HardDriveIcon} size={14} />}
      />

      <DocumentMetadataRow
        label="MIME Type"
        value={
          <span
            className="font-mono text-[10px] text-muted-foreground truncate block"
            title={document.mimeType}
          >
            {document.mimeType || 'application/octet-stream'}
          </span>
        }
        icon={<AppIcon icon={FileCodeIcon} size={14} />}
      />

      <DocumentMetadataRow
        label="Uploaded"
        value={<span>{formattedDate}</span>}
        icon={<AppIcon icon={Calendar03Icon} size={14} />}
      />
    </DocumentMetadataGroup>
  )
}
