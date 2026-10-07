import type { Credentials, HealthStructure, User, UserRole } from '@/features/auth/types/auth'

/*
 * AUTHENTIFICATION FICTIVE — aucun appel API.
 * Ce service simule le backend tant que le contrat d'authentification n'est pas défini.
 * Les comptes, les structures et le mécanisme de session ci-dessous sont provisoires et inventés :
 * la vérification réelle des identifiants et des droits relève du backend.
 */

const SIMULATED_DELAY_MS = 700
const SESSION_KEY = 'ecare.session'

export const structures: HealthStructure[] = [
  { id: 'structure-demo-1', name: 'Centre de santé Démo, Lomé' },
  { id: 'structure-demo-2', name: 'Clinique Fictive, Kara' },
]

interface DemoAccount {
  identifier: string
  password: string
  name: string
  role: UserRole
}

/** Seuls comptes reconnus par le service fictif : un par rôle. */
export const demoAccounts: DemoAccount[] = [
  { identifier: 'abi2026', password: '12345678', name: 'Awa Démo', role: 'gestionnaire' },
  { identifier: 'dr2026', password: '12345678', name: 'Dr Kofi Démo', role: 'medecin' },
]

export class InvalidCredentialsError extends Error {}

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false
  const { name, role, structure } = value as Record<string, unknown>
  return (
    typeof name === 'string' &&
    demoAccounts.some((account) => account.role === role) &&
    structures.some((known) => known.id === (structure as HealthStructure | undefined)?.id)
  )
}

/** Session conservée le temps de l'onglet, pour ne pas redemander la connexion à chaque rechargement. */
export function restoreSession(): User | null {
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null')
    return isUser(stored) ? stored : null
  } catch {
    return null
  }
}

export async function login({ structureId, identifier, password }: Credentials): Promise<User> {
  await new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

  const structure = structures.find((known) => known.id === structureId)
  const account = demoAccounts.find(
    (known) =>
      known.identifier === identifier.trim().toLowerCase() && known.password === password,
  )
  if (!structure || !account) throw new InvalidCredentialsError()

  const user: User = { name: account.name, role: account.role, structure }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}
