import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { AppointmentStatusBadge } from '@/features/appointments/components/AppointmentStatusBadge'
import { useAppointments } from '@/features/appointments/hooks/useAppointments'
import { formatDateTime } from '@/utils/formatDateTime'

/** Rendez-vous d'un patient, du plus récent au plus ancien, pour son dossier. */
export function PatientAppointments({ patientId }: { patientId: string }) {
  const state = useAppointments()
  const appointments =
    state.status === 'success'
      ? state.data.filter((appointment) => appointment.patientId === patientId).reverse()
      : []

  return (
    <Card title="Rendez-vous">
      {state.status === 'loading' && (
        <p role="status" className="text-sm text-muted">
          Chargement des rendez-vous…
        </p>
      )}
      {state.status === 'error' && (
        <Alert variant="error" title="Les rendez-vous n'ont pas pu être chargés.">
          Rechargez la page pour réessayer.
        </Alert>
      )}
      {state.status === 'success' && appointments.length === 0 && (
        <p className="text-sm text-muted">Aucun rendez-vous pour ce patient.</p>
      )}
      {appointments.length > 0 && (
        <ul className="flex flex-col gap-3">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="flex flex-col gap-2 rounded-lg bg-page p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">
                  {formatDateTime(appointment.scheduledAt)}
                </p>
                <AppointmentStatusBadge status={appointment.status} />
              </div>
              <p className="text-sm text-ink">{appointment.reason}</p>
              {appointment.location && (
                <p className="text-xs text-muted">{appointment.location}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
