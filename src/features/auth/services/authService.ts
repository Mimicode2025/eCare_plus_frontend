import type { Credentials, HealthStructure, User } from '@/features/auth/types/auth'

/*
 * AUTHENTIFICATION FICTIVE — aucun appel API.
 * Ce service simule le backend tant que le contrat d'authentification n'est pas défini.
 * Le compte, les structures et le mécanisme de session ci-dessous sont provisoires et inventés :
 * la vérification réelle des identifiants et des droits relève du backend.
 */

const SIMULATED_DELAY_MS = 700
const SESSION_KEY = 'ecare.session'

export const structures: HealthStructure[] = [
  { id: 'structure-demo-1', name: 'Centre de santé Démo, Lomé' },
  { id: 'structure-demo-2', name: 'Clinique Fictive, Kara' },
]

/** Seul compte reconnu par le service fictif. */
export const demoAccount = {
  identifier: 'abi2026',
  password: '12345678',
  name: 'Awa Démo',
}

export class InvalidCredentialsError extends Error {}

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false
  const { name, role, structure } = value as Record<string, unknown>
  return (
    typeof name === 'string' &&
    role === 'gestionnaire' &&
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
  const matches =
    identifier.trim().toLowerCase() === demoAccount.identifier && password === demoAccount.password
  if (!structure || !matches) throw new InvalidCredentialsError()

  const user: User = { name: demoAccount.name, role: 'gestionnaire', structure }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}
