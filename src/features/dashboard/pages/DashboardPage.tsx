import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Page } from '@/components/layouts/Page'
import { Alert as AlertMessage } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { IconLink, recordIconPath } from '@/components/ui/IconLink'
import { StatTile } from '@/components/ui/StatTile'
import { buttonClassName } from '@/components/ui/styles'
import { formatDateTime } from '@/utils/formatDateTime'

export interface DashboardAlert {
  id: string
  patientName: string
  trigger: string
  value: string
  highPriority: boolean
  /** Pastille de priorité, fournie par l'application. */
  priorityBadge: ReactNode
}

export interface DashboardMeasurement {
  patientId: string
  patientName: string
  /** Nature de la mesure, par exemple « Glycémie à jeun ». */
  label: string
  /** Valeur exacte avec son unité. */
  value: string
  recordedAt: string
}

export interface DashboardAppointment {
  id: string
  patientName: string
  reason: string
  scheduledAt: string
  /** Pastille de statut, fournie par l'application. */
  statusBadge: ReactNode
}

export interface DashboardData {
  patientCount: number
  /** Alertes actives, les plus prioritaires en premier. */
  activeAlerts: DashboardAlert[]
  /** Dernière mesure reçue de chaque patient, la plus récente en premier. */
  recentMeasurements: DashboardMeasurement[]
  /** Rendez-vous à venir, le plus proche en premier. */
  upcomingAppointments: DashboardAppointment[]
  unreadMessageCount: number
}

interface DashboardPageProps {
  /** `null` tant que les données ne sont pas disponibles. */
  data: DashboardData | null
  failed: boolean
}

const pageDescription = "Vue d'ensemble du télésuivi"
const MAX_ITEMS_SHOWN = 4

const quickLinks = [
  { to: '/patients', label: 'Consulter la liste des patients' },
  { to: '/alertes', label: 'Ouvrir la file des alertes' },
  { to: '/messagerie', label: 'Ouvrir la messagerie' },
  { to: '/rendez-vous', label: 'Consulter les rendez-vous' },
]

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

const emptyClassName = 'py-6 text-center text-sm text-muted'
const rowClassName =
  'flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 first:pt-0 last:pb-0'

export function DashboardPage({ data, failed }: DashboardPageProps) {
  if (!data) {
    return (
      <Page title="Tableau de bord" description={pageDescription}>
        {failed ? (
          <AlertMessage variant="error" title="Le tableau de bord n'a pas pu être chargé.">
            Rechargez la page pour réessayer.
          </AlertMessage>
        ) : (
          <p role="status" className="text-sm text-muted">
            Chargement du tableau de bord…
          </p>
        )}
      </Page>
    )
  }

  const { patientCount, activeAlerts, recentMeasurements, upcomingAppointments, unreadMessageCount } =
    data
  const highCount = activeAlerts.filter((alert) => alert.highPriority).length
  const [nextAppointment] = upcomingAppointments

  return (
    <Page title="Tableau de bord" description={pageDescription}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Patients suivis"
          value={plural(patientCount, 'patient', 'patients')}
          hint="Dossiers enregistrés"
        />
        <StatTile
          tone="red"
          label="Alertes actives"
          value={plural(activeAlerts.length, 'active', 'actives')}
          hint={`Dont ${highCount} en haute priorité`}
        />
        <StatTile
          tone="green"
          label="Rendez-vous à venir"
          value={plural(upcomingAppointments.length, 'à venir', 'à venir')}
          hint={
            nextAppointment
              ? `Prochain : ${formatDateTime(nextAppointment.scheduledAt)}`
              : 'Aucun rendez-vous planifié'
          }
        />
        <StatTile
          tone="amber"
          label="Messages non lus"
          value={plural(unreadMessageCount, 'non lu', 'non lus')}
          hint="Messages de patients à lire"
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <Card title="Alertes à traiter">
            {activeAlerts.length === 0 ? (
              <p className={emptyClassName}>Aucune alerte active pour le moment.</p>
            ) : (
              <ul className="divide-y divide-line">
                {activeAlerts.slice(0, MAX_ITEMS_SHOWN).map((alert) => (
                  <li key={alert.id} className={rowClassName}>
                    <div className="min-w-40 flex-1">
                      <p className="text-sm font-semibold text-ink">{alert.patientName}</p>
                      <p className="text-xs text-muted">{alert.trigger}</p>
                    </div>
                    <p
                      className={`font-display font-bold whitespace-nowrap ${
                        alert.highPriority ? 'text-danger' : 'text-warning'
                      }`}
                    >
                      {alert.value}
                    </p>
                    {alert.priorityBadge}
                    <Link
                      to={`/alertes/${alert.id}`}
                      aria-label={`Traiter l'alerte ${alert.id} : ${alert.patientName}`}
                      className={buttonClassName('primary', 'sm')}
                    >
                      Traiter l'alerte
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Mesures récentes">
            {recentMeasurements.length === 0 ? (
              <p className={emptyClassName}>Aucune mesure transmise pour le moment.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recentMeasurements.slice(0, MAX_ITEMS_SHOWN).map((measurement) => (
                  <li key={measurement.patientId} className={rowClassName}>
                    <div className="min-w-40 flex-1">
                      <p className="text-sm font-semibold text-ink">{measurement.patientName}</p>
                      <p className="text-xs text-muted">{measurement.label}</p>
                    </div>
                    <p className="font-display font-bold whitespace-nowrap text-ink">
                      {measurement.value}
                    </p>
                    <p className="text-xs whitespace-nowrap text-muted">
                      {formatDateTime(measurement.recordedAt)}
                    </p>
                    <IconLink
                      to={`/patients/${measurement.patientId}`}
                      label={`Consulter le dossier de ${measurement.patientName}`}
                      iconPath={recordIconPath}
                    />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card
            title="Prochains rendez-vous"
            action={
              <Link to="/rendez-vous" className={buttonClassName('soft', 'sm')}>
                Tout voir
              </Link>
            }
          >
            {upcomingAppointments.length === 0 ? (
              <p className={emptyClassName}>Aucun rendez-vous à venir.</p>
            ) : (
              <ul className="divide-y divide-line">
                {upcomingAppointments.slice(0, MAX_ITEMS_SHOWN).map((appointment) => (
                  <li key={appointment.id} className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{appointment.patientName}</p>
                      {appointment.statusBadge}
                    </div>
                    <p className="text-sm text-ink">{formatDateTime(appointment.scheduledAt)}</p>
                    <p className="text-xs text-muted">{appointment.reason}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Accès rapides">
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block rounded-lg border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-page focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </Page>
  )
}
