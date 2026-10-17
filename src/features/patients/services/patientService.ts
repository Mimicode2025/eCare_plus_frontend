import type { Patient, PatientInput } from '@/features/patients/types/patient'

/*
 * DONNÉES FICTIVES — aucun appel API.
 * Ce service simule le backend en mémoire tant que le contrat d'API n'est pas défini.
 * Les signatures, le format du numéro de dossier et les délais sont provisoires.
 * Les patients ci-dessous sont inventés ; les dossiers créés sont perdus au rechargement.
 */

const SIMULATED_DELAY_MS = 700

const patients: Patient[] = [
  {
    id: 'demo-1',
    fileNumber: 'ECP-00001',
    lastName: 'Exemple',
    firstName: 'Jean Kossi',
    sex: 'M',
    birthDate: '1968-03-14',
    phone: '+228 90 00 00 01',
    condition: 'diabete',
    address: 'Quartier Démo, Lomé',
    createdAt: '2026-09-02T09:15:00',
  },
  {
    id: 'demo-2',
    fileNumber: 'ECP-00002',
    lastName: 'Fictive',
    firstName: 'Afi',
    sex: 'F',
    birthDate: '1975-11-02',
    phone: '+228 90 00 00 02',
    condition: 'hypertension',
    email: 'afi.fictive@exemple.test',
    createdAt: '2026-09-18T14:40:00',
  },
  {
    id: 'demo-3',
    fileNumber: 'ECP-00003',
    lastName: 'Test',
    firstName: 'Kodjo',
    sex: 'M',
    birthDate: '1959-07-21',
    phone: '+228 90 00 00 03',
    condition: 'diabete_hypertension',
    emergencyContactName: 'Ama Test',
    emergencyContactPhone: '+228 90 00 00 04',
    createdAt: '2026-10-01T11:05:00',
  },
]

function simulateNetwork() {
  return new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
}

export async function listPatients(): Promise<Patient[]> {
  await simulateNetwork()
  return [...patients].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getPatient(id: string): Promise<Patient | undefined> {
  await simulateNetwork()
  return patients.find((patient) => patient.id === id)
}

export async function createPatient(input: PatientInput): Promise<Patient> {
  await simulateNetwork()
  const patient: Patient = {
    ...input,
    id: crypto.randomUUID(),
    fileNumber: `ECP-${String(patients.length + 1).padStart(5, '0')}`,
    createdAt: new Date().toISOString(),
  }
  patients.push(patient)
  return patient
}

export async function updatePatient(id: string, input: PatientInput): Promise<Patient> {
  await simulateNetwork()
  const index = patients.findIndex((patient) => patient.id === id)
  if (index === -1) throw new Error('Dossier patient introuvable')
  // Le numéro de dossier et la date de création ne sont pas modifiables.
  const { fileNumber, createdAt } = patients[index]
  const patient: Patient = { ...input, id, fileNumber, createdAt }
  patients[index] = patient
  return patient
}
