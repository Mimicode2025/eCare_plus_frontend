import { API_BASE_URL } from '@/config/api'

/** Réponse en erreur de l'API. Le backend décrit ses erreurs au format ProblemDetail (RFC 9457). */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

let accessToken: string | null = null
let onUnauthorized: (() => void) | null = null

/** Jeton joint aux appels suivants ; `null` à la déconnexion. */
export function setAccessToken(token: string | null) {
  accessToken = token
}

/** Appelé quand le backend refuse le jeton courant (session expirée ou révoquée). */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function apiRequest<T>(path: string, { method = 'GET', body }: RequestOptions = {}) {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    if (response.status === 401 && accessToken) onUnauthorized?.()
    const problem = (await response.json().catch(() => null)) as { detail?: string } | null
    throw new ApiError(response.status, problem?.detail ?? response.statusText)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
