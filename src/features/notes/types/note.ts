/** Observation clinique rédigée par un professionnel de santé dans le dossier d'un patient. */
export interface ClinicalNote {
  id: string
  patientId: string
  author: string
  createdAt: string
  text: string
}
