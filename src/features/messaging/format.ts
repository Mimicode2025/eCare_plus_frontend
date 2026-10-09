const timeFormatter = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })
const dayFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' })
const shortDayFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' })

/** Clé du jour local d'une date-heure ISO, pour regrouper les messages par journée. */
export function dayKey(isoDateTime: string) {
  return new Date(isoDateTime).toDateString()
}

/** Heure seule, par exemple « 08:53 ». */
export function formatTime(isoDateTime: string) {
  return timeFormatter.format(new Date(isoDateTime))
}

/** Jour d'une série de messages : « Aujourd'hui », « Hier » ou « 9 octobre ». */
export function formatDay(isoDateTime: string) {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (dayKey(isoDateTime) === new Date().toDateString()) return "Aujourd'hui"
  if (dayKey(isoDateTime) === yesterday.toDateString()) return 'Hier'
  return dayFormatter.format(new Date(isoDateTime))
}

/** Repère court de la liste des conversations : l'heure pour aujourd'hui, sinon le jour. */
export function formatActivity(isoDateTime: string) {
  return dayKey(isoDateTime) === new Date().toDateString()
    ? formatTime(isoDateTime)
    : shortDayFormatter.format(new Date(isoDateTime))
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
