import { createContext, useContext } from 'react'

/** Affiche une carte au centre de l'écran : un titre court, et une précision facultative. */
type ShowFeedback = (title: string, description?: string) => void

export interface FeedbackContextValue {
  /** Action réussie ; la carte se referme d'elle-même. */
  success: ShowFeedback
  /** Action qui n'a pas abouti ; la carte reste affichée jusqu'à sa fermeture. */
  error: ShowFeedback
}

export const FeedbackContext = createContext<FeedbackContextValue | null>(null)

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (!context) throw new Error('useFeedback doit être utilisé dans un FeedbackProvider')
  return context
}
