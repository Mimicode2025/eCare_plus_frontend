import { useEffect, useRef } from 'react'

/**
 * Referme un volet déroulant d'un clic à l'extérieur ou avec la touche Échap.
 * La référence renvoyée est à poser sur l'élément qui contient le bouton et le volet.
 */
export function useDismiss<T extends HTMLElement>(open: boolean, onDismiss: () => void) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) onDismiss()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onDismiss])

  return containerRef
}
