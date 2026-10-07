import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedLayout } from '@/app/routes/ProtectedLayout'
import { LoginPage } from '@/features/auth'
import {
  CreatePatientPage,
  EditPatientPage,
  PatientDetailsPage,
  PatientsPage,
} from '@/features/patients'

export const router = createBrowserRouter([
  { path: 'connexion', element: <LoginPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/patients" replace /> },
      { path: 'patients', element: <PatientsPage /> },
      { path: 'patients/nouveau', element: <CreatePatientPage /> },
      { path: 'patients/:patientId', element: <PatientDetailsPage /> },
      { path: 'patients/:patientId/modifier', element: <EditPatientPage /> },
      { path: '*', element: <Navigate to="/patients" replace /> },
    ],
  },
])
