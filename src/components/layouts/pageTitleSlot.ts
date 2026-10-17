import { createContext } from 'react'

/**
 * Emplacement réservé au titre de la page dans la barre supérieure de l'application.
 * `null` hors de la mise en page connectée : la page affiche alors son titre elle-même.
 */
export const PageTitleSlot = createContext<HTMLElement | null>(null)
