import type {
  Appointment,
  AppointmentAction,
  AppointmentStatus,
} from '@/features/appointments/types/appointment'

export const statusLabels: Record<AppointmentStatus, string> = {
  planifie: 'Planifié',
  confirme: 'Confirmé',
  reporte: 'Reporté',
  annule: 'Annulé',
  realise: 'Réalisé',
}

export const actionLabels: Record<AppointmentAction, string> = {
  confirmer: 'Confirmer',
  annuler: 'Annuler',
  realiser: 'Marquer comme réalisé',
}

/*
 * Actions proposées selon le statut. Simple confort d'interface : c'est le backend qui
 * décidera des transitions réellement autorisées.
 */
const actionsByStatus: Record<AppointmentStatus, AppointmentAction[]> = {
  planifie: ['confirmer', 'annuler'],
  reporte: ['confirmer', 'annuler'],
  confirme: ['realiser', 'annuler'],
  annule: [],
  realise: [],
}

export function availableActions(status: AppointmentStatus) {
  return actionsByStatus[status]
}

/** Rendez-vous encore attendu : ni annulé, ni réalisé, et pas encore passé. */
export function isUpcoming(appointment: Appointment, now: number) {
  return (
    availableActions(appointment.status).length > 0 &&
    new Date(appointment.scheduledAt).getTime() >= now
  )
}
