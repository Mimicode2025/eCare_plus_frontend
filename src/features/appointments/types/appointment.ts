/** Statuts d'un rendez-vous, alignés sur ceux du backend (`StatutRendezVous`). */
export type AppointmentStatus = 'planifie' | 'confirme' | 'reporte' | 'annule' | 'realise'

/** Actions prévues par le backend sur un rendez-vous. Le report n'est pas encore proposé ici. */
export type AppointmentAction = 'confirmer' | 'annuler' | 'realiser'

export interface Appointment {
  id: string
  patientId: string
  /*
   * Hypothèse d'affichage : le nom et le numéro de dossier ne figurent pas dans la réponse
   * actuelle du backend, qui ne renvoie que l'identifiant du patient.
   */
  patientName: string
  patientFileNumber: string
  /** Date et heure au format ISO-8601. */
  scheduledAt: string
  reason: string
  location?: string
  status: AppointmentStatus
}
