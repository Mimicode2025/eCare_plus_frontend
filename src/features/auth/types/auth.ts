export type UserRole = 'gestionnaire' | 'medecin'

export interface User {
  id: string
  /** Prénoms puis nom, tel qu'affiché dans l'application. */
  name: string
  /* Absents des sessions ouvertes avant leur ajout : la page profil part alors du nom complet. */
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
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
