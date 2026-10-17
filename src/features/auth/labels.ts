import type { UserRole } from '@/features/auth/types/auth'

export const roleLabels: Record<UserRole, string> = {
  gestionnaire: 'Gestionnaire',
  medecin: 'Médecin',
}
