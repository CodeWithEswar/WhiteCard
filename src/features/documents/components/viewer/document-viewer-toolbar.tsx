import {
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  RotateRight01Icon,
  Maximize02Icon,
  Minimize02Icon,
  FitToScreenIcon,
  TextWrapIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { PreviewStrategy, PreviewCapability } from '@/config/document-preview'
import type { ZoomControls } from '../../hooks/use-document-zoom'

interface DocumentViewerToolbarProps {
  strategy: PreviewStrategy
  capabilities: PreviewCapability
  zoom: ZoomControls
  lineWrap: boolean
  isFocusMode: boolean
  onToggleLineWrap: () => void
  onToggleFocusMode: () => void
}

export function DocumentViewerToolbar({
  capabilities,
  zoom,
  lineWrap,
  isFocusMode,
  onToggleLineWrap,
  onToggleFocusMode,
}: DocumentViewerToolbarProps) {
  // If format doesn't support any zoom, wrap, or focus, don't show floating toolbar
  if (!capabilities.canZoom && !capabilities.canWrap && !capabilities.canFullscreen) {
    return null
  }

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-lg text-foreground select-none">
        {/* Zoom Controls */}
        {capabilities.canZoom && (
          <>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={zoom.fitToScreen}
                    className="size-8.5 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Fit to screen"
                  />
                }
              >
                <AppIcon icon={FitToScreenIcon} size={16} />
              </TooltipTrigger>
              <TooltipContent side="top">Fit to screen (0)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={zoom.zoomOut}
                    className="size-8.5 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Zoom out"
                  />
                }
              >
                <AppIcon icon={ZoomOutAreaIcon} size={16} />
              </TooltipTrigger>
              <TooltipContent side="top">Zoom out (-)</TooltipContent>
            </Tooltip>

            <button
              type="button"
              onClick={zoom.resetZoom}
              className="px-2 py-1 min-w-[50px] text-center font-mono text-xs font-semibold text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Reset Zoom to 100%"
            >
              {zoom.zoomPercentage}%
            </button>

            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={zoom.zoomIn}
                    className="size-8.5 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Zoom in"
                  />
                }
              >
                <AppIcon icon={ZoomInAreaIcon} size={16} />
              </TooltipTrigger>
              <TooltipContent side="top">Zoom in (+)</TooltipContent>
            </Tooltip>
          </>
        )}

        {/* Rotate Control */}
        {capabilities.canRotate && (
          <>
            <div className="w-px h-4 bg-border/60 mx-0.5" />
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={zoom.rotateClockwise}
                    className="size-8.5 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Rotate clockwise"
                  />
                }
              >
                <AppIcon icon={RotateRight01Icon} size={16} />
              </TooltipTrigger>
              <TooltipContent side="top">Rotate 90°</TooltipContent>
            </Tooltip>
          </>
        )}

        {/* Line Wrap Toggle for Code / Text */}
        {capabilities.canWrap && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={onToggleLineWrap}
                  className={`size-8.5 rounded-xl flex items-center justify-center transition-colors ${
                    lineWrap
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  aria-label="Toggle line wrap"
                />
              }
            >
              <AppIcon icon={TextWrapIcon} size={16} />
            </TooltipTrigger>
            <TooltipContent side="top">Toggle Line Wrap</TooltipContent>
          </Tooltip>
        )}

        {/* Fullscreen / Focus Mode Control */}
        {capabilities.canFullscreen && (
          <>
            <div className="w-px h-4 bg-border/60 mx-0.5" />
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={onToggleFocusMode}
                    className="size-8.5 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={isFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
                  />
                }
              >
                <AppIcon icon={isFocusMode ? Minimize02Icon : Maximize02Icon} size={15} />
              </TooltipTrigger>
              <TooltipContent side="top">
                {isFocusMode ? 'Exit Focus Mode (F)' : 'Focus Mode (F)'}
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  )
}
