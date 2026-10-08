import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { DoctorPatientRecordRoute, DoctorPatientsRoute } from '@/app/routes/doctorRoutes'
import { useAuth, type UserRole } from '@/features/auth'
import { PatientDetailsPage, PatientsPage } from '@/features/patients'

/*
 * Répartition des écrans selon le rôle :
 * - gestionnaire : gestion administrative des dossiers (ajout, modification) ;
 * - médecin : tableau de bord, alertes, consultation des dossiers, mesures et observations.
 * Simple confort de navigation : le contrôle d'accès réel relève du backend.
 */

/** Page d'accueil de chaque rôle après la connexion. */
const homePaths: Record<UserRole, string> = {
  gestionnaire: '/patients',
  medecin: '/tableau-de-bord',
}

export function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? homePaths[user.role] : '/connexion'} replace />
}

/** Réserve un écran à un rôle ; les autres sont renvoyés vers leur page d'accueil. */
export function RoleOnly({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user } = useAuth()
  return user?.role === role ? children : <HomeRedirect />
}

export function PatientsRoute() {
  const { user } = useAuth()
  return user?.role === 'medecin' ? <DoctorPatientsRoute /> : <PatientsPage canManage />
}

export function PatientRecordRoute() {
  const { user } = useAuth()
  return user?.role === 'medecin' ? <DoctorPatientRecordRoute /> : <PatientDetailsPage />
}
