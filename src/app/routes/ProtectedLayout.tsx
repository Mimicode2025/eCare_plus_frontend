import { Navigate, useLocation } from 'react-router'
import { AppLayout, type NavItem } from '@/components/layouts/AppLayout'
import { roleLabels, useAuth, type UserRole } from '@/features/auth'

const dashboardItem: NavItem = {
  to: '/tableau-de-bord',
  label: 'Tableau de bord',
  // Pictogramme « grille ».
  iconPath: 'M3 3h8v8H3V3Zm10 0h8v5h-8V3ZM3 13h8v8H3v-8Zm10-3h8v11h-8V10Z',
}

const patientsItem: NavItem = {
  to: '/patients',
  label: 'Liste des patients',
  // Pictogramme « groupe de personnes ».
  iconPath:
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0v1H2v-1Zm15.5-9.5a3.5 3.5 0 1 0-1.6-6.6 6 6 0 0 1 0 6.2c.5.25 1 .4 1.6.4ZM18 21v-1a8.9 8.9 0 0 0-1.9-5.5A6 6 0 0 1 22 20v1h-4Z',
}

const alertsItem: NavItem = {
  to: '/alertes',
  label: 'File des alertes',
  // Pictogramme « cloche ».
  iconPath:
    'M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z',
}

const messagingItem: NavItem = {
  to: '/messagerie',
  label: 'Messagerie',
  // Pictogramme « bulle de dialogue ».
  iconPath: 'M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z',
}

const appointmentsItem: NavItem = {
  to: '/rendez-vous',
  label: 'Rendez-vous',
  // Pictogramme « calendrier ».
  iconPath:
    'M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm12 8H5v9h14v-9Z',
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  gestionnaire: [patientsItem],
  medecin: [dashboardItem, patientsItem, alertsItem, messagingItem, appointmentsItem],
}

/**
 * Mise en page des écrans réservés aux utilisateurs connectés.
 * Simple confort de navigation : le contrôle d'accès réel relève du backend.
 */
export function ProtectedLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  }

  return (
    <AppLayout
      navItems={navItemsByRole[user.role]}
      user={{ name: user.name, description: roleLabels[user.role] }}
      onLogout={logout}
    />
  )
}
