import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { AlertRoute, DashboardRoute } from '@/app/routes/doctorRoutes'
import {
  HomeRedirect,
  PatientRecordRoute,
  PatientsRoute,
  RoleOnly,
} from '@/app/routes/patientRoutes'
import { ProtectedLayout } from '@/app/routes/ProtectedLayout'
import { AlertsPage } from '@/features/alerts'
import { LoginPage } from '@/features/auth'
import { CreatePatientPage, EditPatientPage } from '@/features/patients'

const managerOnly = (page: ReactNode) => <RoleOnly role="gestionnaire">{page}</RoleOnly>
const doctorOnly = (page: ReactNode) => <RoleOnly role="medecin">{page}</RoleOnly>

export const router = createBrowserRouter([
  { path: 'connexion', element: <LoginPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <HomeRedirect /> },
      { path: 'tableau-de-bord', element: doctorOnly(<DashboardRoute />) },
      { path: 'patients', element: <PatientsRoute /> },
      { path: 'patients/nouveau', element: managerOnly(<CreatePatientPage />) },
      { path: 'patients/:patientId', element: <PatientRecordRoute /> },
      { path: 'patients/:patientId/modifier', element: managerOnly(<EditPatientPage />) },
      { path: 'alertes', element: doctorOnly(<AlertsPage />) },
      { path: 'alertes/:alertId', element: doctorOnly(<AlertRoute />) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
