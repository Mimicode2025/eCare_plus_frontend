import type { Patient } from '@/features/patients/types/patient'

export interface PatientFiltersValue {
  search: string
  /** `''` pour toutes les pathologies. */
  condition: string
}

export const emptyPatientFilters: PatientFiltersValue = { search: '', condition: '' }

/** Minuscules sans accents, pour que « demo » retrouve « Démo ». */
function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

/*
 * Filtrage côté navigateur, suffisant pour les données fictives.
 * Avec l'API réelle, la recherche devra être faite par le backend.
 */
export function filterPatients(patients: Patient[], { search, condition }: PatientFiltersValue) {
  const terms = normalize(search).split(/\s+/).filter(Boolean)
  return patients.filter((patient) => {
    // Un patient suivi pour les deux pathologies correspond aux deux filtres.
    if (condition && patient.condition !== condition && patient.condition !== 'diabete_hypertension') {
      return false
    }
    const haystack = normalize(`${patient.firstName} ${patient.lastName} ${patient.fileNumber}`)
    return terms.every((term) => haystack.includes(term))
  })
}
