import type { Condition, Sex } from '@/features/patients/types/patient'

export const sexLabels: Record<Sex, string> = {
  F: 'Féminin',
  M: 'Masculin',
}

export const conditionLabels: Record<Condition, string> = {
  diabete: 'Diabète',
  hypertension: 'Hypertension artérielle',
  diabete_hypertension: 'Diabète et hypertension artérielle',
}
