import { useEffect, useState } from 'react'
import { getPatient, listPatients } from '@/features/patients/services/patientService'
import type { Patient } from '@/features/patients/types/patient'

type PatientsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; patients: Patient[] }

export function usePatients(): PatientsState {
  const [state, setState] = useState<PatientsState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    listPatients()
      .then((patients) => {
        if (active) setState({ status: 'success', patients })
      })
      .catch(() => {
        if (active) setState({ status: 'error' })
      })
    return () => {
      active = false
    }
  }, [])

  return state
}

type PatientState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'notFound' }
  | { status: 'success'; patient: Patient }

export function usePatient(id: string | undefined): PatientState {
  const [loaded, setLoaded] = useState<{ id: string; state: PatientState } | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    getPatient(id)
      .then((patient) => {
        if (!active) return
        setLoaded({ id, state: patient ? { status: 'success', patient } : { status: 'notFound' } })
      })
      .catch(() => {
        if (active) setLoaded({ id, state: { status: 'error' } })
      })
    return () => {
      active = false
    }
  }, [id])

  if (!id) return { status: 'notFound' }
  // Tant que le résultat chargé ne correspond pas à l'identifiant demandé, on est en chargement.
  return loaded?.id === id ? loaded.state : { status: 'loading' }
}
