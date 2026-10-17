import type { User } from '@/features/auth'
import { simulateNetwork } from '@/lib/demoData'

/*
 * DONNÉES FICTIVES — aucun appel API.
 * Le backend ne permet pas encore à un professionnel de modifier son profil : les changements
 * sont simulés et ne vivent que dans la session de l'onglet.
 *
 * Branchement futur : une route du type `PATCH /me` (cahier des charges, §5.2).
 * Le changement de mot de passe, lui, passe déjà par le backend (code reçu par e-mail).
 */

export interface ProfileChanges {
  firstName: string
  lastName: string
  phone: string
}

export async function updateProfile(user: User, changes: ProfileChanges): Promise<User> {
  await simulateNetwork()
  const firstName = changes.firstName.trim()
  const lastName = changes.lastName.trim()
  return {
    ...user,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    phone: changes.phone.trim() || undefined,
  }
}
