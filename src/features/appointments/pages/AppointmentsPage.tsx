import { useState } from 'react'
import { Page } from '@/components/layouts/Page'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IconLink, recordIconPath } from '@/components/ui/IconLink'
import { SelectField } from '@/components/ui/SelectField'
import { StatTile } from '@/components/ui/StatTile'
import { AppointmentStatusBadge } from '@/features/appointments/components/AppointmentStatusBadge'
import { useAppointments } from '@/features/appointments/hooks/useAppointments'
import {
  actionLabels,
  availableActions,
  isUpcoming,
  statusLabels,
} from '@/features/appointments/labels'
import { applyAppointmentAction } from '@/features/appointments/services/appointmentService'
import type { Appointment, AppointmentAction } from '@/features/appointments/types/appointment'
import { formatDateTime } from '@/utils/formatDateTime'

const pageDescription = 'Consultations planifiées avec les patients suivis'

const headClassName =
  'bg-page px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted uppercase first:rounded-l-lg last:rounded-r-lg'
const cellClassName =
  'border-y border-line px-4 py-3 first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r'

const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))

const count = (total: number) => (total === 1 ? '1 rendez-vous' : `${total} rendez-vous`)

interface AppointmentsTableProps {
  appointments: Appointment[]
  /** Identifiant du rendez-vous dont une action est en cours d'enregistrement. */
  pendingId?: string
  onAction?: (appointment: Appointment, action: AppointmentAction) => void
}

function AppointmentsTable({ appointments, pendingId, onAction }: AppointmentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-208 border-separate border-spacing-y-2 text-sm">
        <thead>
          <tr>
            <th scope="col" className={headClassName}>
              Date et heure
            </th>
            <th scope="col" className={headClassName}>
              Patient
            </th>
            <th scope="col" className={headClassName}>
              Motif
            </th>
            <th scope="col" className={headClassName}>
              Statut
            </th>
            {onAction && (
              <th scope="col" className={headClassName}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className={`${cellClassName} font-semibold whitespace-nowrap text-ink`}>
                {formatDateTime(appointment.scheduledAt)}
              </td>
              <td className={cellClassName}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{appointment.patientName}</p>
                    <p className="text-xs text-muted">N° {appointment.patientFileNumber}</p>
                  </div>
                  <IconLink
                    to={`/patients/${appointment.patientId}`}
                    label={`Consulter le dossier de ${appointment.patientName}`}
                    iconPath={recordIconPath}
                  />
                </div>
              </td>
              <td className={cellClassName}>
                <p>{appointment.reason}</p>
                {appointment.location && (
                  <p className="text-xs text-muted">{appointment.location}</p>
                )}
              </td>
              <td className={cellClassName}>
                <AppointmentStatusBadge status={appointment.status} />
              </td>
              {onAction && (
                <td className={cellClassName}>
                  <div className="flex flex-wrap gap-2">
                    {availableActions(appointment.status).map((action) => (
                      <Button
                        key={action}
                        size="sm"
                        variant={action === 'annuler' ? 'secondary' : 'primary'}
                        disabled={pendingId !== undefined}
                        loading={pendingId === appointment.id}
                        aria-label={`${actionLabels[action]} le rendez-vous de ${appointment.patientName}`}
                        onClick={() => onAction(appointment, action)}
                      >
                        {actionLabels[action]}
                      </Button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AppointmentsPage() {
  const state = useAppointments()
  // Rendez-vous dont le statut a changé depuis l'ouverture de l'écran, par identifiant.
  const [changed, setChanged] = useState<Record<string, Appointment>>({})
  const [pendingId, setPendingId] = useState<string>()
  const [actionFailed, setActionFailed] = useState(false)
  const [status, setStatus] = useState('')
  const [now] = useState(() => Date.now())

  if (state.status !== 'success') {
    return (
      <Page title="Rendez-vous" description={pageDescription}>
        {state.status === 'loading' ? (
          <p role="status" className="text-sm text-muted">
            Chargement des rendez-vous…
          </p>
        ) : (
          <Alert variant="error" title="Les rendez-vous n'ont pas pu être chargés.">
            Rechargez la page pour réessayer.
          </Alert>
        )}
      </Page>
    )
  }

  const handleAction = async (appointment: Appointment, action: AppointmentAction) => {
    setPendingId(appointment.id)
    setActionFailed(false)
    try {
      const updated = await applyAppointmentAction(appointment.id, action)
      setChanged((current) => ({ ...current, [updated.id]: updated }))
    } catch {
      setActionFailed(true)
    } finally {
      setPendingId(undefined)
    }
  }

  const all = state.data.map((appointment) => changed[appointment.id] ?? appointment)
  const upcomingAll = all.filter((appointment) => isUpcoming(appointment, now))
  const shown = status ? all.filter((appointment) => appointment.status === status) : all
  const upcoming = shown.filter((appointment) => isUpcoming(appointment, now))
  // Rendez-vous passés, annulés ou réalisés, du plus récent au plus ancien.
  const past = shown.filter((appointment) => !isUpcoming(appointment, now)).reverse()

  return (
    <Page title="Rendez-vous" description={pageDescription}>
      <div className="grid gap-4 md:grid-cols-3">
        <StatTile label="À venir" value={count(upcomingAll.length)} hint="Planifiés ou confirmés" />
        <StatTile
          tone="amber"
          label="À confirmer"
          value={count(upcomingAll.filter(({ status }) => status !== 'confirme').length)}
          hint="Planifiés ou reportés"
        />
        <StatTile
          tone="green"
          label="Réalisés"
          value={count(all.filter(({ status }) => status === 'realise').length)}
          hint="Consultations effectuées"
        />
      </div>

      <div className="max-w-xs">
        <SelectField
          label="Statut"
          placeholder="Tous les statuts"
          options={statusOptions}
          showRequirement={false}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        />
      </div>

      {actionFailed && (
        <Alert variant="error" title="Le rendez-vous n'a pas pu être mis à jour.">
          Vérifiez votre connexion puis réessayez.
        </Alert>
      )}

      <Card title="Rendez-vous à venir">
        {upcoming.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            {status ? 'Aucun rendez-vous à venir avec ce statut.' : 'Aucun rendez-vous à venir.'}
          </p>
        ) : (
          <AppointmentsTable
            appointments={upcoming}
            pendingId={pendingId}
            onAction={(appointment, action) => void handleAction(appointment, action)}
          />
        )}
      </Card>

      {past.length > 0 && (
        <Card title="Rendez-vous passés ou annulés">
          <AppointmentsTable appointments={past} />
        </Card>
      )}
    </Page>
  )
}
