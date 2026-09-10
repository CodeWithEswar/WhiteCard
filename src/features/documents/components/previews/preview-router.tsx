import { resolvePreviewStrategy } from '@/config/document-preview'
import { ImagePreview } from './image-preview'
import { PdfPreview } from './pdf-preview'
import { TextPreview } from './text-preview'
import { MarkdownPreview } from './markdown-preview'
import { JsonPreview } from './json-preview'
import { CsvPreview } from './csv-preview'
import { SpreadsheetPreview } from './spreadsheet-preview'
import { ArchivePreview } from './archive-preview'
import { OfficeDocumentPreview } from './office-document-preview'
import { DocxPreview } from './docx-preview'
import { AudioPreview } from './audio-preview'
import { VideoPreview } from './video-preview'
import { CodePreview } from './code-preview'
import { GenericFilePreview } from './generic-file-preview'
import type { VaultDocument } from '@/types/document'
import type { ZoomControls } from '../../hooks/use-document-zoom'

interface PreviewRouterProps {
  document: VaultDocument
  fileUrl: string | null
  rawContent: string | null
  arrayBuffer: ArrayBuffer | null
  isLoadingBytes: boolean
  lineWrap: boolean
  zoom: ZoomControls
  onFetchContent: (type: 'text' | 'buffer') => void
  onDownload?: () => void
}

export function PreviewRouter({
  document: doc,
  fileUrl,
  rawContent,
  arrayBuffer,
  isLoadingBytes,
  lineWrap,
  zoom,
  onFetchContent,
  onDownload,
}: PreviewRouterProps) {
  const strategy = resolvePreviewStrategy({
    mimeType: doc.mimeType,
    filename: doc.originalFilename,
  })

  switch (strategy) {
    case 'image':
      return (
        <ImagePreview
          document={doc}
          fileUrl={fileUrl || ''}
          zoom={zoom}
        />
      )

    case 'pdf':
      return (
        <PdfPreview
          document={doc}
          fileUrl={fileUrl || ''}
          arrayBuffer={arrayBuffer}
          isLoadingBytes={isLoadingBytes}
          zoom={zoom}
          onFetchContent={() => onFetchContent('buffer')}
          onDownload={onDownload}
        />
      )

    case 'text':
      return (
        <TextPreview
          document={doc}
          content={rawContent}
          isLoading={isLoadingBytes}
          lineWrap={lineWrap}
          onFetchContent={() => onFetchContent('text')}
        />
      )

    case 'markdown':
      return (
        <MarkdownPreview
          document={doc}
          content={rawContent}
          isLoading={isLoadingBytes}
          lineWrap={lineWrap}
          onFetchContent={() => onFetchContent('text')}
        />
      )

    case 'json':
      return (
        <JsonPreview
          document={doc}
          content={rawContent}
          isLoading={isLoadingBytes}
          onFetchContent={() => onFetchContent('text')}
        />
      )

    case 'csv':
      return (
        <CsvPreview
          document={doc}
          content={rawContent}
          isLoading={isLoadingBytes}
          onFetchContent={() => onFetchContent('text')}
        />
      )

    case 'spreadsheet':
      return (
        <SpreadsheetPreview
          document={doc}
          onDownload={onDownload}
        />
      )

    case 'archive':
      return (
        <ArchivePreview
          document={doc}
          arrayBuffer={arrayBuffer}
          isLoading={isLoadingBytes}
          onFetchContent={() => onFetchContent('buffer')}
          onDownload={onDownload}
        />
      )

    case 'office': {
      const isDocx =
        doc.originalFilename.toLowerCase().endsWith('.docx') ||
        doc.mimeType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      if (isDocx) {
        return (
          <DocxPreview
            document={doc}
            arrayBuffer={arrayBuffer}
            isLoading={isLoadingBytes}
            zoom={zoom}
            onFetchContent={() => onFetchContent('buffer')}
            onDownload={onDownload}
          />
        )
      }

      return (
        <OfficeDocumentPreview
          document={doc}
          onDownload={onDownload}
        />
      )
    }

    case 'audio':
      return (
        <AudioPreview
          document={doc}
          fileUrl={fileUrl || ''}
          onDownload={onDownload}
        />
      )

    case 'video':
      return (
        <VideoPreview
          document={doc}
          fileUrl={fileUrl || ''}
        />
      )

    case 'code':
      return (
        <CodePreview
          document={doc}
          content={rawContent}
          isLoading={isLoadingBytes}
          lineWrap={lineWrap}
          onFetchContent={() => onFetchContent('text')}
        />
      )

    case 'generic':
    default:
      return (
        <GenericFilePreview
          document={doc}
          fileUrl={fileUrl}
          onDownload={onDownload}
        />
      )
  }
}
