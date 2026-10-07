import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { ManagerOnly, PatientRecordRoute, PatientsRoute } from '@/app/routes/patientRoutes'
import { ProtectedLayout } from '@/app/routes/ProtectedLayout'
import { LoginPage } from '@/features/auth'
import { CreatePatientPage, EditPatientPage } from '@/features/patients'

const managerOnly = (page: ReactNode) => <ManagerOnly>{page}</ManagerOnly>

export const router = createBrowserRouter([
  { path: 'connexion', element: <LoginPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/patients" replace /> },
      { path: 'patients', element: <PatientsRoute /> },
      { path: 'patients/nouveau', element: managerOnly(<CreatePatientPage />) },
      { path: 'patients/:patientId', element: <PatientRecordRoute /> },
      { path: 'patients/:patientId/modifier', element: managerOnly(<EditPatientPage />) },
      { path: '*', element: <Navigate to="/patients" replace /> },
    ],
  },
])
