/** Identifiant du texte (erreur ou aide) à associer au champ via aria-describedby. */
export function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}
