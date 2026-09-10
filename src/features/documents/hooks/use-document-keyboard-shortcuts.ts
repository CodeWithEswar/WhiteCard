import { useEffect } from 'react'

interface KeyboardShortcutsProps {
  onToggleDetails?: () => void
  onCloseDetails?: () => void
  onDownload?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onResetZoom?: () => void
  onToggleFocus?: () => void
  enabled?: boolean
}

export function useDocumentKeyboardShortcuts({
  onToggleDetails,
  onCloseDetails,
  onDownload,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFocus,
  enabled = true,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }

      // Ignore if modifier keys like Ctrl or Meta are pressed (unless explicitly handling them)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return
      }

      switch (e.key) {
        case 'Escape':
          onCloseDetails?.()
          break

        case 'i':
        case 'I':
          e.preventDefault()
          onToggleDetails?.()
          break

        case 'd':
        case 'D':
          e.preventDefault()
          onDownload?.()
          break

        case '+':
        case '=':
          e.preventDefault()
          onZoomIn?.()
          break

        case '-':
        case '_':
          e.preventDefault()
          onZoomOut?.()
          break

        case '0':
          e.preventDefault()
          onResetZoom?.()
          break

        case 'f':
        case 'F':
          e.preventDefault()
          onToggleFocus?.()
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    enabled,
    onToggleDetails,
    onCloseDetails,
    onDownload,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onToggleFocus,
  ])
}
