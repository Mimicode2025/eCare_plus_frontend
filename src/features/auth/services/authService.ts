import type { Credentials, Session, UserRole } from '@/features/auth/types/auth'
import { ApiError, apiRequest, setAccessToken } from '@/lib/apiClient'

const SESSION_KEY = 'ecare.session'

/** Réponse de `POST /auth/connexion`. */
interface SessionResponse {
  jeton: string
  expireLe: string
  profil: { id: string; nom: string; prenoms: string }
}

/*
 * Correspondance entre le rôle porté par le jeton et les rôles du portail web.
 * Le backend ne connaît pas de rôle « gestionnaire » : l'administrateur de structure en tient
 * lieu ici. Correspondance à confirmer ; les autres rôles n'ont pas d'écran web défini.
 */
const rolesByClaim: Partial<Record<string, UserRole>> = {
  ADMINISTRATEUR_STRUCTURE: 'gestionnaire',
  MEDECIN: 'medecin',
}

export class InvalidCredentialsError extends Error {}

/** Compte valide, mais dont le rôle n'a pas d'accès défini au portail web. */
export class UnsupportedRoleError extends Error {}

/** Le profil renvoyé à la connexion ne porte pas le rôle : il est lu dans le jeton. */
function readRoleClaim(token: string): string | undefined {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const claims: unknown = JSON.parse(atob(payload))
    const role = (claims as { role?: unknown }).role
    return typeof role === 'string' ? role : undefined
  } catch {
    return undefined
  }
}

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false
  const { token, expiresAt, user } = value as Record<string, unknown>
  return (
    typeof token === 'string' &&
    typeof expiresAt === 'string' &&
    typeof user === 'object' &&
    user !== null &&
    typeof (user as Record<string, unknown>).name === 'string' &&
    Object.values(rolesByClaim).includes((user as Record<string, unknown>).role as UserRole)
  )
}

/** Session conservée le temps de l'onglet, pour ne pas redemander la connexion à chaque rechargement. */
export function restoreSession(): Session | null {
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null')
    if (!isSession(stored) || new Date(stored.expiresAt).getTime() <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    setAccessToken(stored.token)
    return stored
  } catch {
    return null
  }
}

export async function login({ identifier, password }: Credentials): Promise<Session> {
  let response: SessionResponse
  try {
    response = await apiRequest<SessionResponse>('/auth/connexion', {
      method: 'POST',
      body: { identifiant: identifier.trim(), motDePasse: password },
    })
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) throw new InvalidCredentialsError()
    throw error
  }

  const role = rolesByClaim[readRoleClaim(response.jeton) ?? '']
  if (!role) throw new UnsupportedRoleError()

  const session: Session = {
    token: response.jeton,
    expiresAt: response.expireLe,
    user: {
      id: response.profil.id,
      name: `${response.profil.prenoms} ${response.profil.nom}`,
      role,
    },
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  setAccessToken(session.token)
  return session
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
  setAccessToken(null)
}
