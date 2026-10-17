import type { Measurement, MeasurementKind } from '@/features/measurements/types/measurement'

export const kindLabels: Record<MeasurementKind, string> = {
  glycemie: 'Glycémie',
  tension: 'Tension artérielle',
  poids: 'Poids',
  frequence_cardiaque: 'Fréquence cardiaque',
}

const decimal = (digits: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
const twoDecimals = decimal(2)
const oneDecimal = decimal(1)

/** Libellé précis de la mesure, avec le moment de la prise pour la glycémie. */
export function measurementLabel(measurement: Measurement) {
  if (measurement.kind !== 'glycemie') return kindLabels[measurement.kind]
  return measurement.context === 'a_jeun' ? 'Glycémie à jeun' : 'Glycémie post-prandiale'
}

/** Valeur exacte avec son unité, sans interprétation. */
export function formatMeasurementValue(measurement: Measurement) {
  switch (measurement.kind) {
    case 'glycemie':
      return `${twoDecimals.format(measurement.value)} g/L`
    case 'tension':
      return `${measurement.systolic}/${measurement.diastolic} mmHg`
    case 'poids':
      return `${oneDecimal.format(measurement.value)} kg`
    case 'frequence_cardiaque':
      return `${measurement.value} bpm`
  }
}
