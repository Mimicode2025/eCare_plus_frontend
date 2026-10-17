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

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Une mesure par jour à heure fixe : la dernière valeur tombe le `lastDay`,
 * les précédentes les jours d'avant.
 */
function daily<T>(
  lastDay: string,
  time: string,
  values: T[],
  make: (recordedAt: string, value: T) => MeasurementData,
) {
  return values.map((value, index) => {
    const date = new Date(`${lastDay}T${time}:00`)
    date.setDate(date.getDate() - (values.length - 1 - index))
    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    return make(`${day}T${time}:00`, value)
  })
}

const measurementsByPatient: Record<string, MeasurementData[]> = {
  'demo-1': [
    ...daily(
      '2026-10-07',
      '07:40',
      [1.32, 1.28, 1.35, 1.26, 1.22, 1.29, 1.24, 1.18, 1.21, 1.15, 1.21, 1.12, 1.24, 1.18],
      (at, value) => glycemia(at, value, 'a_jeun'),
    ),
    ...daily(
      '2026-10-06',
      '20:10',
      [1.52, 1.47, 1.56, 1.44, 1.5, 1.41, 1.55, 1.46, 1.58, 1.49, 1.61, 1.47, 1.52],
      (at, value) => glycemia(at, value, 'post_prandiale'),
    ),
    weight('2026-09-21T08:00:00', 79.6),
    weight('2026-09-28T08:00:00', 79.1),
    weight('2026-10-05T08:00:00', 78.5),
  ],
  'demo-2': [
    ...daily(
      '2026-10-07',
      '08:10',
      [
        [136, 86],
        [138, 87],
        [134, 84],
        [139, 88],
        [135, 85],
        [137, 86],
        [133, 83],
        [138, 87],
        [134, 84],
        [136, 85],
        [132, 82],
        [137, 86],
        [135, 84],
        [138, 86],
      ],
      (at, [systolic, diastolic]) => pressure(at, systolic, diastolic),
    ),
    pressure('2026-10-02T19:30:00', 139, 88),
    pressure('2026-10-04T19:30:00', 138, 87),
    pressure('2026-10-06T19:30:00', 142, 88),
    ...daily(
      '2026-10-07',
      '08:10',
      [78, 80, 76, 79, 75, 77, 74, 76, 73, 75, 72, 74, 73, 74],
      heartRate,
    ),
    weight('2026-09-28T08:00:00', 66.6),
    weight('2026-10-05T08:00:00', 66.2),
  ],
  'demo-3': [
    ...daily(
      '2026-10-07',
      '07:20',
      [1.22, 1.25, 1.2, 1.28, 1.24, 1.3, 1.26, 1.33, 1.29, 1.35, 1.3, 1.27, 1.34, 1.31],
      (at, value) => glycemia(at, value, 'a_jeun'),
    ),
    ...daily(
      '2026-10-06',
      '14:05',
      [1.42, 1.46, 1.4, 1.48, 1.44, 1.5, 1.47, 1.53, 1.49, 1.56, 1.52, 1.58, 1.78],
      (at, value) => glycemia(at, value, 'post_prandiale'),
    ),
    ...daily(
      '2026-10-07',
      '07:25',
      [
        [128, 80],
        [131, 82],
        [127, 79],
        [133, 83],
        [130, 81],
        [134, 84],
        [132, 82],
        [136, 85],
        [133, 83],
        [137, 86],
        [135, 84],
        [139, 88],
        [138, 87],
        [146, 91],
      ],
      (at, [systolic, diastolic]) => pressure(at, systolic, diastolic),
    ),
    ...daily(
      '2026-10-07',
      '07:25',
      [76, 77, 75, 78, 77, 79, 78, 80, 79, 81, 83, 82, 80, 81],
      heartRate,
    ),
    weight('2026-09-27T07:40:00', 84.4),
    weight('2026-10-04T07:40:00', 84.0),
  ],
}

function simulateNetwork() {
  return new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
}

function sortedMeasurements(patientId: string) {
  return (measurementsByPatient[patientId] ?? [])
    .map((data, index): Measurement => ({ ...data, id: `${patientId}-${index}`, patientId }))
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
}

/** Mesures d'un patient, de la plus récente à la plus ancienne. */
export async function listMeasurements(patientId: string): Promise<Measurement[]> {
  await simulateNetwork()
  return sortedMeasurements(patientId)
}

/** Dernière mesure reçue de chaque patient, indexée par identifiant de patient. */
export async function listLatestMeasurements(): Promise<Record<string, Measurement>> {
  await simulateNetwork()
  const latest: Record<string, Measurement> = {}
  for (const patientId of Object.keys(measurementsByPatient)) {
    const [mostRecent] = sortedMeasurements(patientId)
    if (mostRecent) latest[patientId] = mostRecent
  }
  return latest
}
