export type Sex = 'F' | 'M'

export type Condition = 'diabete' | 'hypertension' | 'diabete_hypertension'

/** Informations saisies à la création d'un dossier patient. */
export interface PatientInput {
  lastName: string
  firstName: string
  sex: Sex
  /** Date au format `AAAA-MM-JJ`. */
  birthDate: string
  phone: string
  condition: Condition
  email?: string
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
}

export interface Patient extends PatientInput {
  id: string
  fileNumber: string
  createdAt: string
}
