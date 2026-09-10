import { useState } from 'react'
import type { ZoomControls } from '../../hooks/use-document-zoom'
import type { VaultDocument } from '@/types/document'

interface ImagePreviewProps {
  document: VaultDocument
  fileUrl: string
  zoom: ZoomControls
}

export function ImagePreview({
  document: doc,
  fileUrl,
  zoom,
}: ImagePreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isZoomed = zoom.zoomLevel > 1.0

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${
        isZoomed ? (zoom.isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
      }`}
      onMouseDown={zoom.startPan}
      onTouchStart={zoom.startPan}
    >
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
            <span className="text-xs text-muted-foreground font-mono">Loading image...</span>
          </div>
        </div>
      )}

      {imageError ? (
        <div className="text-center p-6 space-y-2">
          <p className="text-xs font-semibold text-foreground">Could not render image</p>
          <p className="text-[11px] text-muted-foreground">The image file may be corrupt or inaccessible.</p>
        </div>
      ) : (
        <div
          className="transition-transform duration-100 ease-out will-change-transform flex items-center justify-center"
          style={{
            transform: `translate(${zoom.pan.x}px, ${zoom.pan.y}px) scale(${zoom.zoomLevel}) rotate(${zoom.rotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          <img
            src={fileUrl}
            alt={doc.title}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            draggable={false}
            className={`max-h-[82dvh] max-w-[90vw] object-contain rounded-lg shadow-md border border-border/40 bg-card/60 transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      )}
    </div>
  )
}
