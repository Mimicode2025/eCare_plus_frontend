import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { AlertDetailsPage, PriorityBadge, useAlerts } from '@/features/alerts'
import {
  AppointmentStatusBadge,
  isUpcoming,
  PatientAppointments,
  useAppointments,
} from '@/features/appointments'
import { useAuth } from '@/features/auth'
import { DashboardPage, type DashboardData } from '@/features/dashboard'
import {
  formatMeasurementValue,
  measurementLabel,
  PatientMeasurements,
  useLatestMeasurements,
} from '@/features/measurements'
import { useConversations } from '@/features/messaging'
import { PatientNotes } from '@/features/notes'
import {
  PatientDetailsPage,
  PatientsPage,
  usePatients,
  type PatientColumn,
} from '@/features/patients'
import { formatDateTime } from '@/utils/formatDateTime'

/* Écrans du médecin qui assemblent plusieurs fonctionnalités (patients, alertes, mesures, notes). */

const pending = <span className="text-muted">Chargement…</span>

export function DashboardRoute() {
  const patients = usePatients()
  const alerts = useAlerts()
  const latest = useLatestMeasurements()
  const appointments = useAppointments()
  const conversations = useConversations()
  const [now] = useState(() => Date.now())
  const sources = [patients, alerts, latest, appointments, conversations]

  let data: DashboardData | null = null
  if (
    patients.status === 'success' &&
    alerts.status === 'success' &&
    latest.status === 'success' &&
    appointments.status === 'success' &&
    conversations.status === 'success'
  ) {
    const active = alerts.data.filter((alert) => !alert.resolution)
    data = {
      patientCount: patients.patients.length,
      recentMeasurements: patients.patients
        .flatMap((patient) => {
          const measurement = latest.data[patient.id]
          return measurement
            ? [
                {
                  patientId: patient.id,
                  patientName: `${patient.firstName} ${patient.lastName}`,
                  label: measurementLabel(measurement),
                  value: formatMeasurementValue(measurement),
                  recordedAt: measurement.recordedAt,
                },
              ]
            : []
        })
        .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
      upcomingAppointments: appointments.data
        .filter((appointment) => isUpcoming(appointment, now))
        .map((appointment) => ({
          id: appointment.id,
          patientName: appointment.patientName,
          reason: appointment.reason,
          scheduledAt: appointment.scheduledAt,
          statusBadge: <AppointmentStatusBadge status={appointment.status} />,
        })),
      unreadMessageCount: conversations.data.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0,
      ),
      activeAlerts: active
        .map((alert) => ({
          id: alert.id,
          patientName: alert.patientName,
          trigger: alert.trigger,
          value: alert.value,
          highPriority: alert.priority === 'haute',
          priorityBadge: <PriorityBadge priority={alert.priority} />,
        }))
        // Tri stable : les alertes en haute priorité passent devant, l'ordre par date est conservé.
        .sort((a, b) => Number(b.highPriority) - Number(a.highPriority)),
    }
  }

  return <DashboardPage data={data} failed={sources.some(({ status }) => status === 'error')} />
}

/** Liste des patients du médecin : les colonnes administratives laissent place au suivi. */
export function DoctorPatientsRoute() {
  const latest = useLatestMeasurements()
  const alerts = useAlerts()

  const columns: PatientColumn[] = [
    {
      header: 'Dernière mesure',
      render: (patient) => {
        if (latest.status !== 'success') return latest.status === 'loading' ? pending : '—'
        const measurement = latest.data[patient.id]
        return measurement ? (
          formatDateTime(measurement.recordedAt)
        ) : (
          <span className="text-muted">Aucune mesure</span>
        )
      },
    },
    {
      header: 'Valeur',
      render: (patient) => {
        const measurement = latest.status === 'success' ? latest.data[patient.id] : undefined
        return measurement ? (
          <>
            <span className="font-display font-bold text-ink">
              {formatMeasurementValue(measurement)}
            </span>{' '}
            <span className="text-xs text-muted">({measurementLabel(measurement)})</span>
          </>
        ) : (
          '—'
        )
      },
    },
    {
      header: 'Alertes',
      render: (patient) => {
        if (alerts.status !== 'success') return alerts.status === 'loading' ? pending : '—'
        const active = alerts.data.filter(
          (alert) => alert.patientId === patient.id && !alert.resolution,
        )
        if (active.length === 0) return <Badge tone="green">Aucune alerte active</Badge>
        const highest = active.some((alert) => alert.priority === 'haute') ? 'haute' : 'moyenne'
        return <PriorityBadge priority={highest} />
      },
    },
  ]

  return <PatientsPage canManage={false} columns={columns} />
}

/** Dossier d'un patient vu par le médecin : mesures, observations et rendez-vous au-dessus des informations administratives. */
export function DoctorPatientRecordRoute() {
  const { user } = useAuth()
  return (
    <PatientDetailsPage
      renderExtra={(patient) => (
        <div className="grid items-start gap-6 xl:grid-cols-5">
          <div className="flex flex-col gap-6 xl:col-span-3">
            <PatientMeasurements patientId={patient.id} />
          </div>
          <div className="flex flex-col gap-6 xl:col-span-2">
            <PatientNotes patientId={patient.id} authorName={user?.name ?? ''} />
            <PatientAppointments patientId={patient.id} />
          </div>
        </div>
      )}
    />
  )
}

export function AlertRoute() {
  const { user } = useAuth()
  return (
    <AlertDetailsPage
      currentUserName={user?.name ?? ''}
      renderPatientContext={(patientId) => <PatientMeasurements patientId={patientId} />}
    />
  )
}
