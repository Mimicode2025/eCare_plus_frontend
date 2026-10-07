const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long',
  timeStyle: 'short',
})

/** Formate une date-heure ISO en français, par exemple « 7 octobre 2026 à 08:30 ». */
export function formatDateTime(isoDateTime: string) {
  const date = new Date(isoDateTime)
  return Number.isNaN(date.getTime()) ? isoDateTime : dateTimeFormatter.format(date)
}
