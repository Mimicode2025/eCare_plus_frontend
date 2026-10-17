import type {
  Appointment,
  AppointmentAction,
  AppointmentStatus,
} from '@/features/appointments/types/appointment'
import { demoDateTime, simulateNetwork } from '@/lib/demoData'

/*
 * DONNÉES FICTIVES — aucun appel API.
 * Ce service simule les rendez-vous en mémoire. Les rendez-vous ci-dessous sont inventés et
 * leurs dates sont calculées par rapport à aujourd'hui ; les changements de statut sont perdus
 * au rechargement.
 *
 * Branchement futur : le backend expose `PATCH /rendez-vous/{id}/confirmation`, `/annulation`
 * et `/realisation`, mais pas encore de route pour lister les rendez-vous.
 */

const appointments: Appointment[] = [
  {
    id: 'rdv-demo-1',
    patientId: 'demo-3',
    patientName: 'Kodjo Test',
    patientFileNumber: 'ECP-00003',
    scheduledAt: demoDateTime(1, '09:30'),
    reason: 'Consultation de suivi',
    location: 'Cabinet de consultation',
    status: 'confirme',
  },
  {
    id: 'rdv-demo-2',
    patientId: 'demo-2',
    patientName: 'Afi Fictive',
    patientFileNumber: 'ECP-00002',
    scheduledAt: demoDateTime(3, '11:00'),
    reason: 'Contrôle de la tension artérielle',
    location: 'Cabinet de consultation',
    status: 'planifie',
  },
  {
    id: 'rdv-demo-3',
    patientId: 'demo-1',
    patientName: 'Jean Kossi Exemple',
    patientFileNumber: 'ECP-00001',
    scheduledAt: demoDateTime(6, '15:00'),
    reason: 'Consultation de suivi',
    location: 'Téléconsultation',
    status: 'reporte',
  },
  {
    id: 'rdv-demo-4',
    patientId: 'demo-1',
    patientName: 'Jean Kossi Exemple',
    patientFileNumber: 'ECP-00001',
    scheduledAt: demoDateTime(-7, '10:00'),
    reason: 'Consultation de suivi',
    location: 'Cabinet de consultation',
    status: 'realise',
  },
  {
    id: 'rdv-demo-5',
    patientId: 'demo-2',
    patientName: 'Afi Fictive',
    patientFileNumber: 'ECP-00002',
    scheduledAt: demoDateTime(-3, '16:30'),
    reason: 'Point sur les mesures de la semaine',
    location: 'Téléconsultation',
    status: 'annule',
  },
]

const statusAfter: Record<AppointmentAction, AppointmentStatus> = {
  confirmer: 'confirme',
  annuler: 'annule',
  realiser: 'realise',
}

/** Tous les rendez-vous, du plus proche au plus lointain. */
export async function listAppointments(): Promise<Appointment[]> {
  await simulateNetwork()
  return [...appointments].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
}

export async function applyAppointmentAction(
  id: string,
  action: AppointmentAction,
): Promise<Appointment> {
  await simulateNetwork()
  const index = appointments.findIndex((appointment) => appointment.id === id)
  if (index === -1) throw new Error('Rendez-vous introuvable')
  const updated: Appointment = { ...appointments[index], status: statusAfter[action] }
  appointments[index] = updated
  return updated
}
