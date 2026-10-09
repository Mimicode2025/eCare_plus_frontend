import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { Page } from '@/components/layouts/Page'
import { Alert as AlertMessage } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { buttonClassName } from '@/components/ui/styles'
import { TextareaField } from '@/components/ui/TextareaField'
import { useAlert } from '@/features/alerts/hooks/useAlerts'
import { closeAlert } from '@/features/alerts/services/alertService'
import type { Alert } from '@/features/alerts/types/alert'
import { formatDateTime } from '@/utils/formatDateTime'

const backLink = { to: '/alertes', label: 'Retour à la file des alertes' }

const verificationSteps = [
  'Prendre contact avec le patient pour vérifier son état général.',
  'Vérifier les conditions de la mesure (à jeun, après un repas, au repos).',
  "Consigner vos observations avant de clôturer l'alerte.",
]

interface AlertDetailsPageProps {
  /** Nom du professionnel connecté, enregistré à la clôture. */
  currentUserName: string
  /** Contexte du patient (par exemple ses mesures), composé par l'application. */
  renderPatientContext?: (patientId: string) => ReactNode
}

function AlertBanner({ alert }: { alert: Alert }) {
  const closed = Boolean(alert.resolution)
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border px-5 py-4 ${
        closed ? 'border-success-line bg-success-soft' : 'border-danger-line bg-danger-soft'
      }`}
    >
      <div className="flex flex-col gap-1">
        <p className={`font-display text-lg font-bold ${closed ? 'text-success' : 'text-danger'}`}>
          {closed ? 'Alerte clôturée' : 'Alerte active'} : {alert.trigger} ({alert.value})
        </p>
        <p className="text-sm text-ink">
          Déclenchée le {formatDateTime(alert.triggeredAt)} • Seuil de la règle : {alert.threshold} •
          Patient : {alert.patientName} (N° {alert.patientFileNumber})
        </p>
      </div>
      <span
        className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white ${
          closed ? 'bg-success' : 'bg-danger'
        }`}
      >
        {closed ? 'Clôturée' : 'En cours de vérification'}
      </span>
    </div>
  )
}

interface ResolutionFormProps {
  alert: Alert
  currentUserName: string
  onClosed: (alert: Alert) => void
}

function validateNote(value: string) {
  return value.trim() ? undefined : 'Veuillez renseigner une observation.'
}

function ResolutionForm({ alert, currentUserName, onClosed }: ResolutionFormProps) {
  const [note, setNote] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [submitFailed, setSubmitFailed] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextError = validateNote(note)
    setError(nextError)
    if (nextError) {
      document.getElementById('alert-note')?.focus()
      return
    }
    setSubmitting(true)
    setSubmitFailed(false)
    try {
      onClosed(await closeAlert(alert.id, note.trim(), currentUserName))
    } catch {
      setSubmitFailed(true)
      setSubmitting(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      className="flex flex-col gap-4"
    >
      {submitFailed && (
        <AlertMessage variant="error" title="L'alerte n'a pas pu être clôturée.">
          Vos observations sont conservées. Vérifiez votre connexion puis réessayez.
        </AlertMessage>
      )}
      <TextareaField
        id="alert-note"
        label="Observations cliniques"
        required
        placeholder="Compte rendu de l'échange avec le patient…"
        value={note}
        error={error}
        disabled={submitting}
        onChange={(event) => {
          setNote(event.target.value)
          if (error) setError(validateNote(event.target.value))
        }}
      />
      <Button type="submit" loading={submitting}>
        {submitting ? 'Clôture en cours…' : "Clôturer l'alerte"}
      </Button>
    </form>
  )
}

export function AlertDetailsPage({ currentUserName, renderPatientContext }: AlertDetailsPageProps) {
  const { alertId } = useParams()
  const state = useAlert(alertId)
  // Alerte renvoyée par la clôture, affichée à la place de celle chargée au départ.
  const [closedAlert, setClosedAlert] = useState<Alert>()
  const title = alertId ? `Traitement de l'alerte ${alertId}` : "Traitement de l'alerte"

  if (state.status === 'loading') {
    return (
      <Page title={title} backLink={backLink}>
        <p role="status" className="text-sm text-muted">
          Chargement de l'alerte…
        </p>
      </Page>
    )
  }

  if (state.status === 'error' || !state.data) {
    return (
      <Page title={title} backLink={backLink}>
        {state.status === 'error' ? (
          <AlertMessage variant="error" title="L'alerte n'a pas pu être chargée.">
            Rechargez la page pour réessayer.
          </AlertMessage>
        ) : (
          <AlertMessage variant="error" title="Cette alerte est introuvable.">
            Vérifiez le lien utilisé ou revenez à la file des alertes.
          </AlertMessage>
        )}
      </Page>
    )
  }

  const justClosed = closedAlert?.id === state.data.id
  const alert = justClosed && closedAlert ? closedAlert : state.data

  return (
    <Page
      title={title}
      description="Vérification d'un dépassement de seuil signalé par le télésuivi"
      backLink={backLink}
    >
      {justClosed && (
        <AlertMessage variant="success" title="L'alerte a été clôturée.">
          Vos observations sont enregistrées.
        </AlertMessage>
      )}

      <AlertBanner alert={alert} />

      <div className="grid items-start gap-6 xl:grid-cols-5">
        <div className="flex flex-col gap-6 xl:col-span-3">
          <Card title="Procédure de vérification">
            <p className="text-sm text-muted">
              Il s'agit d'une alerte de télésuivi : aucun diagnostic n'est posé automatiquement.
              L'interprétation reste celle du professionnel de santé.
            </p>
            <ol className="mt-4 flex flex-col gap-3">
              {verificationSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 text-sm text-ink">
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-strong"
                  >
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Card>

          {renderPatientContext?.(alert.patientId)}
        </div>

        <div className="flex flex-col gap-6 xl:col-span-2">
          <Card title="Résolution">
            {alert.resolution ? (
              <div className="rounded-lg bg-page p-4">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Observations de {alert.resolution.closedBy} (
                  {formatDateTime(alert.resolution.closedAt)})
                </p>
                <p className="mt-2 text-sm text-ink">{alert.resolution.note}</p>
              </div>
            ) : (
              <ResolutionForm
                alert={alert}
                currentUserName={currentUserName}
                onClosed={setClosedAlert}
              />
            )}
          </Card>

          <Link
            to={`/patients/${alert.patientId}`}
            className={`self-start ${buttonClassName('secondary')}`}
          >
            Consulter le dossier du patient
          </Link>
        </div>
      </div>
    </Page>
  )
}
