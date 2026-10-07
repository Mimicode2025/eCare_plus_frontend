import { Navigate, useLocation } from 'react-router'
import { AppLayout } from '@/components/layouts/AppLayout'
import { roleLabels, useAuth } from '@/features/auth'

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
      user={{ name: user.name, description: `${roleLabels[user.role]} • ${user.structure.name}` }}
      onLogout={logout}
    />
  )
}
