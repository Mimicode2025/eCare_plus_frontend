const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })

/** Formate une date ISO (`AAAA-MM-JJ` ou date-heure complète) en français. */
export function formatDate(isoDate: string) {
  const date = new Date(isoDate.length === 10 ? `${isoDate}T00:00:00` : isoDate)
  return Number.isNaN(date.getTime()) ? isoDate : dateFormatter.format(date)
}
