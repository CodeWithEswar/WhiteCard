import { useEffect } from 'react'

export function useSearchKeyboard(inputRef: React.RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Check if user is typing in another input / textarea / contenteditable
      const activeElement = document.activeElement
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.hasAttribute('contenteditable')

      // If already typing in an input other than our search input, don't hijack '/'
      if (e.key === '/' && !isInput) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
        return
      }

      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        // If not inside a modal dialog, smoothly focus the search input
        const inDialog = activeElement?.closest('[role="dialog"]')
        if (!inDialog) {
          e.preventDefault()
          inputRef.current?.focus()
          inputRef.current?.select()
        }
      }

      // Escape key behavior
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputRef])
}
