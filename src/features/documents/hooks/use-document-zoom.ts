import { useState, useCallback } from 'react'

export interface ZoomControls {
  zoomLevel: number
  zoomPercentage: number
  rotation: number
  pan: { x: number; y: number }
  isPanning: boolean
  zoomIn: () => void
  zoomOut: () => void
  setZoom: (level: number) => void
  resetZoom: () => void
  fitToScreen: () => void
  rotateClockwise: () => void
  rotateCounterClockwise: () => void
  startPan: (e: React.MouseEvent | React.TouchEvent) => void
}

const MIN_ZOOM = 0.25
const MAX_ZOOM = 4.0
const ZOOM_STEP = 0.25

export function useDocumentZoom(initialZoom = 1.0): ZoomControls {
  const [zoomLevel, setZoomLevel] = useState(initialZoom)
  const [rotation, setRotation] = useState(0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(Number((prev + ZOOM_STEP).toFixed(2)), MAX_ZOOM))
  }, [])

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const next = Math.max(Number((prev - ZOOM_STEP).toFixed(2)), MIN_ZOOM)
      if (next <= 1.0) {
        setPan({ x: 0, y: 0 })
      }
      return next
    })
  }, [])

  const setZoom = useCallback((level: number) => {
    const clamped = Math.min(Math.max(level, MIN_ZOOM), MAX_ZOOM)
    setZoomLevel(clamped)
    if (clamped <= 1.0) {
      setPan({ x: 0, y: 0 })
    }
  }, [])

  const resetZoom = useCallback(() => {
    setZoomLevel(1.0)
    setPan({ x: 0, y: 0 })
    setRotation(0)
  }, [])

  const fitToScreen = useCallback(() => {
    setZoomLevel(1.0)
    setPan({ x: 0, y: 0 })
  }, [])

  const rotateClockwise = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360)
  }, [])

  const rotateCounterClockwise = useCallback(() => {
    setRotation((prev) => (prev - 90 + 360) % 360)
  }, [])

  const startPan = useCallback(
    (startEvent: React.MouseEvent | React.TouchEvent) => {
      if (zoomLevel <= 1.0) return

      const isTouch = 'touches' in startEvent
      const startX = isTouch ? startEvent.touches[0].clientX : startEvent.clientX
      const startY = isTouch ? startEvent.touches[0].clientY : startEvent.clientY
      const initialPanX = pan.x
      const initialPanY = pan.y

      setIsPanning(true)

      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX
        const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY
        const deltaX = currentX - startX
        const deltaY = currentY - startY

        setPan({
          x: initialPanX + deltaX,
          y: initialPanY + deltaY,
        })
      }

      const handleEnd = () => {
        setIsPanning(false)
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleEnd)
        window.removeEventListener('touchmove', handleMove)
        window.removeEventListener('touchend', handleEnd)
      }

      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleMove)
      window.addEventListener('touchend', handleEnd)
    },
    [zoomLevel, pan]
  )

  return {
    zoomLevel,
    zoomPercentage: Math.round(zoomLevel * 100),
    rotation,
    pan,
    isPanning,
    zoomIn,
    zoomOut,
    setZoom,
    resetZoom,
    fitToScreen,
    rotateClockwise,
    rotateCounterClockwise,
    startPan,
  }
}
