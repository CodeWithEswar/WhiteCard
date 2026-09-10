import type { VaultDocument } from '@/types/document'

interface VideoPreviewProps {
  document: VaultDocument
  fileUrl: string
}

export function VideoPreview({
  document: doc,
  fileUrl,
}: VideoPreviewProps) {
  if (!fileUrl || fileUrl === '#') {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center text-xs text-muted-foreground">
        No video stream available.
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="max-w-5xl w-full max-h-[82dvh] rounded-2xl border border-border/80 bg-black overflow-hidden shadow-2xl flex items-center justify-center">
        <video
          src={fileUrl}
          controls
          preload="metadata"
          className="w-full max-h-[80dvh] object-contain focus:outline-none"
          title={doc.title}
        >
          Your browser does not support HTML5 video streaming.
        </video>
      </div>
    </div>
  )
}
