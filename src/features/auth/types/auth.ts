export type UserRole = 'gestionnaire' | 'medecin'

export interface User {
  id: string
  name: string
  role: UserRole
}

export interface Session {
  token: string
  /** Date d'expiration du jeton, au format ISO-8601. */
  expiresAt: string
  user: User
}

export interface Credentials {
  /** Adresse e-mail ou numéro de téléphone du compte. */
  identifier: string
  password: string
}
