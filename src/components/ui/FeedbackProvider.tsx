import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackContext, type FeedbackContextValue } from '@/hooks/useFeedback'

/** Délai avant la fermeture automatique d'une carte de succès. */
const SUCCESS_DURATION_MS = 3000

interface Feedback {
  id: string
  variant: 'success' | 'error'
  title: string
  description?: string
}

const variants = {
  success: {
    icon: 'bg-success-soft text-success',
    // Coche.
    paths: ['m5 12.5 4.5 4.5L19 7.5'],
    close: 'Continuer',
  },
  error: {
    icon: 'bg-danger-soft text-danger',
    // Croix.
    paths: ['M7 7l10 10', 'M17 7 7 17'],
    close: 'Fermer',
  },
}

function FeedbackDialog({ feedback, onClose }: { feedback: Feedback; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { icon, paths, close } = variants[feedback.variant]

  // Ouverture modale : le navigateur gère le fond, le focus et la touche Échap.
  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  useEffect(() => {
    if (feedback.variant !== 'success') return
    const timer = setTimeout(onClose, SUCCESS_DURATION_MS)
    return () => clearTimeout(timer)
  }, [feedback.variant, onClose])

  return (
    <dialog
      ref={dialogRef}
      role={feedback.variant === 'error' ? 'alertdialog' : undefined}
      aria-labelledby="feedback-title"
      aria-describedby={feedback.description ? 'feedback-description' : undefined}
      onClose={onClose}
      // Un clic sur le fond, hors de la carte, la referme.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm animate-pop rounded-3xl bg-surface shadow-xl backdrop:bg-ink/40"
    >
      <div className="flex flex-col items-center gap-5 p-8 text-center">
        <span
          aria-hidden="true"
          className={`flex size-20 items-center justify-center rounded-full ${icon}`}
        >
          <svg
            className="size-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {paths.map((path) => (
              <path key={path} d={path} pathLength="1" strokeDasharray="1" className="animate-draw" />
            ))}
          </svg>
        </span>
        <div className="flex flex-col gap-2">
          <h2 id="feedback-title" className="font-display text-xl font-bold text-ink">
            {feedback.title}
          </h2>
          {feedback.description && (
            <p id="feedback-description" className="text-sm text-muted">
              {feedback.description}
            </p>
          )}
        </div>
        <Button fullWidth onClick={onClose}>
          {close}
        </Button>
      </div>
    </dialog>
  )
}

/** Fournit les cartes de succès et d'échec, affichées au centre de l'écran. */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const value = useMemo<FeedbackContextValue>(() => {
    const show = (variant: Feedback['variant']) => (title: string, description?: string) =>
      setFeedback({ id: crypto.randomUUID(), variant, title, description })
    return { success: show('success'), error: show('error') }
  }, [])

  const close = useMemo(() => () => setFeedback(null), [])

  return (
    <FeedbackContext value={value}>
      {children}
      {feedback && <FeedbackDialog key={feedback.id} feedback={feedback} onClose={close} />}
    </FeedbackContext>
  )
}
