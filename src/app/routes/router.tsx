import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { AlertRoute, DashboardRoute } from '@/app/routes/doctorRoutes'
import {
  LandingRoute,
  PatientRecordRoute,
  PatientsRoute,
  RoleOnly,
} from '@/app/routes/patientRoutes'
import { ProtectedLayout } from '@/app/routes/ProtectedLayout'
import { AlertsPage } from '@/features/alerts'
import { AppointmentsPage } from '@/features/appointments'
import { LoginPage } from '@/features/auth'
import { MessagingPage } from '@/features/messaging'
import { CreatePatientPage, EditPatientPage } from '@/features/patients'

const managerOnly = (page: ReactNode) => <RoleOnly role="gestionnaire">{page}</RoleOnly>
const doctorOnly = (page: ReactNode) => <RoleOnly role="medecin">{page}</RoleOnly>

export const router = createBrowserRouter([
  { index: true, element: <LandingRoute /> },
  { path: 'connexion', element: <LoginPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: 'tableau-de-bord', element: doctorOnly(<DashboardRoute />) },
      { path: 'patients', element: <PatientsRoute /> },
      { path: 'patients/nouveau', element: managerOnly(<CreatePatientPage />) },
      { path: 'patients/:patientId', element: <PatientRecordRoute /> },
      { path: 'patients/:patientId/modifier', element: managerOnly(<EditPatientPage />) },
      { path: 'alertes', element: doctorOnly(<AlertsPage />) },
      { path: 'alertes/:alertId', element: doctorOnly(<AlertRoute />) },
      { path: 'messagerie', element: doctorOnly(<MessagingPage />) },
      { path: 'messagerie/:conversationId', element: doctorOnly(<MessagingPage />) },
      { path: 'rendez-vous', element: doctorOnly(<AppointmentsPage />) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
