import {
  File01Icon,
  FileCodeIcon,
  Calendar03Icon,
  HardDriveIcon,
  Layers01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { DocumentMetadataGroup, DocumentMetadataRow } from './document-metadata-group'
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

  return (
    <DocumentMetadataGroup title="Document File Information">
      <DocumentMetadataRow
        label="Original File"
        value={<span className="font-mono text-[11px] truncate block" title={document.originalFilename}>{document.originalFilename}</span>}
        icon={<AppIcon icon={File01Icon} size={14} />}
      />

      <DocumentMetadataRow
        label="File Size"
        value={<span className="font-mono text-[11px]">{document.sizeFormatted || `${document.sizeBytes} B`}</span>}
        icon={<AppIcon icon={HardDriveIcon} size={14} />}
      />

      <DocumentMetadataRow
        label="File Format"
        value={<span className="font-mono uppercase text-[11px] px-1.5 py-0.5 rounded bg-muted border border-border/70 text-foreground">{document.fileType}</span>}
        icon={<AppIcon icon={Layers01Icon} size={14} />}
      />

      <DocumentMetadataRow
        label="MIME Type"
        value={<span className="font-mono text-[10px] text-muted-foreground truncate block" title={document.mimeType}>{document.mimeType}</span>}
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
