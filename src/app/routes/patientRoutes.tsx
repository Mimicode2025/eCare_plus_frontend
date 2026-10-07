import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '@/features/auth'
import { PatientMeasurements } from '@/features/measurements'
import { PatientDetailsPage, PatientsPage } from '@/features/patients'

/*
 * Répartition des écrans patients selon le rôle :
 * - gestionnaire : gestion administrative des dossiers (ajout, modification) ;
 * - médecin : consultation des dossiers et suivi des mesures.
 * Simple confort de navigation : le contrôle d'accès réel relève du backend.
 */

export function PatientsRoute() {
  const { user } = useAuth()
  return <PatientsPage canManage={user?.role === 'gestionnaire'} />
}

export function PatientRecordRoute() {
  const { user } = useAuth()
  return (
    <PatientDetailsPage
      renderExtra={
        user?.role === 'medecin'
          ? (patient) => <PatientMeasurements patientId={patient.id} />
          : undefined
      }
    />
  )
}

/** Réserve un écran au gestionnaire ; les autres rôles sont renvoyés vers la liste. */
export function ManagerOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return user?.role === 'gestionnaire' ? children : <Navigate to="/patients" replace />
}
