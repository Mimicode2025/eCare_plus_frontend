import { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SelectField } from '@/components/ui/SelectField'
import { MeasurementTrends } from '@/features/measurements/components/MeasurementTrends'
import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'
import {
  formatMeasurementValue,
  kindLabels,
  measurementLabel,
} from '@/features/measurements/labels'
import type { Measurement } from '@/features/measurements/types/measurement'
import { formatDateTime } from '@/utils/formatDateTime'

const kindOptions = Object.entries(kindLabels).map(([value, label]) => ({ value, label }))

const headClassName =
  'bg-page px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted uppercase first:rounded-l-lg last:rounded-r-lg'
const cellClassName =
  'border-y border-line px-4 py-3 first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r'

/** La mesure la plus récente de chaque libellé (la liste reçue est déjà triée par date décroissante). */
function latestByLabel(measurements: Measurement[]) {
  const latest = new Map<string, Measurement>()
  for (const measurement of measurements) {
    const label = measurementLabel(measurement)
    if (!latest.has(label)) latest.set(label, measurement)
  }
  return [...latest.values()]
}

function LatestMeasurements({ measurements }: { measurements: Measurement[] }) {
  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
      {latestByLabel(measurements).map((measurement) => (
        <div key={measurement.id} className="flex flex-col gap-1 rounded-lg bg-page p-4">
          <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
            {measurementLabel(measurement)}
          </dt>
          <dd className="font-display text-2xl font-bold text-ink">
            {formatMeasurementValue(measurement)}
          </dd>
          <dd className="text-xs text-muted">{formatDateTime(measurement.recordedAt)}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Nombre de mesures affichées dans l'historique avant de demander la suite. */
const HISTORY_PAGE_SIZE = 10

function MeasurementHistory({ measurements }: { measurements: Measurement[] }) {
  const [kind, setKind] = useState('')
  const [expanded, setExpanded] = useState(false)
  const shown = kind ? measurements.filter((measurement) => measurement.kind === kind) : measurements
  const visible = expanded ? shown : shown.slice(0, HISTORY_PAGE_SIZE)

  return (
    <Card title="Historique des mesures">
      <div className="flex flex-col gap-4">
        <div className="max-w-xs">
          <SelectField
            label="Type de mesure"
            placeholder="Toutes les mesures"
            options={kindOptions}
            showRequirement={false}
            value={kind}
            onChange={(event) => setKind(event.target.value)}
          />
        </div>

        {shown.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            Aucune mesure de ce type n'a été transmise.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-136 border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr>
                  <th scope="col" className={headClassName}>
                    Date et heure
                  </th>
                  <th scope="col" className={headClassName}>
                    Mesure
                  </th>
                  <th scope="col" className={headClassName}>
                    Valeur
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((measurement) => (
                  <tr key={measurement.id}>
                    <td className={`${cellClassName} whitespace-nowrap`}>
                      {formatDateTime(measurement.recordedAt)}
                    </td>
                    <td className={cellClassName}>{measurementLabel(measurement)}</td>
                    <td className={`${cellClassName} font-semibold whitespace-nowrap`}>
                      {formatMeasurementValue(measurement)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {shown.length > HISTORY_PAGE_SIZE && (
          <div className="flex justify-center">
            <Button variant="secondary" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded
                ? 'Afficher seulement les plus récentes'
                : `Afficher les ${shown.length} mesures`}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

/** Suivi des mesures d'un patient : dernières valeurs reçues puis historique complet. */
export function PatientMeasurements({ patientId }: { patientId: string }) {
  const state = useMeasurements(patientId)

  if (state.status === 'error') {
    return (
      <Alert variant="error" title="Les mesures n'ont pas pu être chargées.">
        Rechargez la page pour réessayer.
      </Alert>
    )
  }

  if (state.status === 'loading' || state.measurements.length === 0) {
    return (
      <Card title="Dernières mesures reçues">
        <p
          role={state.status === 'loading' ? 'status' : undefined}
          className="py-6 text-center text-sm text-muted"
        >
          {state.status === 'loading'
            ? 'Chargement des mesures…'
            : "Ce patient n'a encore transmis aucune mesure."}
        </p>
      </Card>
    )
  }

  return (
    <>
      <Card title="Dernières mesures reçues">
        <LatestMeasurements measurements={state.measurements} />
      </Card>
      <MeasurementTrends measurements={state.measurements} />
      <MeasurementHistory measurements={state.measurements} />
    </>
  )
}
