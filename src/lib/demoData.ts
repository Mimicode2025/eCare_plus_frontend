/*
 * Outils des services de DÉMONSTRATION (aucun appel API).
 * À supprimer quand tous les services appelleront le backend.
 */

const SIMULATED_DELAY_MS = 700

export function simulateNetwork() {
  return new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
}

/** Date-heure fictive, relative à aujourd'hui pour que les écrans de démonstration restent parlants. */
export function demoDateTime(offsetDays: number, time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}
