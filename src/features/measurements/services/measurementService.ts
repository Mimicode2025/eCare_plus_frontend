import type { Measurement } from '@/features/measurements/types/measurement'

/*
 * DONNÉES FICTIVES — aucun appel API.
 * Ce service simule les mesures transmises depuis l'application mobile, tant que le contrat
 * d'API n'est pas défini. Les valeurs sont inventées et n'ont aucune portée médicale.
 * Les unités et la structure des mesures sont provisoires.
 */

const SIMULATED_DELAY_MS = 700

type MeasurementData = Measurement extends infer M
  ? M extends Measurement
    ? Omit<M, 'id' | 'patientId'>
    : never
  : never

const glycemia = (recordedAt: string, value: number, context: 'a_jeun' | 'post_prandiale') =>
  ({ kind: 'glycemie', recordedAt, value, context }) satisfies MeasurementData
const pressure = (recordedAt: string, systolic: number, diastolic: number) =>
  ({ kind: 'tension', recordedAt, systolic, diastolic }) satisfies MeasurementData
const weight = (recordedAt: string, value: number) =>
  ({ kind: 'poids', recordedAt, value }) satisfies MeasurementData
const heartRate = (recordedAt: string, value: number) =>
  ({ kind: 'frequence_cardiaque', recordedAt, value }) satisfies MeasurementData

const measurementsByPatient: Record<string, MeasurementData[]> = {
  'demo-1': [
    glycemia('2026-10-07T07:40:00', 1.18, 'a_jeun'),
    glycemia('2026-10-06T13:55:00', 1.52, 'post_prandiale'),
    glycemia('2026-10-06T07:35:00', 1.24, 'a_jeun'),
    weight('2026-10-05T08:00:00', 78.5),
    glycemia('2026-10-05T07:45:00', 1.12, 'a_jeun'),
    glycemia('2026-10-04T20:10:00', 1.61, 'post_prandiale'),
    glycemia('2026-10-04T07:30:00', 1.21, 'a_jeun'),
    weight('2026-09-28T08:05:00', 79.1),
  ],
  'demo-2': [
    pressure('2026-10-07T08:10:00', 138, 86),
    heartRate('2026-10-07T08:10:00', 74),
    pressure('2026-10-06T19:30:00', 142, 88),
    heartRate('2026-10-06T19:30:00', 78),
    pressure('2026-10-05T08:05:00', 135, 84),
    weight('2026-10-05T08:00:00', 66.2),
    pressure('2026-10-04T08:15:00', 140, 87),
  ],
  'demo-3': [
    glycemia('2026-10-07T07:20:00', 1.31, 'a_jeun'),
    pressure('2026-10-07T07:25:00', 146, 91),
    heartRate('2026-10-07T07:25:00', 81),
    glycemia('2026-10-06T14:05:00', 1.78, 'post_prandiale'),
    pressure('2026-10-06T07:30:00', 144, 90),
    glycemia('2026-10-05T07:25:00', 1.27, 'a_jeun'),
    weight('2026-10-04T07:40:00', 84.0),
    pressure('2026-10-04T07:35:00', 149, 93),
  ],
}

/** Mesures d'un patient, de la plus récente à la plus ancienne. */
export async function listMeasurements(patientId: string): Promise<Measurement[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
  return (measurementsByPatient[patientId] ?? [])
    .map((data, index): Measurement => ({ ...data, id: `${patientId}-${index}`, patientId }))
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
}
