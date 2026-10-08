import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Page } from '@/components/layouts/Page'
import { Alert as AlertMessage } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { StatTile } from '@/components/ui/StatTile'
import { buttonClassName } from '@/components/ui/styles'

export interface DashboardAlert {
  id: string
  patientName: string
  trigger: string
  value: string
  highPriority: boolean
  /** Pastille de priorité, fournie par l'application. */
  priorityBadge: ReactNode
}

export interface DashboardData {
  patientCount: number
  closedAlertCount: number
  /** Alertes actives, les plus prioritaires en premier. */
  activeAlerts: DashboardAlert[]
}

interface DashboardPageProps {
  /** `null` tant que les données ne sont pas disponibles. */
  data: DashboardData | null
  failed: boolean
}

const pageDescription = "Vue d'ensemble du télésuivi"
const MAX_ALERTS_SHOWN = 4

const quickLinks = [
  { to: '/patients', label: 'Consulter la liste des patients' },
  { to: '/alertes', label: 'Ouvrir la file des alertes' },
]

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

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

  const { patientCount, closedAlertCount, activeAlerts } = data
  const highCount = activeAlerts.filter((alert) => alert.highPriority).length

  return (
    <Page title="Tableau de bord" description={pageDescription}>
      <div className="grid gap-4 md:grid-cols-3">
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
          label="Alertes clôturées"
          value={plural(closedAlertCount, 'clôturée', 'clôturées')}
          hint="Vérifiées et consignées"
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card title="Alertes à traiter">
            {activeAlerts.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">
                Aucune alerte active pour le moment.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {activeAlerts.slice(0, MAX_ALERTS_SHOWN).map((alert) => (
                  <li
                    key={alert.id}
                    className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 first:pt-0 last:pb-0"
                  >
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
        </div>

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
    </Page>
  )
}
